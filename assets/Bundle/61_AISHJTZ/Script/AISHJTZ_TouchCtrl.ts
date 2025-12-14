import { _decorator, Component, director, EventTouch, Node, ScrollView, UITransform, Vec3, Layout, AudioSource } from 'cc';
import { AISHJTZ_GameManager } from './AISHJTZ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('AISHJTZ_TouchCtrl')
export class AISHJTZ_TouchCtrl extends Component {

    @property(ScrollView) scrollView: ScrollView = null;
    @property(Node) playArea: Node = null;

    private role: Node = null; // 角色节点
    private scrollViewComp: ScrollView = null;
    private originalScrollEnabled: boolean = true;
    private originalSiblingIndex: number = 0;
    private content: Node = null;
    private isCanTouch: boolean = false;

    onLoad() {
        this.scrollViewComp = this.scrollView.getComponent(ScrollView);
        this.content = this.scrollView.content

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        director.getScene().on("role", this.setRole, this)
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        director.getScene().off("role", this.setRole, this)
    }

    setRole(role: Node) {
        this.role = role
        this.isCanTouch = true
    }


    onTouchStart(event: EventTouch) {
        if (!this.isCanTouch) return;

        // 保存原始状态
        this.originalSiblingIndex = this.node.getSiblingIndex();
        this.originalScrollEnabled = this.scrollViewComp.enabled;

        // 开始拖动时暂时禁用ScrollView滚动
        this.scrollViewComp.enabled = false;
        event.propagationStopped = true;
        this.node.scale = new Vec3(2, 2, 1);
    }

    onTouchMove(event: EventTouch) {
        if (!this.isCanTouch) return;
        // 获取触摸位置并转换为playArea的本地坐标
        const tsp = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(
            new Vec3(event.getUILocation().x, event.getUILocation().y)
        );

        // 临时改变父节点到playArea
        this.node.setParent(this.playArea);
        this.node.setSiblingIndex(this.playArea.children.length - 1);
        this.node.position = tsp;

        event.propagationStopped = true;
    }

    onTouchEnd(event: EventTouch) {
        if (!this.isCanTouch) return;
        if (this.role.name == "鲨鱼") {
            if (this.node.name == "Face_Shark" || this.node.name == "Star_Shark" || this.node.name == "Shoe" || this.node.name == "Fish" || this.node.name == "zp") {
                const isOnRole = this.checkIfOnRole();

                if (!isOnRole) {
                    this.resetToOriginalPosition();
                } else {
                    const isExist = AISHJTZ_GameManager.Instance.nodes.some(
                        item => item.name === this.node.name
                    );

                    if (!isExist) {
                        this.node.getComponent(AudioSource).play();
                        AISHJTZ_GameManager.Instance.nodes.push(this.node);
                    }
                }

                director.getScene().emit("ok");


            } else {
                this.resetToOriginalPosition();
            }
        } else if (this.role.name == "木头人") {
            if (this.node.name == "Baseball" || this.node.name == "BaseballBat" || this.node.name == "Star2" || this.node.name == "Hat" || this.node.name == "Face2") {
                const isOnRole = this.checkIfOnRole();

                if (!isOnRole) {
                    this.resetToOriginalPosition();
                } else {
                    const isExist = AISHJTZ_GameManager.Instance.nodes.some(
                        item => item.name === this.node.name
                    );

                    if (!isExist) {
                        this.node.getComponent(AudioSource).play();
                        AISHJTZ_GameManager.Instance.nodes.push(this.node);
                    }
                }

                director.getScene().emit("ok");

            } else {
                this.resetToOriginalPosition();
            }
        } else if (this.role.name == "树人") {
            if (this.node.name == "BananaMonkey" || this.node.name == "Sun" || this.node.name == "素质666") {
                const isOnRole = this.checkIfOnRole();

                if (!isOnRole) {
                    this.resetToOriginalPosition();
                } else {
                    const isExist = AISHJTZ_GameManager.Instance.nodes.some(
                        item => item.name === this.node.name
                    );

                    if (!isExist) {
                        this.node.getComponent(AudioSource).play();
                        AISHJTZ_GameManager.Instance.nodes.push(this.node);
                    }
                }

                director.getScene().emit("ok");

            } else {
                this.resetToOriginalPosition();
            }
        } else if (this.role.name == "忍者") {
            if (this.node.name == "Kinfe" || this.node.name == "HuE" || this.node.name == "FeiBiao" || this.node.name == "KuWu") {
                const isOnRole = this.checkIfOnRole();

                if (!isOnRole) {
                    this.resetToOriginalPosition();
                } else {
                    const isExist = AISHJTZ_GameManager.Instance.nodes.some(
                        item => item.name === this.node.name
                    );

                    if (!isExist) {
                        this.node.getComponent(AudioSource).play();
                        AISHJTZ_GameManager.Instance.nodes.push(this.node);
                    }
                }

                director.getScene().emit("ok");

            } else {
                this.resetToOriginalPosition();
            }
        }
        this.scrollViewComp.enabled = this.originalScrollEnabled;
        event.propagationStopped = true;
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
        director.getScene().emit("error");

        this.node.setParent(this.content);
        this.content.getComponent(Layout).updateLayout();
        this.node.setSiblingIndex(this.originalSiblingIndex);
        this.node.scale = Vec3.ONE;

        AISHJTZ_GameManager.Instance.nodes.splice(AISHJTZ_GameManager.Instance.nodes.indexOf(this.node), 1);
    }
}