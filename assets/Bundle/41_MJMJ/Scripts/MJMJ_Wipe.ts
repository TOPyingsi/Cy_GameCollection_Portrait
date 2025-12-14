import { _decorator, Camera, Component, EventTouch, Graphics, Mask, Node, UITransform, v3, Vec3 } from 'cc';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
const { ccclass, property } = _decorator;

const v3_0 = v3();

@ccclass('MJMJ_Wipe')
export class MJMJ_Wipe extends Component {
    private static instance: MJMJ_Wipe;

    public static get Instance(): MJMJ_Wipe {
        if (!this.instance) {
            this.instance = new MJMJ_Wipe();
        }
        return this.instance;
    }

    private originalPositions: Map<Node, Vec3> = new Map();

    graphics: Graphics | null = null;
    mask: Mask | null = null;

    protected onLoad(): void {
        MJMJ_Wipe.instance = this;
        this.graphics = NodeUtil.GetComponent("Mask", this.node, Graphics);
        this.mask = NodeUtil.GetComponent("Mask", this.node, Mask);
    }

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onMouseDown, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onMouseUp, this);
        this.node.on(Node.EventType.TOUCH_END, this.onMouseUp, this);
        this.graphics.clear();
    }

    onMouseDown(event: EventTouch) {
        console.error(this.node.name)
        this.graphics.lineWidth = 200;
        this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y), v3_0);
        this.graphics.moveTo(v3_0.x, v3_0.y);
    }

    onMouseMove(event: EventTouch) {
        const lineToPoint = event.getLocation();
        this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y), v3_0);
        this.graphics.lineTo(v3_0.x, v3_0.y);
        this.graphics.stroke();

    }

    onMouseUp(event: EventTouch) {
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