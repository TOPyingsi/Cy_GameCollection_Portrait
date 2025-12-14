import { _decorator, Button, Component, EventTouch, Node, size, sp, Sprite, SpriteFrame, UITransform, v3, Vec3 } from 'cc';
import { THLCB_DataManager } from './THLCB_DataManager';
import Banner from 'db://assets/Scripts/Banner';
import { THLCB_GamePanel } from './THLCB_GamePanel';
const { ccclass, property } = _decorator;

@ccclass('THLCB_Item')
export class THLCB_Item extends Component {

    @property(Sprite)
    sprite: Sprite;

    @property(Button)
    button: Button;

    @property(Node)
    lock: Node;

    @property(Node)
    video: Node;

    @property([SpriteFrame])
    kuangSfs: SpriteFrame[] = [];

    num: number;
    isMove = false;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.TouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.TouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.TouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
    }

    _Init(_num: number, isButton = true) {
        this._Cancel();
        this.num = _num;
        let level = THLCB_DataManager.Instance.getNumberData("Level");
        this.lock.active = isButton && THLCB_DataManager.unlockItemLevels[_num] > level;
        this.video.active = isButton && THLCB_DataManager.unlockItemLevels[_num] > level;
        this.button.enabled = this.lock.active && this.video.active;
        this.sprite.spriteFrame = THLCB_DataManager.thlSfs.find((value, index, obj) => { if (value.name == (this.num + 1).toString()) return value; });
        this.node.active = true;
    }

    Video() {
        if (!this.isMove) return;
        let x = this;
        if (x.lock.active && x.video.active) Banner.Instance.ShowVideoAd(() => {
            x.lock.active = false;
            x.video.active = false;
        });
    }

    _Cancel() {
        this.getComponent(Sprite).spriteFrame = this.kuangSfs[0];
    }

    TouchStart(event: EventTouch) {
        this.isMove = true;
        if (this.lock.active && this.video.active) return;
        THLCB_GamePanel.Instance.ItemTouchStart(event);
    }

    TouchMove(event: EventTouch) {
        this.isMove = false;
        if (this.lock.active && this.video.active) return;
        THLCB_GamePanel.Instance.ItemTouchMove(event);
    }

    TouchEnd(event: EventTouch) {
        if (this.lock.active && this.video.active) return;
        THLCB_GamePanel.Instance.ItemTouchEnd(event);
    }

}