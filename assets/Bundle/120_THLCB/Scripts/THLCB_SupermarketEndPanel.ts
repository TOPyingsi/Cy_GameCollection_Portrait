import { _decorator, Animation, Component, Event, Label, Node, randomRangeInt, sp, Sprite, tween, v3, Vec3 } from 'cc';
import { THLCB_UIBase } from './THLCB_UIBase';
import Banner from 'db://assets/Scripts/Banner';
import { THLCB_DataManager } from './THLCB_DataManager';
import { eventCenter } from './THLCB_EventCenter';
import { THLCB_SupermarketLivePanel } from './THLCB_SupermarketLivePanel';
import { THLCB_SupermarketPanel } from './THLCB_SupermarketPanel';
import { THLCB_MainPanel } from './THLCB_MainPanel';
import { THLCB_AudioManager } from './THLCB_AudioManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('THLCB_SupermarketEndPanel')
export class THLCB_SupermarketEndPanel extends THLCB_UIBase {

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
        eventCenter.on("THLCB_Bonus", this._BonusCheck, this);
    }

    protected _InitData(): void {
        let data = THLCB_DataManager.Instance.getNumberData("Skin");
        this.player.setSkin(`pifu${data}`);
        this._InitItems();
        this._BonusCheck(2);
        this.bonus.play();
        let fanLevelNums = THLCB_DataManager.fanLevelNums;
        let fanLevel = THLCB_DataManager.Instance.getNumberData("FanLevel");
        let fanLimit = fanLevelNums[fanLevel + 1];
        let fansNum = randomRangeInt(fanLimit / 100 * 5, fanLimit / 100 * 15);
        this.newFansLabel.string = "+" + fansNum;
        let fans = THLCB_DataManager.Instance.getNumberData("Fans");
        fans += fansNum;
        THLCB_DataManager.Instance.setNumberData("Fans", fans);
        let exp = THLCB_DataManager.Instance.getNumberData("Exp");
        exp += 50;
        THLCB_DataManager.Instance.setNumberData("Exp", exp);
        ProjectEventManager.emit(ProjectEvent.游戏结束, "果冻大师：吃播ASMR");
    }

    _InitItems() {
        for (let i = 0; i < this.items.children.length; i++) {
            const element = this.items.children[i].children[0];
            if (i < THLCB_SupermarketPanel.Instance.pickItems.length) {
                element.active = true;
                element.getComponent(Sprite).spriteFrame = THLCB_SupermarketPanel.Instance.itemSfs[THLCB_SupermarketPanel.Instance.pickItems[i][0]];
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
        THLCB_AudioManager.Instance._PlaySound(1);
        let target: Node = event.target;
        let x = this;
        Banner.Instance.ShowVideoAd(() => {
            THLCB_DataManager.coinSpawn = target.getWorldPosition();
            let coin = THLCB_DataManager.Instance.getNumberData("Coin");
            coin += 200 * x.mul;
            THLCB_DataManager.Instance.setNumberData("Coin", coin);
            x.node.active = false;
            x.bonus.stop();
            THLCB_MainPanel.Instance._UpdateFans();
            THLCB_AudioManager.Instance._PlayMusic();
        })
    }

    Reward(event: Event) {
        THLCB_AudioManager.Instance._PlaySound(1);
        let target: Node = event.target;
        THLCB_DataManager.coinSpawn = target.getWorldPosition();
        let coin = THLCB_DataManager.Instance.getNumberData("Coin");
        coin += 200;
        THLCB_DataManager.Instance.setNumberData("Coin", coin);
        this.node.active = false;
        THLCB_MainPanel.Instance._UpdateFans();
        THLCB_AudioManager.Instance._PlayMusic();
    }

}