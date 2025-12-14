import { _decorator, Animation, AnimationClip, Event, EventTouch, Node, randomRangeInt, sp, Sprite, SpriteFrame, tween, UITransform, v3, Vec3 } from 'cc';
import { THLCB_UIBase } from './THLCB_UIBase';
import Banner from 'db://assets/Scripts/Banner';
import { THLCB_DataManager } from './THLCB_DataManager';
import { THLCB_MainPanel } from './THLCB_MainPanel';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import { PlayerState } from './THLCB_SupermarketLivePanel';
import { THLCB_AudioManager } from './THLCB_AudioManager';
import { eventCenter } from './THLCB_EventCenter';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('THLCB_EatPanel')
export class THLCB_EatPanel extends THLCB_UIBase {

    private static instance: THLCB_EatPanel;
    public static get Instance(): THLCB_EatPanel {
        return this.instance;
    }

    @property(sp.Skeleton)
    player: sp.Skeleton;

    @property(Sprite)
    bg: Sprite;

    @property(Sprite)
    table: Sprite;

    @property(Sprite)
    giftProcess: Sprite;

    @property(Sprite)
    requestJudge: Sprite;

    @property(Animation)
    phone: Animation;

    @property(Node)
    request: Node;

    @property(Node)
    thl: Node;

    @property(Node)
    thls: Node;

    @property(Node)
    mouth: Node;

    @property(Node)
    face: Node;

    @property(Node)
    touchNode: Node;

    @property([SpriteFrame])
    judgeSfs: SpriteFrame[] = [];

    eatTarget: Node;
    playerState = PlayerState.Idle;
    isTouch = false;
    canEat = false;
    eatNum = 0;
    thlStates = [0, 0, 0];

    protected onLoad(): void {
        super.onLoad();
        THLCB_EatPanel.instance = this;
        this._InitTouch();
        this.schedule(() => {
            if (!this.isTouch || !this.eatTarget) return;
            if (this.playerState != PlayerState.Eat) {
                if (this.canEat && this.playerState == PlayerState.Gape && this.mouth.getComponent(UITransform).getBoundingBoxToWorld().intersects(this.eatTarget.getComponent(UITransform).getBoundingBoxToWorld())) this._Eat();
                else if (this.face.getComponent(UITransform).getBoundingBoxToWorld().intersects(this.eatTarget.getComponent(UITransform).getBoundingBoxToWorld())) {
                    if (this.playerState != PlayerState.Gape) this._Gape();
                }
                else if (this.playerState == PlayerState.Gape) this._Idle();
            }
        }, 0.1);
    }

    _InitTouch() {
        for (let i = 0; i < this.thls.children.length; i++) {
            const element = this.thls.children[i].children[0];
            element.on(Node.EventType.TOUCH_START, this.TouchStart, this);
            element.on(Node.EventType.TOUCH_MOVE, this.TouchMove, this);
            element.on(Node.EventType.TOUCH_END, this.TouchEnd, this);
            element.on(Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
        }
    }

    TouchStart(event: EventTouch) {
        let target: Node = event.target;
        if (this.thlStates[parseInt(target.name)] > 3) return;
        this.isTouch = true;
        let pos = event.getUILocation();
        target.setParent(this.touchNode, true);
        target.setWorldPosition(v3(pos.x, pos.y));
    }

    TouchMove(event: EventTouch) {
        let target: Node = event.target;
        if (this.thlStates[parseInt(target.name)] > 3) return;
        let pos = event.getUILocation();
        target.setWorldPosition(v3(pos.x, pos.y));
        if (this.mouth.getComponent(UITransform).getBoundingBoxToWorld().intersects(target.getComponent(UITransform).getBoundingBoxToWorld())) this.eatTarget = target;
        else this.eatTarget = null;
    }

    TouchEnd(event: EventTouch) {
        let target: Node = event.target;
        if (this.thlStates[parseInt(target.name)] > 3) return;
        this.eatTarget = null;
        if (this.playerState == PlayerState.Gape) this._Idle();
        target.setParent(this.thls.children[parseInt(target.name)], true);
        target.setPosition(v3(0, -195));
        this.isTouch = false;
    }

    protected _InitData(): void {
        THLCB_AudioManager.Instance._PlayLiveMusic();
        let data = THLCB_DataManager.Instance.getNumberData("Skin");
        this.player.setSkin(`pifu${data}`);
        this.bg.spriteFrame = THLCB_MainPanel.Instance.bg.spriteFrame;
        this.table.spriteFrame = THLCB_MainPanel.Instance.table.spriteFrame;
        this._InitThl();
        this.scheduleOnce(this._InitRequest, 2);
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    _InitThl() {
        this.thlStates = [0, 0, 0];
        this.eatNum = 0;
        for (let i = 0; i < this.thls.children.length; i++) {
            const element = this.thls.children[i].children[0].children[0];
            for (let i = 0; i < element.children.length; i++) {
                const element2 = element.children[i].getComponent(Sprite);
                element2.spriteFrame = THLCB_DataManager.thl2Sfs.find((value, index, obj) => { if (value.name == (THLCB_DataManager.curThl[i] + 1).toString()) return value; });
            }
            element.active = true;
        }
    }

    _InitRequest() {
        if (THLCB_DataManager.chatSfs) this.request.children[4].getComponent(Sprite).spriteFrame = THLCB_DataManager.chatSfs[THLCB_DataManager.requestViewer];
        else eventCenter.once("chatSfs", () => { this.request.children[4].getComponent(Sprite).spriteFrame = THLCB_DataManager.chatSfs[THLCB_DataManager.requestViewer]; }, this);
        for (let i = 0; i < this.thl.children.length; i++) {
            const element = this.thl.children[i].getComponent(Sprite);
            element.spriteFrame = THLCB_DataManager.thl2Sfs.find((value, index, obj) => { if (value.name == (THLCB_DataManager.requestThl[i] + 1).toString()) return value; });
        }
        let right = true;
        for (let i = 0; i < THLCB_DataManager.curThl.length; i++) {
            if (THLCB_DataManager.curThl[i] != THLCB_DataManager.requestThl[i]) {
                right = false;
                break;
            }
        }
        this.requestJudge.spriteFrame = this.judgeSfs[right ? 0 : 1];
        tween(this.request)
            .to(0.25, { scale: Vec3.ONE }, { easing: EasingType.backOut })
            .delay(1)
            .call(() => {
                if (right) {
                    THLCB_DataManager.coinSpawn = this.thl.getWorldPosition();
                    let coin = THLCB_DataManager.Instance.getNumberData("Coin");
                    coin += 300;
                    THLCB_DataManager.Instance.setNumberData("Coin", coin);
                }
            })
            .to(0.25, { scale: Vec3.ZERO }, { easing: EasingType.backIn })
            .delay(1)
            .call(() => { this._ShowGift(); })
            .start();
    }

    _ShowGift() {
        this.phone.getState(this.phone.defaultClip.name).wrapMode = AnimationClip.WrapMode.Default;
        this.phone.play();
    }

    _GiftTime() {
        this.giftProcess.fillRange = 1;
    }

    protected update(dt: number): void {
        if (this.giftProcess.fillRange > 0 && this.phone.node.children[2].scale.x > 0) {
            this.giftProcess.fillRange -= dt / 5;
            if (this.giftProcess.fillRange <= 0) {
                this.giftProcess.fillRange = 0;
                this.phone.getState(this.phone.defaultClip.name).wrapMode = AnimationClip.WrapMode.Reverse;
                this.phone.play();
            }
        }
    }

    VideoCoin(event: Event) {
        let target: Node = event.target;
        let x = this;
        Banner.Instance.ShowVideoAd(() => {
            THLCB_DataManager.coinSpawn = target.getWorldPosition();
            let coin = THLCB_DataManager.Instance.getNumberData("Coin");
            coin += 1000;
            THLCB_DataManager.Instance.setNumberData("Coin", coin);
            x.phone.getState(x.phone.defaultClip.name).wrapMode = AnimationClip.WrapMode.Reverse;
            x.phone.play();
        })
    }

    _Gape() {
        this.playerState = PlayerState.Gape;
        this.player.loop = true;
        this.player.animation = "zhangzui";
        let time = this.player.findAnimation("zhangzui").duration / 4;
        this.scheduleOnce(this._ReadyToEat, time);
        this.unschedule(this._Hungry);
        this.unschedule(this._Idle);
    }

    _ReadyToEat() {
        this.canEat = true;
    }

    _Eat() {
        this.unschedule(this._Hungry);
        this.unschedule(this._Idle);
        this.canEat = false;
        this.playerState = PlayerState.Eat;
        this.player.loop = false;
        THLCB_AudioManager.Instance._PlaySound(12);
        let str = "chidongxi";
        this.player.animation = str;
        let num = this.thlStates[parseInt(this.eatTarget.name)];
        this.eatTarget.children[0].children[3 - num].getComponent(Sprite).spriteFrame = null;
        if (num >= 3) {
            // this.eatTarget.active = false;
            this.eatTarget.setParent(this.thls.children[parseInt(this.eatTarget.name)], true);
            this.eatTarget.setPosition(v3(0, -195));
            this.eatNum++;
            if (this.eatNum >= 3) this.scheduleOnce(() => {
                THLCB_MainPanel.Instance.endPanel.active = true;
                this.node.active = false;
            }, 4);
        }
        num++;
        this.thlStates[parseInt(this.eatTarget.name)] = num;
        let time = this.player.findAnimation(str).duration;
        this.scheduleOnce(() => {
            if (this.eatTarget && this.face.getComponent(UITransform).getBoundingBoxToWorld().intersects(this.eatTarget.getComponent(UITransform).getBoundingBoxToWorld())) this._Gape();
            else {
                THLCB_AudioManager.Instance._PlaySound(16);
                this.playerState = PlayerState.Express;
                this.player.animation = "bq" + randomRangeInt(1, 3);
                let duration = this.player.findAnimation(this.player.animation).duration;
                this.scheduleOnce(this._Idle, duration);
            }
        }, time);
    }

    _Idle() {
        this.canEat = false;
        this.playerState = PlayerState.Idle;
        this.player.loop = true;
        this.player.animation = "daiji";
        this.scheduleOnce(this._Hungry, 5);
        this.unschedule(this._ReadyToEat);
    }

    _Hungry() {
        this.player.animation = "biaoqing2";
    }

}