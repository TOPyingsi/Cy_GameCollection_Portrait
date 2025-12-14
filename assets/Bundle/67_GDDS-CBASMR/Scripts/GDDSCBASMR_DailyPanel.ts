import { _decorator, Animation, AnimationClip, Button, Component, Label, Node, Prefab, Sprite, tween, v3 } from 'cc';
import { GDDSCBASMR_UIBase } from './GDDSCBASMR_UIBase';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_DailyPanel')
export class GDDSCBASMR_DailyPanel extends GDDSCBASMR_UIBase {

    @property(Button)
    dailyButton: Button;

    @property(Node)
    dir: Node;

    @property(Node)
    stamp: Node;

    @property([Node])
    items: Node[] = [];

    protected onEnable(): void {
        super.onEnable();
        this._CheckDaily();
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    _CheckDaily() {
        let daily = GDDSCBASMR_DataManager.Instance.getNumberData("Daily");
        let day = daily % 7;
        let lastDaily = GDDSCBASMR_DataManager.Instance.getArrayData("LastDaily");
        let date = new Date;
        let isDaily = false;
        let isSet = false;
        if (lastDaily.length > 0 && lastDaily[0] == date.getFullYear() && lastDaily[1] == date.getMonth() && lastDaily[2] == date.getDate()) isDaily = true;
        this.dailyButton.interactable = !isDaily;
        this.dailyButton.getComponent(Sprite).grayscale = isDaily;
        this.dailyButton.getComponent(Animation).enabled = !isDaily;
        this.dir.active = !isDaily;
        isSet = isDaily;
        for (let i = 0; i < this.items.length; i++) {
            const element = this.items[i];
            if (i < 6 && day > i || day == 0 && isDaily) {
                element.children[0].active = false;
                element.children[1].active = true;
            }
            else {
                element.children[0].active = true;
                element.children[1].active = false;
                if (!isSet) {
                    isSet = true;
                    this.dir.setWorldPosition(element.getWorldPosition());
                }
            }
        }
    }

    DailyButton() {
        let lastDaily = GDDSCBASMR_DataManager.Instance.getArrayData("LastDaily");
        let date = new Date;
        if (lastDaily[0] == date.getFullYear() && lastDaily[1] == date.getMonth() && lastDaily[2] == date.getDate()) return;
        lastDaily[0] = date.getFullYear();
        lastDaily[1] = date.getMonth();
        lastDaily[2] = date.getDate();
        GDDSCBASMR_DataManager.Instance.setArrayData("LastDaily", lastDaily);
        let daily = GDDSCBASMR_DataManager.Instance.getNumberData("Daily");
        daily++;
        GDDSCBASMR_DataManager.Instance.setNumberData("Daily", daily);
        let day = daily % 7;
        let target = this.items[day == 0 ? 6 : day - 1];
        this.dailyButton.interactable = false;
        this.dailyButton.getComponent(Sprite).grayscale = true;
        this.dailyButton.getComponent(Animation).enabled = false;
        this.dir.active = false;
        this.scheduleOnce(() => {
            GDDSCBASMR_DataManager.coinSpawn = target.children[0].getWorldPosition();
            let coin = GDDSCBASMR_DataManager.Instance.getNumberData("Coin");
            coin += parseInt(target.children[0].children[0].getComponent(Label).string);
            GDDSCBASMR_DataManager.Instance.setNumberData("Coin", coin);
        }, 1);
        tween(this.stamp)
            .to(0.5, { worldPosition: target.children[0].getWorldPosition() }, { easing: EasingType.quadOut })
            .delay(0.5)
            .call(() => {
                target.children[0].active = false;
                target.children[1].active = true;
            })
            .to(0.5, { position: v3(1000, 2000) }, { easing: EasingType.quadIn })
            .start();
    }

    ClosePanel(): void {
        let ani = this.node.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }
}