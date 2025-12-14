import { _decorator, Component, EventTouch, Graphics, Node, UITransform, Vec3, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MJMJ_LineController')
export class MJMJ_LineController extends Component {

    private static instance: MJMJ_LineController | null = null;

    public static get Instance(): MJMJ_LineController {
        return this.instance;
    }

    graphics: Graphics | null = null;

    @property(Node)
    drawingArea: Node | null = null; // 绘制区域的节点

    private isDrawing = false;
    private TouchingID: number | null = null;
    private pathPoints: Vec3[] = []; // 记录路径点

    protected onLoad(): void {
        this.graphics = this.node.getChildByName("Line").getComponent(Graphics);
    }

    start() {
        MJMJ_LineController.instance = this;
        this.node.on(Node.EventType.TOUCH_START, this.onMouseDown, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onMouseUp, this);
        this.node.on(Node.EventType.TOUCH_END, this.onMouseUp, this);
    }

    protected update(dt: number): void {
        // if (this.isDrawing && this.pathPoints.length > 1) {
        if (this.pathPoints.length > 1) {
            // this.graphics!.clear();
            this.graphics.moveTo(this.pathPoints[0].x, this.pathPoints[0].y);
            // console.log("开始绘制");
            for (let i = 1; i < this.pathPoints.length; i++) {
                this.graphics.lineTo(this.pathPoints[i].x, this.pathPoints[i].y);
            }
            this.graphics.stroke();
        }
    }


    onMouseDown(event: EventTouch) {
        console.error(this.node.name)
        if (this.TouchingID !== null) return;

        this.TouchingID = event.getID();

        const moveToPoint = this.getClampedPoint(event);
        if (!moveToPoint) return; // 如果点超出边界，忽略该事件

        // this.graphics.moveTo(moveToPoint.x, moveToPoint.y);

        // 记录起点
        this.pathPoints = [new Vec3(moveToPoint.x, moveToPoint.y, 0)];
        this.isDrawing = true;
    }

    onMouseMove(event: EventTouch) {
        if (this.TouchingID === null || this.TouchingID !== event.getID()) return;

        const lineToPoint = this.getClampedPoint(event);
        if (!lineToPoint) return; // 如果点超出边界，忽略该事件

        // this.graphics.lineTo(lineToPoint.x, lineToPoint.y);
        // this.graphics.stroke();

        // 记录移动点
        this.pathPoints.push(new Vec3(lineToPoint.x, lineToPoint.y, 0));
    }

    onMouseUp(event: EventTouch) {
        if (this.TouchingID === null || this.TouchingID !== event.getID()) return;

        this.TouchingID = null;
        this.isDrawing = false;
    }

    hasDrawnLine(): boolean {
        // 如果路径点数量大于1，则认为绘制了线条
        return this.pathPoints.length > 1;
    }

    getGraphicsNode(): Node | null {
        return this.graphics ? this.graphics.node : null;
    }

    startAni() {
        Tween.stopAllByTarget(this.node);
        tween(this.node).to(2, { angle: 720, scale: new Vec3(0, 0, 1) })
            .call(() => {
                this.node.active = false;
            })
            .start();
    }

    resetGraphicsNode() {
        Tween.stopAllByTarget(this.node);
        this.graphics.clear(); // 清除路径
        this.pathPoints = []; // 重置路径点数组
        this.node.active = true;
        this.node.scale = new Vec3(1, 1, 1);
        this.node.angle = 0;
    }

    private getClampedPoint(event: EventTouch): Vec3 | null {
        if (!this.drawingArea) return null;

        const uiTransform = this.drawingArea.getComponent(UITransform);
        if (!uiTransform) return null;

        const worldPoint = new Vec3(event.getUILocation().x, event.getUILocation().y, 0);
        const localPoint = uiTransform.convertToNodeSpaceAR(worldPoint);

        const halfWidth = uiTransform.width / 2;
        const halfHeight = uiTransform.height / 2;

        if (localPoint.x < -halfWidth || localPoint.x > halfWidth || localPoint.y < -halfHeight || localPoint.y > halfHeight) {
            return null;
        }

        return localPoint;
    }
}