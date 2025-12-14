import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, Label, RigidBody2D, UIOpacity, v3, Vec2 } from 'cc';
import { NZABSJ_GameMain } from './NZABSJ_GameMain';
import { NZABSJ_RoleController } from './NZABSJ_RoleController';
import { NZABSJ_PropController } from './NZABSJ_PropController';
const { ccclass, property } = _decorator;

@ccclass('NZABSJ_BoxColliderController')
export class NZABSJ_BoxColliderController extends Component {

    private boxCollider: BoxCollider2D = null;
    private rigidBody: RigidBody2D = null;

    public static isbox: boolean = false
    protected onLoad(): void {
        this.boxCollider = this.node.getComponent(BoxCollider2D);
        this.rigidBody = this.node.getComponent(RigidBody2D);

        this.boxCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    private onBeginContact(a: Collider2D, b: Collider2D) {

        if (NZABSJ_BoxColliderController.isbox) return;
        NZABSJ_BoxColliderController.isbox = true
        console.error("efawegWEG")
        const aTag = a.getComponent(BoxCollider2D).tag;
        const bTag = b.getComponent(BoxCollider2D).tag;

        console.log(a.node.getChildByName("Label").getComponent(Label).string + "  碰到了   " + b.node.name)

        this.scheduleOnce(() => {
            NZABSJ_PropController.Instance.del();
        }, 0)

        if (aTag == bTag) {
            NZABSJ_RoleController.Instance.s();
        } else {
            NZABSJ_RoleController.Instance.e();
        }

        NZABSJ_GameMain.Instance.scheduleOnce(() => {
            console.log("HUIDAPOFLAS");

            NZABSJ_BoxColliderController.isbox = false

        }, 2)

        // NZABSJ_GameMain.Instance.loadProgress();
    }

    protected onDestroy(): void {
        this.boxCollider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

}


