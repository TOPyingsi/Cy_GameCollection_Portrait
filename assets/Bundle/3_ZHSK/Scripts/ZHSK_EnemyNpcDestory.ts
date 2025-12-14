import { _decorator, Collider2D, Component, Contact2DType, director, IPhysics2DContact, Node, RigidBody2D, v2, Vec2 } from 'cc';
import { ZHSK_EnemyRun } from './ZHSK_EnemyRun';
const { ccclass, property } = _decorator;

@ccclass('ZHSK_EnemyNpcDestory')
export class ZHSK_EnemyNpcDestory extends Component {
    @property
    Level: number = 0; // 自己等级
    private _rigidBody: RigidBody2D | null = null;
    private _dir: Vec2 = new Vec2();
    onLoad() {
        this._rigidBody = this.getComponent(RigidBody2D);
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        }

        director.getScene().on("ZHSK_Move", this.onMove, this);
    }
    start() {

    }

    onMove(angle: number) {
        this.scheduleOnce(() => {
            this.node.angle = angle;

        }, 0.1);//间隔一秒执行一次

    }

    update(deltaTime: number) {
        // this._rigidBody.linearVelocity = v2(this._dir)
    }
    onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.node.name == "Enemy" || otherCollider.node.name == "Enemy1" || otherCollider.node.name == "Enemy2" || otherCollider.node.name == "Enemy3" || otherCollider.node.name == "Enemy4" || otherCollider.node.name == "Enemy5" || otherCollider.node.name == "Enemy6" || otherCollider.node.name == "Enemy7" || otherCollider.node.name == "Enemy8" || otherCollider.node.name == "Enemy9") {
            if (otherCollider.node.getComponent(ZHSK_EnemyRun).Level > this.Level) {
                this.scheduleOnce(() => {
                    this.node.destroy();
                });

            }
        }

    }
}


