import { _decorator, Animation, Component, Event, Label, Node, randomRangeInt, sp, Sprite, tween, v3, Vec3 } from 'cc';
import { GDDSCBASMR_UIBase } from './GDDSCBASMR_UIBase';
import Banner from 'db://assets/Scripts/Banner';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import { eventCenter } from './GDDSCBASMR_EventCenter';
import { GDDSCBASMR_SupermarketLivePanel } from './GDDSCBASMR_SupermarketLivePanel';
import { GDDSCBASMR_SupermarketPanel } from './GDDSCBASMR_SupermarketPanel';
import { GDDSCBASMR_MainPanel } from './GDDSCBASMR_MainPanel';
import { GDDSCBASMR_AudioManager } from './GDDSCBASMR_AudioManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_SupermarketEndPanel')
export class GDDSCBASMR_SupermarketEndPanel extends GDDSCBASMR_UIBase {

    @property(Animation)
    bonus: Animation;

    @property(sp.Skeleton)
    player: sp.Skeleton;

    @property(Label)
    bonusLabel: Label;

    @property(Label)
    newFansLabel: Label;

    @property(Node)
    point: Node;

    @property(Node)
    items: Node;

    mul = 2;

    protected onLoad(): void {
        eventCenter.on("GDDSCBASMR_Bonus", this._BonusCheck, this);
    }

    protected _InitData(): void {
        let data = GDDSCBASMR_DataManager.Instance.getNumberData("Skin");
        this.player.setSkin(`pifu${data}`);
        this._InitItems();
        this._BonusCheck(2);
        this.bonus.play();
        let fanLevelNums = GDDSCBASMR_DataManager.fanLevelNums;
        let fanLevel = GDDSCBASMR_DataManager.Instance.getNumberData("FanLevel");
        let fanLimit = fanLevelNums[fanLevel + 1];
        let fansNum = randomRangeInt(fanLimit / 100 * 5, fanLimit / 100 * 15);
        this.newFansLabel.string = "+" + fansNum;
        let fans = GDDSCBASMR_DataManager.Instance.getNumberData("Fans");
        fans += fansNum;
        GDDSCBASMR_DataManager.Instance.setNumberData("Fans", fans);
        let exp = GDDSCBASMR_DataManager.Instance.getNumberData("Exp");
        exp += 50;
        GDDSCBASMR_DataManager.Instance.setNumberData("Exp", exp);
        ProjectEventManager.emit(ProjectEvent.游戏结束, "果冻大师：吃播ASMR");
    }

    _InitItems() {
        for (let i = 0; i < this.items.children.length; i++) {
            const element = this.items.children[i].children[0];
            if (i < GDDSCBASMR_SupermarketPanel.Instance.pickItems.length) {
                element.active = true;
                element.getComponent(Sprite).spriteFrame = GDDSCBASMR_SupermarketPanel.Instance.itemSfs[GDDSCBASMR_SupermarketPanel.Instance.pickItems[i][0]];
            }
            else element.active = false;
        }
    }

    _BonusCheck(num: number) {
        this.mul = num;
        let node: Node;
        switch (num) {
            case 2:
                node = this.bonus.node.children[0].children[this.point.getPosition().x < 0 ? 0 : 6];
                break;
            case 3:
                node = this.bonus.node.children[0].children[this.point.getPosition().x < 0 ? 1 : 5];
                break;
            case 4:
                node = this.bonus.node.children[0].children[this.point.getPosition().x < 0 ? 2 : 4];
                break;
            case 5:
                node = this.bonus.node.children[0].children[3];
                break;
        }
        tween(node)
            .to(0.25, { scale: v3(1.1, 1.1, 1) })
            .to(0.25, { scale: Vec3.ONE })
            .start();
        this.bonusLabel.string = (200 * this.mul).toString();
    }

    VideoReward(event: Event) {
        GDDSCBASMR_AudioManager.Instance._PlaySound(1);
        let target: Node = event.target;
        let x = this;
        Banner.Instance.ShowVideoAd(() => {
            GDDSCBASMR_DataManager.coinSpawn = target.getWorldPosition();
            let coin = GDDSCBASMR_DataManager.Instance.getNumberData("Coin");
            coin += 200 * x.mul;
            GDDSCBASMR_DataManager.Instance.setNumberData("Coin", coin);
            x.node.active = false;
            x.bonus.stop();
            GDDSCBASMR_MainPanel.Instance._UpdateFans();
            GDDSCBASMR_AudioManager.Instance._PlayMusic();
        })
    }

    Reward(event: Event) {
        GDDSCBASMR_AudioManager.Instance._PlaySound(1);
        let target: Node = event.target;
        GDDSCBASMR_DataManager.coinSpawn = target.getWorldPosition();
        let coin = GDDSCBASMR_DataManager.Instance.getNumberData("Coin");
        coin += 200;
        GDDSCBASMR_DataManager.Instance.setNumberData("Coin", coin);
        this.node.active = false;
        GDDSCBASMR_MainPanel.Instance._UpdateFans();
        GDDSCBASMR_AudioManager.Instance._PlayMusic();
    }

}