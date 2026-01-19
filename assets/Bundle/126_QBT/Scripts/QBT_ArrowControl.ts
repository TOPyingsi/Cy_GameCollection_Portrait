import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, RigidBody2D, Vec2 } from 'cc';
import { QBT_CollideEnum, QBT_GameManage } from './QBT_GameManage';
import { QBT_RoleControl } from './QBT_RoleControl';
const { ccclass, property } = _decorator;

@ccclass('QBT_ArrowControl')
export class QBT_ArrowControl extends Component {

    @property(RigidBody2D)
    private rigidBody: RigidBody2D;
    @property(RigidBody2D)
    private rigidChildrenBody: RigidBody2D;

    start() {
        this.getComponent(Collider2D).on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    update(deltaTime: number) {

    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        switch (otherCollider.group) {
            case QBT_CollideEnum.Ground: {
                this.rigidBody.enabled = false;
                this.rigidBody.linearVelocity = Vec2.ZERO;
                this.rigidBody.angularVelocity = 0;
                this.rigidBody.sleep();
                this.rigidChildrenBody.enabled = false;
                this.rigidChildrenBody.linearVelocity = Vec2.ZERO;
                this.rigidChildrenBody.angularVelocity = 0;
                this.rigidChildrenBody.sleep();
                selfCollider.enabled = false;
                break;
            }
            case QBT_CollideEnum.Role: {
                const role = otherCollider.getComponent(QBT_RoleControl);
                if (role.arrowEnter()) {
                    QBT_GameManage.instace.addLoveRole(role);
                    const other = QBT_GameManage.instace.getOtherRole(role);
                    if (other !== null) {
                        role.setOtherRole(other, true);
                        other.setOtherRole(role, false);
                    }
                }
                break;
            }
        }
    }

}


