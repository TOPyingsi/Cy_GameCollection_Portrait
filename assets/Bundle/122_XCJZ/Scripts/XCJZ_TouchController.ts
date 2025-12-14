import { _decorator, Camera, Component, EventTouch, geometry, math, Node, PhysicsSystem, UITransform, Vec3 } from 'cc';
import { XCJZ_EventManager, XCJZ_MyEvent } from './XCJZ_EventManager';
import { XCJZ_GROUP } from './XCJZ_Constant';
import { XCJZ_GameManager } from './XCJZ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('XCJZ_TouchController')
export class XCJZ_TouchController extends Component {

    /** 用来渲染 3D 世界的相机（不是 UI 的 camera1） */
    @property(Camera)
    WorldCamera: Camera | null = null;

    @property
    MoveSpeed = 10;

    private _preHitX: number = 0;
    private _curHitX: number = 0;
    private _touchId: number = -1;
    private _width: number = 0;

    protected onLoad(): void {
        // this._width = this.node.getComponent(UITransform).width;
        this._width = 1080;
    }

    onEnable() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch) {
        if (XCJZ_GameManager.Instance.GameOver) return;
        if (this._touchId != -1) return;
        this._touchId = event.touch.getID();
        if (XCJZ_GameManager.Instance.GamePause) {
            XCJZ_EventManager.Emit(XCJZ_MyEvent.PLAYER_RESUME);
        }
        this._preHitX = event.getUILocation().x;
    }

    private onTouchMove(event: EventTouch) {
        if (XCJZ_GameManager.Instance.GameOver) return;
        if (this._touchId != event.touch.getID()) return;


        if (!this.WorldCamera) {
            console.warn('worldCamera 没赋值');
            return;
        }

        this._curHitX = event.getUILocation().x;
        XCJZ_EventManager.Emit(XCJZ_MyEvent.PLAYER_MOVE, (this._curHitX - this._preHitX) / this._width * this.MoveSpeed);
        this._preHitX = this._curHitX;
    }

    private onTouchEnd(event: EventTouch) {
        if (this._touchId != event.touch.getID()) return;
        this._touchId = -1;
    }
}


