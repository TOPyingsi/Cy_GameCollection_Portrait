import { _decorator, Collider2D, Component, Contact2DType, director, IPhysics2DContact, math, misc, Node, RigidBody2D, v2, Vec2 } from 'cc';
import { ZHSK_EnemyManager } from './ZHSK_EnemyManager';
import { ZHSK_GameManager } from './ZHSK_GameManager';
const { ccclass, property } = _decorator;

@ccclass('ZHSK_EnemyRun')
export class ZHSK_EnemyRun extends Component {

    @property
    moveSpeed: number = 100; // 敌人移动速度
    @property
    Level: number = 0; // 敌人等级
    private _rigidBody: RigidBody2D | null = null;
    private _currentDirection: Vec2 = new Vec2(1, 0); // 当前移动方向

    private _isConstact: boolean = false;
    private _isMove: boolean = true;


    onLoad() {
        // 获取 RigidBody2D 组件
        this._rigidBody = this.getComponent(RigidBody2D);
        // 初始化随机方向
        this.setRandomDirection();
        // 注册碰撞事件
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        }
    }

    update(deltaTime: number) {
        if (!this._isMove) return;
        if (this._rigidBody) {
            // 根据当前方向移动
            const velocity = this._currentDirection.clone().multiplyScalar(this.moveSpeed);
            this._rigidBody.linearVelocity = velocity;
            this.updateRotation();
        }

    }
    updateRotation() {
        let angle = Math.atan2(this._currentDirection.y, this._currentDirection.x);
        let anglerat = misc.radiansToDegrees(angle);
        // this.node.angle = (anglerat > 90 && anglerat <= 180) || (anglerat < -90 && anglerat >= -180) ? 180 - anglerat : anglerat;
        this.node.angle = anglerat - 90; // 设置节点旋转角度
    }

    // 设置随机方向
    setRandomDirection() {
        const angle = Math.random() * Math.PI * 2; // 随机角度（0到2π）
        this._currentDirection = new Vec2(Math.cos(angle), Math.sin(angle)).normalize();
    }

    // 碰撞检测回调
    onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        if (otherCollider.node.name != "Player" && otherCollider.node.name != "Player1" && otherCollider.node.name != "Player2" && otherCollider.node.name != "Player3" && otherCollider.node.name != "Player4" && otherCollider.node.name != "Player5" && otherCollider.node.name != "Player6" && otherCollider.node.name != "Player7" && otherCollider.node.name != "Player8" && otherCollider.node.name != "Player9") {
            // if (this._isConstact) return;
            // this._isConstact = true;

            if (otherCollider.node.getComponent(ZHSK_EnemyRun)?.Level > this.Level) {
                ZHSK_EnemyManager.instance.reomeEnemy(this.node);
            }
            if (otherCollider.node.getComponent(ZHSK_EnemyRun)?.Level == this.Level) {
                function randomInt(min: number, max: number): number {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
                const randomnumber: number = randomInt(0, 1);
                if (randomnumber == 1) {
                    ZHSK_EnemyManager.instance.reomeEnemy(otherCollider.node);
                } else {
                    ZHSK_EnemyManager.instance.reomeEnemy(this.node);
                }

            }
            // if (otherCollider.node.getComponent(ZHSK_EnemyRun)?.Level < this.Level) {
            //     ZHSK_EnemyManager.instance.reomeEnemy(otherCollider.node);
            // }
        }
    }

    Pause() {
        // ZHSK_GameManager.Instance._Puase = true;


        this._isMove = false;
        this._rigidBody.linearVelocity = v2(0, 0);
    }
    protected onEnable(): void {
        director.getScene().on("ZHSK_Pause", this.Pause, this);
        // director.getScene().emit("ZHSK_Pause");
        director.getScene().on("ZHSK_PauseEnd", this.PauseEnd, this);
    }
    PauseEnd() {
        // ZHSK_GameManager.Instance._Puase = false;
        this._isMove = true;
        // this._rigidBody.linearVelocity = v2(1, 0);
    }
}


