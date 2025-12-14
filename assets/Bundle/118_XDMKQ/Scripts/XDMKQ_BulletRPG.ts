import { _decorator, Collider, Component, ICollisionEvent, ITriggerEvent, Node, Quat, RigidBody, Vec3 } from 'cc';
import { XDMKQ_PoolManager } from './XDMKQ_PoolManager';
import { XDMKQ_EnemyController } from './XDMKQ_EnemyController';
import { XDMKQ_AMPLIFICATION, XDMKQ_AUDIO, XDMKQ_SUPPLY, XDMKQ_WEAPON } from './XDMKQ_Constant';
import { XDMKQ_MilitaryVehicleController } from './XDMKQ_MilitaryVehicleController';
import { XDMKQ_PlaneController } from './XDMKQ_PlaneController';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_BulletRPG')
export class XDMKQ_BulletRPG extends Component {

    @property(RigidBody)
    RigidBody: RigidBody = null;

    @property(Collider)
    Collider: Collider = null;

    @property(Node)
    Explode: Node = null;

    private _isRemove: boolean = false;
    private _time: number = 0;

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

    Init(pos: Vec3, v0: Vec3, speed?: number) {
        this.node.setWorldPosition(pos);
        this._isRemove = false;
        this._time = 0;

        const dir = v0.clone().normalize();
        // 生成目标旋转
        const targetRot = new Quat();
        Quat.fromViewUp(targetRot, dir, Vec3.UP); // 让forward朝向dir
        this.node.setRotation(targetRot);

        // 2️⃣ 让刚体向前移动
        const velocity = dir.multiplyScalar(speed);
        this.RigidBody.setLinearVelocity(velocity);
    }

    update(dt: number) {
        if (this._isRemove) return;
        this._time += dt;
        if (this._time > 20) {
            this._isRemove = true;
            this.node.destroy();
            // XDMKQ_PoolManager.PutNode(this.node);
            return;
        }
    }

    onCollisionEnter(event: ICollisionEvent) {
        if (this._isRemove) return;
        this._isRemove = true;

        XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.轰炸);
        this.RigidBody.setLinearVelocity(Vec3.ZERO);
        this.Explode.active = true;
        this.node.children[0].active = false;

        this.scheduleOnce(() => {
            this.Explode.getComponent(Collider).enabled = false;
        })

        const drucation: number = 3.2;
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
            event.otherCollider.node.getComponent(XDMKQ_EnemyController).Hit(XDMKQ_WEAPON.RPG);
        } else if (event.otherCollider.node.name == "军车") {
            event.otherCollider.node.getComponent(XDMKQ_MilitaryVehicleController).Hit(XDMKQ_WEAPON.RPG);
        } else if (event.otherCollider.node.name == "飞机") {
            event.otherCollider.node.getComponent(XDMKQ_PlaneController).Hit(XDMKQ_WEAPON.RPG);
        }
    }
}


