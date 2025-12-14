import { _decorator, Button, CCBoolean, CCInteger, CCString, Component, EventTouch, Node, sp, Sprite, SpriteFrame, Tween, tween, UITransform, v3, Vec3 } from 'cc';
import { GDDSCBASMR_SupermarketLivePanel, PlayerState } from './GDDSCBASMR_SupermarketLivePanel';
import { GDDSCBASMR_AudioManager } from './GDDSCBASMR_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_SupermarketItem')
export class GDDSCBASMR_SupermarketItem extends Component {

    @property(CCInteger)
    eatType: number = 0;

    @property(CCInteger)
    expressType: number = 0;

    @property(CCInteger)
    price: number = 0;

    @property(CCInteger)
    sound: number = 0;

    @property(SpriteFrame)
    touchSf: SpriteFrame;

    @property([SpriteFrame])
    itemSfs: SpriteFrame[] = [];

    sprite: Sprite;
    button: Button;
    touchNode: Node;
    mouth: Node;
    head: Node;
    step = 0;
    id = 0;
    isEat = false;
    isTouch = false;

    protected onLoad(): void {
        this.sprite = this.getComponent(Sprite);
        this.button = this.getComponent(Button);
    }

    protected onEnable(): void {
        this.step = 0;
        this.sprite.spriteFrame = this.itemSfs[0];
        if (this.button) this.button.enabled = true;
        else this._InitTouch();
    }

    protected start(): void {
        if (this.touchSf) this.touchNode = GDDSCBASMR_SupermarketLivePanel.Instance.touchNode;
        else this.touchNode = this.node;
        this.mouth = GDDSCBASMR_SupermarketLivePanel.Instance.mouthSocket;
        this.head = GDDSCBASMR_SupermarketLivePanel.Instance.headSocket;
        this.schedule(() => {
            if (!this.isTouch || this.isEat) return;
            if (GDDSCBASMR_SupermarketLivePanel.Instance.playerState != PlayerState.Eat) {
                if (GDDSCBASMR_SupermarketLivePanel.Instance.canEat && GDDSCBASMR_SupermarketLivePanel.Instance.playerState == PlayerState.Gape && this.mouth.getComponent(UITransform).getBoundingBoxToWorld().intersects(this.touchNode.getComponent(UITransform).getBoundingBoxToWorld())) {
                    GDDSCBASMR_SupermarketLivePanel.Instance._Eat(this);
                    if (this.touchSf) this.isTouch = false, this.isEat = true;
                }
                else if (this.head.getComponent(UITransform).getBoundingBoxToWorld().intersects(this.touchNode.getComponent(UITransform).getBoundingBoxToWorld())) {
                    if (GDDSCBASMR_SupermarketLivePanel.Instance.playerState != PlayerState.Gape) GDDSCBASMR_SupermarketLivePanel.Instance._Gape();
                }
                else if (GDDSCBASMR_SupermarketLivePanel.Instance.playerState == PlayerState.Gape) GDDSCBASMR_SupermarketLivePanel.Instance._Idle();
            }
        }, 0.1);
    }

    OpenPack() {
        GDDSCBASMR_AudioManager.Instance._PlaySound(7);
        this.scheduleOnce(() => {
            this.step++;
            this.sprite.spriteFrame = this.itemSfs[this.step];
            this._InitTouch();
        }, 0.25);
        this.button.enabled = false;
    }

    _InitTouch() {
        this.node.on(Node.EventType.TOUCH_START, this.TouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.TouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.TouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
    }

    _CancelTouch() {
        this.node.off(Node.EventType.TOUCH_START, this.TouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.TouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.TouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
        this.node.setPosition(Vec3.ZERO);
        this.isEat = false;
        this.isTouch = false;
        GDDSCBASMR_SupermarketLivePanel.Instance.eatTarget = null;
    }

    TouchStart(event: EventTouch) {
        this.isTouch = true;
        this.isEat = false;
        if (this.touchSf) {
            this.touchNode.getComponent(Sprite).spriteFrame = this.touchSf;
            this.sprite.spriteFrame = this.itemSfs[this.step + 1];
            Tween.stopAllByTarget(this.touchNode);
            tween(this.touchNode).to(0.1, { scale: v3(0.8, 0.8, 1) }).start();
        }
        let pos = event.getUILocation();
        this.touchNode.setWorldPosition(v3(pos.x, pos.y));
    }

    TouchMove(event: EventTouch) {
        if (this.isEat && this.touchSf) return;
        let pos = event.getUILocation();
        this.touchNode.setWorldPosition(v3(pos.x, pos.y));
        if (this.mouth.getComponent(UITransform).getBoundingBoxToWorld().intersects(this.touchNode.getComponent(UITransform).getBoundingBoxToWorld())) GDDSCBASMR_SupermarketLivePanel.Instance.eatTarget = this;
        else GDDSCBASMR_SupermarketLivePanel.Instance.eatTarget = null;
    }

    TouchEnd(event: EventTouch) {
        GDDSCBASMR_SupermarketLivePanel.Instance.eatTarget = null;
        if (GDDSCBASMR_SupermarketLivePanel.Instance.playerState == PlayerState.Gape) GDDSCBASMR_SupermarketLivePanel.Instance._Idle();
        if (this.touchSf) {
            if (this.isEat) return;
            this.isTouch = false;
            Tween.stopAllByTarget(this.touchNode);
            tween(this.touchNode).to(0.1, { scale: Vec3.ZERO }).start();
            this.sprite.spriteFrame = this.itemSfs[this.step];
        }
        else this.touchNode.setPosition(Vec3.ZERO), this.isTouch = false;
    }

}