import { _decorator, Animation, AnimationClip, Button, Camera, Component, Label, math, Node, Prefab, randomRangeInt, RenderTexture, sp, SpriteFrame, Tween, tween, UITransform, v3, Vec3 } from 'cc';
import { GDDSCBASMR_UIBase } from './GDDSCBASMR_UIBase';
import Banner from 'db://assets/Scripts/Banner';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import { GDDSCBASMR_SupermarketItem } from './GDDSCBASMR_SupermarketItem';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { GDDSCBASMR_SupermarketPanel } from './GDDSCBASMR_SupermarketPanel';
import { GDDSCBASMR_MainPanel } from './GDDSCBASMR_MainPanel';
import { eventCenter } from './GDDSCBASMR_EventCenter';
import { GDDSCBASMR_AudioManager } from './GDDSCBASMR_AudioManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_SupermarketLivePanel')
export class GDDSCBASMR_SupermarketLivePanel extends GDDSCBASMR_UIBase {

    private static instance: GDDSCBASMR_SupermarketLivePanel;
    public static get Instance(): GDDSCBASMR_SupermarketLivePanel {
        return this.instance;
    }

    @property(sp.Skeleton)
    player: sp.Skeleton;

    @property(sp.Skeleton)
    head: sp.Skeleton;

    @property(Animation)
    shining: Animation;

    @property(Label)
    watchLabel: Label;

    @property(Node)
    touchNode: Node;

    @property(Node)
    mouthSocket: Node;

    @property(Node)
    headSocket: Node;

    @property(Node)
    items: Node;

    @property([Prefab])
    itemPrefabs: Prefab[] = [];

    playerState = PlayerState.Idle;
    eatNum = 0;
    canEat = false;
    eatTarget: GDDSCBASMR_SupermarketItem;

    protected onLoad(): void {
        super.onLoad();
        GDDSCBASMR_SupermarketLivePanel.instance = this;
    }

    protected _InitData(): void {
        this._UpdateSkin();
        let pickItems = GDDSCBASMR_SupermarketPanel.Instance.pickItems;
        for (let i = 0; i < this.items.children.length; i++) {
            const element = this.items.children[i];
            if (i >= pickItems.length) {
                element.active = false;
                continue;
            }
            element.active = true;
            if (element.children.length > 0) PoolManager.PutNode(element.children[0]);
            let item: Node = PoolManager.GetNodeByPrefab(this.itemPrefabs[pickItems[i][0]], element);
            item.getComponent(GDDSCBASMR_SupermarketItem).id = i;
        }
        this.eatNum = 0;
        this.scheduleOnce(this._Hungry, 5);
        this.unschedule(this._UpdateWatch);
        this.watchLabel.string = "13245";
        this.schedule(this._UpdateWatch, 0.5);
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    _UpdateSkin() {
        let num = GDDSCBASMR_DataManager.Instance.getNumberData("Skin");
        this.player.setSkin("pifu" + num);
        this.head.setSkin("pifu" + num);
    }

    _UpdateWatch() {
        let num = parseInt(this.watchLabel.string);
        num += randomRangeInt(1, 200);
        this.watchLabel.string = num.toString();
    }

    TakePhoto() {
        GDDSCBASMR_AudioManager.Instance._PlaySound(6);
        this.shining.play();
        if (this.playerState == PlayerState.Idle) {
            this.unschedule(this._Hungry);
            this.unschedule(this._Idle);
            this.playerState = PlayerState.Express;
            this.player.loop = false;
            this.player.animation = "bq" + randomRangeInt(1, 4);
            let time = this.player.findAnimation(this.player.animation).duration;
            this.scheduleOnce(this._Idle, time);
        }
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

    _Eat(item: GDDSCBASMR_SupermarketItem) {
        this.unschedule(this._Hungry);
        this.unschedule(this._Idle);
        this.canEat = false;
        this.playerState = PlayerState.Eat;
        this.player.loop = false;
        GDDSCBASMR_AudioManager.Instance._PlaySound(8 + item.sound);
        let str = "";
        switch (item.eatType) {
            case 0:
                str = "chidongxi";
                break;
            case 1:
            case 2:
            case 3:
                str = "chimian" + (item.eatType == 1 ? "" : item.eatType);
                break;
            case 4:
                str = "heyinliao";
                break;
        }
        this.player.animation = str;
        item.step++;
        if (item.eatType != 4) {
            item.sprite.spriteFrame = item.itemSfs[item.step];
            if (item.step == item.itemSfs.length - 1) this.EatEnd(item);
            this.eatTarget = null;
        }
        else {
            item._CancelTouch();
            item.node.setParent(this.mouthSocket);
            let v = item.node.children[0].getPosition();
            item.node.setPosition(v.negative());
        }
        let time = this.player.findAnimation(str).duration;
        this.scheduleOnce(() => {
            if (item.eatType == 4) {
                item.sprite.spriteFrame = item.itemSfs[item.step];
                item.node.setParent(this.items.children[item.id]);
                if (item.step == item.itemSfs.length - 1) this.EatEnd(item);
            }
            if (this.eatTarget || this.headSocket.getComponent(UITransform).getBoundingBoxToWorld().intersects(item.getComponent(UITransform).getBoundingBoxToWorld())) this._Gape();
            else {
                GDDSCBASMR_AudioManager.Instance._PlaySound(16 + item.expressType);
                this.playerState = PlayerState.Express;
                switch (item.expressType) {
                    case 0:
                        this.player.animation = "bq" + randomRangeInt(1, 3);
                        break;
                    case 1:
                    case 2:
                    case 3:
                        this.player.animation = "biaoqing" + (item.expressType + 2);
                        break;
                }
                let duration = this.player.findAnimation(this.player.animation).duration;
                this.scheduleOnce(this._Idle, duration);
            }
        }, time);
        Tween.stopAllByTarget(this.touchNode);
        tween(this.touchNode)
            .to(0.1, { scale: Vec3.ZERO })
            .start();
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

    EatEnd(item: GDDSCBASMR_SupermarketItem) {
        item._CancelTouch();
        GDDSCBASMR_DataManager.coinSpawn = item.node.getWorldPosition();
        let coins = GDDSCBASMR_DataManager.Instance.getNumberData("Coin");
        coins += item.price == 0 ? 200 : item.price;
        GDDSCBASMR_DataManager.Instance.setNumberData("Coin", coins);
        this.eatNum++;
        if (this.eatNum >= GDDSCBASMR_SupermarketPanel.Instance.pickItems.length) this.scheduleOnce(() => {
            GDDSCBASMR_MainPanel.Instance.supermarketEndPanel.active = true;
            this.node.active = false;
        }, 4);
    }

}

export enum PlayerState {
    Idle,
    Gape,
    Eat,
    Express
}