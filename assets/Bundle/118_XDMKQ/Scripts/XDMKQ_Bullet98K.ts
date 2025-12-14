import { _decorator, Collider, Component, ICollisionEvent, Node, Quat, RigidBody, Vec3 } from 'cc';
import { XDMKQ_PoolManager } from './XDMKQ_PoolManager';
import { XDMKQ_CameraController } from './XDMKQ_CameraController';
import { XDMKQ_EnemyController } from './XDMKQ_EnemyController';
import { XDMKQ_PlayerController } from './XDMKQ_PlayerController';
import { XDMKQ_BulletManager } from './XDMKQ_BulletManager';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_AMPLIFICATION, XDMKQ_AUDIO, XDMKQ_SUPPLY, XDMKQ_WEAPON } from './XDMKQ_Constant';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_Bullet98K')
export class XDMKQ_Bullet98K extends Component {

    @property(RigidBody)
    RigidBody: RigidBody = null;

    @property(Collider)
    Collider: Collider = null;

    @property(Node)
    CameraNode: Node = null;

    private _isRemove: boolean = false;
    private _speed: number = 10;
    private _targetPos: Vec3 = new Vec3();
    private _dir: Vec3 = new Vec3();
    private _tempPos: Vec3 = new Vec3();
    private v_0: Vec3 = new Vec3();
    private v_1: Vec3 = new Vec3();
    // protected onEnable(): void {
    //     if (this.Collider) {
    //         this.Collider.on('onCollisionEnter', this.onCollisionEnter, this);
    //     }
    // }

    // protected onDisable(): void {
    //     if (this.Collider) {
    //         this.Collider.off('onCollisionEnter', this.onCollisionEnter, this);
    //     }
    // }

    Init(pos: Vec3, targetPos: Vec3, speed?: number) {
        this.node.setWorldPosition(pos);
        this._isRemove = false;

        this._dir = targetPos.clone().subtract(pos).normalize();
        // 生成目标旋转
        const targetRot = new Quat();
        Quat.fromViewUp(targetRot, this._dir, Vec3.UP); // 让forward朝向dir
        this.node.setRotation(targetRot);

        this._speed = speed || this._speed;
        this._targetPos = targetPos;
        this._dir;

        // 2️⃣ 让刚体向前移动
        // const velocity = dir.multiplyScalar(speed);
        // this.RigidBody.setLinearVelocity(velocity);
        XDMKQ_CameraController.Instance.TraceTarget(this.node, this.CameraNode.getWorldPosition(), this.CameraNode.eulerAngles);
        XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.FIre_98K);
    }


    protected update(dt: number): void {
        if (this._isRemove) return;

        this._dir = this._targetPos.clone().subtract(this.node.worldPosition).normalize();
        this.v_0 = this.node.worldPosition;
        this.v_1 = this.node.worldPosition.add(this._dir.clone().multiplyScalar(this._speed * dt));

        Vec3.lerp(this._tempPos, this.v_0, this.v_1, dt);
        if (Vec3.distance(this._tempPos, this._targetPos) < 0.3) {
            this._isRemove = true;
            XDMKQ_PlayerController.Instance.TargetEnemy.Hit(XDMKQ_WEAPON.步枪);
            XDMKQ_BulletManager.Instance.CreateHitEffect(this.node.worldPosition.clone());
            XDMKQ_CameraController.Instance.ReCover();
            this.node.destroy();
            //XDMKQ_PoolManager.PutNode(this.node);
        }
        this.node.setWorldPosition(this._tempPos);

    }

    // Init(pos: Vec3, v0: Vec3, speed?: number) {
    //     this.node.setWorldPosition(pos);
    //     this._isRemove = false;

    //     const dir = v0.clone().normalize();
    //     // 生成目标旋转
    //     const targetRot = new Quat();
    //     Quat.fromViewUp(targetRot, dir, Vec3.UP); // 让forward朝向dir
    //     this.node.setRotation(targetRot);

    //     // 2️⃣ 让刚体向前移动
    //     const velocity = dir.multiplyScalar(speed);
    //     this.RigidBody.setLinearVelocity(velocity);
    //     XDMKQ_CameraController.Instance.TraceTarget(this.node, this.CameraNode.getWorldPosition(), this.CameraNode.eulerAngles);
    // }

    // onCollisionEnter(event: ICollisionEvent) {
    //     console.error(this._isRemove, event.otherCollider.node.name);
    //     if (this._isRemove) return;
    //     this._isRemove = true;
    //     if (event.otherCollider.getGroup() == 1 << 1) {
    //         const enemy: XDMKQ_EnemyController = XDMKQ_PlayerController.Instance.GetEnemyController(event.otherCollider.node);
    //         if (enemy) {
    //             enemy.Hit(XDMKQ_PlayerController.Instance.CurWeapon);
    //             XDMKQ_BulletManager.Instance.CreateHitEffect(this.node.worldPosition.clone());
    //         }
    //     }
    //     XDMKQ_CameraController.Instance.ReCover();
    //     XDMKQ_PoolManager.PutNode(this.node);
    // }
}


