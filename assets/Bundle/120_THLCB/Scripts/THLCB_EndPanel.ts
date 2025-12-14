import { _decorator, Animation, Event, Label, Node, randomRangeInt, sp, Sprite, tween, v3, Vec3 } from 'cc';
import { THLCB_UIBase } from './THLCB_UIBase';
import Banner from 'db://assets/Scripts/Banner';
import { THLCB_DataManager } from './THLCB_DataManager';
import { eventCenter } from './THLCB_EventCenter';
import { THLCB_MainPanel } from './THLCB_MainPanel';
import { THLCB_AudioManager } from './THLCB_AudioManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('THLCB_EndPanel')
export class THLCB_EndPanel extends THLCB_UIBase {

    @property(Animation)
    bonus: Animation;

    @property(sp.Skeleton)
    player: sp.Skeleton;

    @property(Label)
    bonusLabel: Label;

    @property(Label)
    heartLabel: Label;

    @property(Label)
    comLabel: Label;

    @property(Sprite)
    bg: Sprite;

    @property(Sprite)
    table: Sprite;

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
        let exp = THLCB_DataManager.Instance.getNumberData("Exp");
        exp += 100;
        THLCB_DataManager.Instance.setNumberData("Exp", exp);
        this.heartLabel.string = `${randomRangeInt(1000, 9999) / 100}万`;
        this.comLabel.string = `${randomRangeInt(1000, 9999) / 100}万`;
        ProjectEventManager.emit(ProjectEvent.游戏结束, "果冻大师：吃播ASMR");
    }

    _InitItems() {
        for (let i = 0; i < this.items.children.length; i++) {
            const element = this.items.children[i].children[0];
            for (let j = 0; j < element.children.length; j++) {
                const element2 = element.children[j].getComponent(Sprite);
                element2.spriteFrame = THLCB_DataManager.thl2Sfs.find((value, index, obj) => { if (value.name == (THLCB_DataManager.curThl[j] + 1).toString()) return value; });
            }
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
            THLCB_MainPanel.Instance._OpenMain();
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
        THLCB_MainPanel.Instance._OpenMain();
        THLCB_AudioManager.Instance._PlayMusic();
    }

}