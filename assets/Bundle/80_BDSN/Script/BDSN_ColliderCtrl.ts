import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, Node, RigidBody2D } from 'cc';
import { BDSN_Box } from './BDSN_Box';
const { ccclass, property } = _decorator;

@ccclass('BDSN_ColliderCtrl')
export class BDSN_ColliderCtrl extends Component {
    private boxCollider2D: BoxCollider2D = null;
    private rigidBody: RigidBody2D = null;

    protected onLoad(): void {
        this.boxCollider2D = this.node.getComponent(BoxCollider2D);
        this.rigidBody = this.node.getComponent(RigidBody2D);

        this.boxCollider2D.on(Contact2DType.BEGIN_CONTACT, this.BEGIN_CONTACT, this);
    }

    BEGIN_CONTACT(selfCollider: Collider2D, otherCollider: Collider2D) {
        try {
            if (otherCollider.tag == 1) {//top
                const comp = otherCollider.node.parent.getComponent(BDSN_Box)
                comp.updateSide(false, comp.bottom, comp.left, comp.right)
            }
            if (otherCollider.tag == 2) {//bottom
                const comp = otherCollider.node.parent.getComponent(BDSN_Box)
                comp.updateSide(comp.top, false, comp.left, comp.right)
            }
            if (otherCollider.tag == 3) {//left
                const comp = otherCollider.node.parent.getComponent(BDSN_Box)
                comp.updateSide(comp.top, comp.bottom, false, comp.right)
            }
            if (otherCollider.tag == 4) {//right
                const comp = otherCollider.node.parent.getComponent(BDSN_Box)
                comp.updateSide(comp.top, comp.bottom, comp.left, false)
            }
        } catch (error) {
            console.log(error)
        }

    }
}


