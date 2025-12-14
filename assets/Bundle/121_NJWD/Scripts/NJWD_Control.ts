import { _decorator, Animation, clamp, Component, Event, EventTouch, Node, RigidBody, v3, Vec2, Vec3 } from 'cc';
import { NJWD_GameManager } from './NJWD_GameManager';
import { NJWD_UI } from './NJWD_UI';
const { ccclass, property } = _decorator;

@ccclass('NJWD_Control')
export class NJWD_Control extends Component {

    @property(RigidBody)
    movePlayer: RigidBody;

    @property(Node)
    moveButtons: Node;

    @property(Node)
    shoot: Node;

    moveX = 0;
    canMove = true;
    lastPos: Vec2;

    protected start(): void {
        this.moveButtons.children[0].on(Node.EventType.TOUCH_START, this.MoveStart, this);
        this.moveButtons.children[0].on(Node.EventType.TOUCH_END, this.MoveEnd, this);
        this.moveButtons.children[0].on(Node.EventType.TOUCH_CANCEL, this.MoveEnd, this);
        this.moveButtons.children[this.moveButtons.children.length - 1].on(Node.EventType.TOUCH_START, this.MoveStart, this);
        this.moveButtons.children[this.moveButtons.children.length - 1].on(Node.EventType.TOUCH_END, this.MoveEnd, this);
        this.moveButtons.children[this.moveButtons.children.length - 1].on(Node.EventType.TOUCH_CANCEL, this.MoveEnd, this);
        this.shoot.on(Node.EventType.TOUCH_START, this.RotateStart, this);
        this.shoot.on(Node.EventType.TOUCH_MOVE, this.RotateMove, this);
    }

    protected update(dt: number): void {
        let x = this.moveX;
        if (this.moveX == -1.5 && this.movePlayer.node.getWorldPosition().x < -7) x = 0;
        else if (this.moveX == 1.5 && this.movePlayer.node.getWorldPosition().x > 7) x = 0;
        console.log(x, this.movePlayer.node.getWorldPosition().x);
        if (this.movePlayer.node.active && this.canMove) this.movePlayer.setLinearVelocity(v3(x, 0));
        else this.movePlayer.setLinearVelocity(Vec3.ZERO);
    }

    MoveStart(event: EventTouch) {
        let node: Node = event.target;
        this.moveX = node.getSiblingIndex() == 0 ? -1.5 : 1.5;
    }

    MoveEnd(event: EventTouch) {
        this.moveX = 0;
    }

    Action(event: Event) {
        let node: Node = event.target;
        this.movePlayer.getComponent(Animation).play(`Action${node.getSiblingIndex()}`);
    }

    RotateStart(event: EventTouch) {
        this.lastPos = event.getUILocation();
    }

    RotateMove(event: EventTouch) {
        let pos = event.getUILocation();
        let dir = new Vec2;
        Vec2.subtract(dir, pos, this.lastPos);
        dir = dir.multiplyScalar(0.1);
        let camera = NJWD_GameManager.Instance.camera;
        let euler = camera.eulerAngles.clone();
        euler.x = clamp(euler.x + dir.y, -90, 90);
        euler.y = clamp(euler.y - dir.x, -90, 90);
        camera.setRotationFromEuler(euler);
        this.lastPos = pos;
    }

    Shoot() {
        if (NJWD_UI.Instance.ammo == 0 || NJWD_UI.Instance.isHit) return;
        NJWD_GameManager.Instance.Shoot();
        NJWD_UI.Instance.Shoot();
    }

}
