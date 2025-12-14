import { _decorator, Component, EventTouch, Node, UITransform, v2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('KFCD_TouchCtrl')
export class KFCD_TouchCtrl extends Component {

    @property(Node)
    objectvice: Node = null;

    @property(Node)
    GA: Node = null;

    initialPos
    startPos

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        const worldPos = this.node.getWorldPosition();
        const localPos = this.GA.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        this.initialPos = this.node.getPosition().clone();

    }

    onTouchMove(event: EventTouch) {
        const pos = event.getUILocation();
        const movePos = this.GA.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y));
        this.node.setPosition(movePos.x, movePos.y);
    }

    onTouchEnd(event: EventTouch) {
        const pos = event.getUILocation();
        const endPos = this.GA.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y));
        const bol = this.objectvice.getComponent(UITransform).getBoundingBox().contains(v2(endPos.x, endPos.y))
        if (bol) {
            console.log("66666666666666");
        } else {
            this.node.setPosition(this.initialPos);
        }
    }
}


