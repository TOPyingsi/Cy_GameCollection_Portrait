import { _decorator, Animation, AudioSource, Event, BoxCollider, BoxCollider2D, Button, Component, director, find, instantiate, Label, Node, ParticleSystem2D, tween, v2, Vec2 } from 'cc';
import { ZHSK_PlayerManager } from './ZHSK_PlayerManager';
import Banner from 'db://assets/Scripts/Banner';
import { ZHSK_GameManager } from './ZHSK_GameManager';
import { ZHSK_Player } from './ZHSK_Player';
import { BOXCOLLIDER2D } from '../../../../extensions/plugin-import-2x/creator/components/BoxCollider2D';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { ZHSK_StartUIManager } from './ZHSK_StartUIManager';
import { ZHSK_BuffManager } from './ZHSK_BuffManager';
const { ccclass, property } = _decorator;

@ccclass('ZHSK_JDMSGameUIManager')
export class ZHSK_JDMSGameUIManager extends Component {
    @property(Node)
    Music: Node = null;
    @property(Node)
    Player: Node = null;
    @property(Node)
    Yinyue: Node = null;
    @property(Node)
    Puase: Node = null;
    @property(Node)
    Speed: Node = null;
    @property(Node)
    Levelup: Node = null;
    @property(Label) // 绑定倒计时Label节点
    countdownLabel: Label = null;
    @property(Label) // 绑定倒计时Label节点
    SpeeddownLabel: Label = null;
    currentTime: number = 15; // 倒计时总时长
    currentTime1: number = 15; // 倒计时总时长
    _Puase = null;
    public static SpeedTwiceEnable: boolean = true;
    PlayerName: string = null;
    //弹出设置面板
    OpenSetPanel() {
        find("Canvas").getComponent(AudioSource).play();
        find("Canvas/设置界面").active = true;
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "召唤神鲲");
        director.pause();
    }
    //关闭设置面板
    CloseSetPanel() {
        find("Canvas").getComponent(AudioSource).play();
        find("Canvas/设置界面").active = false;
        director.resume();
    }
    //返回主页
    ReturnHome() {
        find("Canvas").getComponent(AudioSource).play();

        ZHSK_PlayerManager.PlayerLevel = 0;
        director.loadScene("ZHSK_Start");//更改为主界面
        director.resume();


    }
    MusicChage() {
        if (this.Yinyue == null || this.Music == null) {
            return;
        }
        if (this.Yinyue.children[0].active == false) {
            this.node.getComponent(AudioSource).volume = 0;

        }
        else {
            this.node.getComponent(AudioSource).volume = 1;

        }
        if (this.Music.children[0].active == false) {
            find("Canvas").getComponent(AudioSource).volume = 0;

        }
        else {
            find("Canvas").getComponent(AudioSource).volume = 1;

        }
    }
    update() {
        if (this._Puase == true) {
            director.getScene().emit("ZHSK_Pause");
        }



        this.MusicChage();
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

                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed /= 1.2;
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
    AllStart() {
        find("Canvas").getComponent(AudioSource).play();
        find("Canvas/奇遇面板").active = false;
        director.resume();
        Banner.Instance.ShowVideoAd(() => {
            if (ZHSK_JDMSGameUIManager.SpeedTwiceEnable == true) {
                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed *= 1.2;
                this.PlayerName = find("Canvas/PlayerManager").children[0].name;
                ZHSK_JDMSGameUIManager.SpeedTwiceEnable = false;
                ZHSK_BuffManager.Instance.startTimer1();
            }
            else {
                ZHSK_BuffManager.Instance.SpeeddownLabel.string = "15";
                ZHSK_BuffManager.Instance.currentTime1 = 15;

            }
            this.Speed.getComponent(Button).interactable = false;
            this.Puase.getComponent(Button).interactable = false;
            director.getScene().emit("ZHSK_Pause");
            this._Puase = true;
            if (this.Puase.children[1].active == true) {
                ZHSK_BuffManager.Instance.countdownLabel.string = "15";
                ZHSK_BuffManager.Instance.currentTime = 15;
                // ZHSK_BuffManager.Instance.startTimer();
            }
            else {
                ZHSK_BuffManager.Instance.startTimer();
            }


            // ZHSK_BuffManager.Instance.SpeeddownLabel.string = "15";
            // ZHSK_BuffManager.Instance.currentTime1 = 15;
            // ZHSK_BuffManager.Instance.startTimer1();
            tween(this.node)
                .call(() => {
                    for (let j = 0; j < find("Canvas/暂存").children.length; j++) {
                        find("Canvas/暂存").children[j].destroy();

                    }
                    find("Canvas/PlayerManager").children[0].getComponent(BoxCollider2D).enabled = false;
                })
                .delay(0.1)
                .call(() => {
                    this.LevelUpFengZhuang();

                })
                .delay(0.1)
                .call(() => {
                    find("Canvas/PlayerManager").children[0].getComponent(BoxCollider2D).enabled = true;
                })
                .start();
        })
    }
    SpeedStart() {
        if (ZHSK_JDMSGameUIManager.SpeedTwiceEnable == true) {
            find("Canvas").getComponent(AudioSource).play();

            console.error(this.Speed);

            find("Canvas/奇遇面板").active = false;
            director.resume();
            this.Speed.getComponent(Button).interactable = false;
            this.PlayerName = find("Canvas/PlayerManager").children[0].name;
            find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed *= 1.2;
            ZHSK_JDMSGameUIManager.SpeedTwiceEnable = false;
            ZHSK_BuffManager.Instance.startTimer1();
        }
        else {
            find("Canvas/奇遇面板").active = false;
            director.resume();
            // this.Speed.getComponent(Button).interactable = false;
            // this.PlayerName = find("Canvas/PlayerManager").children[0].name;
            // find("ZHSK_BuffManager").getComponent(ZHSK_BuffManager).enabled = false;
            // this.Speed.children[1].active = true;
            // ZHSK_JDMSGameUIManager.SpeedTwiceEnable = true;
            ZHSK_BuffManager.Instance.SpeeddownLabel.string = "15";
            ZHSK_BuffManager.Instance.currentTime1 = 15;

            ZHSK_BuffManager.Instance.startTimer1();

        }
    }
    Puasestart() {
        // find("Canvas").getComponent(AudioSource).play();
        find("Canvas/奇遇面板").active = false;
        director.resume();
        if (this.Puase.children[1].active == true) {
            ZHSK_BuffManager.Instance.countdownLabel.string = "15";
            ZHSK_BuffManager.Instance.currentTime = 15;
        }
        else {
            ZHSK_BuffManager.Instance.Puasestart();
        }
        // Banner.Instance.ShowVideoAd(() => {
        //     this.Puase.getComponent(Button).interactable = false;
        //     director.getScene().emit("ZHSK_Pause");
        //     this._Puase = true;
        //     this.startTimer();
        // })


    }
    LevelUp() {
        find("Canvas").getComponent(AudioSource).play();
        find("Canvas/奇遇面板").active = false;
        director.resume();
        Banner.Instance.ShowVideoAd(() => {
            tween(this.node)
                .call(() => {
                    for (let j = 0; j < find("Canvas/暂存").children.length; j++) {
                        find("Canvas/暂存").children[j].destroy();

                    }
                    find("Canvas/PlayerManager").children[0].getComponent(BoxCollider2D).enabled = false;
                })
                .delay(0.1)
                .call(() => {
                    this.LevelUpFengZhuang();

                })
                .delay(0.1)
                .call(() => {
                    find("Canvas/PlayerManager").children[0].getComponent(BoxCollider2D).enabled = true;
                })
                .start();
        })

    }
    LevelUpFengZhuang() {

        if (this.Player.children[0].name == "Player") {
            const enemy = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[0]);
            enemy.active = false;
            find("Canvas/暂存").addChild(enemy);
            const enemy1 = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[0]);
            enemy1.active = false;
            find("Canvas/暂存").addChild(enemy1);
        }
        if (this.Player.children[0].name == "Player1") {
            const enemy = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[1]);
            enemy.active = false;
            find("Canvas/暂存").addChild(enemy);
            const enemy1 = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[1]);
            enemy1.active = false;
            find("Canvas/暂存").addChild(enemy1);
        }
        if (this.Player.children[0].name == "Player2") {
            const enemy = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[2]);
            enemy.active = false;
            find("Canvas/暂存").addChild(enemy);
            const enemy1 = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[2]);
            enemy1.active = false;
            find("Canvas/暂存").addChild(enemy1);
        }
        if (this.Player.children[0].name == "Player3") {


            const enemy = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[3]);
            enemy.active = false;
            find("Canvas/暂存").addChild(enemy);
            const enemy1 = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[3]);
            enemy1.active = false;
            find("Canvas/暂存").addChild(enemy1);

        }
        if (this.Player.children[0].name == "Player4") {
            const enemy = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[4]);
            enemy.active = false;
            find("Canvas/暂存").addChild(enemy);
            const enemy1 = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[4]);
            enemy1.active = false;
            find("Canvas/暂存").addChild(enemy1);
        }
        if (this.Player.children[0].name == "Player5") {


            const enemy = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[5]);
            enemy.active = false;
            find("Canvas/暂存").addChild(enemy);
            const enemy1 = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[5]);
            enemy1.active = false;
            find("Canvas/暂存").addChild(enemy1);

        }
        if (this.Player.children[0].name == "Player6") {


            const enemy = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[6]);
            enemy.active = false;
            find("Canvas/暂存").addChild(enemy);
            const enemy1 = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[6]);
            enemy1.active = false;
            find("Canvas/暂存").addChild(enemy1);


        }
        if (this.Player.children[0].name == "Player7") {


            const enemy = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[7]);
            enemy.active = false;
            find("Canvas/暂存").addChild(enemy);
            const enemy1 = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[7]);
            enemy1.active = false;
            find("Canvas/暂存").addChild(enemy1);

        }
        if (this.Player.children[0].name == "Player8") {
            const enemy = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[8]);
            enemy.active = false;
            find("Canvas/暂存").addChild(enemy);
            const enemy1 = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[8]);
            enemy1.active = false;
            find("Canvas/暂存").addChild(enemy1);
        }
        if (this.Player.children[0].name == "Player9") {
            const enemy = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[9]);
            enemy.active = false;
            find("Canvas/暂存").addChild(enemy);
            const enemy1 = instantiate(this.Player.children[0].getComponent(ZHSK_PlayerManager).changeyPrefabs[9]);
            enemy1.active = false;
            find("Canvas/暂存").addChild(enemy1);
        }
    }
    GoHome() {
        find("Canvas").getComponent(AudioSource).play();

        ZHSK_PlayerManager.PlayerLevel = 0;
        director.loadScene("ZHSK_Start");
    }
    NoFUHuo() {

        ZHSK_PlayerManager.PlayerLevel = 0;
        find("Canvas/不复活弹窗").active = true;
        find("Canvas/不复活弹窗").getComponent(Animation).play();
        find("Canvas/复活").active = false;
        find("Canvas").getComponent(AudioSource).play();

    }
    Again() {
        find("Canvas").getComponent(AudioSource).play();
        // director.loadScene("ZHSK_Start");
        ZHSK_PlayerManager.PlayerLevel = 0;
        const currentScene = director.getScene().name;
        // 重新运行当前场景
        director.loadScene(currentScene);
    }

    XiaCi() {

        find("Canvas/开始弹窗").active = false;
        ZHSK_GameManager.Instance._win = null;
        find("Canvas/PlayerManager").getComponent(ZHSK_Player).moveDir = new Vec2(-60, 80);
        find("Canvas").getComponent(AudioSource).play();
    }
    LevelupTowice() {
        find("Canvas").getComponent(AudioSource).play();
        Banner.Instance.ShowVideoAd(() => {
            tween(this.node)
                .call(() => {
                    this.LevelUpFengZhuang();
                    find("Canvas/开始弹窗").active = false;
                })
                .delay(0.05)
                .call(() => {
                    this.LevelUpFengZhuang();
                })
                .delay(0.05)
                .call(() => {
                    find("Canvas/开始弹窗").active = false;
                    ZHSK_GameManager.Instance._win = null;
                    find("Canvas/PlayerManager").getComponent(ZHSK_Player).moveDir = new Vec2(-60, 80);
                })
                .start();
        })
    }
    start() {
        ZHSK_GameManager.Instance._win = false;


        ZHSK_JDMSGameUIManager.SpeedTwiceEnable = true;
        console.error(this.Yinyue);
        if (this.Yinyue == null) {
            return;
        }

        this.Yinyue.children[0].active = ZHSK_StartUIManager.Music;
        this.Music.children[0].active = ZHSK_StartUIManager.YingYUe;
    }
    OntoggleCheck(event: Event) {
        switch (event.target.name) {
            case "音效开关框":
                ZHSK_StartUIManager.Music = !ZHSK_StartUIManager.Music;
                event.target.children[0].active = ZHSK_StartUIManager.Music;
                break;
            case "音乐开关框":
                ZHSK_StartUIManager.YingYUe = !ZHSK_StartUIManager.YingYUe;
                event.target.children[0].active = ZHSK_StartUIManager.YingYUe;
                break;
        }

    }
    CloseQiYu() {
        director.resume();
        find("Canvas/奇遇面板").active = false;
    }
}


