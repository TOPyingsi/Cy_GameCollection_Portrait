import { _decorator, Animation, AnimationClip, Button, Event, Label, Node, randomRange, Sprite, tween } from 'cc';
import { THLCB_UIBase } from './THLCB_UIBase';
import { THLCB_DataManager } from './THLCB_DataManager';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import Banner from 'db://assets/Scripts/Banner';
import { THLCB_AudioManager } from './THLCB_AudioManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('THLCB_GachaPanel')
export class THLCB_GachaPanel extends THLCB_UIBase {

    @property(Label)
    timesLabel: Label;

    @property(Label)
    rewardLabel: Label;

    @property(Node)
    spinner: Node;

    @property(Node)
    fReward: Node;

    @property(Node)
    gachaBtn: Node;

    @property(Node)
    outOfTimes: Node;

    @property(Node)
    rewardPanel: Node;

    @property(Node)
    finalReward: Node;

    @property(Node)
    videoIcon: Node;

    reward = 0;
    isGacha = false;

    protected _InitData(): void {
        this.isGacha = false;
        let data = THLCB_DataManager.Instance.getArrayData<number>("SkinStates");
        this.fReward.children[0].active = data[28] == 1;
        this.fReward.children[1].active = data[28] == 0;
        let lastGacha = THLCB_DataManager.Instance.getArrayData<number>("LastGacha");
        let gacha = THLCB_DataManager.Instance.getNumberData("Gacha");
        let date = new Date;
        if (lastGacha.length == 0 || !((lastGacha.length > 0 && lastGacha[0] == date.getFullYear() && lastGacha[1] == date.getMonth() && lastGacha[2] == date.getDate()))) gacha = 0, THLCB_DataManager.Instance.setNumberData("Gacha", gacha);
        this.gachaBtn.getComponent(Button).interactable = gacha < 4;
        this.gachaBtn.getComponent(Sprite).grayscale = gacha == 4;
        let ani = this.gachaBtn.getComponent(Animation);
        if (gacha < 4) ani.play();
        else ani.stop();
        this.outOfTimes.active = gacha == 4;
        this.timesLabel.string = gacha + "/4";
        this.videoIcon.active = gacha > 0 && gacha < 4;
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    Gacha() {
        if (this.isGacha) return;
        let x = this;
        let gacha = THLCB_DataManager.Instance.getNumberData("Gacha");
        if (gacha == 0) this._Gacha();
        else if (gacha < 4) Banner.Instance.ShowVideoAd(() => { x._Gacha() });
    }

    _Gacha() {
        THLCB_AudioManager.Instance._PlaySound(21);
        THLCB_AudioManager.Instance._PlaySound(1);
        this.isGacha = true;
        let lastGacha = THLCB_DataManager.Instance.getArrayData<number>("LastGacha");
        let date = new Date;
        lastGacha[0] = date.getFullYear();
        lastGacha[1] = date.getMonth();
        lastGacha[2] = date.getDate();
        THLCB_DataManager.Instance.setArrayData("LastGacha", lastGacha);
        let gacha = THLCB_DataManager.Instance.getNumberData("Gacha");
        gacha++;
        THLCB_DataManager.Instance.setNumberData("Gacha", gacha);
        let ani = this.gachaBtn.getComponent(Animation);
        if (gacha < 4) ani.play();
        else ani.stop();
        this.gachaBtn.getComponent(Button).interactable = gacha < 4;
        this.gachaBtn.getComponent(Sprite).grayscale = gacha == 4;
        this.outOfTimes.active = gacha == 4;
        this.timesLabel.string = gacha + "/4";
        this.videoIcon.active = gacha > 0 && gacha < 4;
        tween(this.spinner)
            .by(3, { angle: 1800 })
            .by(2, { angle: randomRange(360, 720) }, { easing: EasingType.cubicOut })
            .call(() => {
                let angle = this.spinner.angle % 360;
                this.reward = Math.floor(angle / 72);
                console.log(this.reward);
                this._GetReward();
            })
            .start();
    }

    _GetReward() {
        let data = THLCB_DataManager.Instance.getArrayData<number>("SkinStates");
        this.finalReward.children[0].active = !(this.reward == 3 && data[28] == 0);
        this.finalReward.children[1].active = (this.reward == 3 && data[28] == 0);
        switch (this.reward) {
            case 0:
                this.reward = 200;
                break;
            case 1:
                this.reward = 500;
                break;
            case 2:
                this.reward = 1000;
                break;
            case 3:
                this.reward = 2000;
                break;
            case 4:
                this.reward = 100;
                break;
        }
        this.rewardLabel.string = this.reward.toString();
        this.rewardPanel.active = true;
        let ani = this.rewardPanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Reverse;
        ani.play();
    }

    CloseReward(event: Event) {
        THLCB_AudioManager.Instance._PlaySound(1);
        let data = THLCB_DataManager.Instance.getArrayData<number>("SkinStates");
        if (this.reward == 2000 && data[28] == 0) {
            data[28] = 1;
            THLCB_DataManager.Instance.setArrayData("SkinStates", data);
        }
        else {
            THLCB_DataManager.coinSpawn = event.target.getWorldPosition();
            let money = THLCB_DataManager.Instance.getNumberData("Coin");
            money += this.reward;
            THLCB_DataManager.Instance.setNumberData("Coin", money);
        }
        let ani = this.rewardPanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
        this._InitData();
    }

    ClosePanel(): void {
        if (this.isGacha) return;
        let ani = this.node.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }

}