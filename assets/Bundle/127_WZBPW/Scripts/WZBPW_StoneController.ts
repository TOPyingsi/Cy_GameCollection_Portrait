import { _decorator, Component, Vec3, CircleCollider2D, RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 石头控制器
 * 处理石头被舌头击中后的推动行为
 * 使用物理引擎的力来推动石头，石头会受重力影响并滚动
 */
@ccclass('WZBPW_StoneController')
export class WZBPW_StoneController extends Component {
    // 被推动的力度（冲量）
    @property
    public pushForce: number = 500;

    // 是否施加旋转力（让石头滚动）
    @property
    public applyRotation: boolean = true;

    // 旋转力度系数
    @property
    public rotationFactor: number = 0.5;

    // 碰撞体组件
    private _collider: CircleCollider2D | null = null;

    // 刚体组件
    private _rigidBody: RigidBody2D | null = null;

    onLoad() {
        // 获取碰撞体组件（优先使用圆形碰撞体）
        this._collider = this.node.getComponent(CircleCollider2D);
        if (!this._collider) {
            console.warn('WZBPW_StoneController: CircleCollider2D component not found, stone may not roll properly');
        }

        // 获取刚体组件
        this._rigidBody = this.node.getComponent(RigidBody2D);
        if (!this._rigidBody) {
            console.warn('WZBPW_StoneController: RigidBody2D component not found');
        }
    }

    /**
     * 被舌头击中时调用
     * @param frogPosition 青蛙位置
     */
    public onTongueHit(frogPosition: Vec3): void {
        if (!this._rigidBody) {
            console.warn('WZBPW_StoneController: RigidBody2D not found, cannot apply force');
            return;
        }

        console.log('WZBPW_StoneController: Stone hit by tongue, applying push force away from frog');

        // 计算推离青蛙的方向（与箱子相反）
        const direction = new Vec3();
        Vec3.subtract(direction, this.node.worldPosition, frogPosition);
        direction.normalize();

        // 应用冲量（impulse）推离青蛙
        const impulse = new Vec2(
            direction.x * this.pushForce,
            direction.y * this.pushForce
        );

        this._rigidBody.applyLinearImpulseToCenter(impulse, true);

        // 如果启用旋转，施加角冲量让石头滚动
        if (this.applyRotation) {
            // 根据推力方向计算旋转方向
            // 向右推 -> 顺时针旋转（负角速度）
            // 向左推 -> 逆时针旋转（正角速度）
            const angularImpulse = -direction.x * this.pushForce * this.rotationFactor;
            this._rigidBody.applyAngularImpulse(angularImpulse, true);
            
            console.log('WZBPW_StoneController: Applied angular impulse', angularImpulse, 'for rolling effect');
        }

        console.log('WZBPW_StoneController: Applied impulse', impulse, 'to stone');
    }

    /**
     * 从指定位置推开
     * @param fromPos 推动来源位置
     */
    public pushAway(fromPos: Vec3): void {
        if (!this._rigidBody) {
            console.warn('WZBPW_StoneController: RigidBody2D not found, cannot apply force');
            return;
        }

        // 计算推离方向
        const direction = new Vec3();
        Vec3.subtract(direction, this.node.worldPosition, fromPos);
        const distance = direction.length();

        // 如果距离太小，不移动
        if (distance < 0.1) {
            console.log('WZBPW_StoneController: Source too close, not applying force');
            return;
        }

        direction.normalize();

        // 应用冲量
        const impulse = new Vec2(
            direction.x * this.pushForce,
            direction.y * this.pushForce
        );

        this._rigidBody.applyLinearImpulseToCenter(impulse, true);

        // 如果启用旋转，施加角冲量
        if (this.applyRotation) {
            const angularImpulse = -direction.x * this.pushForce * this.rotationFactor;
            this._rigidBody.applyAngularImpulse(angularImpulse, true);
        }

        console.log('WZBPW_StoneController: Applied impulse away from', fromPos);
    }

    /**
     * 停止移动（清除速度和角速度）
     */
    public stopMoving(): void {
        if (this._rigidBody) {
            this._rigidBody.linearVelocity = new Vec2(0, 0);
            this._rigidBody.angularVelocity = 0;
            console.log('WZBPW_StoneController: Stopped moving and rotating');
        }
    }

    /**
     * 是否正在移动
     */
    public get isMoving(): boolean {
        if (!this._rigidBody) {
            return false;
        }
        // 检查刚体是否有速度或角速度
        const velocity = this._rigidBody.linearVelocity;
        const angularVelocity = this._rigidBody.angularVelocity;
        return velocity.length() > 0.1 || Math.abs(angularVelocity) > 0.1;
    }
}
