import { _decorator, Camera, Color, Component, director, EventTouch, Graphics, instantiate, Node, UITransform, v2, Vec3 } from 'cc';
import { JZHZLX_GameManager } from './JZHZLX_GameManager';
import { JZHZLX_RoleAndGoalsController } from './JZHZLX_RoleAndGoalsController';
const { ccclass, property } = _decorator;

@ccclass('JZHZLX_LineController')
export class JZHZLX_LineController extends Component {

    graphics: Graphics | null = null;
    isDrawing = false;
    path: Vec3[] = [];

    targetRole: JZHZLX_RoleAndGoalsController = null;

    TouchingID: number | null = null;

    start() {
        this.graphics = this.node.getComponent(Graphics);
        this.node.on(Node.EventType.TOUCH_START, this.onMouseDown, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onMouseUp, this);
        this.node.on(Node.EventType.TOUCH_END, this.onMouseUp, this);

    }

    onMouseDown(event: EventTouch) {
        if (this.TouchingID !== null) return;
        this.TouchingID = event.getID();
        console.log("TouchingID : " + this.TouchingID);

        this.path = [];
        const moveToPoint = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        this.targetRole = JZHZLX_GameManager.Instance.GetPointInRoleBoundingBox(v2(moveToPoint.x, moveToPoint.y));
        if (this.targetRole) {
            this.graphics.strokeColor = this.targetRole.color;
            // this.graphics.moveTo(moveToPoint.x, moveToPoint.y);
            this.path.push(new Vec3(moveToPoint.x, moveToPoint.y, 0));
        } else {
            this.TouchingID = null;
            console.error(123);
        }
    }

    onMouseMove(event: EventTouch) {
        if (this.TouchingID === null || this.TouchingID !== event.getID()) return;

        const lineToPoint = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));

        this.path.push(new Vec3(lineToPoint.x, lineToPoint.y, 0));

        if (this.targetRole) {
            this.graphics.strokeColor = this.targetRole.color;
            // this.graphics.lineTo(lineToPoint.x, lineToPoint.y);
            // this.graphics.stroke();
            this.path.push(new Vec3(lineToPoint.x, lineToPoint.y, 0));
        }

        // 检查路径长度是否达到一千
        if (this.path.length >= 1000) {
            this.onMouseUp(event);
        }

    }

    onMouseUp(event: EventTouch) {
        if (this.TouchingID === null || this.TouchingID !== event.getID()) return;
        this.TouchingID = null;

        if (this.targetRole && this.path.length > 0) {
            this.node.setSiblingIndex(0);
            this.targetRole.path = this.path;

            JZHZLX_GameManager.Instance.CheckMove();
        }

        console.error(this.path.length)

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

}