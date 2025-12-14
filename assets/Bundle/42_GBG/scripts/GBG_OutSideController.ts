import { _decorator, Collider2D, Component, Node, Contact2DType, EventTouch, director, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OutSideController')
export class OutSideController extends Component {
    collider : Collider2D;
    
    protected onLoad(): void {
        this.collider = this.getComponent(Collider2D);
    }

    protected onEnable(): void {
        this.collider.on(Contact2DType.END_CONTACT, this.END_CONTACT, this);
    }

    END_CONTACT(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        if (otherCollider.node.name == "needle"){
            // console.log(selfCollider);
            // console.log(otherCollider);
            console.log("OUTS");
            director.getScene().emit("Lose");
        }
    }

    protected onDisable(): void {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.END_CONTACT, this);
    }
}


