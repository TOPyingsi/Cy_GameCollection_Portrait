import { _decorator, Component, director, instantiate, Label, Material, Node, resources, SceneAsset, sys } from 'cc';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { SXZW_AudioManage } from './SXZW_AudioManage';
import { SXZW_HeroesManage } from './SXZW_HeroesManage';
import { Panel, UIManager } from '../../../Scripts/Framework/Managers/UIManager';
const { ccclass, property } = _decorator;

@ccclass('SXZW_GameManage')
export class SXZW_GameManage extends Component {

    // 配置 --------------------------
    public static showReturnButton = true; // 显示返回按钮
    // -------------------------------

    private static _coin: number = -1

    public static get Coin() {
        if (this._coin === -1) {
            this._coin = Number(sys.localStorage.getItem("sxzw_coin")) || 100
        }
        return this._coin;
    }

    public static AddCoin(coin: number) {
        this._coin += Number(coin);
        sys.localStorage.setItem("sxzw_coin", this._coin)
        this.coinChange?.(this._coin);
    }

    public static EnoughCoin(coin: number) {
        return this.Coin >= Number(coin);
    }

    public static SubCoin(coin: number): boolean {
        if (!this.EnoughCoin(coin)) {
            return false;
        }
        this._coin -= Number(coin);
        sys.localStorage.setItem("sxzw_coin", this._coin)
        this.coinChange?.(this._coin);
        return true
    }

    public static coinChange: (coin: number) => void = null;

    private static gameManage: SXZW_GameManage;
    public static get Instance() {
        return this.gameManage;
    }

    @property(Node)
    guiPage: Node = null;

    @property(Node)
    gameNode: Node = null;

    @property(Node)
    guiWordNode: Node = null;

    @property(Node)
    gameWordNode: Node = null;

    @property(Node)
    guiCamera: Node = null;

    @property(Node)
    gameCamera: Node = null;

    @property(Label)
    moneyLabel: Label = null; // 金币显示标签

    @property(Label)
    tips: Label = null

    @property(SXZW_HeroesManage)
    heroes: SXZW_HeroesManage = null;

    private tipsShowTime = 0;

    protected onLoad(): void {
        SXZW_GameManage.gameManage = this;
        this.heroes.node.active = true;
    }

    protected onEnable(): void {
        SXZW_GameManage.coinChange = (coin: number) => this.onCoinChange(coin);
    }

    start() {
        ProjectEventManager.emit(ProjectEvent.游戏开始, "谁先阵亡");
        this.onCoinChange(SXZW_GameManage.Coin);
        this.guiWordNode.active = true;
        this.guiPage.active = true;
        this.guiCamera.active = true;

        this.gameNode.active = false;
        this.gameWordNode.active = false;
        this.gameCamera.active = false;
    }

    update(deltaTime: number) {
        if (this.tipsShowTime > 0) {
            this.tipsShowTime -= deltaTime;
            if (this.tipsShowTime <= 0) {
                this.tips.node.parent.parent.active = false;
            }
        }
    }

    onCoinChange(coin: number) {
        if (this.moneyLabel) this.moneyLabel.string = `${coin}`;
    }

    startGame() {
        this.guiWordNode.active = false;
        this.guiPage.active = false;
        this.guiCamera.active = false;

        this.gameNode.active = true;
        this.gameWordNode.active = true;
        this.gameCamera.active = true;

        SXZW_AudioManage.Instance.playStartGameEffect();
    }

    endGame() {
        this.guiWordNode.active = true;
        this.guiPage.active = true;
        this.guiCamera.active = true;

        this.gameNode.active = false;
        this.gameWordNode.active = false;
        this.gameCamera.active = false;
        UIManager.ShowPanel(Panel.ReturnPanel);
    }

    showTips(text: string, time: number = 3) {
        this.tips.string = text;
        this.tips.node.parent.parent.active = true;
        this.tipsShowTime = time;
    }

    protected onDisable(): void {
        SXZW_GameManage.coinChange = null; // 清除静态方法引用
    }
}


