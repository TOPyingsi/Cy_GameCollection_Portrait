import { _decorator, Component, Vec3, BoxCollider2D, RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 箱子控制器
 * 处理箱子被舌头击中后的拉动行为
 * 使用物理引擎的力来拉动箱子，箱子会受重力影响
 */
@ccclass('WZBPW_BoxController')
export class WZBPW_BoxController extends Component {
    // 被拉动的力度（冲量）
    @property
    public pullForce: number = 500;

    // 碰撞体组件
    private _collider: BoxCollider2D | null = null;

    // 刚体组件
    private _rigidBody: RigidBody2D | null = null;

    onLoad() {
        // 获取碰撞体组件
        this._collider = this.node.getComponent(BoxCollider2D);
        if (!this._collider) {
            console.warn('WZBPW_BoxController: BoxCollider2D component not found');
        }

        // 获取刚体组件
        this._rigidBody = this.node.getComponent(RigidBody2D);
        if (!this._rigidBody) {
            console.warn('WZBPW_BoxController: RigidBody2D component not found');
        }
    }

    /**
     * 被舌头击中时调用
     * @param frogPosition 青蛙位置
     */
    public onTongueHit(frogPosition: Vec3): void {
        if (!this._rigidBody) {
            console.warn('WZBPW_BoxController: RigidBody2D not found, cannot apply force');
            return;
        }

        console.log('WZBPW_BoxController: Box hit by tongue, applying pull force toward frog');

        // 计算拉向青蛙的方向
        const direction = new Vec3();
        Vec3.subtract(direction, frogPosition, this.node.worldPosition);
        direction.normalize();

        // 应用冲量（impulse）拉向青蛙
        // 使用冲量而不是持续的力，这样箱子会被"拉一下"然后受重力影响下落
        const impulse = new Vec2(
            direction.x * this.pullForce,
            direction.y * this.pullForce
        );

        this._rigidBody.applyLinearImpulseToCenter(impulse, true);

        console.log('WZBPW_BoxController: Applied impulse', impulse, 'to box');
    }

    /**
     * 向目标位置拉动
     * @param targetPos 目标位置
     */
    public pullToward(targetPos: Vec3): void {
        if (!this._rigidBody) {
            console.warn('WZBPW_BoxController: RigidBody2D not found, cannot apply force');
            return;
        }

        // 计算方向
        const direction = new Vec3();
        Vec3.subtract(direction, targetPos, this.node.worldPosition);
        const distance = direction.length();

        // 如果距离太小，不移动
        // if (distance < 0.1) {
        //     console.log('WZBPW_BoxController: Target too close, not applying force');
        //     return;
        // }

        direction.normalize();

        // 应用冲量
        const impulse = new Vec2(
            direction.x * this.pullForce,
            direction.y * this.pullForce
        );

        this._rigidBody.applyLinearImpulseToCenter(impulse, true);

        console.log('WZBPW_BoxController: Applied impulse toward', targetPos);
    }

    /**
     * 停止移动（清除速度）
     */
    public stopMoving(): void {
        if (this._rigidBody) {
            this._rigidBody.linearVelocity = new Vec2(0, 0);
            console.log('WZBPW_BoxController: Stopped moving (cleared velocity)');
        }
    }

    /**
     * 是否正在移动
     */
    public get isMoving(): boolean {
        if (!this._rigidBody) {
            return false;
        }
        // 检查刚体是否有速度
        const velocity = this._rigidBody.linearVelocity;
        return velocity.length() > 0.1;
    }
}
