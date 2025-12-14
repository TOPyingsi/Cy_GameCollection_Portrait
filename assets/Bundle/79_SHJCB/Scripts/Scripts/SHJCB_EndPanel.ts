import { _decorator, Animation, Event, Label, Node, randomRangeInt, sp, Sprite, tween, v3, Vec3 } from 'cc';
import { SHJCB_UIBase } from './SHJCB_UIBase';
import Banner from 'db://assets/Scripts/Banner';
import { SHJCB_DataManager } from './SHJCB_DataManager';
import { eventCenter } from './SHJCB_EventCenter';
import { SHJCB_MainPanel } from './SHJCB_MainPanel';
import { SHJCB_AudioManager } from './SHJCB_AudioManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_EndPanel')
export class SHJCB_EndPanel extends SHJCB_UIBase {

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
        eventCenter.on("SHJCB_Bonus", this._BonusCheck, this);
    }

    protected _InitData(): void {
        let data = SHJCB_DataManager.Instance.getNumberData("Skin");
        this.player.setSkin(`pifu${data}`);
        this._InitItems();
        this._BonusCheck(2);
        this.bonus.play();
        let exp = SHJCB_DataManager.Instance.getNumberData("Exp");
        exp += 100;
        SHJCB_DataManager.Instance.setNumberData("Exp", exp);
        this.heartLabel.string = `${randomRangeInt(1000, 9999) / 100}万`;
        this.comLabel.string = `${randomRangeInt(1000, 9999) / 100}万`;
        ProjectEventManager.emit(ProjectEvent.游戏结束, "果冻大师：吃播ASMR");
    }

    _InitItems() {
        for (let i = 0; i < this.items.children.length; i++) {
            const element = this.items.children[i].children[0].children[1];
            element.getComponent(Sprite).spriteFrame = SHJCB_DataManager.mukbangSfs.find((value, index, obj) => { if (value.name == `mold${SHJCB_DataManager.curMubkang[0] + 1}-${SHJCB_DataManager.jellyName[SHJCB_DataManager.curMubkang[1]]}_1`) return value; });
            element.children[0].getComponent(Sprite).spriteFrame = SHJCB_DataManager.curMubkang[3] == 0 ? null : SHJCB_DataManager.gameTop2.find((value, index, obj) => { if (value.name == `blink${SHJCB_DataManager.curMubkang[3]}`) return value; });
            element.children[1].getComponent(Sprite).spriteFrame = SHJCB_DataManager.top1.find((value, index, obj) => { if (value.name == SHJCB_DataManager.top1Name[SHJCB_DataManager.curMubkang[2]]) return value; });;
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
            SHJCB_MainPanel.Instance._OpenMain();
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
        SHJCB_MainPanel.Instance._OpenMain();
        SHJCB_AudioManager.Instance._PlayMusic();
    }

}