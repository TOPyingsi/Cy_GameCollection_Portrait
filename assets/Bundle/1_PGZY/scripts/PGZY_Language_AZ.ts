import { _decorator, Component, Node, ScrollView, Vec3, UITransform, director, Prefab } from 'cc';
import { PGZY_Item_Language_AZ } from './PGZY_Item_Language_AZ';
import { PGZY_select_Language_AZ } from './PGZY_select_Language_AZ';
import { UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;


@ccclass('PGZY_Language_AZ')
export class PGZY_Language_AZ extends Component {

    private static _instance: PGZY_Language_AZ = null;
    public static get Instance() { return PGZY_Language_AZ._instance; }

    @property(ScrollView)
    scrollView: ScrollView = null;

    @property(Node)
    content: Node = null;

    @property(PGZY_select_Language_AZ)
    select: PGZY_select_Language_AZ = null;

    @property(GamePanel)
    gamePanel: GamePanel = null;

    @property(Prefab)
    answer: Prefab = null;

    MissionData = [
        { Index: 0, IsRight: true, Desc: "欣赏" },
        { Index: 1, IsRight: false, Desc: "云辰" },
        { Index: 2, IsRight: false, Desc: "景美" },
        { Index: 3, IsRight: true, Desc: "别致" },
        { Index: 4, IsRight: false, Desc: "相提并伦" },
        { Index: 5, IsRight: true, Desc: "没精打采" },
        { Index: 6, IsRight: false, Desc: "一颗永流传" },
        { Index: 7, IsRight: false, Desc: "老娘丰韵犹存" },
        { Index: 8, IsRight: false, Desc: "只要貌似很性感" },
        { Index: 9, IsRight: false, Desc: "网吧怎么走" },
        { Index: 10, IsRight: true, Desc: "我妈一有钱就高兴" },
        { Index: 11, IsRight: false, Desc: "老师放屁" },
    ];

    missionMap: Map<number, boolean> = new Map();
    item: PGZY_Item_Language_AZ = null;

    onLoad() {
        PGZY_Language_AZ._instance = this;
        this.MissionData.forEach(e => this.missionMap.set(e.Index, false));
        this.content.on(Node.EventType.TOUCH_START, () => {
            this.select.Show(false);
            this.item = null;
        }, this);
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer;

    }

    Select(item: PGZY_Item_Language_AZ) {
        this.item = item;
        let position = item.node.worldPosition.clone();
        this.select.Show(true, new Vec3(position.x, position.y + item.node.getComponent(UITransform).height / 2 + 30, 0), this.Check.bind(this));
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
            this.gamePanel.Win();
        }, 0.5);
    }

    Win() {
        const scene = director.getScene()
        const grandchildren = this.getAllGrandchildren(scene);
        // this.score.active = true;
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
