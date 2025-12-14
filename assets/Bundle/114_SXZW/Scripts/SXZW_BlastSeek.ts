import { _decorator, Collider, Component, ITriggerEvent, Animation, ParticleSystem, RigidBody, SphereCollider, math, Color, Vec3, CapsuleCollider, director } from 'cc';
import { SXZW_RoleControl } from './SXZW_RoleControl';
import { SXZW_PlayManage } from './SXZW_PlayManage';
const { ccclass, property } = _decorator;

@ccclass('SXZW_BlastSeek')
export class SXZW_BlastSeek extends Component {

    collider: SphereCollider
    set: Set<RigidBody> = new Set()
    wait = false;
    damage: number
    ps: ParticleSystem[]

    protected onLoad(): void {
        this.ps = this.getComponentsInChildren(ParticleSystem)
        this.ps.push(this.getComponent(ParticleSystem))
        this.collider = this.getComponent(SphereCollider);
        this.collider.enabled = false;
    }

    start() {

    }

    onEnable() {

    }

    public startSeek(radius: number, damage: number) {
        this.enabled = true;
        this.ps.forEach((p) => {
            p.clear()
            p.play()
        })
        this.damage = damage;
        const s = (radius * 5) / 10;
        this.node.setWorldScale(new Vec3(s, s, s))
        this.collider.enabled = true;
        this.set.clear();
        this.wait = false;
        this.collider.on("onTriggerEnter", this.onTriggerEnter, this);
        this.collider.on("onTriggerExit", this.onTriggerEnter, this);
    }

    update(deltaTime: number) {
        if (this.wait) {
            this.set.forEach((rigbody) => {
                if (rigbody.node) {
                    if (rigbody.getGroup() == 8) {

                    } else if (rigbody.getGroup() == 16) {
                        const role = rigbody.getComponent(SXZW_RoleControl);
                        if (role) {
                            const len = this.pointToCapsuleDistance(this.node.worldPosition, role.getComponent(CapsuleCollider))
                            const scale = this.collider.node.worldScale;

                            let damage = math.lerp(this.damage * 4, this.damage, math.clamp01(len / (this.collider.radius * Math.max(scale.x, scale.y, scale.z))))
                            damage = Math.round(damage)
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
                            role.blastHurt()
                        }
                    }
                }
            });
            this.set.clear();
            this.collider.off("onTriggerEnter", this.onTriggerEnter, this);
            this.collider.off("onTriggerExit", this.onTriggerEnter, this);
            this.collider.enabled = false;
            this.wait = false;
        }
        else if (this.collider.enabled) {
            this.wait = true;
        }
        else if (!this.ps[0].isEmitting && this.ps[0].getParticleCount() === 0) {
            this.enabled = false;
        }
    }

    onTriggerEnter(event: ITriggerEvent) {
        if ((event.otherCollider.getGroup() & 24) !== 0) {
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

    protected onDisable(): void {

    }


    closestPointOnSegment(p: Vec3, a: Vec3, b: Vec3, out: Vec3) {
        const ab = new Vec3();
        Vec3.subtract(ab, b, a);
        const t = Vec3.dot(Vec3.subtract(new Vec3(), p, a), ab) / Vec3.dot(ab, ab);
        const clampedT = Math.min(Math.max(t, 0), 1);
        Vec3.multiplyScalar(out, ab, clampedT);
        Vec3.add(out, out, a);
        return out;
    }

    /** 点到 CapsuleCollider 边界的最短距离 */
    pointToCapsuleDistance(point: Vec3, capsule: CapsuleCollider): number {
        const node = capsule.node;
        const worldScale = node.getWorldScale(new Vec3());
        const radius = capsule.radius * Math.max(worldScale.x, worldScale.y);
        const height = capsule.height * worldScale.y;


        const center = node.getWorldPosition(new Vec3());
        const halfHeight = (height - 2 * radius) / 2;

        const axisStart = new Vec3(0, -halfHeight, 0);
        const axisEnd = new Vec3(0, halfHeight, 0);

        Vec3.transformMat4(axisStart, axisStart, node.getWorldMatrix());
        Vec3.transformMat4(axisEnd, axisEnd, node.getWorldMatrix());

        const closest = new Vec3();
        this.closestPointOnSegment(point, axisStart, axisEnd, closest);

        const dir = new Vec3();
        Vec3.subtract(dir, point, closest);
        return Math.max(dir.length() - radius, 0);
    }

}


