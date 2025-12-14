import { _decorator, Collider, Component, Enum, ICollisionEvent, ITriggerEvent, Node, Vec3 } from 'cc';
import { XDMKQ_PoolManager } from './XDMKQ_PoolManager';
import { XDMKQ_EnemyController } from './XDMKQ_EnemyController';
import { XDMKQ_AUDIO, XDMKQ_WEAPON } from './XDMKQ_Constant';
import { XDMKQ_MilitaryVehicleController } from './XDMKQ_MilitaryVehicleController';
import { XDMKQ_PlaneController } from './XDMKQ_PlaneController';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_Bullet_SL')
export class XDMKQ_Bullet_SL extends Component {

    @property({ type: Enum(XDMKQ_WEAPON) })
    Weapon: XDMKQ_WEAPON = XDMKQ_WEAPON.手雷;

    @property(Collider)
    Collider: Collider = null;

    @property
    RotateSpeed: number = 20;

    @property(Node)
    Explode: Node = null;

    private _v0: Vec3 = new Vec3();
    private _g: Vec3 = new Vec3();
    private _isRemove: boolean = false;
    private _speed: number = 0;
    private _time: number = 0;

    private _p0: Vec3 = new Vec3();
    private _p: Vec3 = new Vec3();
    protected onEnable(): void {
        if (this.Collider) {
            this.Collider.on('onCollisionEnter', this.onCollisionEnter, this);
        }

        if (this.Explode) {
            this.Explode.getComponent(Collider).on('onTriggerEnter', this.onTriggerEnter, this);
        }
    }

    protected onDisable(): void {
        if (this.Collider) {
            this.Collider.off('onCollisionEnter', this.onCollisionEnter, this);
        }

        if (this.Explode) {
            this.Explode.getComponent(Collider).off('onTriggerEnter', this.onTriggerEnter, this);
        }
    }

    Init(pos: Vec3, v0: Vec3, g: Vec3, speed?: number) {
        this.node.setWorldPosition(pos);
        this.node.eulerAngles = new Vec3(0, 0, 0);
        this._p0 = pos;
        this._v0 = v0;
        this._g = g;
        this._speed = speed;
        this._isRemove = false;
        this._time = 0;
    }

    update(dt: number) {
        if (this._isRemove) return;
        this._time += dt;
        if (this._time > 10) {
            this._isRemove = true;
            this.node.destroy();
            //XDMKQ_PoolManager.PutNode(this.node);
            return;
        }

        this._p.set(
            this._p0.x + this._v0.x * this._time + 0.5 * this._g.x * this._time * this._time,
            this._p0.y + this._v0.y * this._time + 0.5 * this._g.y * this._time * this._time,
            this._p0.z + this._v0.z * this._time + 0.5 * this._g.z * this._time * this._time
        );
        this.node.setWorldPosition(this._p);

        //旋转
        const angle: Vec3 = this.node.eulerAngles.add3f(this.RotateSpeed * dt, 0, 0);
        if (angle.x > 360) angle.x -= 360;
        this.node.eulerAngles = angle;
    }

    onCollisionEnter(event: ICollisionEvent) {
        if (this._isRemove) return;
        this._isRemove = true;
        this.Explode.active = true;
        this.node.children[0].active = false;

        this.scheduleOnce(() => {
            this.Explode.getComponent(Collider).enabled = this.Weapon != XDMKQ_WEAPON.手雷;
        })
        this.Weapon == XDMKQ_WEAPON.手雷 ? XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.SL) : XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.RSP);
        const drucation: number = this.Weapon == XDMKQ_WEAPON.手雷 ? 2 : 5;
        this.scheduleOnce(() => {
            this.node.children[0].active = true;
            this.Explode.active = false;
            this.Explode.getComponent(Collider).enabled = true;
            this.node.destroy();
            // XDMKQ_PoolManager.PutNode(this.node);
        }, drucation);
    }

    onTriggerEnter(event: ITriggerEvent) {
        // console.error(event.otherCollider.node.name);
        if (event.otherCollider.node.name == "Enemy") {
            event.otherCollider.node.getComponent(XDMKQ_EnemyController).Hit(this.Weapon);
        } else if (event.otherCollider.node.name == "军车") {
            event.otherCollider.node.getComponent(XDMKQ_MilitaryVehicleController).Hit(this.Weapon);
        } else if (event.otherCollider.node.name == "飞机") {
            event.otherCollider.node.getComponent(XDMKQ_PlaneController).Hit(this.Weapon);
        }
    }
}


