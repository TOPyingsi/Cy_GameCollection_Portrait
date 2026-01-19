import { _decorator, Component, Enum, game, math, Node, RigidBody2D, Vec2, Vec3 } from 'cc';
import { QBT_AnimEvent, QBT_AnimType, QBT_GameManage } from './QBT_GameManage';
const { ccclass, property } = _decorator;

export enum QBT_RoleGender {
    MALE = 0,   // 雄性
    Femina = 1, // 雌性
    Bigender = 2 // 双姓
}

@ccclass('QBT_RoleControl')
export class QBT_RoleControl extends Component {

    @property({ type: Enum(QBT_RoleGender) })
    private gender: QBT_RoleGender = QBT_RoleGender.MALE;

    @property(Node)
    public babyList: Node[] = [];

    @property(Node)
    private loveEye: Node;

    private rigidBody: RigidBody2D;
    private otherRole: QBT_RoleControl = null;
    public get getOtherRole(): QBT_RoleControl { return this.otherRole; }

    private isTop: boolean = false;

    private rotateTime: number = 0;
    private rotateLeftDir: boolean = false;
    private jumpTime: number = 0;
    private matingTime: number = 0;

    start() {
        this.loveEye.active = false;
        this.rigidBody = this.getComponent(RigidBody2D);
    }

    update(deltaTime: number) {
        if (QBT_GameManage.instace.pause) return;
        if (this.otherRole) {

            const t = math.clamp01(this.rotateTime / 0.5);
            let z = 0;
            if (this.rotateLeftDir) {
                z = math.lerp(30, -30, t);
                if (t >= 1) {
                    this.rotateLeftDir = false;
                    this.rotateTime = 0;
                }
            } else {
                z = math.lerp(-30, 30, t);
                if (t >= 1) {
                    this.rotateLeftDir = true;
                    this.rotateTime = 0;
                }
            }
            this.node.setRotationFromEuler(new Vec3(0, 0, z))
            this.rotateTime += deltaTime;

            const thisX = this.node.worldPositionX;
            const otherX = this.otherRole.node.worldPositionX;

            const v = this.rigidBody.linearVelocity;

            if (Math.abs(thisX - otherX) < 50) {
                v.x = 0;
                if (this.isTop) {
                    if (this.matingTime > 3) {
                        this.babyList.forEach(element => {
                            if (this.otherRole.babyList.includes(element)) {
                                element.setWorldPosition(new Vec3((thisX + otherX) / 2, this.node.worldPositionY, 0));
                                element.active = true;

                                QBT_GameManage.instace.addAnimEvent(new QBT_AnimEvent(element, QBT_AnimType.MatingEnd));
                                QBT_GameManage.instace.matingEnd(this, this.otherRole, element);

                                this.node.active = false;
                                this.otherRole.node.active = false;
                            }
                        });
                        if (this.node.active) {
                            console.log("没有相同")
                        }
                    }
                    this.matingTime += deltaTime;
                }
            } else if (thisX > otherX) {
                v.x = -4;
            } else {
                v.x = 4;
            }
            this.rigidBody.linearVelocity = v;
        } else if (this.loveEye.active) {
            if (game.totalTime - this.jumpTime > 1000) {
                this.rigidBody.applyForceToCenter(new Vec2(0, 2000), true);
                this.jumpTime = game.totalTime;
            }
        }

    }

    public setOtherRole(role: QBT_RoleControl, isTop: boolean) {
        this.otherRole = role;
        this.isTop = isTop;
    }

    arrowEnter(): boolean {
        if (this.loveEye.active) return false;
        this.loveEye.active = true;
        return true;
    }



}


