import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, PhysicsSystem2D, RigidBody2D, Vec2, Vec3 } from 'cc';
import { ZDXS_PoolManager } from './ZDXS_PoolManager';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_BulletController')
export class ZDXS_BulletController extends Component {

    @property
    IsBounce: boolean = false;

    RigidBody: RigidBody2D = null;
    Collider: Collider2D = null;

    private _isRemove: boolean = false;
    private _timer: number = 0;

    protected onLoad(): void {
        this.RigidBody = this.getComponent(RigidBody2D);
        this.Collider = this.getComponent(Collider2D);
        if (this.Collider && !this.IsBounce) {
            this.Collider.on(Contact2DType.BEGIN_CONTACT, this.OnBeginContact, this);
        }
    }

    Init(parent: Node, worldPos: Vec3, dir: Vec2, speed: number, timer: number) {
        this.node.parent = parent;
        this.node.setWorldPosition(worldPos);
        this._isRemove = false;
        this._timer = timer;
        this.RigidBody.linearVelocity = dir.normalize().multiplyScalar(speed);
        this.node.angle = this.GetAngle(dir);
    }

    //将向量转化为angle
    GetAngle(dir: Vec2): number {
        return Math.atan2(dir.y, dir.x) * 180 / Math.PI;
    }

    protected lateUpdate(dt: number): void {
        if (this._isRemove) return;
        this.node.angle = this.GetAngle(this.RigidBody.linearVelocity);
        this._timer -= dt;
        if (this._timer < 0) {
            this._isRemove = true;
            this.scheduleOnce(() => {
                ZDXS_PoolManager.PutNode(this.node);
            })
            // this.node.destroy();
        }
    }

    OnBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
        if (other.group != 1 << 2) {
            if (this._isRemove) return;
            this._isRemove = true;
            // this.scheduleOnce(() => {
            ZDXS_PoolManager.PutNode(this.node);
            // })
        }
    }
}


