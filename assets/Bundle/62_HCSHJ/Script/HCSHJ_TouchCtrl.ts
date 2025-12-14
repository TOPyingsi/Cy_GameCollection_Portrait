import { _decorator, Component, director, EventTouch, Node, RigidBody2D, UITransform, Vec3 } from 'cc';
import { HCSHJ_GameManager } from './HCSHJ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('HCSHJ_TouchCtrl')
export class HCSHJ_TouchCtrl extends Component {

    private prop: Node = null;
    private line: Node = null;

    private isTouching: boolean = false;
    private isCanTouch: boolean = true;
    private width: number = 0;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.on(Node.EventType.TOUCH_END, this.TOUCH_END, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this);
        director.on("loadProp", this.setProp, this);
        director.on("win", this.gameOver, this)

        this.width = this.node.getComponent(UITransform).width;
    }

    TOUCH_START(event: EventTouch) {
        if (this.isTouching || !this.prop || !this.isCanTouch) return;
        this.isTouching = true;
        const tsp = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.isInRange(tsp);
    }

    TOUCH_MOVE(event: EventTouch) {
        if (!this.isTouching || !this.prop || !this.isCanTouch) return;
        const tmp = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.isInRange(tmp);
    }

    TOUCH_END(event: EventTouch) {
        if (!this.isTouching || !this.prop || !this.isCanTouch) return;
        this.isTouching = false;
        this.prop.getComponent(RigidBody2D).enabled = true;

        const tep = this.node.getComponent(UITransform).convertToNodeSpaceAR(
            new Vec3(event.getUILocation().x, event.getUILocation().y)
        );

        const halfWidth = this.width / 2;
        let finalPosX = tep.x;
        if (tep.x > halfWidth) {
            finalPosX = halfWidth - 50;
        } else if (tep.x < -halfWidth) {
            finalPosX = -halfWidth + 50;
        }

        const finalPos = new Vec3(finalPosX, tep.y, tep.z);

        this.line.destroy();
        this.line = null;
        this.prop = null;
        HCSHJ_GameManager.Instance.TVT()

        this.scheduleOnce(() => {
            HCSHJ_GameManager.Instance.loadProp(finalPos);
        }, 1);
    }

    setProp(prop: Node, line: Node) {
        this.prop = prop;
        this.line = line;
        console.log("setProp:", prop.name);
    }

    isInRange(pos: Vec3) {
        const halfWidth = this.width / 2;
        const clampedX = Math.max(-halfWidth, Math.min(halfWidth, pos.x));
        this.prop.setPosition(clampedX, this.prop.position.y, 0);
        this.line.setPosition(clampedX, this.line.position.y, 0);
    }

    gameOver() {
        this.isCanTouch = false;
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.off(Node.EventType.TOUCH_END, this.TOUCH_END, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this);
        director.off("loadProp", this.setProp, this);
        director.off("win", this.gameOver, this)
    }
}


