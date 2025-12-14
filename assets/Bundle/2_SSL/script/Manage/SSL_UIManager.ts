import { _decorator, Component, director, find, instantiate, Node, Prefab, resources, Sprite, SpriteFrame } from 'cc';
import { Ticket_paly_pageController } from '../Ticket_PlayPage/SSL_Ticket_play_pageController';
import { UImachine } from '../SSL_UImachine';
import { mainPageController } from '../mainPage/SSL_mainPageController';
import { sharesPageController } from '../sharesPage/SSL_sharesPageController';
import Banner from 'db://assets/Scripts/Banner';
import { GameManager } from 'db://assets/Scripts/GameManager';
import { Panel, UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;
enum page {
    Ticket_Play = 'Ticket_play',
}

@ccclass('SSL_UIManager')
export class SSL_UIManager extends Component {
    static instance: SSL_UIManager = null;

    uiMachine: UImachine = new UImachine();

    @property(Prefab)
    Ticket_playPagePrefab: Prefab;
    Ticket_playPageScript: Ticket_paly_pageController;

    @property(Prefab)
    mainPagePrefab: Prefab;
    mainPageScript: mainPageController;

    @property(Prefab)
    sharesPage: Prefab;
    sharesPageScript: sharesPageController;

    @property(GamePanel)
    gamePanel : GamePanel;
    @property(Node)
    bkk : Node;

    // 生命周期问题，为什么当一个物体实例化后，会调用哪一个函数

    onLoad() {
        SSL_UIManager.instance = this;

        let Ticket_playPage = instantiate(this.Ticket_playPagePrefab);
        this.Ticket_playPageScript = Ticket_playPage.getComponent(Ticket_paly_pageController);
        this.Ticket_playPageScript.init();

        let mainPagePrefab = instantiate(this.mainPagePrefab);
        this.mainPageScript = mainPagePrefab.getComponent(mainPageController);
        this.mainPageScript.init();

        let sharesPagePrefab = instantiate(this.sharesPage);
        this.sharesPageScript = sharesPagePrefab.getComponent(sharesPageController);
        this.sharesPageScript.init();

        this.uiMachine.initPage(this.mainPageScript);

        this.bkk.setScale(0, 0, 0);
        this.gamePanel.time = 9999999999;
        // Trends loading, careful Async !!!!!
        // console.log(this.uiMachine);
        // resources.load(page.Ticket_Play, Prefab, (err, prefab) => {
        //     console.log(prefab);
        //     this.Ticket_playPage = new Ticket_paly_pageController(page.Ticket_Play, prefab);
        //     console.log(this.Ticket_playPage);
        //     this.uiMachine.initPage(this.Ticket_playPage);
        // });
        // console.log(this.Ticket_playPagePrefab);
    }

    /** 获取枚举所有的值*/
    public static GetEnumValues(enumType: any): string[] {
        const enumValues = Object.keys(enumType)
            .map(key => enumType[key])
            .filter(value => typeof value === 'string');

        return enumValues as string[];
    }



}


