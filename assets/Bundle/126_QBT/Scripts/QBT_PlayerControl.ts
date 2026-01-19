import { _decorator, Component, Animation, AnimationState, NodeEventType, Vec2, EventTouch, math, Vec3, Node, RigidBody2D, instantiate, screen } from 'cc';
import { QBT_GameManage } from './QBT_GameManage';
const { ccclass, property } = _decorator;

@ccclass('QBT_PlayerControl')
export class QBT_PlayerControl extends Component {

    private static maxTouchLenght: number = 300;

    @property(Animation)
    private attackAnimations: Animation;
    @property(Node)
    private arrowNode: Node;

    private animState: AnimationState;

    private startTouchPos: Vec2 = new Vec2();
    private nodeAngle: Vec3 = new Vec3();
    private turn: Vec3 = new Vec3();
    private readyId: number = -1;
    private lastAngle: number = 0;

    start() {
        this.attackAnimations.play("drawBow");
        this.animState = this.attackAnimations.getState("drawBow");
        this.animState.pause();
        this.animState.setTime(0);
        this.animState.sample()

        QBT_PlayerControl.maxTouchLenght = screen.windowSize.width / 3;;

        this.node.getScale(this.turn);

        /*         PhysicsSystem2D.instance.enable = true;
                PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
                    EPhysics2DDrawFlags.Pair |
                    EPhysics2DDrawFlags.CenterOfMass |
                    EPhysics2DDrawFlags.Joint |
                    EPhysics2DDrawFlags.Shape; */

        QBT_GameManage.instace.touchPlane.on(NodeEventType.TOUCH_START, this.touchStart, this);
        QBT_GameManage.instace.touchPlane.on(NodeEventType.TOUCH_MOVE, this.touchMove, this);
        QBT_GameManage.instace.touchPlane.on(NodeEventType.TOUCH_END, this.touchEnd, this);
        QBT_GameManage.instace.touchPlane.on(NodeEventType.TOUCH_CANCEL, this.touchEnd, this);
    }

    update(deltaTime: number) {

    }

    touchStart(event: EventTouch) {
        if (this.readyId >= 0 || !QBT_GameManage.instace.isGameRunStage || QBT_GameManage.instace.pause) return;
        this.readyId = event.getID();
        event.getLocation(this.startTouchPos);
    }

    touchMove(event: EventTouch) {
        if (this.readyId !== event.getID()) return;
        const v = new Vec2();
        event.getLocation(v);
        const dir = Vec2.subtract(new Vec2(), v, this.startTouchPos);
        const a = Math.atan2(dir.y, dir.x);
        let angle = math.toDegree(a);

        if (Math.abs(this.lastAngle - angle) < 1) return;

        if (angle > 90 || angle < -90) {
            this.turn.x = -this.turn.y;
            this.nodeAngle.z = angle - 180;
        } else {
            this.turn.x = this.turn.y;
            this.nodeAngle.z = angle;
        }
        this.node.setScale(this.turn);
        this.node.setRotationFromEuler(this.nodeAngle);

        this.animState.setTime(math.clamp01(dir.length() / QBT_PlayerControl.maxTouchLenght));
        this.animState.sample()
    }

    touchEnd(event: EventTouch) {
        if (this.readyId !== event.getID()) return;
        this.readyId = -1;
        this.animState.setTime(0);
        this.animState.sample();

        const v = new Vec2();
        event.getLocation(v);
        const dir = Vec2.subtract(new Vec2(), v, this.startTouchPos);
        this.lunch(dir.length() / QBT_PlayerControl.maxTouchLenght, this.turn.x > 0);
    }

    lunch(forch: number, front: boolean) {
        const arrow = instantiate(this.arrowNode).getComponent(RigidBody2D);
        arrow.node.setParent(QBT_GameManage.instace.arrowsNode, false);
        arrow.node.setWorldRotation(this.arrowNode.getWorldRotation());
        arrow.node.setWorldPosition(this.arrowNode.getWorldPosition());
        arrow.node.setScale(this.arrowNode.getWorldScale())
        arrow.node.active = true;
        arrow.applyForceToCenter(
            arrow.node.right.toVec2().multiplyScalar(math.lerp(1000, 5000, math.clamp01(forch)) * (front ? 1 : -1)),
            true
        );
    }

}


