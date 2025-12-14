import { _decorator, Component, Enum, error, EventTouch, Node, v3, Vec3 } from 'cc';
import { SNZL_TYPE } from './SNZL_Constant';
import { SNZL_LVController } from './SNZL_LVController';
import { SNZL_SoundController, SNZL_Sounds } from './SNZL_SoundController';
const { ccclass, property } = _decorator;

@ccclass('SNZL_ItemMove')
export class SNZL_ItemMove extends Component {
    @property({ type: Enum(SNZL_TYPE) })
    Type: SNZL_TYPE = SNZL_TYPE.TYPE1;

    IsMove: boolean = false;
    IsClick: boolean = true;

    private _z = 0
    private _parent: Node = null;
    private _scale: Vec3 = new Vec3();

    private _startPos: Vec3 = new Vec3();
    private _contentPos: Vec3 = new Vec3();

    protected onLoad(): void {
        this._parent = this.node.parent;
        this._scale = this.node.scale.clone();

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this._z = this.node.worldPosition.z;
    }

    onTouchStart(event: EventTouch) {
        if (!this.IsClick) return;
        if (!this.IsMove) {
            const pos = event.getUILocation();
            this._startPos = v3(pos.x, pos.y, this._z);
            this._contentPos = SNZL_LVController.Instance.Content.getPosition().clone();
        } else {
            // SNZL_SoundController.Instance.playSoundByName(SNZL_Sounds.Click);
        }
    }

    onTouchMove(event: EventTouch) {
        if (!this.IsMove) {
            const pos = event.getUILocation();
            const offset = v3(this._contentPos.x + pos.x - this._startPos.x, this._contentPos.y, this._contentPos.z);
            SNZL_LVController.Instance.Content.setPosition(offset);
            if (Math.abs(pos.y - this._startPos.y) >= 150) {
                this.changeMove();
                const pos = event.getUILocation();
                this.node.setWorldPosition(v3(pos.x, pos.y, this._z))
            }
        } else {
            const pos = event.getUILocation();
            this.node.setWorldPosition(v3(pos.x, pos.y, this._z))
        }
    }

    onTouchEnd(event: EventTouch) {
        if (this.IsMove) {
            const pos = event.getUILocation();
            if (pos.y < SNZL_LVController.Instance.CutY) {
                this.changeCell();
            } else {
                this._parent.active = false;
            }
            if (SNZL_LVController.Instance.checkItem(this.Type, this.node.getWorldPosition())) {
                this.node.destroy();
                SNZL_LVController.Instance.checkFinish();
                SNZL_SoundController.Instance.playSoundByName(SNZL_Sounds.Place);
            }
        }
    }


    changeMove() {
        this.IsMove = true;
        this.node.parent = SNZL_LVController.Instance.ItemParent;
        this.node.scale = new Vec3(1, 1, 1);
    }

    changeCell() {
        this.IsMove = false;
        this._parent.active = true;
        this.node.parent = this._parent;
        this.node.scale = this._scale;
        this.node.setPosition(v3(0, 0, 0));
    }
}


