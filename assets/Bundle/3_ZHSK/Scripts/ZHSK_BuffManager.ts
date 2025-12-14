import { _decorator, AudioSource, Button, Component, director, find, Label, Node, ParticleSystem2D } from 'cc';
import Banner from 'db://assets/Scripts/Banner';
import { ZHSK_Player } from './ZHSK_Player';
import { ZHSK_JDMSGameUIManager } from './ZHSK_JDMSGameUIManager';
const { ccclass, property } = _decorator;

@ccclass('ZHSK_BuffManager')
export class ZHSK_BuffManager extends Component {
    @property(Node)
    Puase: Node = null;
    @property(Node)
    Speed: Node = null;

    @property(Label) // 绑定倒计时Label节点
    countdownLabel: Label = null;
    @property(Label) // 绑定倒计时Label节点
    SpeeddownLabel: Label = null;
    currentTime: number = 15; // 倒计时总时长
    currentTime1: number = 15; // 倒计时总时长
    _Puase = null;
    PlayerName: string = null;
    public static Instance: ZHSK_BuffManager = null;

    protected onLoad(): void {
        ZHSK_BuffManager.Instance = this;
    }
    startTimer() {

        this.schedule(this.updateTimer, 1);
        this.Puase.children[1].active = true;
        this.Puase.children[0].active = false;
        find("Canvas/下雪").active = true;
        find("Canvas/下雪").getComponent(ParticleSystem2D).resetSystem();
    }
    startTimer1() {

        this.schedule(this.updateTimer1, 1);
        this.Speed.children[1].active = true;
        this.Speed.children[0].active = false;

    }
    updateTimer1() {
        this.currentTime1--;
        this.updateCountdownDisplay1();
        if (find("Canvas/PlayerManager").children[0].name != this.PlayerName) {
            find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed *= 1.5;
            this.PlayerName = find("Canvas/PlayerManager").children[0].name;
        }
        if (this.currentTime1 <= 0) {
            this.stopTimer1();
            if (this.Speed) {
                this.Speed.getComponent(Button).interactable = true; // 倒计时结束启用按钮
                this.Speed.children[1].active = false;
                this.Speed.children[0].active = true;
                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed /= 1.5;
                ZHSK_JDMSGameUIManager.SpeedTwiceEnable = true;
                this.currentTime1 = 15;
                this.SpeeddownLabel.string = "15";
            }
        }
    }
    updateTimer() {
        this.currentTime--;
        this.updateCountdownDisplay();

        if (this.currentTime <= 0) {
            this.stopTimer();
            //  find("Canvas/下雪").active = false;
            find("Canvas/下雪").getComponent(ParticleSystem2D).stopSystem();
            if (this.Puase) {
                this.Puase.getComponent(Button).interactable = true; // 倒计时结束启用按钮
                this.Puase.children[1].active = false;
                this.Puase.children[0].active = true;
                this._Puase = false;
                director.getScene().emit("ZHSK_PauseEnd");

                this.currentTime = 15;
                this.countdownLabel.string = "15";
            }
        }
    }
    stopTimer() {
        // 停止定时器
        this.unschedule(this.updateTimer);
    }
    stopTimer1() {
        // 停止定时器
        this.unschedule(this.updateTimer1);
    }
    updateCountdownDisplay() {
        if (this.countdownLabel) {
            this.countdownLabel.string = this.currentTime.toString();
        }
    }
    updateCountdownDisplay1() {
        if (this.SpeeddownLabel) {
            this.SpeeddownLabel.string = this.currentTime1.toString();
        }
    }
    SpeedStart() {
        find("Canvas").getComponent(AudioSource).play();

        // find("Canvas/奇遇面板").active = false;
        // director.resume();
        Banner.Instance.ShowVideoAd(() => {
            if (ZHSK_JDMSGameUIManager.SpeedTwiceEnable == true) {
                this.PlayerName = find("Canvas/PlayerManager").children[0].name;
                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed *= 1.5;
                this.startTimer1();
                ZHSK_JDMSGameUIManager.SpeedTwiceEnable = false;
                this.Speed.getComponent(Button).interactable = false;
            }
        })

    }
    Puasestart() {
        find("Canvas").getComponent(AudioSource).play();
        // find("Canvas/奇遇面板").active = false;
        // director.resume();

        Banner.Instance.ShowVideoAd(() => {
            this.Puase.getComponent(Button).interactable = false;
            director.getScene().emit("ZHSK_Pause");
            this._Puase = true;
            this.startTimer();
        })

    }
    update() {
        if (this._Puase == true) {
            director.getScene().emit("ZHSK_Pause");
        }
    }
}


