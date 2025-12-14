import { _decorator, Camera, Component, director, EventTouch, instantiate, Label, Node, Prefab } from 'cc';
import { NDPA_EventManager, NDPA_MyEvent } from './NDPA_EventManager';
import { NDPA_SetBtn } from './NDPA_SetBtn';
import { NDPA_BUTTON, NDPA_GAME, NDPA_LV, NDPA_PROPTYPE } from './NDPA_GameConstant';
import { NDPA_TipsManager } from './NDPA_TipsManager';
import { NDPA_Settlement } from './NDPA_Settlement';
import { NDPA_GameUtil } from './NDPA_GameUtil';
import { NDPA_TipsPanel } from './NDPA_TipsPanel';
import { NDPA_AudioManager, NDPA_Audios } from './NDPA_AudioManager';
import { NDPA_BlankScreen } from './NDPA_BlankScreen';
import { NDPA_PrefsManager } from './NDPA_PrefsManager';
import { NDPA_Prop } from './NDPA_Prop';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { Panel, UIManager } from '../../../Scripts/Framework/Managers/UIManager';
import { GameManager } from '../../../Scripts/GameManager';
import { ProjectEvent, ProjectEventManager } from '../../../Scripts/Framework/Managers/ProjectEventManager';
import { AudioManager, Audios } from '../../../Scripts/Framework/Managers/AudioManager';
import { PanelBase } from '../../../Scripts/Framework/UI/PanelBase';
const { ccclass, property } = _decorator;

@ccclass('NDPA_GameManager')
export class NDPA_GameManager extends Component {

    public static Instance: NDPA_GameManager = null;

    @property(Node)
    SetPanel: Node = null;

    @property(Node)
    ShopPanel: Node = null;

    @property(Node)
    GoldAwardTarget: Node = null;

    @property(Node)
    Canvas: Node = null;

    @property(Label)
    GoldLabel: Label = null;

    @property(Camera)
    MainCamera: Camera = null;

    @property(Node)
    LevelParent: Node = null;

    @property(Node)
    BadBallParent: Node = null;

    @property(Prefab)
    BadBall: Prefab = null;

    @property({ type: [Prefab] })
    Lvs: Prefab[] = [];

    @property(Node)
    SettlementPanel: Node = null;

    @property(Node)
    TreasurePanel: Node = null;

    @property(Node)
    TipsPanel: Node = null;

    @property(Node)
    MenuPanel: Node = null;

    remain: number = 0;
    TargetPanel: Node = null;

    isClick: boolean = true;//玩家能否点击宝箱
    isTipsPattern: boolean = false;//是否为提示模式
    isGameFail: boolean = false;//游戏是否已经输了 -- 不需要再进行了
    isRestart: boolean = false;//玩家是否点击重新开始
    isNext: boolean = false;//玩家是否点击下一关
    isFall: boolean = false;//游戏是否进行到煤球掉落阶段
    Game: NDPA_GAME = NDPA_GAME.PASS;
    isPass: boolean = false;
    isNewGame: boolean = true;

    // gameLv: LV = LV.LV40;

    protected onLoad(): void {
        NDPA_GameManager.Instance = this;
        // NDPA_AudioManager.PlayMusic(NDPA_Audios.BGMusci);
    }

    protected onEnable(): void {
        NDPA_EventManager.ON(NDPA_MyEvent.NDPA_REMAINING, this.reduce, this);
    }

    start() {
        this.showGold();
        this.initGame();
    }


    //重新开始
    restart() {
        BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, "Bundle/NDPA_Prefabs/过渡黑屏").then((prefab: Prefab) => {
            const hp: Node = instantiate(prefab);
            hp.parent = this.Canvas;
            hp.getComponent(NDPA_BlankScreen).show(() => {
                NDPA_TipsManager.Instance.clear();
                this.initGame();
                if (this.isTipsPattern) {
                    this.scheduleOnce(() => {
                        NDPA_TipsManager.Instance.startTips();
                    });
                }
            })
        })
    }

    //下一关
    next() {
        BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, "Bundle/NDPA_Prefabs/过渡黑屏").then((prefab: Prefab) => {
            const hp: Node = instantiate(prefab);
            hp.parent = this.Canvas;
            hp.getComponent(NDPA_BlankScreen).show(() => {
                NDPA_PrefsManager.Instance.userData.CurLv = NDPA_GameUtil.getAdjacentEnumCirculation(NDPA_LV, NDPA_PrefsManager.Instance.userData.CurLv);
                NDPA_PrefsManager.Instance.saveData();
                // this.gameLv = GameUtil.getAdjacentEnumCirculation(LV, this.gameLv);
                this.isTipsPattern = false;
                NDPA_TipsManager.Instance.clear();
                const curLv = NDPA_PrefsManager.Instance.userData.CurLv;
                if (curLv == NDPA_LV.LV9 || curLv == NDPA_LV.LV19 || curLv == NDPA_LV.LV29 || curLv == NDPA_LV.LV39) this.showTreasureBoxPanel();
                else this.initGame();
            })
        })
    }

    //展示奖品界面
    showTreasureBoxPanel() {
        BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, "Bundle/NDPA_Prefabs/TreasurePanel").then((prefab: Prefab) => {
            const treasureBoxPanel: Node = instantiate(prefab);
            treasureBoxPanel.parent = this.TreasurePanel;
        })
    }

    //关卡提示
    tips() {
        //重新开始之后 -- 显示提示
        BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, "Bundle/NDPA_Prefabs/过渡黑屏").then((prefab: Prefab) => {
            const hp: Node = instantiate(prefab);
            hp.parent = this.Canvas;
            hp.getComponent(NDPA_BlankScreen).show(() => {
                this.initGame();
                this.isTipsPattern = true;
                this.scheduleOnce(() => {
                    NDPA_TipsManager.Instance.startTips();
                }, 0.1);
            })
        })

    }

    //煤球往下砸
    reduce() {
        this.remain--;
        if (this.remain <= 0) {
            this.scheduleOnce(() => {
                this.isFall = true;
                if (this.isRestartOrNext()) return
                NDPA_EventManager.Scene.emit(NDPA_MyEvent.NDPA_FALLING);
                this.checkGame();
            }, 3);
        }
    }

    //煤球砸完之后对游戏结果进去判断
    checkGame() {
        let isKeep: boolean = false;
        this.scheduleOnce(() => {
            if (this.isRestartOrNext()) return;
            isKeep = true;
            NDPA_EventManager.Scene.emit(NDPA_MyEvent.NDPA_SMILE);
        }, 5)
        this.scheduleOnce(() => {
            if (!isKeep) return;
            if (this.isRestartOrNext()) return;
            if (!this.isNewGame) return;
            this.isNewGame = false;
            this.SettlementPanel.active = true;
            if (this.Game == NDPA_GAME.PASS) {
                this.isPass = true;
            }
            NDPA_Settlement.Instance.show(this.Game);
        }, 7)
    }

    /**
     * 
     * @returns 玩家在游戏过程中点击重新开始或者下一关的时候返回true
     */
    isRestartOrNext(): boolean {
        if (this.isGameFail || this.isRestart || this.isNext || this.isPass) {
            this.unscheduleAllCallbacks();
            this.Game = NDPA_GAME.PASS;
            this.isRestart = false;
            this.isNext = false;
            return true;
        }
        return false;
    }

    gameFail() {
        this.isGameFail = true;
        this.SettlementPanel.active = true;
        NDPA_Settlement.Instance.show(NDPA_GAME.FAIL);
    }

    // 道具的使用 --重新开始
    restartBtn() {
        this.isFall = false;
        this.unscheduleAllCallbacks();
        NDPA_AudioManager.PlaySound(NDPA_Audios.PartClick);
        this.isRestart = true;
        this.restart();
    }

    // 道具的使用 --提示
    tipsBtn(event: EventTouch) {
        this.isFall = false;
        this.unscheduleAllCallbacks();
        NDPA_AudioManager.PlaySound(NDPA_Audios.PartClick);
        if (this.isTipsPattern) return;
        let prop: NDPA_Prop = event.target.getComponent(NDPA_Prop);
        if (prop.isClick) {
            prop.use();
            this.tips();
        } else {
            this.showTipsPanel(prop.PropType);
        }
    }

    // 道具的使用 --下一关
    nextBtn(event: EventTouch) {
        this.isFall = false;
        this.unscheduleAllCallbacks();
        NDPA_AudioManager.PlaySound(NDPA_Audios.PartClick);
        let prop: NDPA_Prop = event.target.getComponent(NDPA_Prop);
        if (prop.isClick) {
            this.isNext = true;
            prop.use();
            this.next();
        }
    }

    close() {
        if (this.TargetPanel && this.TargetPanel.active) {
            NDPA_AudioManager.PlaySound(NDPA_Audios.PartClick);
            this.TargetPanel.active = false;
            this.TargetPanel = null;
        }
    }

    closeShop() {
        if (this.TargetPanel && this.TargetPanel.active) {
            NDPA_TipsManager.Instance.gameResume();
            NDPA_AudioManager.PlaySound(NDPA_Audios.PartClick);
            this.TargetPanel.active = false;
            this.TargetPanel = null;
            this.restart();
            NDPA_EventManager.Scene.emit(NDPA_MyEvent.NDPA_SHOWPROP);
        }
    }

    closeSet() {
        if (this.TargetPanel && this.TargetPanel.active) {
            NDPA_TipsManager.Instance.gameResume();
            NDPA_AudioManager.PlaySound(NDPA_Audios.PartClick);
            this.TargetPanel.active = false;
            this.TargetPanel = null;
        }
    }

    //设置
    SetBtn() {
        NDPA_TipsManager.Instance.gamePause();
        NDPA_AudioManager.PlaySound(NDPA_Audios.PartClick);
        this.TargetPanel = this.SetPanel;
        this.TargetPanel.active = true;
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "脑洞破案");
    }

    //商店
    shopBtn() {
        NDPA_TipsManager.Instance.gamePause();
        NDPA_AudioManager.PlaySound(NDPA_Audios.PartClick);
        this.TargetPanel = this.ShopPanel;
        this.TargetPanel.active = true;
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "脑洞破案");
    }

    musicBtn(event: EventTouch) {
        let setBtn: NDPA_SetBtn = event.target.getComponent(NDPA_SetBtn);
        setBtn.click();

        switch (setBtn.ButtonType) {
            case NDPA_BUTTON.MUSIC:
                NDPA_AudioManager.Mute = !setBtn.isPitchOn;
                break;
            case NDPA_BUTTON.SHAKE:
                break;
        }
        NDPA_AudioManager.PlaySound(NDPA_Audios.PartClick);
        if (NDPA_AudioManager.Mute) {
            NDPA_AudioManager.StopAll();
            AudioManager.Instance.StopBGM()
        } else {
            // NDPA_AudioManager.PlayMusic(NDPA_Audios.BGMusci);
            // AudioManager.Instance.PlayCommonBGM(Audios.BGM);
        }
    }


    showGold(gold: number = 0) {
        NDPA_PrefsManager.Instance.userData.Gold += gold;
        this.GoldLabel.string = String(NDPA_PrefsManager.Instance.userData.Gold);
    }

    showTipsPanel(type: NDPA_PROPTYPE) {
        NDPA_TipsManager.Instance.gamePause();
        this.TipsPanel.active = true;
        this.TipsPanel.getComponent(NDPA_TipsPanel).show(type);
    }

    BreakMenu() {
        BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, "Bundle/NDPA_Prefabs/过渡黑屏").then((prefab: Prefab) => {
            const hp: Node = instantiate(prefab);
            hp.parent = this.Canvas;
            hp.getComponent(NDPA_BlankScreen).show(() => {
                director.loadScene(GameManager.StartScene);
                ProjectEventManager.emit(ProjectEvent.返回主页, "脑洞破案");
            })
        })
    }

    //#region 场景预制体的载入

    initGame() {
        this.initData();
        //初始化煤球
        const badBalls: Node = instantiate(this.BadBall);
        badBalls.parent = this.BadBallParent;

        //初始化关卡
        // const lv: Node = instantiate(this.Lvs[0]);
        const lv: Node = instantiate(this.Lvs[NDPA_PrefsManager.Instance.userData.CurLv]);
        // const LV: Node = instantiate(this.Lvs[this.gameLv]);
        lv.parent = this.LevelParent;

        //第一关--提示
        if (NDPA_PrefsManager.Instance.userData.CurLv == NDPA_LV.LV1) {
            this.isTipsPattern = true
            this.scheduleOnce(() => {
                NDPA_TipsManager.Instance.startTips();
            }, 0.1);
        }
    }

    initData() {
        this.BadBallParent.removeAllChildren();
        this.LevelParent.removeAllChildren();
        this.remain = 0;
        this.isGameFail = false;
        if (!this.isFall) {
            this.isRestartOrNext();
        }
        this.isFall = false;
        this.isPass = false;
        this.isNewGame = true;
        this.Game = NDPA_GAME.PASS;
    }

}


