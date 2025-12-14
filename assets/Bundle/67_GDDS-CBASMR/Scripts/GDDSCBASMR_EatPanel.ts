import { _decorator, Animation, AnimationClip, Event, EventTouch, Node, randomRangeInt, sp, Sprite, SpriteFrame, tween, UITransform, v3, Vec3 } from 'cc';
import { GDDSCBASMR_UIBase } from './GDDSCBASMR_UIBase';
import Banner from 'db://assets/Scripts/Banner';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import { GDDSCBASMR_MainPanel } from './GDDSCBASMR_MainPanel';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import { PlayerState } from './GDDSCBASMR_SupermarketLivePanel';
import { GDDSCBASMR_AudioManager } from './GDDSCBASMR_AudioManager';
import { eventCenter } from './GDDSCBASMR_EventCenter';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_EatPanel')
export class GDDSCBASMR_EatPanel extends GDDSCBASMR_UIBase {

    private static instance: GDDSCBASMR_EatPanel;
    public static get Instance(): GDDSCBASMR_EatPanel {
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
    mubkang: Node;

    @property(Node)
    mubkangs: Node;

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
    mubkangStates = [1, 1, 1];

    protected onLoad(): void {
        super.onLoad();
        GDDSCBASMR_EatPanel.instance = this;
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
        for (let i = 0; i < this.mubkangs.children.length; i++) {
            const element = this.mubkangs.children[i].children[1];
            element.on(Node.EventType.TOUCH_START, this.TouchStart, this);
            element.on(Node.EventType.TOUCH_MOVE, this.TouchMove, this);
            element.on(Node.EventType.TOUCH_END, this.TouchEnd, this);
            element.on(Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
        }
    }

    TouchStart(event: EventTouch) {
        this.isTouch = true;
        let target: Node = event.target;
        let pos = event.getUILocation();
        target.setParent(this.touchNode, true);
        target.setWorldPosition(v3(pos.x, pos.y));
    }

    TouchMove(event: EventTouch) {
        let target: Node = event.target;
        let pos = event.getUILocation();
        target.setWorldPosition(v3(pos.x, pos.y));
        if (this.mouth.getComponent(UITransform).getBoundingBoxToWorld().intersects(target.getComponent(UITransform).getBoundingBoxToWorld())) this.eatTarget = target;
        else this.eatTarget = null;
    }

    TouchEnd(event: EventTouch) {
        let target: Node = event.target;
        this.eatTarget = null;
        if (this.playerState == PlayerState.Gape) this._Idle();
        target.setParent(this.mubkangs.children[parseInt(target.name)], true);
        target.setPosition(v3(0, 100));
        this.isTouch = false;
    }

    protected _InitData(): void {
        GDDSCBASMR_AudioManager.Instance._PlayLiveMusic();
        let data = GDDSCBASMR_DataManager.Instance.getNumberData("Skin");
        this.player.setSkin(`pifu${data}`);
        this.bg.spriteFrame = GDDSCBASMR_MainPanel.Instance.bg.spriteFrame;
        this.table.spriteFrame = GDDSCBASMR_MainPanel.Instance.table.spriteFrame;
        this._InitMubkang();
        this.scheduleOnce(this._InitRequest, 2);
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    _InitMubkang() {
        this.mubkangStates = [1, 1, 1];
        this.eatNum = 0;
        for (let i = 0; i < this.mubkangs.children.length; i++) {
            const element = this.mubkangs.children[i].children[1];
            if (GDDSCBASMR_DataManager.mukbangSfs) element.getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.mukbangSfs.find((value, index, obj) => { if (value.name == `mold${GDDSCBASMR_DataManager.curMubkang[0] + 1}-${GDDSCBASMR_DataManager.jellyName[GDDSCBASMR_DataManager.curMubkang[1]]}_1`) return value; });
            else eventCenter.once("mukbangSfs", () => { element.getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.mukbangSfs.find((value, index, obj) => { if (value.name == `mold${GDDSCBASMR_DataManager.curMubkang[0] + 1}-${GDDSCBASMR_DataManager.jellyName[GDDSCBASMR_DataManager.curMubkang[1]]}_1`) return value; }); }, this);
            element.children[0].getComponent(Sprite).spriteFrame = element.getComponent(Sprite).spriteFrame;
            element.children[0].children[0].getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.curMubkang[3] == 0 ? null : GDDSCBASMR_DataManager.gameTop2.find((value, index, obj) => { if (value.name == `blink${GDDSCBASMR_DataManager.curMubkang[3]}`) return value; });
            element.children[1].getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.top1.find((value, index, obj) => { if (value.name == GDDSCBASMR_DataManager.top1Name[GDDSCBASMR_DataManager.curMubkang[2]]) return value; });
            element.children[1].active = true;
            element.active = true;
        }
    }

    _InitRequest() {
        if (GDDSCBASMR_DataManager.chatSfs) this.request.children[3].getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.chatSfs[GDDSCBASMR_DataManager.requestViewer];
        else eventCenter.once("chatSfs", () => { this.request.children[3].getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.chatSfs[GDDSCBASMR_DataManager.requestViewer]; }, this);
        this.mubkang.getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.mukbangSfs.find((value, index, obj) => { if (value.name == `mold${GDDSCBASMR_DataManager.requestMubkang[0] + 1}-${GDDSCBASMR_DataManager.jellyName[GDDSCBASMR_DataManager.requestMubkang[1]]}_1`) return value; });
        this.mubkang.children[0].getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.requestMubkang[3] == 0 ? null : GDDSCBASMR_DataManager.gameTop2.find((value, index, obj) => { if (value.name == `blink${GDDSCBASMR_DataManager.requestMubkang[3]}`) return value; });
        this.mubkang.children[1].getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.top1.find((value, index, obj) => { if (value.name == GDDSCBASMR_DataManager.top1Name[GDDSCBASMR_DataManager.requestMubkang[2]]) return value; });
        let right = true;
        for (let i = 0; i < GDDSCBASMR_DataManager.curMubkang.length; i++) {
            if (GDDSCBASMR_DataManager.curMubkang[i] != GDDSCBASMR_DataManager.requestMubkang[i]) {
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
                    GDDSCBASMR_DataManager.coinSpawn = this.mubkang.getWorldPosition();
                    let coin = GDDSCBASMR_DataManager.Instance.getNumberData("Coin");
                    coin += 300;
                    GDDSCBASMR_DataManager.Instance.setNumberData("Coin", coin);
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
            GDDSCBASMR_DataManager.coinSpawn = target.getWorldPosition();
            let coin = GDDSCBASMR_DataManager.Instance.getNumberData("Coin");
            coin += 1000;
            GDDSCBASMR_DataManager.Instance.setNumberData("Coin", coin);
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
        GDDSCBASMR_AudioManager.Instance._PlaySound(12);
        let str = "chidongxi";
        this.player.animation = str;
        let num = this.mubkangStates[parseInt(this.eatTarget.name)];
        num++;
        this.mubkangStates[parseInt(this.eatTarget.name)] = num;
        if (num < 4) {
            this.eatTarget.getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.mukbangSfs.find((value, index, obj) => { if (value.name == `mold${GDDSCBASMR_DataManager.curMubkang[0] + 1}-${GDDSCBASMR_DataManager.jellyName[GDDSCBASMR_DataManager.curMubkang[1]]}_${num}`) return value; });
            this.eatTarget.children[0].getComponent(Sprite).spriteFrame = this.eatTarget.getComponent(Sprite).spriteFrame;
            this.eatTarget.children[1].active = num != 3;
        }
        else {
            this.eatTarget.active = false;
            this.eatTarget.setParent(this.mubkangs.children[parseInt(this.eatTarget.name)], true);
            this.eatTarget.setPosition(v3(0, 100));
            this.eatNum++;
            if (this.eatNum >= 3) this.scheduleOnce(() => {
                GDDSCBASMR_MainPanel.Instance.endPanel.active = true;
                this.node.active = false;
            }, 4);
        }
        let time = this.player.findAnimation(str).duration;
        this.scheduleOnce(() => {
            if (this.eatTarget && this.face.getComponent(UITransform).getBoundingBoxToWorld().intersects(this.eatTarget.getComponent(UITransform).getBoundingBoxToWorld())) this._Gape();
            else {
                GDDSCBASMR_AudioManager.Instance._PlaySound(16);
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