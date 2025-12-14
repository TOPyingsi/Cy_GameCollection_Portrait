import { _decorator, Collider2D, Component, Contact2DType, find, IPhysics2DContact, Node, RigidBody2D, sp, v2, Vec2, Vec3 } from 'cc';
import { ZDXS_PoolManager } from './ZDXS_PoolManager';
import { ZDXS_EnemyController } from './ZDXS_EnemyController';
import { ZDXS_GameManager } from './ZDXS_GameManager';
import { ZDXS_BoxController } from './ZDXS_BoxController';
import { ZDXS_AudioManager } from './ZDXS_AudioManager';
import { ZDXS_AUDIO } from './ZDXS_Constant';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_BulletGrenade')
export class ZDXS_BulletGrenade extends Component {

    @property
    public ExplosionRadius: number = 300; // 爆炸半径

    @property
    public ExplosionForce: number = 1000; // 爆炸力度

    @property
    MinImpulse: number = 2000;

    RigidBody: RigidBody2D = null;
    Collider: Collider2D = null;
    Icon: Node = null;
    Spine: sp.Skeleton = null;

    private _isRemove: boolean = false;

    private _elapsed = 0;
    private _startPos: Vec3 = new Vec3();
    private _moveDir: Vec2 = new Vec2();
    private _g: number = 0;

    protected onLoad(): void {
        this.RigidBody = this.getComponent(RigidBody2D);
        this.Collider = this.getComponent(Collider2D);
        this.Icon = find("Icon", this.node);
        this.Spine = find("爆炸", this.node).getComponent(sp.Skeleton);
        this.Spine.setCompleteListener(() => this.RemoveSelf());

        if (this.Collider) {
            this.Collider.on(Contact2DType.BEGIN_CONTACT, this.OnBeginContact, this);
        }
    }

    RemoveSelf() {
        ZDXS_PoolManager.PutNode(this.node);
    }

    InitGrenade(parent: Node, worldPos: Vec3, dir: Vec2, g: number) {
        this.node.parent = parent;
        this.node.setWorldPosition(worldPos.clone());
        this._isRemove = false;

        this._startPos = worldPos.clone();
        this._moveDir = dir;
        this._g = g;
        this._elapsed = 0;
        this.Icon.active = true;
        this.Spine.node.active = false;
        this.RigidBody.enabled = true;
    }


    protected update(dt: number): void {
        if (this._isRemove) return;
        this._elapsed += dt * 10;
        const x = this._startPos.x + this._moveDir.x * this._elapsed;
        const y = this._startPos.y + this._moveDir.y * this._elapsed - 0.5 * this._g * this._elapsed * this._elapsed;
        this.node.setWorldPosition(x, y, 0);
    }

    Blast() {
        this.scheduleOnce(() => {
            ZDXS_AudioManager.Instance.Play(ZDXS_AUDIO.爆炸);
            this.Icon.active = false;
            this.RigidBody.enabled = false;
            this.Spine.node.active = true;
            this.Spine.setAnimation(0, "animation", false);
            // this.EnemyRigidBody.enabled = false;

            // 触发爆炸后，你可以通过碰撞区域推力
            this.TriggerExplosion();
        });
    }

    public TriggerExplosion() {
        const nodesInRange = this.getNodesInExplosionRange();

        // 对范围内的每个物体施加力
        nodesInRange.forEach(node => {
            const direction = node.worldPosition.subtract(this.node.worldPosition).normalize();
            // console.error(node.name);
            if (node.name == "Enemy") {
                node.getComponent(ZDXS_EnemyController).Explosion(v2(direction.x, direction.y), this.ExplosionForce)
            } else if (node.name == "木板") {
                node.getComponent(ZDXS_BoxController).Blast();
            }
            else if (node.name == "Box" && node.getComponent(ZDXS_BoxController).HaveHope) {
                node.getComponent(ZDXS_BoxController).Blast();
            }
            else {
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
        allNodes.forEach(node => {
            console.error(node.name);
        });
        return allNodes.filter(node => Vec3.distance(node.worldPosition, this.node.worldPosition) < this.ExplosionRadius && node != this.node);
    }


    OnBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
        if (this._isRemove) return;
        this._isRemove = true;
        this.Blast();
        // ZDXS_PoolManager.PutNode(this.node);
    }

}


