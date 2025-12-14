import { _decorator, Component, EventTouch, Node, Vec2 } from 'cc';
import { GFS_NZ } from './GFS_NZ';
const { ccclass, property } = _decorator;

@ccclass('GFS_TouchController')
export class GFS_TouchController extends Component {

    public static Instance: GFS_TouchController = null;

    IsTouch: boolean = false;

    private _startX: number = 0

    protected onLoad(): void {
        GFS_TouchController.Instance = this;

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        if (!this.IsTouch) return;
        this._startX = event.getUILocation().x;
    }

    onTouchMove(event: EventTouch) {
        if (!this.IsTouch) return;
        const offX = event.getUILocation().x - this._startX;
        GFS_NZ.Instance.moveByOffsetX(offX);
    }

    onTouchEnd(event: EventTouch) {
        if (!this.IsTouch) return;
        GFS_NZ.Instance.moveByOffsetX();
    }
}


