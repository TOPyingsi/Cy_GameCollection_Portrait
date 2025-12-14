import { _decorator, Component, EventTouch, find, Node, tween, UITransform, v2, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('QC_PropCtrl')
export class QC_PropCtrl extends Component {

    @property(Node) gameArea: Node = null;

    private originalPos: Vec3 = new Vec3();
    private siblingIndex: number = 0;
    private touchOriginalPos: Vec3 = new Vec3();

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {

        const touchStartPos = this.gameArea.getComponent(UITransform)
            .convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        if (this.node.name == "柜子门") {
            this.touchOriginalPos = touchStartPos;
        }
    }

    onTouchMove(event: EventTouch) {
        if (this.node.name == "柜子门") {
        } else {
            this.node.setPosition(this.touchOriginalPos.x + event.getDelta().x, this.touchOriginalPos.y + event.getDelta().y, this.touchOriginalPos.z);
        }
    }

    onTouchEnd(event: EventTouch) {

        const touchEndPos = this.gameArea.getComponent(UITransform)
            .convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        if (this.node.name == "柜子门") {
            if (this.touchOriginalPos.x >= touchEndPos.x + 50 || this.touchOriginalPos.x <= touchEndPos.x - 50 || this.touchOriginalPos.y >= touchEndPos.y + 50 || this.touchOriginalPos.y <= touchEndPos.y - 50) {
                this.node.destroy();
                find("Canvas/GameArea/BG/高跟鞋").active = true;
            }
        }
    }
}


