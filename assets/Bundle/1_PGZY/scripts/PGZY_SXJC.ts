import { _decorator, Component, Node, ScrollView, Vec3, UITransform, director, Prefab } from 'cc';
import { UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { PGZY_select_SXJC } from './PGZY_select_SXJC';
import { PGZY_Item_SXJC } from './PGZY_Item_SXJC';
import { PGZY_TipPanel } from './PGZY_TipPanel';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;


@ccclass('PGZY_SXJC')
export class PGZY_SXJC extends Component {

    private static _instance: PGZY_SXJC = null;
    public static get Instance() { return PGZY_SXJC._instance; }

    @property(ScrollView)
    scrollView: ScrollView = null;

    @property(Node)
    content: Node = null;

    @property(PGZY_select_SXJC)
    select: PGZY_select_SXJC = null;

    @property(GamePanel)
    gamePanel: GamePanel = null;

    @property(Prefab)
    answer: Prefab = null;

    // @property(PGZY_TipPanel)
    // tipPanel: PGZY_TipPanel = null;

    MissionData = [
        { Index: 0, IsRight: false, Desc: "D" },
        { Index: 1, IsRight: true, Desc: "D" },
        { Index: 2, IsRight: true, Desc: "B" },
        { Index: 3, IsRight: false, Desc: "微信" },
        { Index: 4, IsRight: false, Desc: "支付宝" },
        { Index: 5, IsRight: false, Desc: "斤" },
        { Index: 6, IsRight: false, Desc: "元" },
        { Index: 7, IsRight: false, Desc: "米" },
        { Index: 8, IsRight: false, Desc: "✌" },
        { Index: 9, IsRight: false, Desc: "速来办公室" },
        { Index: 10, IsRight: false, Desc: "七上八下" },
        { Index: 11, IsRight: false, Desc: "九九归一" },
        { Index: 12, IsRight: false, Desc: "猴子" },
        { Index: 13, IsRight: false, Desc: "小熊" },
    ];

    missionMap: Map<number, boolean> = new Map();
    item: PGZY_Item_SXJC = null;

    onLoad() {
        PGZY_SXJC._instance = this;
        this.MissionData.forEach(e => this.missionMap.set(e.Index, false));
        this.content.on(Node.EventType.TOUCH_START, () => {
            this.select.Show(false);
            this.item = null;
        }, this);
    }

    start() {
        this.gamePanel.answerPrefab = this.answer;
    }
    Select(item: PGZY_Item_SXJC) {
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
