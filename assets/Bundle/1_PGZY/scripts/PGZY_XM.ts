import { _decorator, Component, Node, ScrollView, Vec3, UITransform, director, Prefab } from 'cc';
import { UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { PGZY_select_XM } from './PGZY_select_XM';
import { PGZY_Item_XM } from './PGZY_Item_XM';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;


@ccclass('PGZY_XM')
export class PGZY_XM extends Component {

    private static _instance: PGZY_XM = null;
    public static get Instance() { return PGZY_XM._instance; }

    @property(ScrollView)
    scrollView: ScrollView = null;

    @property(Node)
    content: Node = null;

    @property(PGZY_select_XM)
    select: PGZY_select_XM = null;

    @property(GamePanel)
    gamePanel: GamePanel = null;

    @property(Prefab)
    answer: Prefab = null;

    @property(Node)
    score: Node = null;

    @property(Node)
    fail: Node = null;

    MissionData = [
        { Index: 0, IsRight: false, Desc: "金莲" },
        { Index: 1, IsRight: true, Desc: "正能量" },
        { Index: 2, IsRight: false, Desc: "包邮" },
        { Index: 3, IsRight: false, Desc: "卖萌" },
        { Index: 4, IsRight: true, Desc: "触类旁通" },
        { Index: 5, IsRight: false, Desc: "自信不疑" },
        { Index: 6, IsRight: false, Desc: "耐人寻味" },
        { Index: 7, IsRight: false, Desc: "抑扬顿挫" },
        { Index: 8, IsRight: false, Desc: "一行白鹭上青天" },
        { Index: 9, IsRight: false, Desc: "野火烧不尽" },
        { Index: 10, IsRight: false, Desc: "千金散尽还复来" },
        { Index: 11, IsRight: false, Desc: "不成人之恶" },
        { Index: 12, IsRight: true, Desc: "任尔东西南北风" },
        { Index: 13, IsRight: false, Desc: "阿姨" },
        { Index: 14, IsRight: false, Desc: "爷爷" },
        { Index: 15, IsRight: true, Desc: "祖国" },
        { Index: 16, IsRight: false, Desc: "羽毛" },
        { Index: 17, IsRight: false, Desc: "老师" },
        { Index: 18, IsRight: true, Desc: "时光" },
    ];

    missionMap: Map<number, boolean> = new Map();
    item: PGZY_Item_XM = null;

    onLoad() {
        PGZY_XM._instance = this;
        this.MissionData.forEach(e => this.missionMap.set(e.Index, false));
        this.content.on(Node.EventType.TOUCH_START, () => {
            this.select.Show(false);
            this.item = null;
        }, this);
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer;
    }

    Select(item: PGZY_Item_XM) {
        this.item = item;
        let position = item.node.worldPosition.clone();
        this.select.Show(true, new Vec3(position.x, position.y + item.node.getComponent(UITransform).height / 2 + 30, 0), this.Check.bind(this));
    }

    onCloseButtonClick() {
        const scene = director.getScene()
        const grandchildren = this.getAllGrandchildren(scene);
        for (let i = 0; i < grandchildren.length; i++) {
            if (grandchildren[i].name == "Panel") {
                grandchildren[i].active = false;
                this.gamePanel.time = 90;
                this.gamePanel.StartTimer();
            }
        }
    }

    Check(isRight: boolean) {
        console.log("Check", isRight);

        if (!this.item) return;

        let data = this.MissionData.find(e => e.Index == this.item.MissionIndex);

        if (data.IsRight == isRight) {
            //选对
            this.missionMap.set(this.item.MissionIndex, true);
            this.item.ShowRight();
            this.CheckWin();
        }
        else {
            this.gamePanel.time -= 5;
            this.gamePanel.RefreshLabel();
            UIManager.ShowFloatingText("时间-5s", "#FF0000");
        }
    }

    CheckWin() {
        for (let [key, value] of Array.from(this.missionMap)) {
            if (!value) return;
        }
        this.Win();
        this.scrollView.scrollToTop(1);

        this.scheduleOnce(() => {
            this.gamePanel.Win();
        }, 0.5);
    }

    Win() {
        const scene = director.getScene()
        const grandchildren = this.getAllGrandchildren(scene);
        this.score.active = true;
        for (let i = 0; i < grandchildren.length; i++) {
            if (grandchildren[i].name == "RightSign") {
                grandchildren[i].active = true;
            }
        }

    }

    getAllGrandchildren(node: Node): Node[] {
        let grandchildren: Node[] = [];
        node.children.forEach(child => {
            child.children.forEach(grandchild => {
                grandchildren.push(grandchild);
            });
        });
        return grandchildren;
    }

}
