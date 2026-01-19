import { _decorator, AudioClip, Button, Component, Label, Node } from 'cc';
import { JJWXR_pigeon_AudioManager } from '../../Utils/JJWXR_pigeon_AudioManager';
import { eventCenter } from '../../Utils/JJWXR_pigeon_EventCenter';
import { JJWXR_pigeon_Events } from '../../Utils/JJWXR_pigeon_Events';
import { JJWXR_pigeon_BattleUI } from './JJWXR_pigeon_BattleUI';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { JJWXR_pigeon_GameUI } from './JJWXR_pigeon_GameUI';
const { ccclass, property } = _decorator;
@ccclass('JJWXR_pigeon_UIManager')
export class JJWXR_pigeon_UIManager extends Component {

    // ----------------------------------------------------------------------------------------------------------------------------------------------------
    // 事件管理器
    public static eventCenter = eventCenter;

    @property(Node)
    private gameUI: Node = null;
    @property(Node)
    private battleUI: Node = null;
    @property(Node)
    private gameSucceedUI: Node = null;
    @property(Node)
    private gameFailedUI: Node = null;
    @property(Node)
    private classBeginUI: Node = null;
    @property(Button)
    private classButton: Button = null;

    @property(Node)
    private classEncourageUI: Node = null;

    @property(Node)
    private slideEffect: Node = null;
    @property(Node)
    private clickEffect: Node = null;

    @property(AudioClip)
    private aimBeginSound: AudioClip = null;
    @property(AudioClip)
    private hitOverSound: AudioClip = null;

    @property(Node)
    private gunLoad: Node = null;


    @property({ type: Node })
    private preciseHitUI: Node = null; // 绑定精准射击UI

    // ----------------------------------------------------------------------------------------------------------------------------------------------------

    private static _instance: JJWXR_pigeon_UIManager = null;
    public static get instance(): JJWXR_pigeon_UIManager {
        return this._instance;
    }

    onLoad() {
        JJWXR_pigeon_UIManager._instance = this;
    }

    start() {
        ProjectEventManager.emit(ProjectEvent.游戏开始);
        this.init();

        eventCenter.on(JJWXR_pigeon_Events.SHOW_GAME_UI, this.showGameUI, this);
        eventCenter.on(JJWXR_pigeon_Events.HIDE_GAME_UI, this.hideGameUI, this);
        eventCenter.on(JJWXR_pigeon_Events.SHOW_BATTLE_UI, this.showBattleUI, this);
        eventCenter.on(JJWXR_pigeon_Events.HIDE_BATTLE_UI, this.hideBattleUI, this);
        eventCenter.on(JJWXR_pigeon_Events.SHOW_SUCCEED_UI, this.showGameSucceedUI, this);
        eventCenter.on(JJWXR_pigeon_Events.SHOW_FAILED_UI, this.showGameFailedUI, this);

        eventCenter.on(JJWXR_pigeon_Events.SHOW_ENCOURAGE_UI, this.showClassEncourageUI, this);

        eventCenter.on(JJWXR_pigeon_Events.SHOWPRECISEHIT, this.showPreciseHitUI, this); // 监听显示精准射击UI事件
    }
    onDestroy() {
        eventCenter.off(JJWXR_pigeon_Events.SHOW_GAME_UI, this.showGameUI, this);
        eventCenter.off(JJWXR_pigeon_Events.HIDE_GAME_UI, this.hideGameUI, this);
        eventCenter.off(JJWXR_pigeon_Events.SHOW_BATTLE_UI, this.showBattleUI, this);
        eventCenter.off(JJWXR_pigeon_Events.HIDE_BATTLE_UI, this.hideBattleUI, this);
        eventCenter.off(JJWXR_pigeon_Events.SHOW_SUCCEED_UI, this.showGameSucceedUI, this);
        eventCenter.off(JJWXR_pigeon_Events.SHOW_FAILED_UI, this.showGameFailedUI, this);

        eventCenter.off(JJWXR_pigeon_Events.SHOW_ENCOURAGE_UI, this.showClassEncourageUI, this);

        eventCenter.off(JJWXR_pigeon_Events.SHOWPRECISEHIT, this.showPreciseHitUI, this); // 取消监听显示精准射击UI事件
    }

    private init() {
        console.log("JJWXR_pigeon_UIManager init");
        const isFirstPlay = localStorage.getItem('JJWXR_pigeon_isFirstPlay');
        console.log("UIManager isFirstPlay", isFirstPlay);
        eventCenter.emit(JJWXR_pigeon_Events.ON_TOUCH_EVENT_END); // 监听触摸事件;
        if (isFirstPlay == "true") {
            this.hideGameUI();
            this.gunLoad.active = false;
            this.classBeginUI.active = false;
            this.classEncourageUI.active = false;
            this.scheduleOnce(() => {
                eventCenter.emit(JJWXR_pigeon_Events.MOVE_TO_ORIGIN_POSITION);
                this.scheduleOnce(() => {
                    this.classBeginUI.active = true;
                    this.classButton.node.on(Button.EventType.CLICK, this.showUI, this);
                    this.clickEffect.active = true;
                }, 2);
            }, 2.5);
        }
        else {
            this.showUI();
            this.slideEffect.active = false;
            this.clickEffect.active = false;
        }
    }

    // 显示界面
    public showUI() {
        // 显示游戏UI
        this.showGameUI();
        // 隐藏战斗UI
        // 隐藏游戏成功UI
        this.hideBattleUI();
        // 隐藏游戏失败UI
        this.hideGameSucceedUI();
        this.hideGameFailedUI();
        this.gunLoad.active = true;
        this.classBeginUI.active = false;
        eventCenter.emit(JJWXR_pigeon_Events.ON_TOUCH_EVENT_START); // 监听触摸事件;
    }

    // 显示教程鼓励界面
    public showClassEncourageUI() {
        this.classEncourageUI.active = true;
        this.scheduleOnce(() => {
            this.classEncourageUI.active = false;
        }, 5);
    }

    // 显示游戏界面
    public showGameUI() {
        console.log("showGameUI");
        this.gameUI.active = true;
    }
    // 隐藏游戏界面
    public hideGameUI() {
        console.log("hideGameUI");
        this.gameUI.active = false;
    }

    // 显示战斗界面
    public showBattleUI() {
        JJWXR_pigeon_AudioManager.instance.playOneShot(this.aimBeginSound);
        this.battleUI.active = true;
        this.battleUI.getComponent(JJWXR_pigeon_BattleUI).onBattleUIShow();

    }
    // 隐藏战斗界面
    public hideBattleUI() {
        this.battleUI.active = false;
        this.battleUI.getComponent(JJWXR_pigeon_BattleUI).onBattleUIHide();
        this.scheduleOnce(() => {
            JJWXR_pigeon_AudioManager.instance.playOneShot(this.hitOverSound);
        }, 0.1);
    }

    // 显示游戏成功界面
    public showGameSucceedUI() {
        this.gameSucceedUI.active = true;
        eventCenter.emit(JJWXR_pigeon_Events.UPDATE_SUCCEED_UI);
    }
    // 隐藏游戏成功界面
    public hideGameSucceedUI() {
        this.gameSucceedUI.active = false;
    }

    // 显示游戏失败界面
    public showGameFailedUI() {
        this.gameFailedUI.active = true;
    }
    // 隐藏游戏失败界面
    public hideGameFailedUI() {
        this.gameFailedUI.active = false;
    }


    // 爆头显示UI
    public showPreciseHitUI() {
        console.log("爆头显示UI");
        this.preciseHitUI.active = true;
        // 爆头UI显示3秒后隐藏
        this.scheduleOnce(() => {
            this.hidePreciseHitUI();
        }, 1);
    }
    // 爆头隐藏UI
    public hidePreciseHitUI() {
        this.preciseHitUI.active = false;
    }
}