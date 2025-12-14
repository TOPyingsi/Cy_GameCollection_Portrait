import { _decorator, Component, EventTouch, Graphics, Mask, Node, UITransform, v3, Vec3 } from 'cc';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
const { ccclass, property } = _decorator;

const v3_0 = v3();

@ccclass('ZZ_Wipe')
export class ZZ_Wipe extends Component {
    public static instance: ZZ_Wipe;

    private originalPositions: Map<Node, Vec3> = new Map();

    graphics: Graphics | null = null;
    mask: Mask | null = null;

    protected onLoad(): void {
        ZZ_Wipe.instance = this;
        this.graphics = NodeUtil.GetComponent("Mask", this.node, Graphics);
        this.mask = NodeUtil.GetComponent("Mask", this.node, Mask);
    }

    start() {
        // return;
        this.node.on(Node.EventType.TOUCH_START, this.onMouseDown, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onMouseUp, this);
        this.node.on(Node.EventType.TOUCH_END, this.onMouseUp, this);
        this.graphics.clear();
    }

    onMouseDown(event: EventTouch) {
        return;
        this.graphics.lineWidth = 50;
        this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y), v3_0);
        this.graphics.moveTo(v3_0.x, v3_0.y);
    }

    onMouseMove(event: EventTouch) {
        return;
        const lineToPoint = event.getLocation();
        this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y), v3_0);
        this.graphics.lineTo(v3_0.x, v3_0.y);
        this.graphics.stroke();
    }

    onMouseUp(event: EventTouch) {
        return;
        this.node.active = false;
    }

    reSet() {
        console.error("reSet")
        this.graphics.clear();
        this.mask.enabled = true;
        this.graphics.enabled = true;
        this.mask.node.active = true;
        this.graphics.node.active = true;
        this.node.active = false;
    }
}