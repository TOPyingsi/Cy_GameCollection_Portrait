import { _decorator, Collider2D, Component, Contact2DType, director, EventTouch, IPhysics2DContact, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('insideEdge')
export class insideEdge extends Component {

    collider: Collider2D;

    protected onLoad(): void {
        this.collider = this.getComponent(Collider2D);
    }

    protected onEnable(): void {
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        // console.log("FEIO");
        // console.log(selfCollider);?
        if (otherCollider.node.name == "needle"){
            director.getScene().emit("Lose");
        }
    }


    protected onDisable(): void {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
}


