import { _decorator, Component, director, EventTouch, find, instantiate, Label, Node, Prefab, Sprite, tween, Tween, UIOpacity, v3 } from 'cc';
import { XDMKQ_Panel } from './XDMKQ_Panel';
import { XDMKQ_AUDIO, XDMKQ_PANEL, XDMKQ_SUPPLY, XDMKQ_SUPPLY_ITEM, XDMKQ_WEAPON } from './XDMKQ_Constant';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_RoleItem } from './XDMKQ_RoleItem';
import { XDMKQ_SupplyItem } from './XDMKQ_SupplyItem';
import { XDMKQ_CurSupplyItem } from './XDMKQ_CurSupplyItem';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
import Banner from 'db://assets/Scripts/Banner';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { Panel, UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_PanelManager')
export class XDMKQ_PanelManager extends Component {
    public static Instance: XDMKQ_PanelManager = null;

    @property(Sprite)
    LoadingSprite: Sprite = null;

    @property(Prefab)
    RoleItem: Prefab = null;

    @property(Node)
    RoleContent: Node = null;

    @property(Node)
    BackMuneBut: Node = null;

    @property(XDMKQ_SupplyItem)
    Supplys: XDMKQ_SupplyItem[] = [];

    @property(Node)
    CurSupplyContent: Node = null;

    @property(Prefab)
    CurSupplyItem: Prefab = null;

    LevelPanel: XDMKQ_Panel = null;
    SetPanel: XDMKQ_Panel = null;
    LoadingPanel: XDMKQ_Panel = null;
    RolePanel: XDMKQ_Panel = null;
    SupplyPanel: XDMKQ_Panel = null;
    InjuredPanel: XDMKQ_Panel = null;
    DiePanel: XDMKQ_Panel = null;
    OverPanel: XDMKQ_Panel = null;
    VideoPanel: XDMKQ_Panel = null;
    Tips: Node = null;

    TargetPanel: XDMKQ_Panel = null;
    private _dieLabel: Label = null;
    private _nameLabel: Label = null;
    private _birthdayLabel: Label = null;

    MapCurSupply: Map<XDMKQ_SUPPLY, XDMKQ_CurSupplyItem> = new Map();

    protected onLoad(): void {
        if (XDMKQ_PanelManager.Instance != null) {
            this.node.destroy();
            return;
        }
        XDMKQ_PanelManager.Instance = this;
        director.addPersistRootNode(this.node);

        this.LevelPanel = find("LevelPanel", this.node).getComponent(XDMKQ_Panel);
        this.SetPanel = find("SetPanel", this.node).getComponent(XDMKQ_Panel);
        this.LoadingPanel = find("LoadingPanel", this.node).getComponent(XDMKQ_Panel);
        this.RolePanel = find("RolePanel", this.node).getComponent(XDMKQ_Panel);
        this.SupplyPanel = find("SupplyPanel", this.node).getComponent(XDMKQ_Panel);
        this.InjuredPanel = find("InjuredPanel", this.node).getComponent(XDMKQ_Panel);
        this.DiePanel = find("DiePanel", this.node).getComponent(XDMKQ_Panel);
        this.OverPanel = find("OverPanel", this.node).getComponent(XDMKQ_Panel);
        this.VideoPanel = find("VideoPanel", this.node).getComponent(XDMKQ_Panel);
        this.Tips = find("Tips", this.node);

        this._dieLabel = find("Main/DieTips", this.DiePanel.node).getComponent(Label);
        this._nameLabel = find("Main/Name", this.DiePanel.node).getComponent(Label);
        this._birthdayLabel = find("Main/Birthday", this.DiePanel.node).getComponent(Label);
    }

    OnButtonClick(event: EventTouch) {
        XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.点击);
        switch (event.target.name) {
            case "ClosePanel":
                this.ClosePanel();
                if (director.getScene().name == "XDMKQ_Game") XDMKQ_GameManager.Instance.GamePause = false;
                break;
            case "返回主页":
                this.ClosePanel();
                if (director.getScene().name == "XDMKQ_Game") {
                    director.loadScene("XDMKQ_Menu");
                    this.ShowLoadingPanel();
                } else {
                    UIManager.ShowPanel(Panel.ReturnPanel);
                }
                break;
            case "全部领取":
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_SUPPLYITEM_CLICK);
                event.getCurrentTarget().active = false;
                this.scheduleOnce(() => {
                    event.getCurrentTarget().active = true;
                }, 1);
                break;
            case "抢救":
                Banner.Instance.ShowVideoAd(() => {
                    XDMKQ_GameManager.Instance.Damage = 0;
                    XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_ROLE_SHOW);
                    this.ClosePanel();
                })
                break;
            case "放弃抢救":
                XDMKQ_GameManager.Instance.CurRole.IsLife = false;
                let lifeRoleCount: number = 0;
                XDMKQ_GameManager.Instance.Roles.forEach(role => { if (role.IsLife) lifeRoleCount++; });
                if (lifeRoleCount == 0) {
                    this.ShowPanel(XDMKQ_PANEL.OverPanel);
                } else {
                    this.ShowPanel(XDMKQ_PANEL.DiePanel);
                    ProjectEventManager.emit(ProjectEvent.游戏结束, "兄弟们开枪");
                }
                break;
            case "补充弹药":
                Banner.Instance.ShowVideoAd(() => {
                    XDMKQ_GameManager.Instance.MapBullet.forEach((value, key) => {
                        if (key == XDMKQ_WEAPON.炮台) return;
                        key == XDMKQ_WEAPON.手雷 || key == XDMKQ_WEAPON.燃烧弹 ? value.CurBullet += value.MagazineCapacity * 2 : value.ReduceBullet += value.MagazineCapacity * 2
                    });
                    XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CHANGE_BULLET);
                    XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CURWEAPON_BULLET_SHOW);
                    XDMKQ_GameManager.Instance.GamePause = false;
                    this.ClosePanel();
                })
                break;
            case "放弃补充弹药":
                XDMKQ_GameManager.Instance.GamePause = false;
                this.ClosePanel();
                break;

        }
    }

    ShowPanel(panel: XDMKQ_PANEL) {
        switch (panel) {
            case XDMKQ_PANEL.LevelPanel:
                this.Show(this.LevelPanel);
                break;
            case XDMKQ_PANEL.SetPanel:
                this.Show(this.SetPanel);
                if (director.getScene().name == "XDMKQ_Game") ProjectEventManager.emit(ProjectEvent.页面转换, "兄弟们开枪");
                break;
            case XDMKQ_PANEL.RolePanel:
                this.Show(this.RolePanel);
                this.InitRolePanel();
                break;
            case XDMKQ_PANEL.SupplyPanel:
                this.Show(this.SupplyPanel);
                this.InitSupplyPanel();
                break;
            case XDMKQ_PANEL.InjuredPanel:
                XDMKQ_GameManager.Instance.GamePause = true;
                this.Show(this.InjuredPanel);
                break;
            case XDMKQ_PANEL.DiePanel:
                this.Show(this.DiePanel);
                this.ShowDiePanel();
                break;
            case XDMKQ_PANEL.OverPanel:
                this.Show(this.OverPanel);
                break;
            case XDMKQ_PANEL.VideoPanel:
                this.Show(this.VideoPanel);
                break;
        }
    }

    public Show(panel: XDMKQ_Panel) {
        if (this.TargetPanel == panel) return;
        if (this.TargetPanel) this.ClosePanel();
        this.TargetPanel = panel;
        this.TargetPanel.Show();
    }

    public ClosePanel() {
        if (this.TargetPanel) {
            this.TargetPanel.Close();
            this.TargetPanel = null;
        }
    }


    public ShowLoadingPanel(cb: Function = null) {
        if (this.TargetPanel == this.LoadingPanel) return;
        this.Show(this.LoadingPanel);
        Tween.stopAllByTarget(this.LoadingSprite);
        this.LoadingSprite.fillRange = 0;
        tween(this.LoadingSprite)
            .to(3, { fillRange: 1 }, { easing: `backInOut` })
            .delay(1)
            .call(() => {
                this.ClosePanel();
                cb && cb();
            })
            .start();
    }

    public InitRolePanel() {
        this.RoleContent.removeAllChildren();
        XDMKQ_GameManager.Instance.Roles.forEach(role => {
            const node: Node = instantiate(this.RoleItem);
            node.parent = this.RoleContent;
            node.getComponent(XDMKQ_RoleItem).Init(role);
        })
    }

    public ShowTips(tips: string) {
        const uiopacity: UIOpacity = this.Tips.getComponent(UIOpacity);
        const tipsLabel: Label = find("Tips", this.Tips).getComponent(Label);
        Tween.stopAllByTarget(uiopacity);
        uiopacity.opacity = 255;
        tipsLabel.string = tips;
        tween(uiopacity)
            .delay(3)
            .to(1, { opacity: 0 }, { easing: `backInOut` })
            .start();
    }

    public InitSupplyPanel() {
        XDMKQ_GameManager.Instance.InitSupplys();
        for (let i = 0; i < this.Supplys.length; i++) {
            while (!XDMKQ_GameManager.Instance.Supplies[i]) XDMKQ_GameManager.Instance.Supplies[i] = XDMKQ_GameManager.Instance.ChangeSupply(i);
            this.Supplys[i].Init(XDMKQ_GameManager.Instance.Supplies[i], i);
        }
    }

    public AddCurSupplyItem(supply: XDMKQ_SUPPLY_ITEM) {
        if (this.MapCurSupply.has(supply.Supply)) {
            this.MapCurSupply.get(supply.Supply).AddCount();
            return;
        }
        const node: Node = instantiate(this.CurSupplyItem);
        node.parent = this.CurSupplyContent;
        node.getComponent(XDMKQ_CurSupplyItem).Init(supply);
        this.MapCurSupply.set(supply.Supply, node.getComponent(XDMKQ_CurSupplyItem));
    }

    public ClearCurSupply() {
        this.CurSupplyContent.removeAllChildren();
        this.MapCurSupply.clear();
    }

    public ShowDiePanel() {
        this._nameLabel.string = XDMKQ_GameManager.Instance.CurRole.Name;
        this._birthdayLabel.string = XDMKQ_GameManager.Instance.CurRole.Birthday;
        this._dieLabel.node.setScale(v3(0, 0, 0));
        this._nameLabel.node.setScale(v3(0, 0, 0));
        this._birthdayLabel.node.setScale(v3(0, 0, 0));
        tween(this._dieLabel.node)
            .delay(0.5)
            .call(() => {
                this._dieLabel.node.setScale(v3(2, 2, 2));
            })
            .to(0.5, { scale: v3(1, 1, 1) }, { easing: `backInOut` })
            .call(() => {
                this._nameLabel.node.setScale(v3(2, 2, 2));
                tween(this._nameLabel.node)
                    .to(0.5, { scale: v3(1, 1, 1) }, { easing: `backInOut` })
                    .call(() => {
                        this._birthdayLabel.node.setScale(v3(2, 2, 2));
                        tween(this._birthdayLabel.node)
                            .to(0.5, { scale: v3(1, 1, 1) }, { easing: `backInOut` })
                            .delay(1)
                            .call(() => {
                                this.ShowPanel(XDMKQ_PANEL.RolePanel);
                            })
                            .start();
                    })
                    .start();
            })
            .start();
    }

}


