import { _decorator, Animation, AnimationClip, Button, Component, Event, EventTouch, Label, Node, randomRangeInt, sp, Sprite, SpriteFrame, Tween, tween, UIOpacity, UITransform, v3, Vec3 } from 'cc';
import { GDDSCBASMR_UIBase } from './GDDSCBASMR_UIBase';
import Banner from 'db://assets/Scripts/Banner';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import { GDDSCBASMR_MainPanel } from './GDDSCBASMR_MainPanel';
import { GDDSCBASMR_AniEvent } from './GDDSCBASMR_AniEvent';
import { UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import { eventCenter } from './GDDSCBASMR_EventCenter';
import { GDDSCBASMR_AudioManager } from './GDDSCBASMR_AudioManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_SupermarketPanel')
export class GDDSCBASMR_SupermarketPanel extends GDDSCBASMR_UIBase {

    private static instance: GDDSCBASMR_SupermarketPanel;
    public static get Instance(): GDDSCBASMR_SupermarketPanel {
        return this.instance;
    }

    @property(Button)
    finishButton: Button;

    @property(Sprite)
    bunny: Sprite;

    @property(Sprite)
    catchItem: Sprite;

    @property(sp.Skeleton)
    player: sp.Skeleton;

    @property({ type: Animation, group: "Ani" })
    doors: Animation;

    @property({ type: Animation, group: "Ani" })
    fridgeDoors: Animation;

    @property({ type: Animation, group: "Ani" })
    catcher: Animation;

    @property({ type: Animation, group: "Ani" })
    scan: Animation;

    @property({ type: Label, group: "Label" })
    costLabel: Label;

    @property({ type: Label, group: "Label" })
    numLabel: Label;

    @property({ type: Label, group: "Label" })
    bunnyLabel: Label;

    @property({ type: Label, group: "Label" })
    totalLabel: Label;

    @property({ type: Node, group: "Node" })
    buyItem: Node;

    @property({ type: Node, group: "Node" })
    basket: Node;

    @property({ type: Node, group: "Node" })
    scanScreen: Node;

    @property({ type: Node, group: "Node" })
    scanLabels: Node;

    @property({ type: Node, group: "Node" })
    scanItems: Node;

    @property({ type: Node, group: "Node" })
    hand: Node;

    @property({ type: Node, group: "Node" })
    finishDone: Node;

    @property({ type: Node, group: "Node" })
    closePanel: Node;

    @property({ type: Node, group: "Node" })
    finishPanel: Node;

    @property({ type: [SpriteFrame], group: "SpriteFrames" })
    itemSfs: SpriteFrame[] = [];

    @property({ type: [SpriteFrame], group: "SpriteFrames" })
    catchSfs: SpriteFrame[] = [];

    @property({ type: [SpriteFrame], group: "SpriteFrames" })
    bunnySfs: SpriteFrame[] = [];

    doorOpen = false;
    fridgeOpen = false;
    isBuying = false;
    cost = 0;
    scans = 0;
    pickItems: number[][] = [];
    finishItems = [0, 0, 0, 0, 0];

    protected onLoad(): void {
        super.onLoad();
        GDDSCBASMR_SupermarketPanel.instance = this;
        for (let i = 0; i < this.scanItems.children.length; i++) {
            const element = this.scanItems.children[i].children[0];
            element.on(Node.EventType.TOUCH_START, this._ScanTouchStart, this);
            element.on(Node.EventType.TOUCH_MOVE, this._ScanTouchMove, this);
            element.on(Node.EventType.TOUCH_END, this._ScanTouchEnd, this);
            element.on(Node.EventType.TOUCH_CANCEL, this._ScanTouchEnd, this);
        }
    }

    protected update(dt: number): void {
        let num = parseInt(this.costLabel.string);
        if (this.cost != num) {
            if (this.cost > num) {
                if (this.cost - num >= 17) num += 17;
                else num += this.cost - num;
            }
            else if (this.cost < num) {
                if (num - this.cost >= 17) num -= 17;
                else num -= num - this.cost;
            }
            this.costLabel.string = num.toString();
        }
    }

    protected _InitData(): void {
        GDDSCBASMR_AudioManager.Instance._PlaySPMKMusic();
        this.doorOpen = false;
        this.doors.node.active = true;
        this.doors.play("doorsIdle");
        this.fridgeOpen = false;
        this.fridgeDoors.node.active = true;
        this.fridgeDoors.play("fridgeDoorsIdle");
        this._UpdateSkin();
        this.pickItems = [];
        this.CheckFinish();
        this.cost = 0;
        this.finishPanel.active = false;
        for (let i = 0; i < this.basket.children.length; i++) {
            const element = this.basket.children[i].children[0];
            element.getComponent(Sprite).spriteFrame = null;
            element.getComponent(UIOpacity).opacity = 255;
            element.setPosition(Vec3.ZERO);
        }
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    _UpdateSkin() {
        let num = GDDSCBASMR_DataManager.Instance.getNumberData("Skin");
        this.player.setSkin("pifu" + num);
    }

    CheckFinish() {
        this.numLabel.string = this.pickItems.length + " / 5";
        if (this.pickItems.length == 0) {
            this.finishButton.interactable = false;
            this.finishButton.getComponent(Sprite).grayscale = true;
        }
        else {
            this.finishButton.interactable = true;
            this.finishButton.getComponent(Sprite).grayscale = false;
        }
    }

    OpenDoors() {
        if (this.doorOpen) return;
        this.doorOpen = true;
        this.doors.play();
        GDDSCBASMR_AudioManager.Instance._PlaySound(3);
    }

    OpenFridge() {
        if (this.fridgeOpen) return;
        this.fridgeOpen = true;
        this.fridgeDoors.play("fridgeDoorsOpen");
        GDDSCBASMR_AudioManager.Instance._PlaySound(1);
    }

    ClickPhone() {
        let num = randomRangeInt(1, 4);
        this.player.animation = "bq" + num;
        let time = this.player.findAnimation("bq" + num).duration;
        this.unschedule(this.PlayerIdle);
        this.scheduleOnce(this.PlayerIdle, time);
        GDDSCBASMR_AudioManager.Instance._PlaySound(1);
    }

    PlayerIdle() {
        this.player.animation = "daiji";
    }

    ChooseItem(event: Event, num: number) {
        if (this.isBuying) return;
        GDDSCBASMR_AudioManager.Instance._PlaySound(1);
        let item: Node = event.target;
        let coin = GDDSCBASMR_DataManager.Instance.getNumberData("Coin");
        let price = parseInt(item.getComponentInChildren(Label).string);
        if (this.cost + price > coin) GDDSCBASMR_MainPanel.Instance._OpenNeed();
        else if (this.pickItems.length >= 5) UIManager.ShowTip("购物篮已满");
        else {
            this.isBuying = true;
            let node = item.children[0].children[item.children[0].children.length - 1];
            let basketItem = this.basket.children[this.pickItems.length].children[0];
            basketItem.setScale(item.children[0].getScale());
            Tween.stopAllByTarget(basketItem);
            Tween.stopAllByTarget(basketItem.getComponent(UIOpacity));
            basketItem.getComponent(Sprite).spriteFrame = null;
            basketItem.getComponent(UIOpacity).opacity = 255;
            basketItem.setPosition(Vec3.ZERO);
            this.buyItem.setParent(basketItem);
            this.buyItem.setWorldPosition(node.getWorldPosition());
            this.buyItem.getComponent(Sprite).spriteFrame = this.itemSfs[num];
            this.buyItem.active = true;
            tween(this.buyItem)
                .to(1, { worldPosition: basketItem.getWorldPosition() }, { easing: EasingType.backIn })
                .call(() => {
                    this.isBuying = false;
                    basketItem.getComponent(Sprite).spriteFrame = this.itemSfs[num];
                    this.pickItems.push([num, price]);
                    this.cost += price;
                    this.buyItem.active = false;
                    this.CheckFinish();
                })
                .start();
        }
    }

    CancelChoose() {
        if (this.isBuying || this.pickItems.length == 0) return;
        GDDSCBASMR_AudioManager.Instance._PlaySound(1);
        let length = this.pickItems.length;
        let basketItem = this.basket.children[length - 1].children[0];
        let price = this.pickItems[length - 1][1];
        this.cost -= price;
        tween(basketItem)
            .by(1, { position: v3(0, 500) })
            .start();
        tween(basketItem.getComponent(UIOpacity))
            .to(1, { opacity: 0 })
            .call(() => {
                basketItem.getComponent(Sprite).spriteFrame = null;
                basketItem.getComponent(UIOpacity).opacity = 255;
                basketItem.setPosition(Vec3.ZERO);
            })
            .start();
        this.pickItems.pop();
        this.CheckFinish();
    }

    FinishPick() {
        if (this.isBuying || this.pickItems.length == 0) return;
        GDDSCBASMR_AudioManager.Instance._PlaySound(1);
        this.finishPanel.active = true;
        this._FinishInit();
    }

    _FinishInit() {
        this.scanScreen.active = false;
        this.bunny.spriteFrame = this.bunnySfs[0];
        this.bunnyLabel.string = "在这里扫描！";
        this.scans = 0;
        for (let i = 0; i < this.scanLabels.children.length; i++) {
            const element = this.scanLabels.children[i];
            element.active = false;
        }
        this.totalLabel.string = "0";
        this.scan.play("scanOff");
        for (let i = 0; i < this.scanItems.children.length; i++) {
            const element = this.scanItems.children[i].children[0];
            if (i < this.pickItems.length) {
                element.getComponent(Sprite).spriteFrame = this.itemSfs[this.pickItems[i][0]];
                element.active = true;
            }
            else element.active = false;
        }
        this.hand.active = true;
        this.finishItems = [0, 0, 0, 0, 0];
    }

    _ScanTouchStart(event: EventTouch) {
        let target: Node = event.target;
        if (this.finishItems[parseInt(target.name)] == 1) return;
        GDDSCBASMR_AudioManager.Instance._PlaySound(1);
        let pos = event.getUILocation();
        target.setParent(this.scanItems, true);
        target.setWorldPosition(v3(pos.x, pos.y));
        this.scan.play("scanOn");
        this.hand.active = false;
    }

    _ScanTouchMove(event: EventTouch) {
        let target: Node = event.target;
        if (this.finishItems[parseInt(target.name)] == 1) return;
        let pos = event.getUILocation();
        target.setWorldPosition(v3(pos.x, pos.y));
        if (this.scan.node.children[2].getComponent(UITransform).getBoundingBoxToWorld().contains(pos)) {
            GDDSCBASMR_AudioManager.Instance._PlaySound(4);
            this.finishItems[parseInt(target.name)] = 1;
            tween(target)
                .to(0.25, { scale: v3(1.3, 1.3, 1) })
                .to(0.25, { scale: Vec3.ONE })
                .to(1, { worldPosition: v3(2000, 2000) }, { easing: EasingType.quadIn })
                .call(() => {
                    target.active = false;
                    target.setParent(this.scanItems.children[parseInt(target.name)], true);
                    target.setPosition(Vec3.ZERO);
                })
                .start();
            if (!this.scanScreen.active) this.scanScreen.active = true;
            this._SetScan(parseInt(target.name));
        }
    }

    _ScanTouchEnd(event: EventTouch) {
        let target: Node = event.target;
        if (this.finishItems[parseInt(target.name)] == 1) return;
        target.setParent(this.scanItems.children[parseInt(target.name)], true);
        target.setPosition(Vec3.ZERO);
        this.scan.play("scanOff");
    }

    _SetScan(num: number) {
        let labels = this.scanLabels.children[this.scans];
        labels.active = true;
        labels.getComponent(Label).string = this.itemSfs[this.pickItems[num][0]].name;
        labels.children[1].getComponent(Label).string = this.pickItems[num][1].toString();
        this.totalLabel.string = (parseInt(this.totalLabel.string) + this.pickItems[num][1]).toString();
        this.scans++;
        if (this.scans >= this.pickItems.length) this.finishDone.active = true;
        this.scan.play("scanOff");
    }

    FinishDone() {
        GDDSCBASMR_AudioManager.Instance._PlaySound(5);
        let coins = GDDSCBASMR_DataManager.Instance.getNumberData("Coin");
        coins -= this.cost;
        GDDSCBASMR_DataManager.Instance.setNumberData("Coin", coins);
        this.finishDone.active = false;
        this.scanScreen.active = false;
        this.bunny.spriteFrame = this.bunnySfs[1];
        this.bunnyLabel.string = "谢谢！";
        this.scheduleOnce(() => {
            this.node.active = false;
            GDDSCBASMR_MainPanel.Instance.supermarketLivePanel.active = true;
        }, 2);
    }

    VideoCatch() {
        if (this.isBuying) return;
        GDDSCBASMR_AudioManager.Instance._PlaySound(1);
        if (this.pickItems.length >= 5) return UIManager.ShowTip("购物篮已满");
        let x = this;
        Banner.Instance.ShowVideoAd(() => {
            x.catcher.play("catcherCatch");
            x.isBuying = true;
        });
    }

    CatchUp() {
        this.catchItem.spriteFrame = this.catchSfs[randomRangeInt(0, this.catchSfs.length)];
    }

    CatchEnd() {
        this.catcher.play();
        let index = this.itemSfs.indexOf(this.catchItem.spriteFrame);
        this.catchItem.spriteFrame = null;
        let basketItem = this.basket.children[this.pickItems.length].children[0];
        basketItem.setScale(v3(0.6, 0.6, 1));
        this.buyItem.setParent(basketItem);
        this.buyItem.setWorldPosition(this.catchItem.node.getWorldPosition());
        this.buyItem.getComponent(Sprite).spriteFrame = this.itemSfs[index];
        this.buyItem.active = true;
        tween(this.buyItem)
            .to(1, { worldPosition: basketItem.getWorldPosition() }, { easing: EasingType.backIn })
            .call(() => {
                this.isBuying = false;
                basketItem.getComponent(Sprite).spriteFrame = this.itemSfs[index];
                this.pickItems.push([index, 0]);
                this.cost += 0;
                this.buyItem.active = false;
                this.CheckFinish();
            })
            .start();
    }

    ClosePanel(): void {
        this.closePanel.active = true;
        let ani = this.closePanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Reverse;
        ani.play();
    }

    Close() {
        this.closePanel.active = false;
        this.node.active = false;
        GDDSCBASMR_MainPanel.Instance._OpenMain();
        GDDSCBASMR_AudioManager.Instance._PlayMusic();
    }

    CloseClosePanel() {
        let ani = this.closePanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }
}