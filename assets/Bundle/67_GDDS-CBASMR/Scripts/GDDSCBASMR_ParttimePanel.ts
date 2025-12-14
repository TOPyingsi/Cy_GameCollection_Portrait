import { _decorator, Animation, AnimationClip, Component, Event, Label, Node, randomRangeInt, Sprite, SpriteFrame, Tween, tween, UIOpacity, v3, Vec3 } from 'cc';
import { GDDSCBASMR_UIBase } from './GDDSCBASMR_UIBase';
import { GDDSCBASMR_MainPanel } from './GDDSCBASMR_MainPanel';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import Banner from 'db://assets/Scripts/Banner';
import { GDDSCBASMR_AudioManager } from './GDDSCBASMR_AudioManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_ParttimePanel')
export class GDDSCBASMR_ParttimePanel extends GDDSCBASMR_UIBase {

    @property(Sprite)
    heart: Sprite;

    @property(Label)
    guestLabel: Label;

    @property(Node)
    guest1: Node;

    @property(Node)
    guest2: Node;

    @property(Node)
    milkTea: Node;

    @property(Node)
    requestMilkTea: Node;

    @property(Node)
    request: Node;

    @property(Node)
    ready: Node;

    @property(Node)
    tutorialPanel: Node;

    @property(Node)
    closePanel: Node;

    @property(Node)
    finishPanel: Node;

    @property([Node])
    tf: Node[] = [];

    @property([Node])
    coinNode: Node[] = [];

    @property([SpriteFrame])
    ingredSfs: SpriteFrame[] = [];

    @property([SpriteFrame])
    readySfs: SpriteFrame[] = [];

    time = 6;
    isOrder = false;
    ingredArr: number[] = [];
    requestArr: number[] = [];
    guestTypes: string[] = ["bear", "capybara", "cat", "cinamonroll", "ghost", "melody", "pig", "rabbit"];
    guestName: string;
    guest: Node;
    private guestNum = 0;
    public get GuestNum(): number {
        return this.guestNum;
    }
    public set GuestNum(value: number) {
        this.guestNum = value;
        this.guestLabel.string = this.guestNum + "/8";
    }

    protected update(dt: number): void {
        if (this.isOrder && this.time > 0) {
            this.time -= dt;
            if (this.time <= 0) {
                this.time = 0;
                this._Fail();
            }
            this.heart.fillRange = this.time / 8;
        }
    }

    protected _InitData(): void {
        GDDSCBASMR_AudioManager.Instance._PlayPTMusic();
        this.tutorialPanel.active = true;
        let ani = this.tutorialPanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Reverse;
        ani.play();
        this.GuestNum = 0;
        this.unscheduleAllCallbacks();
        this.ready.active = false;
        this.request.active = false;
        if (this.guest) {
            Tween.stopAllByTarget(this.guest);
            this.guest.setPosition(v3(900, -100));
        }
        this.guest = this.guest1;
        this.finishPanel.active = false;
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    StartGame() {
        GDDSCBASMR_AudioManager.Instance._PlaySound(1);
        let ani = this.tutorialPanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
        for (let i = 0; i < this.milkTea.children.length; i++) {
            const element = this.milkTea.children[i].getComponent(Sprite);
            element.spriteFrame = null;
        }
        this.scheduleOnce(() => {
            GDDSCBASMR_AudioManager.Instance._PlaySound(23);
            this.ready.getComponent(Sprite).spriteFrame = this.readySfs[0];
            this.ready.active = true;
            this.scheduleOnce(() => {
                this.ready.getComponent(Sprite).spriteFrame = this.readySfs[1];
                this.scheduleOnce(() => {
                    this.ready.active = false;
                    this._GuestReady();
                }, 1);
            }, 1);
        }, 1);
        this.isOrder = false;
        this.ingredArr = [];
    }

    _GuestReady() {
        this.guest.setPosition(v3(900, -100));
        this.guestName = this.guestTypes[randomRangeInt(0, this.guestTypes.length)];
        this.guest.getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.guestSfs.find((value, index, obj) => { if (value.name == this.guestName + "_normal") return value; });
        let t1 = tween(this.guest).to(2, { position: v3(0, -100) }).call(() => { this._InitRequest(); });
        let t2 = tween(this.guest).to(0.25, { angle: 15 }).to(0.5, { angle: -15 }).to(0.5, { angle: 15 }).to(0.5, { angle: -15 }).to(0.25, { angle: 0 });
        tween(this.guest).parallel(t1, t2).start();
    }

    _GuestLeave() {
        let leaveGuest = this.guest;
        this.scheduleOnce(() => {
            this.request.active = false;
            let t1 = tween(leaveGuest).to(2, { position: v3(-900, -100) });
            let t2 = tween(leaveGuest).to(0.25, { angle: 15 }).to(0.5, { angle: -15 }).to(0.5, { angle: 15 }).to(0.5, { angle: -15 }).to(0.25, { angle: 0 });
            tween(this.guest).parallel(t1, t2).start();
            this.guest = this.guest == this.guest1 ? this.guest2 : this.guest1;
            if (this.GuestNum < 8) this._GuestReady();
        }, 1);
    }

    _InitRequest() {
        this.tf[0].active = false;
        this.tf[1].active = false;
        this.requestArr = [randomRangeInt(0, 3), randomRangeInt(0, 3), randomRangeInt(0, 3)];
        for (let i = 0; i < 3; i++) {
            const element = this.requestMilkTea.children[i].getComponent(Sprite);
            element.spriteFrame = this.ingredSfs[this.requestArr[i]];
            this.milkTea.children[i].getComponent(Sprite).spriteFrame = null;
        }
        this.ingredArr = [];
        this.milkTea.setPosition(Vec3.ZERO);
        this.milkTea.getComponent(UIOpacity).opacity = 255;
        this.time = 8;
        this.request.active = true;
        this.isOrder = true;
    }

    ChooseIngredient(event: Event) {
        if (!this.isOrder) return;
        let target: Node = event.target;
        let num = target.getSiblingIndex();
        this.ingredArr.push(num);
        this.milkTea.children[this.ingredArr.length - 1].getComponent(Sprite).spriteFrame = this.ingredSfs[num];
        if (this.ingredArr.length == 3) this.Check();
    }

    Check() {
        for (let i = 0; i < 3; i++) {
            if (this.ingredArr[i] != this.requestArr[i]) return this._Fail();
        }
        this._Win();
    }

    _Win() {
        GDDSCBASMR_AudioManager.Instance._PlaySound(24);
        this.isOrder = false;
        this.tf[0].active = true;
        this.guest.getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.guestSfs.find((value, index, obj) => { if (value.name == this.guestName + "_happy") return value; });
        this.GuestNum++;
        if (this.GuestNum == 8) this._Finish();
        this._GuestLeave();
        this.scheduleOnce(() => {
            let t1 = tween(this.milkTea).to(0.5, { position: v3(0, 500) });
            let t2 = tween(this.milkTea).to(0.25, { scale: v3(1.3, 0.7, 1) }).to(0.25, { scale: Vec3.ONE });
            tween(this.milkTea).parallel(t1, t2).start();
            tween(this.milkTea.getComponent(UIOpacity)).to(0.5, { opacity: 0 }).start();
        }, 0.5);
    }

    _Fail() {
        GDDSCBASMR_AudioManager.Instance._PlaySound(25);
        this.isOrder = false;
        this.tf[1].active = true;
        this.guest.getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.guestSfs.find((value, index, obj) => { if (value.name == this.guestName + "_sad") return value; });
        this._GuestLeave();
    }

    _Finish() {
        this.finishPanel.active = true;
        let ani = this.finishPanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Reverse;
        ani.play();
    }

    VideoCoin() {
        GDDSCBASMR_AudioManager.Instance._PlaySound(1);
        // let ani = this.finishPanel.getComponent(Animation);
        let coinSpawn = this.coinNode[0];
        Banner.Instance.ShowVideoAd(() => {
            GDDSCBASMR_AudioManager.Instance._PlayMusic();
            GDDSCBASMR_DataManager.coinSpawn = coinSpawn.getWorldPosition();
            let coin = GDDSCBASMR_DataManager.Instance.getNumberData("Coin");
            coin += 1600;
            GDDSCBASMR_DataManager.Instance.setNumberData("Coin", coin);
            // ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
            // ani.play();
            this.node.active = false;
        });
    }

    EndCoin() {
        GDDSCBASMR_AudioManager.Instance._PlaySound(1);
        GDDSCBASMR_AudioManager.Instance._PlayMusic();
        GDDSCBASMR_DataManager.coinSpawn = this.coinNode[1].getWorldPosition();
        let coin = GDDSCBASMR_DataManager.Instance.getNumberData("Coin");
        coin += 800;
        GDDSCBASMR_DataManager.Instance.setNumberData("Coin", coin);
        // let ani = this.finishPanel.getComponent(Animation);
        // ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        // ani.play();
        this.node.active = false;
    }

    ClosePanel(): void {
        this.closePanel.active = true;
        let ani = this.closePanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Reverse;
        ani.play();
    }

    Close() {
        GDDSCBASMR_AudioManager.Instance._PlayMusic();
        this.closePanel.active = false;
        this.node.active = false;
        GDDSCBASMR_MainPanel.Instance._OpenMain();
    }

    CloseClosePanel() {
        let ani = this.closePanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }

}