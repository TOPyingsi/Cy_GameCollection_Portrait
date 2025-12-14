import { _decorator, Component, Node, Graphics, Vec3, Color, EventTouch, ScrollView, UITransform, Vec2, v2 } from 'cc';
import { SJ_GameManager } from './SJ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('SJ_Line')
export class SJ_Line extends Component {

    graphics: Graphics | null = null;
    isDrawing = false;
    path: Vec3[] = [];
    TouchingID: number | null = null;

    private currentNode: Node = null;

    protected onLoad(): void {
        this.graphics = this.node.getComponent(Graphics);
        this.node.on(Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this);
        this.node.on(Node.EventType.TOUCH_END, this.TOUCH_END, this);
    }

    protected update(dt: number): void {
        if (this.path && this.path.length > 0) {
            for (let i = 0; i < this.path.length; i++) {
                let pos = this.path[i];
                if (i == 0) {
                    this.graphics.moveTo(pos.x, pos.y);
                } else {
                    this.graphics.lineTo(pos.x, pos.y);
                }
            }
            this.graphics.stroke();
        }
    }

    TOUCH_START(event: EventTouch) {
        if (this.TouchingID !== null) return;
        this.TouchingID = event.getID();

        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        SJ_GameManager.instance.a.forEach(node => {
            const bol = node.getComponent(UITransform).getBoundingBox().contains(v2(pos.x, pos.y))
            if (bol) {
                this.currentNode = node;
                SJ_GameManager.instance.scrollView.getComponent(ScrollView).enabled = false;
                this.graphics.strokeColor = Color.BLACK;
                this.graphics.lineWidth = 10;
            }
        })
    }

    TOUCH_MOVE(event: EventTouch) {
        if (this.TouchingID === null || this.TouchingID !== event.getID() || !this.currentNode) return;

        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        if (this.path.length >= 1000) {
            this.TOUCH_END(event);
        } else {
            this.path.push(new Vec3(pos.x, pos.y, 0));
        }
    }

    TOUCH_END(event: EventTouch) {
        if (this.TouchingID === null || this.TouchingID !== event.getID()) return;

        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        SJ_GameManager.instance.b.forEach(node => {
            const bol = node.getComponent(UITransform).getBoundingBox().contains(v2(pos.x, pos.y))
            if (bol) {
                if (node.name == `${this.currentNode.name}_End`) {
                    SJ_GameManager.instance.selectRight(node, false);
                    SJ_GameManager.instance.a = SJ_GameManager.instance.a.filter(item => item != this.currentNode);
                    SJ_GameManager.instance.b = SJ_GameManager.instance.b.filter(item => item != node);
                } else {
                    SJ_GameManager.instance.selectWrong(node);
                }
            }
        });

        this.TouchingID = null;
        SJ_GameManager.instance.scrollView.getComponent(ScrollView).enabled = true;
        this.path = [];
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.off(Node.EventType.TOUCH_END, this.TOUCH_END, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this);
    }
}