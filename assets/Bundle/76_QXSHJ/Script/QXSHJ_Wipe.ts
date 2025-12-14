import { _decorator, Camera, Component, EventTouch, Graphics, Mask, Node, UITransform, v3, Vec3 } from 'cc';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
const { ccclass, property } = _decorator;

const v3_0 = v3();

@ccclass('MJMJ_Wipe')
export class MJMJ_Wipe extends Component {
    private static instance: MJMJ_Wipe;
    private originalPositions: Map<Node, Vec3> = new Map();
    private erasedRatio = 0;
    private totalArea = 0;
    private lastPos: Vec3 = v3();
    private lastCalculateTime = 0;


    public static get Instance(): MJMJ_Wipe {
        if (!this.instance) {
            this.instance = new MJMJ_Wipe();
        }
        return this.instance;
    }

    graphics: Graphics | null = null;
    mask: Mask | null = null;

    protected onLoad(): void {
        MJMJ_Wipe.instance = this;
        this.graphics = NodeUtil.GetComponent("Mask", this.node, Graphics);
        this.mask = NodeUtil.GetComponent("Mask", this.node, Mask);

        const uiTransform = this.node.getComponent(UITransform);
        this.totalArea = uiTransform.width * uiTransform.height;
    }

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onMouseDown, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onMouseUp, this);
        this.node.on(Node.EventType.TOUCH_END, this.onMouseUp, this);
        this.graphics.clear();
    }

    onMouseDown(event: EventTouch) {
        this.graphics.lineWidth = 50;
        this.node.getComponent(UITransform).convertToNodeSpaceAR(
            v3(event.getUILocation().x, event.getUILocation().y),
            v3_0
        );
        this.lastPos.set(v3_0);
        this.graphics.moveTo(v3_0.x, v3_0.y);
    }

    onMouseMove(event: EventTouch) {
        this.node.getComponent(UITransform).convertToNodeSpaceAR(
            v3(event.getUILocation().x, event.getUILocation().y),
            v3_0
        );

        // 计算移动距离（至少为线宽的1/10，防止原地擦拭无效）
        const minDistance = this.graphics.lineWidth / 10;
        const rawDistance = Vec3.distance(this.lastPos, v3_0);
        const effectiveDistance = Math.max(rawDistance, minDistance);
        this.lastPos.set(v3_0);

        // 绘制线条
        this.graphics.lineTo(v3_0.x, v3_0.y);
        this.graphics.stroke();

        if (Date.now() - this.lastCalculateTime < 30) return;
        this.lastCalculateTime = Date.now();

        // 计算擦除面积（基于有效距离）
        const strokeArea = this.graphics.lineWidth * effectiveDistance;
        this.erasedRatio += strokeArea / this.totalArea;

        // 达到阈值时完全擦除
        if (this.erasedRatio >= 0.7) {
            this.node.active = false;
        }

        console.log(`擦除进度: ${(this.erasedRatio * 100).toFixed(1)}%`);
    }

    onMouseUp(event: EventTouch) {
    }

    reSet() {
        this.graphics.clear();
        this.mask.enabled = true;
        this.graphics.enabled = true;
        this.mask.node.active = true;
        this.graphics.node.active = true;
        this.node.active = true;
        this.erasedRatio = 0;
    }
}