import { _decorator, BoxCollider2D, CircleCollider2D, Collider2D, Component, Contact2DType, director, ERigidBody2DType, Node, PhysicsSystem2D, RigidBody2D, Vec2 } from 'cc';
import { HCSHJ_GameManager } from './HCSHJ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('HCSHJ_ColliderCtrl')
export class HCSHJ_ColliderCtrl extends Component {
    private readonly wall = 8388608;

    private circleCollider: CircleCollider2D = null;
    private rigidBody: RigidBody2D = null;
    public isTouchingWeapon: boolean = false;
    // private isCanCollide: boolean = true;

    protected onLoad(): void {
        this.circleCollider = this.node.getComponent(CircleCollider2D);
        this.rigidBody = this.node.getComponent(RigidBody2D);

        this.circleCollider.on(Contact2DType.BEGIN_CONTACT, this.BEGIN_CONTACT, this);
    }

    sameType: HCSHJ_ColliderCtrl = null;

    BEGIN_CONTACT(selfCollider: Collider2D, otherCollider: Collider2D) {
        // if (!this.isCanCollide) return;
        // this.isCanCollide = false;

        if (selfCollider.group === otherCollider.group && selfCollider.tag === otherCollider.tag) {
            if (this.sameType != null) return;

            this.sameType = otherCollider.getComponent(HCSHJ_ColliderCtrl);
            this.scheduleOnce(() => {

                // 校验碰撞节点是否有效
                if (selfCollider.node?.isValid) {
                    selfCollider.node.destroy();
                }
                if (otherCollider.node?.isValid) {
                    otherCollider.node.destroy();
                }

                // 确保 otherCollider.node 未被销毁后再调用
                if (otherCollider.node?.isValid) {
                    HCSHJ_GameManager.Instance.synthetic(
                        selfCollider.tag,
                        otherCollider.tag,
                        otherCollider.node.position
                    );
                }
            }, 0);
        } else if (otherCollider.group === this.wall && otherCollider.tag === 1) {
            console.log("BEGIN_CONTACT", selfCollider.name, otherCollider.name, otherCollider.group);
            HCSHJ_GameManager.Instance.gamePanel.Lost();
        }

        // this.scheduleOnce(() => {
        //     this.isCanCollide = true;
        // }, 0.1)
    }

    protected onDisable(): void {
        this.circleCollider.off(Contact2DType.BEGIN_CONTACT, this.BEGIN_CONTACT, this);
    }
}


