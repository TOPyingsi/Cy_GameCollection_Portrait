import { _decorator, Component, EventTouch, Node, Rect, Sprite, UITransform, v3, Vec3 } from 'cc';
import { NZCK_LVController } from './NZCK_LVController';
const { ccclass, property } = _decorator;

@ccclass('NZCK_JD')
export class NZCK_JD extends Component {

    private _initPos: Vec3 = new Vec3();
    private _UITransform: UITransform = null;
    private _startPos: Vec3 = new Vec3();

    protected onLoad(): void {
        this._initPos = this.node.getWorldPosition().clone();
        this._UITransform = this.getComponent(UITransform);
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        this._startPos = this.node.getWorldPosition().clone();
    }

    onTouchMove(event: EventTouch) {
        const pos = event.getUILocation();
        this.node.setWorldPosition(v3(pos.x, pos.y, this._startPos.z));
    }

    onTouchEnd(event: EventTouch) {
        const flag = NZCK_LVController.Instance.checkByRect(this._UITransform.getBoundingBoxToWorld());
        if (flag) {
            this.node.setWorldPosition(this._initPos);
        } else {
            this.node.setWorldPosition(this._startPos);
        }
    }
}


