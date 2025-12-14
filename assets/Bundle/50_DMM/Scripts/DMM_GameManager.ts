import { _decorator, AudioClip, Button, Component, director, find, Label, Node, tween, v3, Vec3 } from 'cc';
import { DMM_EnemyRun } from './DMM_EnemyRun';
import { DMM_NpcManager } from './DMM_NpcManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import Banner from 'db://assets/Scripts/Banner';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { DMM_SoundManager } from './DMM_SoundManager';
const { ccclass, property } = _decorator;

@ccclass('DMM_GameManager')
export class DMM_GameManager extends Component {
    public static Instance: DMM_GameManager = null;
    @property(Label) // 绑定倒计时Label节点
    countdownLabel: Label = null;
    @property(Node) // 绑定倒计时Label节点
    Chose: Node = null;
    @property(GamePanel) // 绑定倒计时Label节点
    gamepanel: GamePanel = null;

    currentTime: number = 15; // 倒计时总时长
    @property()
    startTime: number = 15;

    protected onLoad(): void {
        DMM_GameManager.Instance = this;
    }
    start() {
        this.gamepanel.time = 420;
        DMM_SoundManager.Instance.randPlayBGM();
        this.currentTime = this.startTime;
        this.countdownLabel.string = "躲藏倒计时：" + this.startTime.toString() + "s";
    }

    Win() {
        if (find("Canvas/BG/Npc").children.length == 0) {
            this.gamepanel.Win();
        }
        Banner.Instance.ShowBannerAd();
    }
    Lose() {
        this.gamepanel.Lost();
        Banner.Instance.ShowBannerAd();
    }
    update(deltaTime: number) {

    }
    startTimer() {

        this.schedule(this.updateTimer, 1);
        DMM_GameManager.Instance.Enemyreturn();

    }
    updateTimer() {
        this.currentTime--;
        this.updateCountdownDisplay();
        if (this.currentTime === (this.startTime - 1)) {
            DMM_NpcManager.Instance.NpcHide();
        }


        if (this.currentTime <= 0) {

            this.stopTimer();
            this.currentTime += this.startTime;
            this.countdownLabel.string = "开始抓人喽！！！";
            tween(find("Canvas/BG/Enemy"))
                .to(0, { worldPosition: v3(find("Canvas/BG/Enemy").worldPosition) })
                .to(1, { worldPosition: v3(find("Canvas/起始位置").worldPosition) })
                .call(() => {
                    DMM_EnemyRun.Instance.startEnd();
                })
                .start();

        }
    }
    Enemyreturn() {
        tween(find("Canvas/BG/Enemy"))
            .to(0, { worldPosition: v3(find("Canvas/BG/Enemy").worldPosition) })
            .to(1, { worldPosition: v3(find("Canvas/music").worldPosition) })
            .start();
    }
    stopTimer() {
        // 停止定时器
        this.unschedule(this.updateTimer);
    }
    updateCountdownDisplay() {
        if (this.countdownLabel) {
            this.countdownLabel.string = "躲藏倒计时：" + this.currentTime.toString() + "s";
        }
    }
    //恢复躲藏选择
    ChoseFix() {
        for (let i = 0; i < this.Chose.children.length; i++) {
            this.Chose.children[i].active = true;
            this.Chose.children[i].getComponent(Button).interactable = true;
        }

    }
    //关闭选择
    ChoseClose() {
        for (let i = 0; i < this.Chose.children.length; i++) {
            this.Chose.children[i].active = false;

        }
    }
    ChoseClose1() {
        for (let i = 0; i < this.Chose.children.length; i++) {
            this.Chose.children[i].getComponent(Button).interactable = false;
        }
    }

}
