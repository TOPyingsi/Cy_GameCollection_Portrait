import { _decorator, Collider2D, Component, Contact2DType, DistanceJoint2D, EventTouch, find, FixedJoint2D, IPhysics2DContact, Joint2D, Node, RigidBody, RigidBody2D, sp, v2, v3, Vec2, Vec3 } from 'cc';
import { ZDXS_Attracted } from './ZDXS_Attracted';
import { ZDXS_GameManager } from './ZDXS_GameManager';
import { THLCB_UIBase } from '../../89_THLCB/Scripts/THLCB_UIBase';
import { ZDXS_EventManager, ZDXS_MyEvent } from './ZDXS_EventManager';
import { ZDXS_AudioManager } from './ZDXS_AudioManager';
import { ZDXS_AUDIO } from './ZDXS_Constant';
const { ccclass, property } = _decorator;

export enum ZDXS_ENEMY_SPIN {
    Idle = "daiji",
    Happly = "gaoxin",
    Fear = "haipa"
}

@ccclass('ZDXS_EnemyController')
export class ZDXS_EnemyController extends ZDXS_Attracted {

    @property(Node)
    Hand: Node = null;

    @property
    HitForce: number = 100;

    @property
    DieForce: number = 60;

    EnemyRigidBody: RigidBody2D = null;
    EnemyCollider: Collider2D = null;
    BodyRigidBodys: RigidBody2D[] = [];
    BodyPart: Node = null;
    BodyPartRigidBody: RigidBody2D = null;

    IsDide: boolean = false;

    Spine: sp.Skeleton = null;
    private _ani: string = "";
    private _cb: Function = null;

    private _isAttracted: boolean = false;
    private _targetPos: Vec3 = new Vec3();
    private _fixedJoint: FixedJoint2D = null;
    private _first: boolean = true;

    protected onLoad(): void {
        super.onLoad();
        this.EnemyRigidBody = this.getComponent(RigidBody2D);
        this.BodyPart = find("Body", this.node);
        this.BodyPartRigidBody = find("Body", this.node).getComponent(RigidBody2D);
        this.Spine = this.getComponent(sp.Skeleton);

        this.node.children.forEach(e => {
            if (e.getComponent(RigidBody2D)) {
                this.BodyRigidBodys.push(e.getComponent(RigidBody2D));
                e.getComponent(Collider2D).on(Contact2DType.BEGIN_CONTACT, this.OnBeginContact_Body, this);
                e.active = false;
            }
        })

        this.EnemyCollider = this.getComponent(Collider2D);
        this.EnemyCollider.on(Contact2DType.BEGIN_CONTACT, this.OnBeginContact_Enemy, this);
        this.EnemyCollider.on(Contact2DType.POST_SOLVE, this.OnPostSolveContact_Enemy, this);
        this.PlaySpin(ZDXS_ENEMY_SPIN.Idle);
        this.node.name = "Enemy";

        ZDXS_EventManager.On(ZDXS_MyEvent.ZDXS_PLAYER_FAIL_SHOW, this.FailAni, this);

    }

    protected start(): void {
        ZDXS_GameManager.Instance.EnemyCount++;
        ZDXS_GameManager.Instance.Explosions.push(this.node);
    }

    protected onDisable(): void {
        this.node.children.forEach(e => {
            if (e.getComponent(RigidBody2D)) {
                e.getComponent(Collider2D).off(Contact2DType.BEGIN_CONTACT, this.OnBeginContact_Body, this);
            }
        })

        this.EnemyCollider.off(Contact2DType.BEGIN_CONTACT, this.OnBeginContact_Enemy, this);
        this.EnemyCollider.off(Contact2DType.POST_SOLVE, this.OnPostSolveContact_Enemy, this);
        ZDXS_EventManager.Off(ZDXS_MyEvent.ZDXS_PLAYER_FAIL_SHOW, this.FailAni, this);
    }

    Die() {
        this.scheduleOnce(() => {
            if (this.IsDide) return;
            this.IsDide = true;
            ZDXS_AudioManager.Instance.Play(ZDXS_AUDIO.敌人死亡);
            if (this.node.scale.x == -1) this.node.scale = v3(1, 1, 1);
            ZDXS_GameManager.Instance.RemoveEnemy();
            this.Spine.enabled = false;
            // this.EnemyCollider.sensor = true;
            // this.EnemyCollider.apply();
            this.EnemyRigidBody.enabled = false;
            this.BodyRigidBodys.forEach(e => {
                e.node.active = true;
            })
        });
    }

    FailAni() {
        if (this.Spine.enabled == true) {
            this.PlaySpin(ZDXS_ENEMY_SPIN.Happly, true);
        }
    }

    Attract(target: RigidBody2D): ZDXS_Attracted {
        this.Die();
        this.FixedJoint = this.BodyPart.addComponent(FixedJoint2D);
        this.FixedJoint.connectedBody = target;
        this.FixedJoint.frequency = 0.2;
        this.FixedJoint.apply();
        return this;
        // super.Attract(target);
        // return this;
    }

    Send(dir: Vec2, force: number) {
        this.Release();
        this.BodyPartRigidBody.applyForceToCenter(dir.normalize().multiplyScalar(force), true);
    }

    Explosion(dir: Vec2, force: number) {
        this.Die();
        this.scheduleOnce(() => {
            this.Send(dir, force);
            this.scheduleOnce(() => {
                this.BodyRigidBodys.forEach(e => {
                    if (e.getComponent(Joint2D)) {
                        e.getComponent(Joint2D).enabled = false;
                    }
                })
            })

        })
    }

    //释放
    // Release() {
    //     if (!this._fixedJoint) return;
    //     this._fixedJoint.enabled = false;
    //     this._fixedJoint.apply();
    // }

    // Attract(target: RigidBody2D): RigidBody2D {
    //     this.Die();
    //     return this.BodyPartRigidBody;
    // }

    OnBeginContact_Enemy(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
        if (other.group == 1 << 1) {
            contact.disabled = true;
            this.Die();
        }
    }

    OnPostSolveContact_Enemy(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
        const impulse = contact.getImpulse();
        if (impulse) {
            // 法线方向的冲击力（数组，第0个元素通常就够用了）
            let normalImpulse = impulse.normalImpulses[0];

            // console.log('冲击强度:', normalImpulse);
            // 如果冲击太大 → 角色死亡
            if (normalImpulse > this.DieForce) {
                // this.node.destroy();
                if (!this._first) {
                    this.Die();
                }
                this._first = false;
            }
        }
    }


    OnBeginContact_Body(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
        if (other.group == 1 << 1) {
            if (self.node.getComponent(Joint2D) && self.node.getComponent(Joint2D).enabled) self.node.getComponent(Joint2D).enabled = false;
            contact.disabled = true;
            this.OnHit(other, self);
        }
    }


    OnHit(bullet: Collider2D, body: Collider2D) {
        // 拿到被击中的刚体
        let enemyRb = body.getComponent(RigidBody2D);
        let bulletRb = bullet.getComponent(RigidBody2D);
        if (!enemyRb || !bulletRb) return;

        // 子弹的速度方向作为击飞方向
        let v = bulletRb.linearVelocity.clone();
        v.normalize();

        // 施加冲击力（瞬间击飞）
        let impulse = new Vec2(v.x * this.HitForce, v.y * this.HitForce);
        let content = new Vec2();
        enemyRb.getWorldCenter(content);
        enemyRb.applyLinearImpulse(impulse, content, true);
        // 如果子弹是一次性 → 可以销毁；如果是贯穿 → 保持飞行
        // this.node.destroy();
    }

    PlaySpin(ani: string, loop: boolean = false, cb?: Function) {
        if (this._ani == ani) return;
        this._ani = ani;
        this._cb = cb;
        this.Spine.setAnimation(0, ani, loop);
        // this.Skeleton.
    }

}


