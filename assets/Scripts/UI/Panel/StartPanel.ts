import { _decorator, Component, Label, Node, Event, Prefab, Vec2, instantiate, Vec3, tween, v3, director, resources, find, Sprite, SpriteFrame, Layout } from 'cc';
import NodeUtil from '../../Framework/Utils/NodeUtil';
import Banner, { Channel } from '../../Banner';
import { AudioManager, Audios } from '../../Framework/Managers/AudioManager';
import { Panel, UIManager } from '../../Framework/Managers/UIManager';
import { GameManager } from '../../GameManager';
import { DataManager } from '../../Framework/Managers/DataManager';
import { BannerManager } from '../../Framework/Managers/BannerManager';
import PrefsManager from '../../Framework/Managers/PrefsManager';
import { Constant } from '../../Framework/Const/Constant';
import SignInPanel from './SignInPanel';
import { ProjectEvent, ProjectEventManager } from '../../Framework/Managers/ProjectEventManager';
import { SelectGamePanel } from '../SelectGamePanel';
import { MoreGamePagePanel } from './MoreGamePagePanel';

const { ccclass, property } = _decorator;


@ccclass('StartPanel')
export default class StartPanel extends Component {
    MoneyLabel: Label | null = null;
    Player: Node | null = null;
    PrivacyButton: Node | null = null;
    KeFuButton: Node | null = null;
    MoreGameButton: Node | null = null;
    QuitButton: Node | null = null;
    BottomRightPin: Node | null = null;
    BlockMask: Node | null = null;
    Buttons: Node | null = null;
    TTButtons: Node | null = null;
    static FirstShow = true;

    @property(Layout)
    layout: Layout;

    protected onLoad(): void {
        this.MoneyLabel = NodeUtil.GetComponent("MoneyLabel", this.node, Label);
        this.Player = NodeUtil.GetNode("Player", this.node);
        this.PrivacyButton = NodeUtil.GetNode("PrivacyButton", this.node);
        this.KeFuButton = NodeUtil.GetNode("KeFuButton", this.node);
        this.MoreGameButton = NodeUtil.GetNode("MoreGameButton", this.node);
        this.QuitButton = NodeUtil.GetNode("QuitButton", this.node);
        this.BottomRightPin = NodeUtil.GetNode("BottomRightPin", this.node);
        this.BlockMask = NodeUtil.GetNode("BlockMask", this.node);
        this.Buttons = NodeUtil.GetNode("Buttons", this.node);
        this.TTButtons = NodeUtil.GetNode("TTButtons", this.node);
    }

    public static IsfirstStart: boolean = true;

    protected start(): void {
        // AudioManager.Instance.PlayCommonBGM(Audios.BGM);

        if (!StartPanel.FirstShow && !SignInPanel.IsAlreadySignIn() && !GameManager.IsIndieGame) {
            // UIManager.ShowPanel(Panel.SignInPanel);
        }

        if (StartPanel.FirstShow) {
            StartPanel.FirstShow = false;
        }

        if (StartPanel.IsfirstStart) {
            //初始化广告控制器
            BannerManager.Instance.Init();
            StartPanel.IsfirstStart = false;
        } else {
            ProjectEventManager.emit(ProjectEvent.返回主页);
        }


        this.BlockMask.active = false;

        Banner.Instance.JudgeChannel((channel) => this.SetButtonState(channel));


        GameManager.GameData = DataManager.GetStartGameData();

        //华为
        let isHwNeedLogin = Banner.IS_HUAWEI_QUICK_GAME && !Banner.IsLogin;

        if (isHwNeedLogin) {
            UIManager.ShowPanel(Panel.HwLoginPanel);

            Banner.Instance.HWGameLogin(() => {
                Banner.IsLogin = true;
                UIManager.HidePanel(Panel.HwLoginPanel);
            }, () => {
                UIManager.ShowTip("登陆失败");
            });
        }
        if (DataManager.EnterFirstGame) {
            let data = DataManager.GetDataByNames(SelectGamePanel.SeletGameData[0].Data);
            MoreGamePagePanel.SelectGameData = data;
        }
        if(Banner.IsShowServerBundle){
            this.layout.node.active=true;
        }
    }

    SetButtonState(channel: Channel) {
        this.KeFuButton.active = channel == Channel.VivoBtn || channel == Channel.OppoBtn;
        this.MoreGameButton.active = channel == Channel.OppoBtn;
        this.QuitButton.active = channel == Channel.HuaweiBtn;
        if (Banner.IS_BYTEDANCE_MINI_GAME) {
            this.Buttons.active = false;
            this.TTButtons.active = true;
        }
    }
    OnButtonClick(event: Event) {
        AudioManager.Instance.PlayCommonSFX(Audios.ButtonClick);

        switch (event.target.name) {
            case "StartGameButton":
                if (GameManager.IsIndieGame) {
                    UIManager.ShowLoadingPanel(GameManager.GameData.startScene, GameManager.GameData.Bundles);
                } else {
                    if (Banner.IsShowServerBundle) {
                        if (DataManager.EnterFirstGame) {
                            let gameData = DataManager.GetDataByName(SelectGamePanel.SeletGameData[0].Data[0]);
                            GameManager.Instance.LoadGame(gameData);
                        } else {
                            UIManager.ShowPanel(Panel.MoreGamePagePanel, [DataManager.GameData]);
                            // UIManager.ShowPanel(Panel.SelectGamePanel);
                        }
                    } else {
                        if (DataManager.EnterFirstGame) {
                            let gameData = DataManager.GetDataByName(SelectGamePanel.SeletGameData[0].Data[0]);
                            GameManager.Instance.LoadGame(gameData);
                        } else {
                            UIManager.ShowPanel(Panel.MoreGamePagePanel, [DataManager.GameData]);
                        }
                    }
                    // UIManager.ShowLoadingPanel(GameManager.GameData.startScene, GameManager.GameData.Bundles);
                }
                if (Banner.IsWz) {
                    Banner.Instance.ShowCustomAd();//万总华为APK-点击开始游戏弹原生
                }
                break;

            case "PrivacyButton":
                if (Banner.IS_ANDROID) {
                    Banner.Instance.AndroidPrivacy();
                } else if (Banner.IS_HarmonyOSNext_GAME) {
                    Banner.Instance.HarmonyOsNextPrivacy();
                } else {
                    UIManager.ShowPanel(Panel.PrivacyPanel, false);
                }
                break;

            case "KeFuButton":
                Banner.Instance.AndroidKeFu();
                break;
            case "MoreGameButton":
                Banner.Instance.AndroidMoreGame();
                break;
            case "QuitButton":
                Banner.Instance.Quit();
                break;
            case "SettingButton":
                UIManager.ShowPanel(Panel.SettingPanel);
                break;
            case "TTchebianlan":
                UIManager.ShowPanel(Panel.SidebarPanel);
                break;
            case "TTAddShortcut":
                Banner.Instance.TTAddShortcut();
                break;
            case "TTSubscription":
                Banner.Instance.TTSubscription(() => { }, () => { }, () => { });
                break;
            case "TTAppMessage":
                Banner.Instance.ShareDYAppMessage();
                break;
                case "StartGameButton-001":
          let gameData1 =DataManager.GetDataByName(DataManager.GameData[2].gameName)
         GameManager.Instance.LoadGame(gameData1);
break;
 case "StartGameButton-002":
         let gameData2=DataManager.GetDataByName(DataManager.GameData[3].gameName)
         GameManager.Instance.LoadGame(gameData2);
 break;
 case "StartGameButton-003":
         let gameData3 = DataManager.GetDataByName(DataManager.GameData[4].gameName)
          GameManager.Instance.LoadGame(gameData3);
 break;
        }
    }
}