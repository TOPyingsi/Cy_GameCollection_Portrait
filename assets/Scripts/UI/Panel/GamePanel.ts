import { _decorator, CCInteger, Component, director, Event, game, Label, Node, Prefab } from 'cc';
import Banner from 'db://assets/Scripts/Banner';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
import { EventManager, MyEvent } from '../../Framework/Managers/EventManager';
import { PanelBase } from '../../Framework/UI/PanelBase';
import { Tools } from '../../Framework/Utils/Tools';
import NodeUtil from '../../Framework/Utils/NodeUtil';
import { Panel, UIManager } from '../../Framework/Managers/UIManager';
import { DataManager } from '../../Framework/Managers/DataManager';
import { AudioManager, Audios } from '../../Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GamePanel')
export class GamePanel extends PanelBase {
    public static Instance: GamePanel = null;

    /**游戏时间：默认180s */
    time: number = 180;
    _answerPrefab: Prefab = null;
    answerIsUnlock: boolean = false;//广告是否已经解锁

    /**答案的预制体，没有答案设为空，答案的Layer需要设置为BannerUI，要不然不显示 */
    get answerPrefab(): Prefab { return this._answerPrefab; }

    set answerPrefab(value: Prefab) {
        this._answerPrefab = value;
        this.AnswerButton.active = this.answerPrefab != null || this.answerCallback != null;
    }

    _answerCallback: Function = null;

    /**答案的回调，没有答案设为空 */
    get answerCallback(): Function { return this._answerCallback; }

    set answerCallback(value: Function) {
        this._answerCallback = value;
        this.AnswerButton.active = this.answerPrefab != null || this.answerCallback != null;
    }

    winStr: string = "";
    lostStr: string = "";

    TimeLabel: Label = null;
    GameNameLabel: Label = null;
    AnswerButton: Node = null;

    gamePause: boolean = false;
    gameOver: boolean = false;

    protected __preload(): void {
    }

    protected onLoad(): void {
        GamePanel.Instance = this;
        this.AnswerButton = NodeUtil.GetNode("AnswerButton", this.node);
        this.TimeLabel = NodeUtil.GetComponent("TimeLabel", this.node, Label);
        this.GameNameLabel = NodeUtil.GetComponent("GameNameLabel", this.node, Label);
        this.StartGame();
        director.getScene().on(MyEvent.TreasureBoxShow, this.StopTimer, this);
        director.getScene().on(MyEvent.TreasureBoxDestroy, this.StartTimer, this);
    }

    protected start(): void {
        //游戏启动的时候隐藏这些界面
        UIManager.HidePanel(Panel.SettingPanel);
        UIManager.HidePanel(Panel.WinPanel);
        UIManager.HidePanel(Panel.LostPanel);
        this.Show();
    }

    Show(): void {
        AudioManager.Instance.StopBGM();
        this.GameNameLabel.string = `${GameManager.GameData.gameName}`;
        this.AnswerButton.active = this.answerPrefab != null || this.answerCallback != null;
        this.RefreshLabel();
    }

    StartGame() {
        this.StartTimer();
        ProjectEventManager.emit(ProjectEvent.游戏开始, GameManager.GameData.gameName);
    }

    /**游戏胜利 */
    Win() {
        if (this.gameOver) return;
        UIManager.ShowPanel(Panel.WinPanel, [this.winStr]);
        this.StopTimer();
        GameManager.GameData.Pass = true;
        DataManager.UnlockNextLv(GameManager.GameData);
        this.gameOver = true;
        ProjectEventManager.emit(ProjectEvent.游戏结束, GameManager.GameData.gameName);
    }

    /**游戏失败 */
    Lost() {
        if (this.gameOver) return;
        UIManager.ShowPanel(Panel.LostPanel, [this.lostStr]);
        this.StopTimer();
        this.time = 0;
        this.RefreshLabel();
        this.gameOver = true;
        ProjectEventManager.emit(ProjectEvent.游戏结束, GameManager.GameData.gameName);
    }

    /**开始计时器 */
    StartTimer() {
        if (this.gameOver) return;
        this.gamePause = false;
        this.schedule(this.CountDown, 1);
    }

    /**暂停计时器 */
    StopTimer() {
        this.gamePause = true;
        this.unschedule(this.CountDown);
    }

    CountDown() {
        if (this.gameOver) {
            this.StopTimer();
            return;
        }

        this.time--;
        this.RefreshLabel();

        if (this.time <= 0) {
            this.Lost();
        }
    }

    RefreshLabel() {
        if (this.time <= 0) {
            this.time = 0;
        }

        this.TimeLabel.string = `${Tools.FillWithZero(Math.floor(this.time / 60), 2)}:${Tools.FillWithZero(Math.floor(this.time % 60), 2)}`;
    }

    OnButtonClick(event: Event) {
        switch (event.target.name) {
            case "PauseButton":
                this.StopTimer();
                UIManager.ShowPanel(Panel.SettingPanel, [() => {
                    this.StartTimer();
                }]);
                break;
            case "SkipButton":
                Banner.Instance.ShowVideoAd(() => {
                    GameManager.Instance.LoadGame(DataManager.UnlockNextLv(GameManager.GameData));
                });
                break;
            case "AddTimeButton":
                Banner.Instance.ShowVideoAd(() => {
                    this.time += 120;
                    this.RefreshLabel();
                });
                break;
            case "AnswerButton":
                if (this.answerIsUnlock) {
                    if (this.answerCallback) {
                        this.answerCallback();
                    }
                    if (this.answerPrefab) {
                        UIManager.ShowPanel(Panel.AnswerPanel, [this.answerPrefab]);

                    }
                } else {
                    Banner.Instance.ShowVideoAd(() => {
                        this.answerIsUnlock = true;
                        this.AnswerButton.getChildByName("视屏角标").active = false;
                        if (this.answerCallback) {
                            this.answerCallback();
                        }
                        if (this.answerPrefab) {
                            UIManager.ShowPanel(Panel.AnswerPanel, [this.answerPrefab]);

                        }
                    });
                }

                break;
        }
    }

    protected onEnable(): void {
        EventManager.on(MyEvent.Start_Game, this.StartGame, this);
        EventManager.on(MyEvent.Pause_Game, this.StopTimer, this);
        EventManager.on(MyEvent.Resume_Game, this.StartTimer, this);

    }

    protected onDisable(): void {
        EventManager.off(MyEvent.Start_Game, this.StartGame, this);
        EventManager.off(MyEvent.Pause_Game, this.StopTimer, this);
        EventManager.off(MyEvent.Resume_Game, this.StartTimer, this);
        director.getScene().off(MyEvent.TreasureBoxShow, this.StopTimer, this);
        director.getScene().off(MyEvent.TreasureBoxDestroy, this.StartTimer, this);

    }

}