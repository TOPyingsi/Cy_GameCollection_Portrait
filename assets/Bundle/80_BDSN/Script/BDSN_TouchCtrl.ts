import { _decorator, Component, director, EventTouch, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BDSN_TouchCtrl')
export class BDSN_TouchCtrl extends Component {

    @property(Node) gameArea: Node = null;

    private parent: Node = null;
    private offsetX: number = 0;
    private offsetY: number = 0;
    private startPos: Vec3 = null;

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.parent = this.node.parent;
    }


    onTouchStart(event: EventTouch) {
        const pos = event.getUILocation();
        this.startPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y));

    }

    onTouchMove(event: EventTouch) {
        const pos = event.getUILocation();
        const touchMovePos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y));
        this.node.setPosition(touchMovePos.x, touchMovePos.y);
    }

    onTouchEnd(event: EventTouch) {
        const pos = event.getUILocation();
        const touchMovePos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y));
        director.getScene().emit("touchEnd", touchMovePos, this.node)
    }
}


