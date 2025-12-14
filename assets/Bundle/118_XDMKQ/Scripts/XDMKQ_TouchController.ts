import { _decorator, Camera, Component, EventTouch, Node, Vec2 } from 'cc';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_TouchController')
export class XDMKQ_TouchController extends Component {

    @property
    RotateSpeed = 0.3; // 灵敏度

    @property(Node)
    Fire: Node = null;

    private _touchID: number | null = null;
    private _lastPos: Vec2 = new Vec2();
    onEnable() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        if (this.Fire) {
            this.Fire.on(Node.EventType.TOUCH_START, this.onFireStart, this);
            this.Fire.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.Fire.on(Node.EventType.TOUCH_END, this.onFireEnd, this);
            this.Fire.on(Node.EventType.TOUCH_CANCEL, this.onFireEnd, this);
        }

        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_FIRE_SHOW, this.FireShow, this);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        if (this.Fire) {
            this.Fire.off(Node.EventType.TOUCH_START, this.onFireStart, this);
            this.Fire.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.Fire.off(Node.EventType.TOUCH_END, this.onFireEnd, this);
            this.Fire.off(Node.EventType.TOUCH_CANCEL, this.onFireEnd, this);
        }

        XDMKQ_EventManager.Off(XDMKQ_MyEvent.XDMKQ_FIRE_SHOW, this.FireShow, this);
    }
    onTouchStart(event: EventTouch) {
        if (this._touchID != null) return;
        this._touchID = event.touch.getID();
        this._lastPos = event.getLocation();
    }

    onTouchMove(event: EventTouch) {
        if (event.touch.getID() == this._touchID) {
            const cur = new Vec2();
            event.getLocation(cur);
            const dx = cur.x - this._lastPos.x;
            const dy = cur.y - this._lastPos.y;
            this._lastPos.set(cur);
            // this._yaw -= dx * this.RotateSpeed * 0.2;
            // this._pitch -= dy * this.RotateSpeed * 0.2;
            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_TOUCH_MOVE, dx * this.RotateSpeed, dy * this.RotateSpeed);
            // this._pitch = math.clamp(this._pitch, this.minPitch, this.maxPitch);
        }
    }

    onTouchEnd(event: EventTouch) {
        if (event.touch.getID() == this._touchID) {
            this._touchID = null;
        }
    }

    onFireStart(event: EventTouch) {
        if (this._touchID != null) return;
        this._touchID = event.touch.getID();
        this._lastPos = event.getLocation();
        XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_FIRE_START);
    }

    onFireEnd(event: EventTouch) {
        if (event.touch.getID() == this._touchID) {
            this._touchID = null;
            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_FIRE_END);
        }
    }

    FireShow(showIcon: boolean, touch: boolean = true) {
        this.Fire.active = touch;
        this.Fire.getChildByName("Icon").active = showIcon;
    }

}


