import { _decorator, Collider2D, Component, Contact2DType, error, IPhysics2DContact, Node, tween, UIOpacity, UITransform, v3, Vec3 } from 'cc';
import { ZJXY_GameManager } from './ZJXY_GameManager';
const { ccclass, property } = _decorator;

@ccclass('ZJXY_PlayerManager')
export class ZJXY_PlayerManager extends Component {
    start() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

    }


    onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.node.name == "岩浆") {
            ZJXY_GameManager.Instance.WinorLose = false;
            ZJXY_GameManager.Instance.GameJudgment();
            this.node.getComponent(Collider2D).enabled = false;

        }
        if (otherCollider.node.name == "水") {
            ZJXY_GameManager.Instance.WinNumber += 1;
            console.error(ZJXY_GameManager.Instance.WinNumber);
            ZJXY_GameManager.Instance.NumberJudgment();



        }
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    }
}




