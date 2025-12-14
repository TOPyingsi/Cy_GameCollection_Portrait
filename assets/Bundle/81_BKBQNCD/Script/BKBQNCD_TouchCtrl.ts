import { _decorator, Component, EventTouch, Node, UITransform, v2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BKBQNCD_TouchCtrl')
export class BKBQNCD_TouchCtrl extends Component {

    @property(Node) role: Node = null;
    private isTouch: boolean = false;
    initialPos: Vec3 = null;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);

        this.initialPos = this.role.position;
    }


    touchStart(event: EventTouch) {
        const touchStartPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        const isRole = this.role.getComponent(UITransform).getBoundingBox().contains(v2(touchStartPos.x, touchStartPos.y));
        if (!isRole) return;
        this.isTouch = true;
    }

    touchMove(event: EventTouch) {
        if (!this.isTouch) return;
        const touchPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        this.role.setPosition(touchPos.x, this.initialPos.y);
    }

    touchEnd(event: EventTouch) {
        if (this.isTouch) {
            this.isTouch = false;
            // this.role.setPosition(0, this.initialPos.y);
        }
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.node.off(Node.EventType.TOUCH_END, this.touchEnd, this);
    }
}


