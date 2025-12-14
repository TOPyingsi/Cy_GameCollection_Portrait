import { _decorator, Animation, Component, Event, Label, Node, randomRangeInt, sp, Sprite, tween, v3, Vec3 } from 'cc';
import { SHJCB_UIBase } from './SHJCB_UIBase';
import Banner from 'db://assets/Scripts/Banner';
import { SHJCB_DataManager } from './SHJCB_DataManager';
import { eventCenter } from './SHJCB_EventCenter';
import { SHJCB_SupermarketLivePanel } from './SHJCB_SupermarketLivePanel';
import { SHJCB_SupermarketPanel } from './SHJCB_SupermarketPanel';
import { SHJCB_MainPanel } from './SHJCB_MainPanel';
import { SHJCB_AudioManager } from './SHJCB_AudioManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_SupermarketEndPanel')
export class SHJCB_SupermarketEndPanel extends SHJCB_UIBase {

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
        eventCenter.on("SHJCB_Bonus", this._BonusCheck, this);
    }

    protected _InitData(): void {
        let data = SHJCB_DataManager.Instance.getNumberData("Skin");
        this.player.setSkin(`pifu${data}`);
        this._InitItems();
        this._BonusCheck(2);
        this.bonus.play();
        let fanLevelNums = SHJCB_DataManager.fanLevelNums;
        let fanLevel = SHJCB_DataManager.Instance.getNumberData("FanLevel");
        let fanLimit = fanLevelNums[fanLevel + 1];
        let fansNum = randomRangeInt(fanLimit / 100 * 5, fanLimit / 100 * 15);
        this.newFansLabel.string = "+" + fansNum;
        let fans = SHJCB_DataManager.Instance.getNumberData("Fans");
        fans += fansNum;
        SHJCB_DataManager.Instance.setNumberData("Fans", fans);
        let exp = SHJCB_DataManager.Instance.getNumberData("Exp");
        exp += 50;
        SHJCB_DataManager.Instance.setNumberData("Exp", exp);
        ProjectEventManager.emit(ProjectEvent.游戏结束, "果冻大师：吃播ASMR");
    }

    _InitItems() {
        for (let i = 0; i < this.items.children.length; i++) {
            const element = this.items.children[i].children[0];
            if (i < SHJCB_SupermarketPanel.Instance.pickItems.length) {
                element.active = true;
                element.getComponent(Sprite).spriteFrame = SHJCB_SupermarketPanel.Instance.itemSfs[SHJCB_SupermarketPanel.Instance.pickItems[i][0]];
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
        SHJCB_AudioManager.Instance._PlaySound(1);
        let target: Node = event.target;
        let x = this;
        Banner.Instance.ShowVideoAd(() => {
            SHJCB_DataManager.coinSpawn = target.getWorldPosition();
            let coin = SHJCB_DataManager.Instance.getNumberData("Coin");
            coin += 200 * x.mul;
            SHJCB_DataManager.Instance.setNumberData("Coin", coin);
            x.node.active = false;
            x.bonus.stop();
            SHJCB_MainPanel.Instance._UpdateFans();
            SHJCB_AudioManager.Instance._PlayMusic();
        })
    }

    Reward(event: Event) {
        SHJCB_AudioManager.Instance._PlaySound(1);
        let target: Node = event.target;
        SHJCB_DataManager.coinSpawn = target.getWorldPosition();
        let coin = SHJCB_DataManager.Instance.getNumberData("Coin");
        coin += 200;
        SHJCB_DataManager.Instance.setNumberData("Coin", coin);
        this.node.active = false;
        SHJCB_MainPanel.Instance._UpdateFans();
        SHJCB_AudioManager.Instance._PlayMusic();
    }

}