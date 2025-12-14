import { _decorator, Component, EventTouch, Node, Rect, UITransform, v3, Vec3 } from 'cc';
import { GFS_LVController } from './GFS_LVController';
const { ccclass, property } = _decorator;

@ccclass('GFS_XD')
export class GFS_XD extends Component {
    public static Instance: GFS_XD = null;

    UITransform: UITransform = null;

    private _startPos: Vec3 = new Vec3();

    protected onLoad(): void {
        GFS_XD.Instance = this;

        this.UITransform = this.getComponent(UITransform);
        this._startPos = this.node.getWorldPosition().clone();

        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchMove(event: EventTouch) {
        const pos = event.getUILocation();
        this.node.setWorldPosition(v3(pos.x, pos.y, this._startPos.z));
        const rect = GFS_LVController.Instance.getBlackDogBoundingBoxToWorld();

        if (rect && rect.intersects(this.getBoundingBoxToWorld())) {
            GFS_LVController.Instance.BlackDogItem.switchBlackDogBlood();
        }
    }

    onTouchEnd(event: EventTouch) {
        this.node.setWorldPosition(this._startPos);
    }

    getBoundingBoxToWorld(): Rect {
        return this.UITransform.getBoundingBoxToWorld();
    }
}


