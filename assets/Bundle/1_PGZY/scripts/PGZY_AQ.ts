import { _decorator, Component, Node, ScrollView, Vec3, UITransform, director, Prefab } from 'cc';
import { PGZY_Item_AQ } from './PGZY_Item_AQ';
import { UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { PGZY_select_AQ } from './PGZY_select_AQ';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;


@ccclass('PGZY_AQ')
export class PGZY_AQ extends Component {

    //# region 属性
    private static _instance: PGZY_AQ = null;
    public static get Instance() { return PGZY_AQ._instance; }

    @property(ScrollView)
    scrollView: ScrollView = null;

    @property(Node)
    content: Node = null;

    @property(PGZY_select_AQ)
    select: PGZY_select_AQ = null;

    @property(GamePanel)
    gamePanel: GamePanel = null;



    @property(Node)
    score: Node = null;

    @property(Node)
    fail: Node = null;

    @property(Prefab)
    answer: Prefab = null;


    MissionData = [
        { Index: 0, IsRight: false, Desc: "花园" },
        { Index: 1, IsRight: true, Desc: "奶茶" },
        { Index: 2, IsRight: false, Desc: "杜甫" },
        { Index: 3, IsRight: false, Desc: "包拯" },
        { Index: 4, IsRight: false, Desc: "钱到月底不够花" },
        { Index: 5, IsRight: false, Desc: "顶个诸葛亮" },
        { Index: 6, IsRight: true, Desc: "一片冰心在玉" },
        { Index: 7, IsRight: false, Desc: "每逢佳节倍思亲" },
        { Index: 8, IsRight: false, Desc: "大肠" },
        { Index: 9, IsRight: false, Desc: "小红" },
    ];

    missionMap: Map<number, boolean> = new Map();
    item: PGZY_Item_AQ = null;
    //#endregion


    onLoad() {
        PGZY_AQ._instance = this;
        this.MissionData.forEach(e => this.missionMap.set(e.Index, false));
        this.content.on(Node.EventType.TOUCH_START, () => {
            this.select.Show(false);
            this.item = null;
        }, this);
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer;
    }

    //#region 事件
    Select(item: PGZY_Item_AQ) {
        this.item = item;
        let position = item.node.worldPosition.clone();
        this.select.Show(true, new Vec3(position.x, position.y + item.node.getComponent(UITransform).height / 2 + 30, 0), this.Check.bind(this));
    }
    //#endregion

    //#region 方法
    Check(isRight: boolean) {
        console.log("Check", isRight);
        if (!this.item) return;
        let data = this.MissionData.find(e => e.Index == this.item.MissionIndex);
        if (data.IsRight == isRight) {
            //选对
            this.missionMap.set(this.item.MissionIndex, true);
            this.item.ShowRight();
            this.CheckWin();
        } else {
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
            this.gamePanel.Win()
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
    //#endregion

}
