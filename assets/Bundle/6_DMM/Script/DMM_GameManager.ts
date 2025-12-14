import { _decorator, color, Component, director, EventTouch, InstanceMaterialType, instantiate, Label, Node, Prefab, Quat, Size, Tween, tween, UIOpacity, UITransform, v3, Vec3, Widget } from 'cc';
import { DMM_AudioManager, DMM_Audios } from './DMM_AudioManager';
import { DMM_PrefsManager } from './DMM_PrefsManager';
import { DMM_Camera } from './DMM_Camera';
import { DMM_Award } from './DMM_Award';
import { DMM_PlayerController } from './DMM_PlayerController';
import { DMM_LV } from './DMM_LV';
import { DMM_Blast } from './DMM_Blast';
import { COLOR, DMM_SOUND } from './DMM_Constant';
import { DMM_Timer } from './DMM_Timer';
import { DMM_ShowPlayerPanel } from './DMM_ShowPlayerPanel';
import { DMM_Sound } from './DMM_Sound';
import { DMM_BlankScreen } from './DMM_BlankScreen';
import { DMM_NumberIncrementLabel } from './DMM_NumberIncrementLabel';
import { ProjectEvent, ProjectEventManager } from '../../../Scripts/Framework/Managers/ProjectEventManager';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import Banner from '../../../Scripts/Banner';
import { DataManager, GameData } from '../../../Scripts/Framework/Managers/DataManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('DMM_GameManager')
export class DMM_GameManager extends Component {
    public static Instance: DMM_GameManager = null;

    @property(Node)
    Canvas: Node = null;

    @property(Node)
    MenuPanel: Node = null;

    @property(Node)
    ShopPanel: Node = null;

    @property(Node)
    SetPanel: Node = null;

    @property(Node)
    MoreGamePanel: Node = null;

    @property(DMM_NumberIncrementLabel)
    NumTs: DMM_NumberIncrementLabel = null;

    @property(Node)
    UIPanel: Node = null;

    @property(Node)
    GetGoldPanel: Node = null;

    @property(Node)
    AwardStart: Node = null;

    @property(Node)
    AwardTarget: Node = null;

    @property(Node)
    GamePanel: Node = null;

    @property(DMM_Timer)
    Timer: DMM_Timer = null;

    @property(Node)
    CameraPanel: Node = null;

    @property(UIOpacity)
    HDUIOpacity: UIOpacity = null;

    @property(Node)
    TipsPanel: Node = null;

    @property(Label)
    NameLabel: Label = null;

    @property(UIOpacity)
    GameStartTips: UIOpacity = null;

    @property(Widget)
    HideBtn: Widget = null;

    @property(Node)
    SettlePanel: Node = null;

    @property(Node)
    LVParent: Node = null;

    @property(Node)
    MoveTipsPanel: Node = null;

    @property(Node)
    HandTips: Node = null;

    @property(Node)
    TouchPanel: Node = null;

    @property(Node)
    ShowPanel: Node = null;

    IsClick: boolean = true;//能否点击
    private _hideBtnContentWidth: number = 0;
    private _isShowHideBtn: boolean = false;

    protected onLoad(): void {
        DMM_GameManager.Instance = this;
        this._hideBtnContentWidth = this.HideBtn.node.getComponent(UITransform).contentSize.width;
    }

    start() {
        this.showGold();
        this.init();
        ProjectEventManager.emit(ProjectEvent.游戏开始, "躲猫猫");
        DMM_AudioManager.PlayMusic(DMM_Audios.BGMusci);
        DMM_Camera.Instance.rotateAndMoveToTarget(1);
    }

    /**初始化人物跟场景*/
    init() {
        DMM_PlayerController.Instance.init();
        const lv: number = DMM_PrefsManager.Instance.userData.LV % 3;
        this.LVParent.removeAllChildren();
        BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], `Bundle/DMM_Prefabs/LV${lv}`).then((prefab: Prefab) => {
            const lv: Node = instantiate(prefab);
            lv.parent = this.LVParent;
        })
    }

    /**展示金币*/
    showGold(gold: number = 0) {
        if (gold != 0) {
            DMM_PrefsManager.Instance.userData.Gold += gold;
            DMM_PrefsManager.Instance.saveData();
        }
        this.NumTs.playNumberIncrementTo(DMM_PrefsManager.Instance.userData.Gold);
    }

    /**游戏开始*/
    gameStart() {
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], "Bundle/DMM_Prefabs/过渡黑屏").then((prefab: Prefab) => {
            const node: Node = instantiate(prefab);
            node.parent = this.Canvas;
            node.getComponent(DMM_BlankScreen).show(() => {
                this.MenuPanel.active = false;
                node.destroy();
                // DMM_Camera.Instance.rotateAndMoveToTarget(1);
            })
        })
    }

    /**展示商店界面*/
    showShop() {
        if (!this.IsClick) return;
        this.IsClick = false;
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        DMM_Camera.Instance.returnToInitialPosition(1, () => { this.IsClick = true });
        this.ShopPanel.active = true;
        this.UIPanel.active = false;
    }

    /**关闭商店界面*/
    closeShop() {
        if (!this.IsClick) return;
        this.IsClick = false;
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        DMM_Camera.Instance.rotateAndMoveToTarget(1, () => { this.IsClick = true });
        this.ShopPanel.active = false;
        this.UIPanel.active = true;
    }

    /**展示设置界面*/
    showSetPanel() {
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        this.SetPanel.active = true;
    }

    /**关闭设置界面*/
    closeSetPanel() {
        this.SetPanel.active = false;
    }

    /**展示更多游戏界面*/
    showMoreGamePanel() {
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        this.MoreGamePanel.active = true;
    }

    /**关闭更多游戏界面*/
    closeMoreGamePanel() {
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        this.MoreGamePanel.active = false;
    }

    /**展示激励视频界面*/
    showGetGoldPanel() {
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        this.GetGoldPanel.active = true;
    }

    /**关闭激励视频界面*/
    closeGetGoldPanel() {
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        this.GetGoldPanel.active = false;
    }

    /**展示视频视角UI*/
    showCameraPanel() {
        this.CameraPanel.active = true;
        tween(this.HDUIOpacity)
            .to(3, { opacity: 0 }, { easing: `sineOut` })
            .to(3, { opacity: 255 }, { easing: `sineOut` })
            .union()
            .repeatForever()
            .start();
    }

    /**关闭视频视角UI*/
    closeCameraPanel() {
        this.CameraPanel.active = false;
        Tween.stopAllByTarget(this.HDUIOpacity);
    }

    /**展示被抓提示UI*/
    showTipsPabel(name: string) {
        this.TipsPanel.active = true;
        this.NameLabel.string = name;
        this.scheduleOnce(() => {
            this.TipsPanel.active = false;
        }, 1);
    }

    /**展示游戏开始UI*/
    showGameStartTips() {
        this.GameStartTips.opacity = 255;
        tween(this.GameStartTips)
            .to(3, { opacity: 0 }, { easing: `sineOut` })
            .call(() => {
                if (DMM_PrefsManager.Instance.userData.LV == 1) {
                    this.showMoveTipsPanel();
                    DMM_PlayerController.Instance.addTips();
                }
            })
            .start();
    }

    /**显示隐藏按钮*/
    showHideBtn() {
        if (this._isShowHideBtn) return;
        this._isShowHideBtn = true;
        Tween.stopAllByTarget(this.HideBtn);
        tween(this.HideBtn)
            .to(0.3, { right: 0 }, { easing: `sineOut` })
            .start();
    }

    /**显示游戏结算界面*/
    showSettlePanel() {
        BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], "Bundle/DMM_Prefabs/过渡黑屏").then((prefab: Prefab) => {
            const hp: Node = instantiate(prefab);
            hp.parent = this.Canvas;
            hp.getComponent(DMM_BlankScreen).showDMM(() => {
                this.SettlePanel.active = true;
            }, () => {
                this.init();
            })
        })
    }

    /**关闭游戏结算界面*/
    closeSettlePanel() {
        this.SettlePanel.active = false;
        this.CameraPanel.active = false;
        this.GamePanel.active = false;
        this.UIPanel.active = true;
    }

    /**关闭隐藏按钮*/
    hideHideBtn() {
        if (!this._isShowHideBtn) return;
        this._isShowHideBtn = false;
        Tween.stopAllByTarget(this.HideBtn);
        tween(this.HideBtn)
            .to(0.3, { right: -this._hideBtnContentWidth }, { easing: `sineOut` })
            .start();
    }

    /**播放激励视频获取金币*/
    playViedoGetGold() {
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        Banner.Instance.ShowVideoAd(() => {
            DMM_AudioManager.PlaySound(DMM_Audios.Gold);
            BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], "Bundle/DMM_Prefabs/Award").then((prefab: Prefab) => {
                const award: Node = instantiate(prefab);
                award.parent = this.Canvas;
                award.getComponent(DMM_Award).init(this.AwardStart.getWorldPosition().clone(), this.AwardTarget.getWorldPosition().clone(), () => {
                    this.showGold(150);
                    DMM_AudioManager.PlaySound(DMM_Audios.Gold);
                }, 20);
            })
        })
    }

    /**进入合了个枪游戏*/
    HLGQBtn() {
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], "Bundle/DMM_Prefabs/过渡黑屏").then((prefab: Prefab) => {
            const node: Node = instantiate(prefab);
            node.parent = this.Canvas;
            node.getComponent(DMM_BlankScreen).show(() => {
                director.loadScene("HLGQ_Menu");
            })
        })
    }

    /**进入脑洞破案游戏*/
    NDPABtn() {
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], "Bundle/DMM_Prefabs/过渡黑屏").then((prefab: Prefab) => {
            const node: Node = instantiate(prefab);
            node.parent = this.Canvas;
            node.getComponent(DMM_BlankScreen).show(() => {
                director.loadScene("NDPA_Game");
            })
        })
    }

    /**进入谁是内鬼游戏*/
    SSNGBtn() {
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], "Bundle/DMM_Prefabs/过渡黑屏").then((prefab: Prefab) => {
            const node: Node = instantiate(prefab);
            node.parent = this.Canvas;
            node.getComponent(DMM_BlankScreen).show(() => {
                director.loadScene("ClueMaster_Game");
            })
        })
    }


    /**音乐按钮*/
    musicBtn(event: EventTouch) {
        const soundTs: DMM_Sound = event.getCurrentTarget().getComponent(DMM_Sound);
        soundTs.switch();
        if (DMM_SOUND.MUSIC == soundTs.Type) {
            DMM_AudioManager.PlaySound(DMM_Audios.Click);
            if (soundTs.IsMute) {
                DMM_AudioManager.StopAll();
            } else {
                DMM_AudioManager.PlayMusic(DMM_Audios.BGMusci);
            }
            DMM_AudioManager.Mute = soundTs.IsMute;
        } else if (DMM_SOUND.SHAKE == soundTs.Type) {
            console.log(`震动`);
        }
    }

    /**返回首页*/
    backMenu() {
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        this.SetPanel.active = false;
        director.loadScene(GameManager.StartScene);
    }

    /**开始倒计时*/
    startTimer() {
        this.Timer.startCountdown(30, () => {
            this.hideBtn();
        });
    }

    /**展示免费试用界面 */
    showPlayerPanel() {
        if (!DMM_ShowPlayerPanel.Instance.Show()) {
            this.gameStartBtn();
            return;
        }
        this.ShowPanel.active = true;
    }

    /**游戏开始*/
    gameStartBtn() {
        this.ShowPanel.active = false;
        this.UIPanel.active = false;
        this.GamePanel.active = true;
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], "Bundle/DMM_Prefabs/过渡黑屏").then((prefab: Prefab) => {
            const node: Node = instantiate(prefab);
            node.parent = this.Canvas;
            node.getComponent(DMM_BlankScreen).showDMM(() => {
                DMM_Camera.Instance.startMoveTrace(DMM_PlayerController.Instance.node);
                DMM_LV.Instance.placeRolesInCircle();
            }, () => {
                DMM_PlayerController.Instance.NameTs.string = "你";
                DMM_Camera.Instance.startMoveTrace();
                DMM_Camera.Instance.IsMoveTrace = false;
                DMM_Camera.Instance.rotateCameraAndMoveToBackTop(() => {
                    DMM_Camera.Instance.fov(50, 1);
                    // EventManager.Scene.emit(MyEvent.DMM_AI_MOVE);
                });
            })
        })
        // DMM_LV.Instance.oppenDoor();
    }

    /**变身效果*/
    changeBtn() {
        BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], "Bundle/DMM_Prefabs/Blast").then((prefab: Prefab) => {
            const node = instantiate(prefab);
            node.parent = director.getScene();
            // node.getComponent(DMM_Blast).show(DMM_Camera.Instance.Target.getWorldPosition());
            node.getComponent(DMM_Blast).show(DMM_Camera.Instance.Target.getWorldPosition(), v3(1, 1, 1), COLOR.White);
        })
    }

    /**隐藏按钮*/
    hideBtn() {
        this.closeMoveTipsPanel();
        this.hideHideBtn();
        this.closeHandTips();
        DMM_LV.Instance.hide();
        this.Timer.hideSelf();
        if (DMM_PlayerController.Instance.Tips) DMM_PlayerController.Instance.Tips.destroy();
    }

    /**展示移动提醒*/
    showMoveTipsPanel() {
        this.MoveTipsPanel.active = true;
        tween(this.MoveTipsPanel)
            .to(4, { scale: v3(0.9, 0.9, 0.9) }, { easing: `sineOut` })
            .to(4, { scale: v3(1, 1, 1) }, { easing: `sineOut` })
            .union()
            .repeatForever()
            .start();
    }

    /**隐藏移动提醒*/
    closeMoveTipsPanel() {
        Tween.stopAllByTarget(this.MoveTipsPanel);
        this.MoveTipsPanel.active = false;
    }

    /**显示提示小手*/
    showHandTips() {
        this.HandTips.active = true;
        tween(this.HandTips)
            .to(2, { scale: v3(0.8, 0.8, 0.8) }, { easing: `sineOut` })
            .to(2, { scale: v3(1, 1, 1) }, { easing: `sineOut` })
            .union()
            .repeatForever()
            .start();
    }

    /**关闭提示小手*/
    closeHandTips() {
        Tween.stopAllByTarget(this.HandTips);
        this.HandTips.active = false;
    }

    //展示移动操作
    showTouchPanel(active: boolean = true) {
        this.TouchPanel.active = active;
    }

}