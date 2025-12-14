import { _decorator, Component, director, EventTouch, Layout, Node, ScrollView, UITransform, v2, Vec3 } from 'cc';
import { SHJBS_GameManager } from './SHJBS_GameManager';
const { ccclass, property } = _decorator;

@ccclass('SHJBS_TouchCtrl')
export class SHJBS_TouchCtrl extends Component {

    @property(ScrollView) scrollView: ScrollView = null;
    @property(Node) playArea: Node = null;

    private scrollViewComp: ScrollView = null;
    private originalScrollEnabled: boolean = true;
    private originalSiblingIndex: number = 0;
    private content: Node = null;
    private static isCanTouch: boolean = false;
    private role: Node = null;

    _map: Map<string, string> = new Map([
        ["鲨鱼", "球鞋"],
        ["鸟", "草莓"],
        ["熊", "鱼"],
        ["鳄鱼", "轰炸机"],
        ["青蛙", "轮胎"],
        ["卡皮巴拉", "椰子"],
        ["忍者", "奶茶"],
        ["大象", "仙人掌"],
        ["天鹅", "喷气机"],
        ["奶牛", "木星"],
        ["人", "棒球棍"],
        ["猿猴", "大树"],
    ]);

    protected onLoad(): void {
        this.scrollViewComp = this.scrollView.getComponent(ScrollView);
        this.content = this.scrollView.content

        this.node.on(Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.on(Node.EventType.TOUCH_END, this.TOUCH_END, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this);

        director.getScene().on("role", this.setRole, this)

    }

    TOUCH_START(event: EventTouch) {
        if (!SHJBS_TouchCtrl.isCanTouch) return;

        this.originalSiblingIndex = this.node.getSiblingIndex();
        this.originalScrollEnabled = this.scrollViewComp.enabled;

        this.scrollViewComp.enabled = false;
        event.propagationStopped = true;
    }

    TOUCH_MOVE(event: EventTouch) {
        if (!SHJBS_TouchCtrl.isCanTouch) return;

        const tsp = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        this.node.setParent(this.playArea);
        this.node.setSiblingIndex(this.playArea.children.length - 1);
        this.node.position = tsp;

        event.propagationStopped = true;
    }

    TOUCH_END(event: EventTouch) {
        this.scrollViewComp.enabled = this.originalScrollEnabled;
        event.propagationStopped = true;
        if (!SHJBS_TouchCtrl.isCanTouch) return;

        const tep = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        // 检查当前角色是否已完成（使用角色名称检查）
        if (SHJBS_GameManager.instance.isRoleCompleted(this.role.name)) {
            this.resetToOriginalPosition();
            return;
        }

        const isOnRole = this.checkIfOnRole();

        if (!isOnRole) {
            this.resetToOriginalPosition();
        } else {
            if (this.node.name == this._map.get(this.role.name)) {
                SHJBS_TouchCtrl.isCanTouch = false;

                SHJBS_GameManager.instance.winCount++;
                console.log("恭喜你，成功！", SHJBS_GameManager.instance.winCount);
                this.node.destroy();
                SHJBS_GameManager.instance.laodYW();
                this.role.getChildByName("Before").destroy();
                this.role.getChildByName("After").active = true;
                SHJBS_GameManager.instance.tip(true);
                SHJBS_GameManager.instance.playAudio(this.role.name);
                this.content.getComponent(UITransform).width -= 300;
            } else {
                SHJBS_GameManager.instance.delHP();
                SHJBS_GameManager.instance.tip(false);
                this.resetToOriginalPosition();
            }
        }
    }

    setRole(role: Node) {
        this.role = role
        SHJBS_TouchCtrl.isCanTouch = true
    }

    private checkIfOnRole(): boolean {
        if (!this.role) return false;

        const roleTransform = this.role.getComponent(UITransform);
        const itemTransform = this.node.getComponent(UITransform);

        const roleWorldPos = roleTransform.convertToWorldSpaceAR(Vec3.ZERO);
        const roleSize = roleTransform.contentSize;
        const itemWorldPos = itemTransform.convertToWorldSpaceAR(Vec3.ZERO);
        const itemSize = itemTransform.contentSize;

        return (
            Math.abs(itemWorldPos.x - roleWorldPos.x) < (roleSize.width + itemSize.width) / 2 &&
            Math.abs(itemWorldPos.y - roleWorldPos.y) < (roleSize.height + itemSize.height) / 2
        );
    }

    private resetToOriginalPosition() {
        this.node.setParent(this.content);
        this.content.getComponent(Layout).updateLayout();
        this.node.setSiblingIndex(this.originalSiblingIndex);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.off(Node.EventType.TOUCH_END, this.TOUCH_END, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this);
        director.getScene().off("role", this.setRole, this)
    }

}