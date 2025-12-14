import { _decorator, Component, Node, ScrollView, Vec3, Color, tween, Tween, Event, UITransform, director, instantiate, Button, Label, resources, Prefab, find, UIOpacity } from 'cc';
import { PGZY_select } from './PGZY_select';
import { PGZY_Item } from './PGZY_Item';
import { FloatingText } from 'db://assets/Scripts/Framework/UI/FloatingText';
import { Panel, UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { GameManager } from 'db://assets/Scripts/GameManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;


@ccclass('PGZY_AB')
export class PGZY_AB extends Component {

    private static _instance: PGZY_AB = null;
    public static get Instance() { return PGZY_AB._instance; }

    @property(ScrollView)
    scrollView: ScrollView = null;

    @property(Node)
    content: Node = null;

    @property(PGZY_select)
    select: PGZY_select = null;

    @property(GamePanel)
    gamePanel: GamePanel = null;

    @property(Node)
    score: Node = null;

    @property(Node)
    fail: Node = null;

    @property(Prefab)
    answer: Prefab = null;

    MissionData = [
        { Index: 0, IsRight: true, Desc: "天经地义" },
        { Index: 1, IsRight: false, Desc: "一蹴而就" },
        { Index: 2, IsRight: true, Desc: "江山丽" },
        { Index: 3, IsRight: false, Desc: "绿上头" },
        { Index: 4, IsRight: false, Desc: "一叶障目" },
        { Index: 5, IsRight: false, Desc: "一箭双雕" },
        { Index: 6, IsRight: false, Desc: "对牛弹琴" },
        { Index: 7, IsRight: false, Desc: "井底之蛙" },
        { Index: 8, IsRight: false, Desc: "支付宝" },
        { Index: 9, IsRight: false, Desc: "" },
        { Index: 10, IsRight: false, Desc: "" },
        { Index: 11, IsRight: false, Desc: "" },
        { Index: 12, IsRight: false, Desc: "" },
    ];

    missionMap: Map<number, boolean> = new Map();
    item: PGZY_Item = null;

    onLoad() {
        PGZY_AB._instance = this;
        this.MissionData.forEach(e => this.missionMap.set(e.Index, false));
        this.content.on(Node.EventType.TOUCH_START, () => {
            this.select.Show(false);
            this.item = null;
        }, this);
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer;

    }

    Select(item: PGZY_Item) {
        this.item = item;
        let position = item.node.worldPosition.clone();
        this.select.Show(true, new Vec3(position.x, position.y + item.node.getComponent(UITransform).height / 2 + 30, 0), this.Check.bind(this));
    }

    Check(isRight: boolean) {
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

}
