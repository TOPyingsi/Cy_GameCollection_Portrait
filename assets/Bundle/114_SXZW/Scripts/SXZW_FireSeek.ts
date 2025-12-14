import { _decorator, Collider, Color, Component, ITriggerEvent, Animation, randomRange, RigidBody, Vec3, SphereCollider, ParticleSystem, geometry, PhysicsSystem, Prefab, instantiate, Node } from 'cc';
import { SXZW_RoleControl } from './SXZW_RoleControl';
import { SXZW_PlayManage } from './SXZW_PlayManage';
const { ccclass, property } = _decorator;

@ccclass('SXZW_FireSeek')
export class SXZW_FireSeek extends Component {

    @property(SphereCollider)
    fireTrigger: SphereCollider = null

    @property(Prefab)
    animObj: Prefab = null

    rigBody: RigidBody

    childs: SXZW_FireSeek[] = null;

    set: Set<RigidBody> = new Set()

    time = 5;
    pastTime = 0;
    nextHurt = 0;
    private maxNextHurt = 0;
    private ainmObjIns: Node;
    public damage = 5;

    protected onLoad(): void {
        this.rigBody = this.getComponent(RigidBody);
        this.childs = this.getComponentsInChildren(SXZW_FireSeek).filter(f => f !== this);
        const ps = this.getComponent(ParticleSystem);
        if (ps) {
            if (!ps.loop) {
                this.time = ps.duration + ps.startLifetime.getMax();
                this.maxNextHurt = ps.duration;
            }
        }
    }

    protected onEnable(): void {
        this.fireTrigger.on("onTriggerEnter", this.onTriggerEnter, this)
        this.fireTrigger.on("onTriggerExit", this.onTriggerExit, this)

        if (this.childs != null) {
            const ray = new geometry.Ray()
            geometry.Ray.fromPoints(ray, this.node.worldPosition.clone(), this.node.worldPosition.clone().add(new Vec3(2, 0, 0)))
            PhysicsSystem.instance.raycast(ray, 4, 2);
            let v1 = 7;
            let v2 = -7;
            if (PhysicsSystem.instance.raycastResults.length > 0) {
                v1 = -7;
            } else {
                geometry.Ray.fromPoints(ray, this.node.worldPosition.clone(), this.node.worldPosition.clone().subtract(new Vec3(2, 0, 0)))
                PhysicsSystem.instance.raycast(ray, 4, 2);
                if (PhysicsSystem.instance.raycastResults.length > 0) {
                    v2 = 7;
                }
            }

            for (let index = 0; index < this.childs.length; index++) {
                this.childs[index].node.setParent(SXZW_PlayManage.Instance.currentLevel.node, true);
                this.childs[index].node.setWorldScale(Vec3.ONE);
                this.childs[index].rigBody?.applyImpulse(new Vec3((index % 2 === 0 ? v1 : v2) * (index + 1), 0, 0))
                this.childs[index].damage = Math.round(this.damage / this.childs.length);
            }
        }

        if (this.animObj) {
            const ainm = instantiate(this.animObj);
            ainm.setParent(SXZW_PlayManage.Instance.currentLevel.node, true)
            ainm.setWorldPosition(this.node.worldPosition)
            this.ainmObjIns = ainm;
        }
    }

    start() {

    }

    update(deltaTime: number) {
        if (this.pastTime > this.time) {
            this.node.destroy()
        } else {
            if (this.pastTime >= this.nextHurt) {
                if (this.nextHurt !== 0 && this.childs != null && this.childs.length > 0) {
                    this.node.destroy();
                }
                this.nextHurt += 2;
                if (this.maxNextHurt > 0 && this.nextHurt > this.maxNextHurt) {
                    this.nextHurt = 99999;
                }
                this.set.forEach((rigbody) => {
                    if (rigbody.node) {
                        const role = rigbody.getComponent(SXZW_RoleControl);
                        if (role) {
                            const damage = this.damage;
                            // 设置文本
                            const label = SXZW_PlayManage.Instance.getHurtTextLabel;
                            if (damage >= 30) {
                                label.color = Color.RED;
                            } else if (damage >= 18) {
                                label.color = new Color(255, 136, 0, 255)
                            } else {
                                label.color = Color.GREEN;
                            }
                            label.string = "-" + damage;
                            label.node.parent.setWorldPosition(role.node.worldPosition)
                            label.getComponent(Animation).play();
                            // 角色受伤
                            role.setHurt(damage)
                            role.faceManage.sad()
                        }
                    }
                });
            }
            this.pastTime += deltaTime;
        }
    }

    onTriggerEnter(event: ITriggerEvent) {
        if (event.otherCollider.getGroup() === 16) {
            const rigBody = event.otherCollider.getComponent(RigidBody)
            if (rigBody) {
                this.set.add(rigBody)
            }
        }
    }

    onTriggerExit(event: ITriggerEvent) {
        const rigBody = event.otherCollider.getComponent(RigidBody)
        if (rigBody) this.set.delete(rigBody)
    }

    protected onDestroy(): void {
        this.fireTrigger.off("onTriggerEnter", this.onTriggerEnter, this)
        this.fireTrigger.off("onTriggerExit", this.onTriggerExit, this)
        if (this.ainmObjIns) {
            this.ainmObjIns.destroy()
        }
    }
}


