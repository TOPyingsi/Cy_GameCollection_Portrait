import { _decorator, Collider, Animation, Color, Component, director, game, ICollisionEvent, instantiate, math, Node, PhysicMaterial, PhysicsSystem, Quat, randomRange, RigidBody, Vec3, randomRangeInt, Prefab, Enum } from 'cc';
import { SXZW_PlayManage } from './SXZW_PlayManage';
import { SXZW_RoleControl } from './SXZW_RoleControl';
import { SXZW_PlayerBodyType } from './SXZW_PlayerBodyType';
import { LevelData, SXZW_WaponsItem } from './SXZW_WaponsItem';
import { SXZW_FireSeek } from './SXZW_FireSeek';
import { SXZW_Utils } from './SXZW_Utils';
import { SXZW_AudioManage } from './SXZW_AudioManage';
import { SXZW_WeaponTypeEnum } from './SXZW_WeaponTypeEnum';
const { ccclass, property } = _decorator;

@ccclass('SXZW_WeaponPrefab')
export class SXZW_WeaponPrefab extends Component {

    colliderList: Collider[] = null
    rigBody: RigidBody = null

    @property({ type: Enum(SXZW_WeaponTypeEnum) })
    weaponType: SXZW_WeaponTypeEnum = SXZW_WeaponTypeEnum.普通

    @property({ type: Number })
    elasticity: number = 0

    @property({ type: Number })
    velocityScaling: number = 1

    @property({ type: Boolean })
    insert: boolean = false

    bleed: boolean = false

    @property(Node)
    insertPointA: Node = null

    @property(Node)
    insertPointB: Node = null

    get blast() {
        return this.weaponType === SXZW_WeaponTypeEnum.爆炸
    }

    get isEemitter() {
        return this.weaponType === SXZW_WeaponTypeEnum.发射器
    }

    @property(Boolean)
    collisionBlast: boolean = false

    @property(Boolean)
    fragmentBlast: boolean = false

    @property(Number)
    blastTime: number = 5

    @property({ type: Node })
    childs: Node[] = []

    @property(Node)
    fire: Node = null

    @property(Node)
    handlePoint: Node = null

    bortherCount = 0;
    data: SXZW_WaponsItem;
    role: SXZW_RoleControl;

    private get getLevelData(): LevelData {
        if (this.role === SXZW_PlayManage.Instance.currentPlayer.role) {
            return this.data.levelData;
        } else {
            const index = math.clamp(Math.floor(SXZW_PlayManage.Instance.getCurrentLevelIndex / 2), 0, this.data.levelDatas.length - 1);
            return this.data.levelDatas[index];
        }
    }

    isLaunch = false
    private maxSpeed = 0;

    public getLaunchPos(node: Node) {
        if (!this.isEemitter) {
            return node.getWorldPosition()
        } else {
            return this.childs[0].getWorldPosition();
        }
    }

    protected onLoad(): void {
        this.colliderList = this.node.getComponents(Collider)
        this.rigBody = this.node.getComponent(RigidBody)
        this.bortherCount = this.node.parent.children.length
        if (this.blast && this.collisionBlast) {
            this.removeCollider();
        }
        if (!this.handlePoint) this.handlePoint = this.node;
    }

    start() {
        this.rigBody.linearDamping = 0;
        this.rigBody.linearFactor = new Vec3(1, 1, 0)
        this.rigBody.angularFactor = new Vec3(1, 1, 1)
        this.rigBody.angularDamping = 0.7;
        this.rigBody.setGroup(256);

    }

    protected onEnable(): void {
        const pm = new PhysicMaterial()
        pm.restitution = this.elasticity;
        pm.friction = 0.5;
        this.colliderList.forEach((collider) => {
            collider.sharedMaterial = pm;
            collider.enabled = false;
        })
    }

    update(deltaTime: number) {
        if (this.isLaunch && !this.blast) {
            const v = new Vec3();
            this.rigBody.getLinearVelocity(v)
            if (v.length() <= 0.01) {
                SXZW_PlayManage.Instance.setWaitRoundTime = 2
                this.scheduleOnce(() => {
                    this.destroy()
                    console.log("销毁脚本 " + this.data.itemName)
                }, 2)
            }
        } else if (this.isLaunch && this.blast && !this.collisionBlast) {
            if (this.blastTime > 0) {
                this.blastTime -= deltaTime;
            } else {
                this.startBlast();
            }
        }
        const vel = new Vec3();
        this.rigBody.getLinearVelocity(vel);
        if (vel.length() > this.maxSpeed) {
            vel.normalize().multiplyScalar(this.maxSpeed);
            this.rigBody.setLinearVelocity(vel);
        }
    }

    // 开始爆炸
    private startBlast() {
        if (this.fragmentBlast && this.childs.length > 0) {
            this.childs.forEach(element => {
                const wea = element.getComponent(SXZW_WeaponPrefab)
                if (wea) {
                    wea.data = this.data;
                    wea.role = this.role;
                    wea.launch(this.node.parent, null, new Vec3(randomRange(30, 50) * randomRangeInt(0, 2) === 0 ? -1 : 1, randomRange(30, 50) * randomRangeInt(0, 2) === 0 ? -1 : 1, 1));
                }
            });
        }
        SXZW_PlayManage.Instance.setWaitRoundTime = 2
        SXZW_PlayManage.Instance.shakeCameraTween();
        const bs = SXZW_PlayManage.Instance.getBlastSeek;
        bs.node.setWorldPosition(this.node.worldPosition);
        bs.startSeek(this.getLevelData.damageRange, this.getLevelData.damage / (this.collisionBlast ? this.bortherCount : 1));

        SXZW_AudioManage.Instance.playDynamiteEffect();

        this.node.destroy();
    }

    launch(parent: Node, worldPosition: Vec3, velocity: Vec3, isChild: boolean = false) {
        if (this.childs.length > 0 && !this.blast) {
            this.childs.forEach(element => {
                const wea = element.getComponent(SXZW_WeaponPrefab)
                if (wea) {
                    wea.data = this.data;
                    wea.role = this.role;
                    wea.launch(parent, null, Vec3.multiply(new Vec3, velocity, new Vec3(randomRange(0.9, 1.1), randomRange(0.9, 1.1), 1)), true)
                }
            });
        }

        this.node.setParent(parent, true);
        this.node.setWorldRotation(Quat.IDENTITY);
        this.rigBody.useGravity = true;
        this.rigBody.enabled = true;

        const pos = worldPosition == null ? this.node.worldPosition.clone() : worldPosition.clone()
        pos.z = SXZW_PlayManage.Instance.currentLevel.node.worldPosition.z;
        this.node.setWorldPosition(pos);

        if (this.blast || this.childs.length === 0) {
            this.rigBody.applyImpulse(new Vec3(velocity.x * this.rigBody.mass, velocity.y * this.rigBody.mass, velocity.z * this.rigBody.mass)); // 设置刚体速度
            this.rigBody.setAngularVelocity(new Vec3(0, 0, 20));
            this.scheduleOnce(() => {
                this.rigBody.setGroup(8);
            }, 0.15);
        } else {
            this.rigBody.setGroup(8);
            this.removeEvent()
            this.rigBody.applyImpulse(new Vec3(0, -10 * this.rigBody.mass, 0))
        }

        // 速度限制
        const v3 = new Vec3()
        this.rigBody.getLinearVelocity(v3)
        this.maxSpeed = v3.length();

        this.colliderList.forEach((collider) => {
            collider.enabled = true;
            //console.log("添加碰撞事件 " + this.data.itemName)
            collider.on("onCollisionEnter", this.onCollisionEnter, this)
        })

        this.isLaunch = true;
        if (!isChild) {
            SXZW_AudioManage.Instance.playSwooshesEffect(); // 扔出
        } else {
            SXZW_AudioManage.Instance.playEmitterEffect()
        }
    }

    private isCollider = false;
    onCollisionEnter(event: ICollisionEvent) {
        this.isCollider = true;
        //console.log("碰撞了 类型：" + this.weaponType + " 对方分组" + event.otherCollider.getGroup() + " 名字" + this.node.name);
        if (this.weaponType === SXZW_WeaponTypeEnum.燃烧 || this.weaponType === SXZW_WeaponTypeEnum.毒药) {
            this.fire.active = true;
            this.fire.setParent(this.node.parent, true);
            //console.log("爆炸范围 " + this.data.levelData.damageRange + " 名字" + this.data.itemName + " 等级" + this.data.itemLevel);
            const s = Math.max(this.getLevelData.damageRange / 2, 1);
            this.fire.setWorldScale(new Vec3(s, s, s))
            //console.log("缩放 " + s)
            //this.fire.setWorldScale(Vec3.ONE);
            const fireSeek = this.fire.getComponent(SXZW_FireSeek)
            if (fireSeek) {
                fireSeek.damage = Math.floor(this.getLevelData.damage * 0.7);
            }
            SXZW_PlayManage.Instance.setWaitRoundTime = 3;
            SXZW_AudioManage.Instance.playGlassBreakEffect();
        } else if (this.blast && this.collisionBlast) {
            this.startBlast();
            return;
        }
        if (event.otherCollider.getGroup() === 2 && event.contacts.length > 0) {
            if (!this.bleed && this.weaponType === SXZW_WeaponTypeEnum.流血) {
                this.bleed = true;
                const impactPoint = new Vec3;
                event.contacts[0].getWorldPointOnB(impactPoint)
                if (this.insert) {
                    this.rotateAndMoveToTarget(event.selfCollider.node, this.insertPointA, this.insertPointB, event.selfCollider, impactPoint)

                    // 移动物品节点
                    event.selfCollider.node.setParent(event.otherCollider.node, true)

                    this.removeCollider()
                }

                //
                const role: SXZW_RoleControl = SXZW_Utils.getComponentInParent(event.otherCollider.node, SXZW_RoleControl)
                if (role) {
                    this.setHurt(role, event)
                    role.faceManage.frown()
                    const node = SXZW_PlayManage.Instance.getBloodParticle.node
                    node.setParent(event.otherCollider.node, true)
                    node.setWorldPosition(impactPoint)

                    node.lookAt(event.otherCollider.node.getWorldPosition(), Vec3.UP)
                    const angle = node.eulerAngles;
                    node.eulerAngles = new Vec3(angle.x, angle.y + 180, angle.z);

                    SXZW_AudioManage.Instance.playBloodEffect();
                }

            } else {
                const role: SXZW_RoleControl = SXZW_Utils.getComponentInParent(event.otherCollider.node, SXZW_RoleControl)
                if (role && role !== this.role) {
                    this.setHurt(role, event)
                    if (!this.blast) {
                        const t = event.otherCollider.getComponent(SXZW_PlayerBodyType);
                        if (t) {
                            if (t.head) {
                                role.headHurt()
                            } else if (t.hand || t.body) {
                                role.bodyHurt()
                            } else if (t.leg) {
                                role.legHurt()
                            }
                        }
                    } else {
                        role.faceManage.frown()
                    }
                }
                SXZW_AudioManage.Instance.playColliderEffect();
            }
            this.removeEvent()
        }
        if (this.fire) {
            this.node.destroy();
        }
    }

    // 设置一个伤害啊
    setHurt(role: SXZW_RoleControl, event: ICollisionEvent) {
        const t = event.otherCollider.getComponent(SXZW_PlayerBodyType);
        const v = new Vec3()
        this.rigBody.getLinearVelocity(v)
        console.log(v.length())
        let damage = this.getLevelData.damage * randomRange(0.9, 1.1); // 伤害波动
        if (randomRangeInt(0, 100) >= 85) damage *= 1.5; //暴击
        if (t) {
            if (t.head) {
                damage *= 1.2;
            } else if (t.leg || t.hand) {
                damage *= 0.8;
            }
        }
        damage = math.clamp(damage, this.getLevelData.damage * 0.5, this.getLevelData.damage * 2)
        damage = Math.round(damage);

        const label = SXZW_PlayManage.Instance.getHurtTextLabel;
        let isCrit = false;
        if (damage >= this.getLevelData.damage * 1.5) {
            label.color = Color.RED;
            isCrit = true;
        } else if (damage >= this.getLevelData.damage) {
            label.color = new Color(255, 136, 0, 255)
        } else {
            label.color = Color.GREEN
        }
        label.string = "-" + damage + (isCrit ? " 暴击" : "");
        label.node.parent.setWorldPosition(event.otherCollider.node.worldPosition)
        label.getComponent(Animation).play();
        role.setHurt(this.getLevelData.damage)
    }

    rotateAndMoveToTarget(
        node: Node,
        pointA: Node,
        pointB: Node,
        targetCollider: Collider,
        impactPoint: Vec3
    ) {
        const worldPointA = pointA.getWorldPosition();
        const targetCenter = targetCollider.node.getWorldPosition(new Vec3());
        const dir = new Vec3();
        Vec3.subtract(dir, impactPoint, worldPointA);
        dir.normalize();
        const tempNode = new Node(); // 临时空节点用于计算
        tempNode.setWorldPosition(worldPointA);
        tempNode.lookAt(impactPoint, Vec3.UNIT_Y); // Y 为刀上方向，可调整
        const newRot = tempNode.getWorldRotation();
        node.setWorldRotation(newRot);
        tempNode.destroy();

        const worldPointB = pointB.getWorldPosition();
        const offset = new Vec3();
        Vec3.subtract(offset, impactPoint, worldPointB); // 目标位置 - 当前刀插入点位置
        const nodePos = node.getWorldPosition();
        Vec3.add(nodePos, nodePos, offset);
        node.setWorldPosition(nodePos);

        // 移动位置
        /*  const offset = new Vec3();
         Vec3.subtract(offset, impactPoint, pointB.getWorldPosition());
 
         const nodePos = node.getWorldPosition();
         Vec3.add(nodePos, nodePos, offset);
         node.setWorldPosition(nodePos); */
    }

    protected onDestroy(): void {
        this.rigBody.linearFactor = new Vec3(0.05, 0.5, 0)
        this.removeEvent()
    }

    removeCollider() {
        this.colliderList.forEach((collider) => {
            collider.enabled = false;
        })
        this.rigBody.clearVelocity()
        this.rigBody.enabled = false;
    }

    removeEvent() {
        if (!this.isCollider) {
            //console.log("没有碰撞但是移除了事件 " + this.data.itemName)
        }
        //console.log("移除碰撞事件")
        SXZW_PlayManage.Instance.setWaitRoundTime = 3;
        this.colliderList.forEach((collider) => {
            collider.off("onCollisionEnter", this.onCollisionEnter, this)
        })
    }
}


