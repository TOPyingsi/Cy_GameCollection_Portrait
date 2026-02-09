import { _decorator, Component, Vec3, Animation, director, Node, CircleCollider2D, tween, PhysicsSystem2D, ERaycast2DType, Vec2, RigidBody2D, ERigidBody2DType } from 'cc';
import { WZBPW_GameManager } from './WZBPW_GameManager';
import { WZBPW_AudioManager } from './WZBPW_AudioManager';
const { ccclass, property } = _decorator;

/**
 * 蚊子控制器
 * 处理蚊子的飞行动画、被捕获和被吃掉的逻辑
 * Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3
 */
@ccclass('WZBPW_MosquitoController')
export class WZBPW_MosquitoController extends Component {
    // 是否被捕获
    @property
    public isCaught: boolean = false;

    // 飞行动画组件
    @property(Animation)
    public animation: Animation | null = null;

    // 碰撞体组件
    @property(CircleCollider2D)
    public collider: CircleCollider2D | null = null;

    // 碰撞半径（用于舌头碰撞检测）
    @property
    public collisionRadius: number = 100;

    // 飞向青蛙的速度（像素/秒）
    @property
    public flyToFrogSpeed: number = 800;

    // 是否启用左右移动
    @property
    public enableHorizontalMovement: boolean = false;

    // 水平移动速度（像素/秒）
    @property
    public horizontalSpeed: number = 100;

    // 移动方向（1为右，-1为左）
    private _moveDirection: number = -1;

    // 是否正在移动
    private _isMoving: boolean = false;

    // 原始位置（用于验证位置不变性）
    private _originalPosition: Vec3 = new Vec3();

    // 跟随的舌头节点引用
    private _followingTongue: Node | null = null;

    // 在舌头上的相对位置偏移
    private _tongueOffset: Vec3 = new Vec3();

    onLoad() {
        // 如果没有手动指定动画组件，尝试自动获取
        if (!this.animation) {
            this.animation = this.getComponentInChildren(Animation);
        }

        // 如果没有手动指定碰撞体，尝试自动获取
        if (!this.collider) {
            this.collider = this.getComponent(CircleCollider2D);
        }

        // 记录原始位置
        this._originalPosition.set(this.node.getWorldPosition());
    }

    start() {
        // 开始飞行动画
        this.startFlying();

        // 如果启用水平移动，开始移动
        if (this.enableHorizontalMovement) {
            this.startHorizontalMovement();
        }
    }

    update(dt: number) {
        // 如果启用水平移动且正在移动
        if (this.enableHorizontalMovement && this._isMoving && !this.isCaught) {
            this.updateHorizontalMovement(dt);
        }
    }

    /**
     * 获取原始位置
     */
    public get originalPosition(): Vec3 {
        return this._originalPosition.clone();
    }

    /**
     * 获取当前世界位置
     */
    public get worldPosition(): Vec3 {
        return this.node.getWorldPosition();
    }

    /**
     * 开始飞行动画
     * Requirements: 4.1 - 关卡开始时蚊子显示飞行动画
     */
    public startFlying(): void {
        if (this.animation) {
            // 播放默认动画（飞行动画）
            const defaultClip = this.animation.defaultClip;
            if (defaultClip) {
                this.animation.play(defaultClip.name);
            } else {
                // 如果没有默认动画，尝试播放第一个动画
                const clips = this.animation.clips;
                if (clips && clips.length > 0 && clips[0]) {
                    this.animation.play(clips[0].name);
                }
            }
        }
    }

    /**
     * 停止飞行动画
     */
    public stopFlying(): void {
        if (this.animation) {
            this.animation.stop();
        }
    }

    /**
     * 开始水平移动
     */
    public startHorizontalMovement(): void {
        this._isMoving = true;
        console.log('WZBPW_MosquitoController: Started horizontal movement');
    }

    /**
     * 停止水平移动
     */
    public stopHorizontalMovement(): void {
        this._isMoving = false;
        console.log('WZBPW_MosquitoController: Stopped horizontal movement');
    }

    /**
     * 更新水平移动
     */
    private updateHorizontalMovement(dt: number): void {
        const currentPos = this.node.getWorldPosition();
        const moveDistance = this.horizontalSpeed * dt * this._moveDirection;
        const newX = currentPos.x + moveDistance;

        // 检查是否会碰到墙
        const nextPos = new Vec3(newX, currentPos.y, currentPos.z);
        if (this.checkWallCollision(currentPos, nextPos)) {
            // 碰到墙，转向
            this._moveDirection *= -1;
            
            // 翻转蚊子节点的X轴scale
            const currentScale = this.node.scale;
            this.node.setScale(-currentScale.x, currentScale.y, currentScale.z);
            
            console.log('WZBPW_MosquitoController: Hit wall, reversing direction and flipping scale');
        } else {
            // 没碰到墙，正常移动
            this.node.setWorldPosition(nextPos);
        }
    }

    /**
     * 检查是否会碰到墙
     */
    private checkWallCollision(fromPos: Vec3, toPos: Vec3): boolean {
        try {
            const results = PhysicsSystem2D.instance.raycast(
                new Vec2(fromPos.x, fromPos.y),
                new Vec2(toPos.x, toPos.y),
                ERaycast2DType.All
            );

            if (results && results.length > 0) {
                for (const hit of results) {
                    if (hit.collider && hit.collider.node && hit.collider.node.name.includes('Wall')) {
                        return true;
                    }
                }
            }
        } catch (e) {
            console.warn('WZBPW_MosquitoController: Wall collision check failed:', e);
        }
        return false;
    }

    /**
     * 启用物理重力（TNT爆炸时调用）
     * 需要在编辑器中给蚊子节点添加 RigidBody2D 组件
     */
    public enableGravity(): void {
        // 获取或添加刚体组件
        let rigidBody = this.node.getComponent(RigidBody2D);
        if (!rigidBody) {
            rigidBody = this.node.addComponent(RigidBody2D);
            console.log('WZBPW_MosquitoController: Added RigidBody2D component');
        }
        
        // 设置为动态刚体，启用重力
        rigidBody.type = ERigidBody2DType.Dynamic;
        rigidBody.gravityScale = 5; // 使用默认重力
        
        // 停止飞行动画
        this.stopFlying();
        
        // 停止水平移动
        if (this.enableHorizontalMovement) {
            this.stopHorizontalMovement();
        }

        console.log('WZBPW_MosquitoController: Physics gravity enabled');
    }

    /**
     * 被捕获时调用
     * Requirements: 3.1 - 舌头碰到蚊子时，蚊子附着到舌头上
     * Requirements: 4.3 - 蚊子被捕获后停止飞行动画
     * @param tongueNode 舌头节点（用于跟随）
     * @param hitPosition 碰撞位置
     */
    public onCaught(tongueNode: Node | null, hitPosition: Vec3): void {
        if (this.isCaught) {
            return; // 已经被捕获，忽略
        }

        this.isCaught = true;
        this._followingTongue = tongueNode;

        // 停止飞行动画
        this.stopFlying();

        // 停止水平移动
        if (this.enableHorizontalMovement) {
            this.stopHorizontalMovement();
        }

        // 禁用碰撞体，防止重复碰撞
        if (this.collider) {
            this.collider.enabled = false;
        }

        console.log('WZBPW_MosquitoController: Mosquito caught at', hitPosition);
    }

    /**
     * 飞向青蛙嘴巴
     * @param frogMouthPosition 青蛙嘴巴位置
     * @param onComplete 到达后的回调
     */
    public flyToFrogMouth(frogMouthPosition: Vec3, onComplete: () => void): void {
        if (!this.node || !this.node.isValid) {
            return;
        }

        // 计算距离和飞行时间
        const currentPos = this.node.getWorldPosition();
        const distance = Vec3.distance(currentPos, frogMouthPosition);
        const duration = distance / this.flyToFrogSpeed;

        // 使用 tween 动画飞向青蛙嘴巴
        tween(this.node)
            .to(duration, { 
                worldPosition: frogMouthPosition 
            }, {
                easing: 'sineIn' // 加速飞向青蛙
            })
            .call(() => {
                if (onComplete) {
                    onComplete();
                }
            })
            .start();

        console.log('WZBPW_MosquitoController: Flying to frog mouth, duration:', duration);
    }

    /**
     * 跟随舌头移动
     * Requirements: 3.2 - 被捕获的蚊子跟随舌头回到青蛙嘴里
     * @param tonguePosition 舌头尖端位置（世界坐标）
     */
    public followTongue(tonguePosition: Vec3): void {
        if (!this.isCaught) {
            return;
        }

        // 更新蚊子位置到舌头尖端位置（加上偏移）
        const newPosition = new Vec3(
            tonguePosition.x + this._tongueOffset.x,
            tonguePosition.y + this._tongueOffset.y,
            tonguePosition.z + this._tongueOffset.z
        );

        this.node.setWorldPosition(newPosition);
    }


    /**
     * 被吃掉时调用
     * Requirements: 3.3 - 蚊子到达青蛙嘴里后消失（被吃掉）
     */
    public onEaten(): void {
        console.log('WZBPW_MosquitoController: Mosquito eaten');

        // 播放青蛙叫声
        const audioManager = WZBPW_AudioManager.instance;
        if (audioManager) {
            audioManager.playFrogCall();
        }

        // 通知游戏管理器
        const gameManager = WZBPW_GameManager.instance;
        if (gameManager) {
            gameManager.onMosquitoEaten();
        }

        // 销毁蚊子节点
        this.node.destroy();
    }

    /**
     * 检查点是否在蚊子碰撞范围内
     * @param point 检测点（世界坐标）
     * @returns 是否碰撞
     */
    public checkCollision(point: Vec3): boolean {
        if (this.isCaught) {
            return false; // 已被捕获的蚊子不再检测碰撞
        }

        const mosquitoPos = this.node.getWorldPosition();
        const distance = Vec3.distance(point, mosquitoPos);
        
        // 调试日志：显示距离和碰撞半径
        if (distance < this.collisionRadius * 1.5) {
            console.log(`WZBPW_MosquitoController: Distance to tongue: ${distance.toFixed(2)}, Collision radius: ${this.collisionRadius}, Hit: ${distance <= this.collisionRadius}`);
        }

        return distance <= this.collisionRadius;
    }

    /**
     * 重置蚊子状态（用于关卡重置）
     */
    public reset(): void {
        this.isCaught = false;
        this._followingTongue = null;
        this._tongueOffset.set(0, 0, 0);

        // 恢复原始位置
        this.node.setWorldPosition(this._originalPosition);

        // 启用碰撞体
        if (this.collider) {
            this.collider.enabled = true;
        }

        // 重新开始飞行动画
        this.startFlying();

        // 如果启用水平移动，重新开始移动
        if (this.enableHorizontalMovement) {
            this.startHorizontalMovement();
        }
    }
}
