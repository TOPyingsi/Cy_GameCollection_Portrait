import { _decorator, Component, find, instantiate, isValid, Node, Prefab, resources, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { Constant } from "../Const/Constant";
import Tip from "../UI/Tip";
import { ResourceUtil } from "../Utils/ResourceUtil";
import { PoolManager } from './PoolManager';
import { BundleManager } from './BundleManager';
import { PanelBase } from '../UI/PanelBase';
import NodeUtil from '../Utils/NodeUtil';
import { FloatingText } from '../UI/FloatingText';
import LoadingPanel from '../../UI/Panel/LoadingPanel';

export enum Panel {
    PrivacyPanel = "Prefabs/UI/PrivacyPanel",
    HealthAdvicePanel = "Prefabs/UI/HealthAdvicePanel",
    SettingPanel = "Prefabs/UI/SettingPanel",
    MoreGamePanel = "Prefabs/UI/MoreGamePanel",
    MoreGamePagePanel = "Prefabs/UI/MoreGamePagePanel",
    SelectGamePanel = "Prefabs/UI/SelectGamePanel",
    UnlockPanel = "Prefabs/UI/UnlockPanel",
    CommonTipPanel = "Prefabs/UI/CommonTipPanel",
    HwLoginPanel = "Prefabs/UI/HwLoginPanel",
    TreasureBoxPanel = "Prefabs/UI/TreasureBoxPanel",
    WinPanel = "Prefabs/UI/WinPanel",
    LostPanel = "Prefabs/UI/LostPanel",
    SignInPanel = "Prefabs/UI/SignInPanel",
    AnswerPanel = "Prefabs/UI/AnswerPanel",
    AddApPanel = "Prefabs/UI/AddApPanel",
    SidebarPanel = "Prefabs/UI/SidebarPanel",//抖音侧边栏
    ReturnPanel = "Prefabs/UI/ReturnPanel"//返回框
}

@ccclass('UIManager')
export class UIManager extends Component {
    public static Instance: UIManager;

    private _layerGame: Node = null;
    /**游戏层 */
    public get LayerGame() {
        if (!this._layerGame) this._layerGame = NodeUtil.GetNode("Layer_Game", this.node);
        return this._layerGame;
    };

    private _layerTreasureBox: Node = null;
    /**宝箱层 */
    public get LayerTreasureBox() {
        if (!this._layerTreasureBox) this._layerTreasureBox = NodeUtil.GetNode("Layer_TreasureBox", this.node);
        return this._layerTreasureBox;
    };

    private _layerAd: Node = null;
    /**广告层 */
    public get LayerAd() {
        if (!this._layerAd) this._layerAd = NodeUtil.GetNode("Layer_TreasureBox", this.node);
        return this._layerAd;
    };

    private _canvas: Node = null;
    public get Canvas() {
        if (!this._canvas) this._canvas = NodeUtil.GetNode("Canvas", this.node);
        return this._canvas;
    };

    onLoad(): void {
        UIManager.Instance = this;
    }

    //#region 静态方法
    private static _panels: Map<string, PanelBase> = new Map();

    public static ShowPanel(path: string, args?: any, cb: Function = null) {
        const loadUI = () => {
            ResourceUtil.Load(path, Prefab, (err: any, prefab: Prefab) => {
                if (err) {
                    console.error(`加载 UI 失败：${path}`);
                    return;
                }

                let node: Node = instantiate(prefab);

                if (node.name == "TreasureBoxPanel") {
                    node.parent = UIManager.Instance.LayerTreasureBox;
                }
                else if (node.name == "LoadingPanel") {
                    node.parent = find("Canvas");
                }
                else {
                    node.parent = UIManager.Instance.LayerGame;
                }

                node.setSiblingIndex(999);

                let panel = node.getComponent(PanelBase);

                if (!panel) {
                    console.error(`[${node.name}]上没有 Panel 脚本，或者没有脚本没有继承自 PanelBase 。路径：[${path}]`);
                    cb && cb();
                    return;
                }

                this._panels.set(path, panel);
                if (Array.isArray(args)) {
                    panel.Show(...args);
                } else {
                    panel.Show(args);
                }
                cb && cb();
            });
        }

        if (!this._panels.has(path)) {
            loadUI();
        } else {
            let panel = this._panels.get(path);

            if (!isValid(panel)) {
                loadUI();
                return;
            };

            if (panel.node.active) return;

            if (panel.node.name == "TreasureBoxPanel") {
                panel.node.parent = UIManager.Instance.LayerTreasureBox;
            }
            else if (panel.node.name == "LoadingPanel") {
                panel.node.parent = find("Canvas");
            }
            else {
                panel.node.parent = UIManager.Instance.LayerGame;
            }

            panel.node.setSiblingIndex(999);

            if (Array.isArray(args)) {
                panel.Show(...args);
            } else {
                panel.Show(args);
            }

            cb && cb();
        }
    }

    public static ShowLoadingPanel(scene: string, bundles?: string[], cb: Function = null) {
        const path = "Prefabs/UI/LoadingPanel";
        resources.load(path, Prefab, function (err, res) {
            if (err) {
                console.error(`加载 UI 失败：${path}`);
                return;
            }

            let node: Node = instantiate(res);
            find("Canvas").addChild(node);

            node.setSiblingIndex(99999);
            node.getComponent(LoadingPanel).Show(scene, bundles, cb);
        });
    }

    public static ShowBundlePanel(bundleName: string, panelPath: string, args?: any, cb?: Function) {
        const path = `${bundleName}/${panelPath}`;

        const loadUI = () => {
            BundleManager.LoadPrefab(bundleName, panelPath).then((prefab: Prefab) => {
                let node: Node = instantiate(prefab);
                node.setPosition(0, 0, 0);
                find("Canvas").addChild(node);
                let panel = node.getComponent(PanelBase);

                if (!panel) {
                    console.error(`[${node.name}]上没有 Panel 脚本，或者没有脚本没有继承自 PanelBase 。路径：[${path}]`);
                    cb && cb();
                    return;
                }

                this._panels.set(path, panel);

                if (Array.isArray(args)) {
                    panel.Show(...args);
                } else {
                    panel.Show(args);
                }

                cb && cb();
            })
        }

        if (!this._panels.has(path)) {
            loadUI();
        }
        else {
            let panel = this._panels.get(path);

            if (!isValid(panel)) {
                loadUI();
                return;
            };

            panel.node.parent = find("Canvas");
            if (Array.isArray(args)) {
                panel.Show(...args);
            } else {
                panel.Show(args);
            }
            cb && cb();
        }
    }

    public static HidePanel(path: string, callback?: Function) {
        if (!this._panels.has(path)) {
            console.warn(`Map中没有[${path}]`);
            return;
        }

        let panel = this._panels.get(path);

        if (panel && isValid(panel) && UIManager.Instance) {
            panel.getComponent(PanelBase).Hide(() => {
                panel.node.parent = UIManager.Instance.LayerGame;
                callback && callback();
            });
        } else {
            panel.getComponent(PanelBase).Hide();
            callback && callback();
        }

    }

    public static HideBundlePanel(bundleName: string, panelPath: string, callback?: Function) {
        const path = `${bundleName}/${panelPath}`;
        this.HidePanel(path, callback);
    }

    public static RefreshPanel(path: string, args?: any) {
        if (!this._panels.has(path)) return;

        let panel = this._panels.get(path);

        if (isValid(panel)) {
            panel.getComponent(PanelBase).Refresh();
        }
    }

    /*** 全局提示*/
    public static ShowTip(content: string, delay: number = 0.75, tweenType: number = 2) {
        PoolManager.GetNode(Constant.Path.Tip, UIManager.Instance.LayerGame, Vec3.ZERO).then(node => node.getComponent(Tip).Show(content, delay, tweenType));
    }

    /*** 全局飘字*/
    public static ShowFloatingText(content: string, colorType: string, isBold: boolean = false, delay: number = 0.35, type: number = 1) {
        PoolManager.GetNode(Constant.Path.FloatingText, UIManager.Instance.LayerGame, Vec3.ZERO).then(node => node.getComponent(FloatingText).Show(content, colorType, isBold, delay, type));
    }

    //#endregion

}