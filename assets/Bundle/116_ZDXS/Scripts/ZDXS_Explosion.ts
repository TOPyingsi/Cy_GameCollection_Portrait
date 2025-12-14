import { _decorator, Collider2D, Component, Contact2DType, find, FixedJoint2D, IPhysics2DContact, Node, RigidBody2D, sp, Sprite, v2, Vec2, Vec3 } from 'cc';
import { ZDXS_GameManager } from './ZDXS_GameManager';
import { ZDXS_EnemyController } from './ZDXS_EnemyController';
import { ZDXS_Attracted } from './ZDXS_Attracted';
import { ZDXS_BoxController } from './ZDXS_BoxController';
import { ZDXS_AudioManager } from './ZDXS_AudioManager';
import { ZDXS_AUDIO } from './ZDXS_Constant';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_Explosion')
export class ZDXS_Explosion extends ZDXS_Attracted {

    @property
    public ExplosionRadius: number = 300; // 爆炸半径

    @property
    public ExplosionForce: number = 1000; // 爆炸力度

    @property
    MinImpulse: number = 2000;

    Collider: Collider2D = null;
    Spine: sp.Skeleton = null;
    protected onLoad(): void {
        super.onLoad();
        this.Collider = this.getComponent(Collider2D);
        this.Spine = find("爆炸", this.node).getComponent(sp.Skeleton);
        this.Spine.setCompleteListener(() => this.RemoveSelf());
        this.Collider.on(Contact2DType.POST_SOLVE, this.OnPostSolveContact, this);
    }

    protected start(): void {
        ZDXS_GameManager.Instance.Explosions.push(this.node);
    }


    OnPostSolveContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
        const impulse = contact.getImpulse();
        if (impulse) {
            // 法线方向的冲击力（数组，第0个元素通常就够用了）
            let normalImpulse = impulse.normalImpulses[0];
            // console.log(this.node.name, ' ----冲击强度:', normalImpulse);

            // 如果冲击太大 → 角色死亡
            if (normalImpulse > this.MinImpulse) {
                this.Blast();
                // this.node.destroy();
            }
        }
    }

    Blast() {
        this.scheduleOnce(() => {
            ZDXS_AudioManager.Instance.Play(ZDXS_AUDIO.爆炸);
            this.getComponent(Sprite).enabled = false;
            this.RigidBody.enabled = false;
            this.Spine.node.active = true;
            this.Spine.setAnimation(0, "animation", false);
            // this.EnemyRigidBody.enabled = false;

            // 触发爆炸后，你可以通过碰撞区域推力
            this.TriggerExplosion();
        });
    }

    RemoveSelf() {
        if (ZDXS_GameManager.Instance.Explosions.indexOf(this.node) != -1) ZDXS_GameManager.Instance.Explosions.splice(ZDXS_GameManager.Instance.Explosions.indexOf(this.node), 1);
        this.node.destroy();
    }


    public TriggerExplosion() {
        const nodesInRange = this.getNodesInExplosionRange();

        // 对范围内的每个物体施加力
        nodesInRange.forEach(node => {
            const direction = node.worldPosition.subtract(this.node.worldPosition).normalize();

            if (node.name == "Enemy") {
                node.getComponent(ZDXS_EnemyController).Explosion(v2(direction.x, direction.y), this.ExplosionForce);
            } else if (node.name == "木板") {
                node.getComponent(ZDXS_BoxController).Blast();
            } else {
                const rigidBody = node.getComponent(RigidBody2D);
                if (rigidBody) {
                    rigidBody.applyForce(new Vec2(direction.x * this.ExplosionForce, direction.y * this.ExplosionForce), Vec2.ZERO, true);
                }
            }
        });

    }

    private getNodesInExplosionRange() {
        // 这里可以通过遍历场景内所有节点并检查距离来实现
        const allNodes = ZDXS_GameManager.Instance.Explosions; // 获取所有可能被爆炸影响的节点
        return allNodes.filter(node => Vec3.distance(node.worldPosition, this.node.worldPosition) < this.ExplosionRadius && node != this.node);
    }


    // Attract(target: RigidBody2D): ZDXS_Attracted {
    //     this._fixedJoint = this.node.addComponent(FixedJoint2D);
    //     this._fixedJoint.connectedBody = target;
    //     this._fixedJoint.frequency = 0.2;
    //     this._fixedJoint.apply();
    //     return this;
    // }

    // Send(dir: Vec2, force: number) {
    //     this.Release();
    //     this.RigidBody.applyForceToCenter(dir.normalize().multiplyScalar(force), true);
    // }

    //释放
    // Release() {
    //     this._fixedJoint.enabled = false;
    //     this._fixedJoint.apply();
    // }

}


