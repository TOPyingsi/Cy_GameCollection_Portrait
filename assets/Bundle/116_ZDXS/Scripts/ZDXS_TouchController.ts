import { _decorator, Component, EventTouch, Node, Vec2 } from 'cc';
import { ZDXS_MyEvent, ZDXS_EventManager } from './ZDXS_EventManager';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_TouchController')
export class ZDXS_TouchController extends Component {


    private _touchPos: Vec2 = new Vec2();

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.OnTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.OnTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.OnTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.OnTouchEnd, this);
    }

    OnTouchStart(event: EventTouch) {
        this._touchPos = event.getUILocation();
        ZDXS_EventManager.Emit(ZDXS_MyEvent.ZDXS_TOUCH_MOVE, this._touchPos.x, this._touchPos.y);
    }

    OnTouchMove(event: EventTouch) {
        this._touchPos = event.getUILocation();
        ZDXS_EventManager.Emit(ZDXS_MyEvent.ZDXS_TOUCH_MOVE, this._touchPos.x, this._touchPos.y);
    }

    OnTouchEnd(event: EventTouch) {
        ZDXS_EventManager.Emit(ZDXS_MyEvent.ZDXS_TOUCH_END);
    }
}


