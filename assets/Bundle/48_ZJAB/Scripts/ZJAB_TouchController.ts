import { _decorator, Component, EventTouch, find, Node, ParticleSystem2D, PhysicsSystem2D, sys, v3, Vec2 } from 'cc';
import { ZJAB_NZ } from './ZJAB_NZ';
const { ccclass, property } = _decorator;

@ccclass('ZJAB_TouchController')
export class ZJAB_TouchController extends Component {

    public static Instance: ZJAB_TouchController = null;

    Particle2D: Node = null;
    IsTouch: boolean = false;
    private _startX: number = 0
    private _startZ: number = 0

    protected onLoad(): void {
        ZJAB_TouchController.Instance = this;

        this.Particle2D = find("Particle2D", this.node);

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        if (!this.IsTouch) return;
        this._startX = event.getUILocation().x;
        this.Particle2D.active = true;
        this.Particle2D.getComponent(ParticleSystem2D).resetSystem();
        const pos = event.getUILocation();
        this.Particle2D.setWorldPosition(v3(pos.x, pos.y))
    }

    onTouchMove(event: EventTouch) {
        if (!this.IsTouch) return;
        const offX = event.getUILocation().x - this._startX;
        ZJAB_NZ.Instance.moveByOffsetX(offX);
        const pos = event.getUILocation();
        this.Particle2D.setWorldPosition(v3(pos.x, pos.y))
    }

    onTouchEnd(event: EventTouch) {
        if (!this.IsTouch) return;
        ZJAB_NZ.Instance.moveByOffsetX();
        this.Particle2D.active = false;
    }
}


