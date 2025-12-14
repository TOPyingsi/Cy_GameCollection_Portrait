import { _decorator, Component, director, EventTouch, Layout, Node, ScrollView, UITransform, v2, Vec3 } from 'cc';
import { PT_GameManager } from './PT_GameManager';
const { ccclass, property } = _decorator;

@ccclass('PT_TouchCtrl')
export class PT_TouchCtrl extends Component {

    @property(ScrollView) scrollView: ScrollView = null;
    @property(Node) playArea: Node = null;

    private originalScrollEnabled: boolean = true;
    private originalSiblingIndex: number = 0;
    private content: Node = null;

    protected onLoad(): void {
        this.content = this.scrollView.content

        this.node.on(Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.on(Node.EventType.TOUCH_END, this.TOUCH_END, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this);
    }

    TOUCH_START(event: EventTouch) {
        this.originalSiblingIndex = this.node.getSiblingIndex();
        this.originalScrollEnabled = this.scrollView.enabled;

        this.scrollView.enabled = false;
        event.propagationStopped = true;
    }

    TOUCH_MOVE(event: EventTouch) {
        const tsp = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        this.node.setParent(this.playArea);
        this.node.setSiblingIndex(this.playArea.children.length - 1);
        this.node.position = tsp;

        event.propagationStopped = true;
    }

    TOUCH_END(event: EventTouch) {
        this.scrollView.enabled = this.originalScrollEnabled;
        event.propagationStopped = true;

        const tep = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        console.log(tep);

        PT_GameManager.instance.from.children.forEach(item => {
            const isItem = item.getComponent(UITransform).getBoundingBox().contains(v2(tep.x, tep.y));
            if (isItem) {
                if (item.name == this.node.name) {
                    PT_GameManager.instance.playAudio()
                    PT_GameManager.instance.nodes.find(item => item.name == this.node.name).active = true;
                    PT_GameManager.instance.ovo()
                    this.node.destroy();
                } else {
                    this.resetToOriginalPosition();
                }
            } else {
                this.resetToOriginalPosition();
            }
        });
        PT_GameManager.instance.refeshScrollViewContentUITransform();
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
    }
}