import { _decorator, Animation, Event, Label, Node, randomRangeInt, sp, Sprite, tween, v3, Vec3 } from 'cc';
import { GDDSCBASMR_UIBase } from './GDDSCBASMR_UIBase';
import Banner from 'db://assets/Scripts/Banner';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import { eventCenter } from './GDDSCBASMR_EventCenter';
import { GDDSCBASMR_MainPanel } from './GDDSCBASMR_MainPanel';
import { GDDSCBASMR_AudioManager } from './GDDSCBASMR_AudioManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_EndPanel')
export class GDDSCBASMR_EndPanel extends GDDSCBASMR_UIBase {

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
        eventCenter.on("GDDSCBASMR_Bonus", this._BonusCheck, this);
    }

    protected _InitData(): void {
        let data = GDDSCBASMR_DataManager.Instance.getNumberData("Skin");
        this.player.setSkin(`pifu${data}`);
        this._InitItems();
        this._BonusCheck(2);
        this.bonus.play();
        let exp = GDDSCBASMR_DataManager.Instance.getNumberData("Exp");
        exp += 100;
        GDDSCBASMR_DataManager.Instance.setNumberData("Exp", exp);
        this.heartLabel.string = `${randomRangeInt(1000, 9999) / 100}万`;
        this.comLabel.string = `${randomRangeInt(1000, 9999) / 100}万`;
        ProjectEventManager.emit(ProjectEvent.游戏结束, "果冻大师：吃播ASMR");
    }

    _InitItems() {
        for (let i = 0; i < this.items.children.length; i++) {
            const element = this.items.children[i].children[0].children[1];
            element.getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.mukbangSfs.find((value, index, obj) => { if (value.name == `mold${GDDSCBASMR_DataManager.curMubkang[0] + 1}-${GDDSCBASMR_DataManager.jellyName[GDDSCBASMR_DataManager.curMubkang[1]]}_1`) return value; });
            element.children[0].getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.curMubkang[3] == 0 ? null : GDDSCBASMR_DataManager.gameTop2.find((value, index, obj) => { if (value.name == `blink${GDDSCBASMR_DataManager.curMubkang[3]}`) return value; });
            element.children[1].getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.top1.find((value, index, obj) => { if (value.name == GDDSCBASMR_DataManager.top1Name[GDDSCBASMR_DataManager.curMubkang[2]]) return value; });
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
            GDDSCBASMR_MainPanel.Instance._OpenMain();
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
        GDDSCBASMR_MainPanel.Instance._OpenMain();
        GDDSCBASMR_AudioManager.Instance._PlayMusic();
    }

}