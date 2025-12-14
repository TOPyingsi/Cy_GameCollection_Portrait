import { _decorator, Collider2D, Component, Contact2DType, director, Node, PolygonCollider2D, RigidBody2D, tween, Vec3 } from 'cc';
import { SHJDMM_GameManager } from './SHJDMM_GameManager';
const { ccclass, property } = _decorator;

@ccclass('SHJDMM_Collider')
export class SHJDMM_Collider extends Component {

    private polygonCollider: PolygonCollider2D = null;
    private rigidBody: RigidBody2D = null;

    protected onLoad(): void {
        this.polygonCollider = this.node.getComponent(PolygonCollider2D);
        this.rigidBody = this.node.getComponent(RigidBody2D);

        if (this.polygonCollider) {
            this.polygonCollider.on(Contact2DType.BEGIN_CONTACT, this.BEGIN_CONTACT, this);
        }
        director.getScene().on("timeOut", this.timeOut, this);
    }

    protected start(): void {
        if (this.polygonCollider) {
            this.polygonCollider.enabled = false;
        }
        if (this.rigidBody) {
            this.rigidBody.enabled = false;
        }
    }

    BEGIN_CONTACT(selfCollider: Collider2D, otherCollider: Collider2D) {
        SHJDMM_GameManager.instance.map.set(selfCollider.node, otherCollider.node);
    }

    timeOut() {
        if (this.polygonCollider) {
            this.polygonCollider.enabled = true;
        }

        if (this.rigidBody) {
            this.rigidBody.enabled = true;
        }

        this.scheduleOnce(() => {
            if (this.polygonCollider) {
                this.polygonCollider.enabled = false;
            }
            if (this.rigidBody) {
                this.rigidBody.enabled = false;
            }
        }, 0);
    }
}