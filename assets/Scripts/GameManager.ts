import { _decorator, Component, director, game, math, Node, PhysicsSystem2D, sys } from 'cc';
import { DataManager, GameData } from './Framework/Managers/DataManager';
import Banner, { BannerMode } from './Banner';
import { BannerManager } from './Framework/Managers/BannerManager';
import PrefsManager from './Framework/Managers/PrefsManager';
import { Constant } from './Framework/Const/Constant';
import { EventManager, MyEvent } from './Framework/Managers/EventManager';
import { Panel, UIManager } from './Framework/Managers/UIManager';
import { MoreGamePagePanel } from './UI/Panel/MoreGamePagePanel';
const { ccclass, property } = _decorator;

//所有游戏的总管理脚本
@ccclass('GameManager')
export class GameManager extends Component {
    public static Instance: GameManager = null;

    /**展示所有的游戏 */
    static ShowAllGame: boolean = false;

    /**当前游戏的数据 */
    static GameData: GameData = null;

    /**游戏的总开始场景 */
    static StartScene: string = `Start`;
    // static StartScene: string = `ZDXS_Menu`;

    /**当前本地游戏是否是独立游戏 */
    static IsIndieGame: boolean = true;

    static MaxAP = 15;


    public static get AP(): number {
        return PrefsManager.GetNumber(Constant.Key.AP, GameManager.MaxAP);
    }
    public static set AP(value: number) {
        value = Math.floor(value);
        value = math.clamp(value, 0, this.MaxAP);
        PrefsManager.SetNumber(Constant.Key.AP, value);
        EventManager.Scene.emit(MyEvent.ShowAPTimer, value < this.MaxAP);
        EventManager.Scene.emit(MyEvent.RefreshAP);
    }

    apCountingTimer: number = 0;
    apTime: number = 0;
    maxAddApTime: number = 300;//每隔多少秒加一点体力

    protected onLoad(): void {
        GameManager.Instance = this;
        director.addPersistRootNode(this.node);
        PhysicsSystem2D.instance.debugDrawFlags = 0;
        // game.setFrameRate(300);
        console.log(`当前模式:[${BannerMode[Banner.Mode]}]\t策略:[${BannerManager.Strategy}]`);
    }

    start() {
        Banner.Instance.Init();

        this.apTime = this.maxAddApTime;
        this.StartCountingTime();
    }

    StartCountingTime() {
        clearInterval(this.apCountingTimer);
        EventManager.Scene.emit(MyEvent.ShowAPTimer, true);
        this.apCountingTimer = setInterval(() => {
            this.apTime--;
            if (this.apTime <= 0) {
                this.apTime = this.maxAddApTime;
                if (GameManager.AP < GameManager.MaxAP) {
                    GameManager.AP++;
                }

            }

            EventManager.Scene.emit(MyEvent.RefreshAPTimer, this.apTime);
        }, 1000);
    }

    StopCountingTime() {
        console.log(`关闭原生自弹`);
        clearInterval(this.apCountingTimer);
        EventManager.Scene.emit(MyEvent.ShowAPTimer, false);
    }

    LoadGame(data: GameData) {
        console.log(`加载游戏：${data.gameName}`);
        GameManager.GameData = data;
        GameManager.AP--;
        UIManager.ShowLoadingPanel(data.startScene, data.Bundles);
    }

    ReturnAndShowMoreGame() {
        if (Banner.IsShowServerBundle) {
            UIManager.ShowLoadingPanel(GameManager.StartScene, null, () => { UIManager.ShowPanel(Panel.MoreGamePagePanel, [DataManager.GameData, false]) });
        } else {
            UIManager.ShowLoadingPanel(GameManager.StartScene, null, () => { UIManager.ShowPanel(Panel.MoreGamePagePanel, [DataManager.GameData, false]) });
        }

    }

    protected onDestroy(): void {
        this.StopCountingTime();
    }
}