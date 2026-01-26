import { _decorator, Component, Vec3, Graphics, EventTouch, input, Input, UITransform, Color, Camera, Vec2, EventMouse, director, PhysicsSystem2D, ERaycast2DType } from 'cc';
import { WZBPW_GameManager, GameState } from './WZBPW_GameManager';
import { WZBPW_TongueController } from './WZBPW_TongueController';
import { WZBPW_UIManager } from './WZBPW_UIManager';
import { WZBPW_LaserAimer } from './WZBPW_LaserAimer';
const { ccclass, property } = _decorator;

/**
 * 青蛙控制器
 * 处理瞄准线绘制和触摸事件
 */
@ccclass('WZBPW_FrogController')
export class WZBPW_FrogController extends Component {
    // 嘴巴位置偏移（相对于青蛙节点）
    @property(Vec3)
    public mouthOffset: Vec3 = new Vec3(0, 50, 0);

    // 瞄准线绘制组件
    @property(Graphics)
    public aimLineGraphics: Graphics | null = null;

    // 主摄像机（用于坐标转换）
    @property(Camera)
    public mainCamera: Camera | null = null;

    // 瞄准线颜色
    @property(Color)
    public aimLineColor: Color = new Color(255, 0, 0, 200);

    // 瞄准线宽度
    @property
    public aimLineWidth: number = 4;

    // 舌头最大长度（用于计算瞄准线终点）
    @property
    public maxTongueLength: number = 1000;

    // 激光瞄准器最大长度
    @property
    public laserAimerMaxLength: number = 1000;

    // 舌头控制器引用
    @property(WZBPW_TongueController)
    public tongueController: WZBPW_TongueController | null = null;

    // 激光瞄准器引用（可选，运行时动态查找）
    private _laserAimer: WZBPW_LaserAimer | null = null;

    // 激光瞄准器是否激活
    private _laserAimerActive: boolean = false;

    // 是否正在瞄准
    private _isAiming: boolean = false;

    // 当前瞄准方向
    private _aimDirection: Vec3 = new Vec3();

    // 当前触摸位置（世界坐标）
    private _touchWorldPos: Vec3 = new Vec3();
    
    // 最后一次触摸的屏幕坐标
    private _lastTouchScreenPos: Vec2 | null = null;
    
    // 最后一次鼠标事件
    private _lastMouseEvent: EventMouse | null = null;

    /**
     * 获取嘴巴的世界坐标位置
     */
    public get mouthPosition(): Vec3 {
        const worldPos = this.node.getWorldPosition();
        return new Vec3(
            worldPos.x + this.mouthOffset.x,
            worldPos.y + this.mouthOffset.y,
            worldPos.z + this.mouthOffset.z
        );
    }

    /**
     * 获取当前瞄准方向
     */
    public get aimDirection(): Vec3 {
        return this._aimDirection.clone();
    }

    /**
     * 是否正在瞄准
     */
    public get isAiming(): boolean {
        return this._isAiming;
    }

    onLoad() {
        // 如果没有指定摄像机，尝试查找主摄像机
        if (!this.mainCamera) {
            const cameraNode = this.node.scene.getChildByName('Main Camera');
            if (cameraNode) {
                this.mainCamera = cameraNode.getComponent(Camera);
            }
        }

        // 注册触摸事件
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        
        // 注册鼠标事件（用于实时跟踪鼠标位置）
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    onDestroy() {
        // 注销触摸事件
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        
        // 注销鼠标事件
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    /**
     * 每帧更新
     */
    update(dt: number): void {
        // 如果正在瞄准且有最后鼠标事件，持续更新瞄准线
        if (this._isAiming && this._lastMouseEvent) {
            // 使用最后的鼠标位置更新瞄准线
            const mousePos = this._lastMouseEvent.getUILocation();
            this.updateTouchPositionFromScreen(mousePos);
            this.drawAimLine();
        }
    }

    /**
     * 鼠标移动事件
     */
    private onMouseMove(event: EventMouse): void {
        // 保存最后的鼠标事件
        this._lastMouseEvent = event;
    }

    /**
     * 触摸开始事件
     */
    private onTouchStart(event: EventTouch): void {
        const gameManager = WZBPW_GameManager.instance;
        
        // 检查是否可以开始瞄准
        if (!gameManager || !gameManager.canStartAiming()) {
            return;
        }

        this._isAiming = true;
        gameManager.gameState = GameState.AIMING;

        // 保存触摸位置
        this._lastTouchScreenPos = event.getUILocation();

        // 更新触摸位置并绘制瞄准线
        this.updateTouchPosition(event);
        this.drawAimLine();
    }

    /**
     * 触摸移动事件
     */
    private onTouchMove(event: EventTouch): void {
        if (!this._isAiming) {
            return;
        }
        
        // 保存触摸位置
        this._lastTouchScreenPos = event.getUILocation();

        // 更新触摸位置并重绘瞄准线
        this.updateTouchPosition(event);
        this.drawAimLine();
    }

    /**
     * 触摸结束事件
     */
    private onTouchEnd(event: EventTouch): void {
        if (!this._isAiming) {
            return;
        }

        const gameManager = WZBPW_GameManager.instance;
        
        // 清除瞄准线和触摸位置
        this.clearAimLine();
        this._isAiming = false;
        this._lastTouchScreenPos = null;
        this._lastMouseEvent = null;

        // 检查是否可以发射
        if (gameManager && gameManager.canShoot()) {
            // 发射舌头（这里只是触发，实际发射逻辑在 TongueController 中实现）
            this.shootTongue();
        }
    }

    /**
     * 从屏幕坐标更新触摸位置
     */
    private updateTouchPositionFromScreen(screenPos: Vec2): void {
        // 直接使用屏幕坐标作为世界坐标（2D UI 场景）
        this._touchWorldPos.set(screenPos.x, screenPos.y, 0);
        
        // 计算瞄准方向
        this.calculateAimDirection();
    }

    /**
     * 更新触摸位置（转换为世界坐标）
     */
    private updateTouchPosition(event: EventTouch): void {
        const touchPos = event.getUILocation();
        
        // 直接使用屏幕坐标作为世界坐标（2D UI 场景）
        this._touchWorldPos.set(touchPos.x, touchPos.y, 0);

        // 计算瞄准方向
        this.calculateAimDirection();
    }

    /**
     * 计算瞄准方向（从嘴巴指向触摸位置）
     */
    private calculateAimDirection(): void {
        const mouthPos = this.mouthPosition;
        
        // 方向 = 触摸位置 - 嘴巴位置
        Vec3.subtract(this._aimDirection, this._touchWorldPos, mouthPos);
        
        // 归一化方向向量
        if (this._aimDirection.length() > 0) {
            this._aimDirection.normalize();
        }
    }

    /**
     * 绘制瞄准线
     */
    public drawAimLine(): void {
        console.log(`WZBPW_FrogController: drawAimLine called, laserActive: ${this._laserAimerActive}, laserAimer: ${this._laserAimer ? 'found' : 'null'}`);
        
        // 如果激光瞄准器激活，只绘制激光轨迹，不绘制普通瞄准线
        if (this._laserAimerActive && this._laserAimer) {
            console.log('WZBPW_FrogController: Drawing laser aim line');
            // 清除普通瞄准线
            if (this.aimLineGraphics) {
                this.aimLineGraphics.clear();
            }
            // 设置激光瞄准器的最大长度
            this._laserAimer.maxLength = this.laserAimerMaxLength;
            // 更新激光瞄准器
            const mouthPos = this.mouthPosition;
            this._laserAimer.updateAim(mouthPos, this._aimDirection);
            return;
        }

        // 如果激光应该激活但没找到激光瞄准器，尝试重新查找
        if (this._laserAimerActive && !this._laserAimer) {
            console.warn('WZBPW_FrogController: Laser aimer should be active but not found, trying to find it');
            this._laserAimer = this.findLaserAimerInScene();
            if (this._laserAimer) {
                console.log('WZBPW_FrogController: Laser aimer found on retry');
                this._laserAimer.activate();
                // 递归调用一次来绘制激光
                this.drawAimLine();
                return;
            }
        }

        console.log('WZBPW_FrogController: Drawing normal aim line');

        // 普通瞄准线绘制
        if (!this.aimLineGraphics) {
            return;
        }

        const graphics = this.aimLineGraphics;
        const mouthPos = this.mouthPosition;

        // 清除之前的绘制
        graphics.clear();

        // 设置线条样式
        graphics.strokeColor = this.aimLineColor;
        graphics.lineWidth = this.aimLineWidth;
        // graphics.lineCap = Graphics.LineCap.BUTT;  // 设置线条端点样式为平头，避免末端变粗
        // graphics.lineJoin = Graphics.LineJoin.MITER;  // 设置线条连接样式

        // 计算瞄准线终点（世界坐标）
        const endPoint = this.calculateAimLineEndPoint(mouthPos, this._aimDirection);

        // 获取 Graphics 节点的世界位置
        const graphicsWorldPos = this.aimLineGraphics.node.getWorldPosition();
        
        // 将世界坐标转换为相对于 Graphics 节点的本地坐标（直接相减）
        const localStart = new Vec3(
            mouthPos.x - graphicsWorldPos.x,
            mouthPos.y - graphicsWorldPos.y,
            0
        );
        const localEnd = new Vec3(
            endPoint.x - graphicsWorldPos.x,
            endPoint.y - graphicsWorldPos.y,
            0
        );

        // 绘制瞄准线
        graphics.moveTo(localStart.x, localStart.y);
        graphics.lineTo(localEnd.x, localEnd.y);
        graphics.stroke();
    }

    /**
     * 计算瞄准线终点
     * 使用射线检测找到最近的墙体，或者使用最大长度
     */
    private calculateAimLineEndPoint(startPos: Vec3, direction: Vec3): Vec3 {
        // 默认终点为最大长度处
        const defaultEndPoint = new Vec3(
            startPos.x + direction.x * this.maxTongueLength,
            startPos.y + direction.y * this.maxTongueLength,
            0
        );

        // 使用物理射线检测找到墙体
        try {
            // 使用 All 模式获取所有碰撞体，然后找最近的墙体
            const results = PhysicsSystem2D.instance.raycast(
                new Vec2(startPos.x, startPos.y),
                new Vec2(defaultEndPoint.x, defaultEndPoint.y),
                ERaycast2DType.All
            );
            if (results && results.length > 0) {
                // 找到最近的墙体
                let closestWallHit: { point: Vec2, distance: number } | null = null;

                for (const hit of results) {
                    // 只处理墙体
                    if (hit.collider && hit.collider.node && hit.collider.node.name.includes('Wall')) {
                        const hitPoint = hit.point;
                        const distance = Vec2.distance(new Vec2(startPos.x, startPos.y), hitPoint);

                        if (!closestWallHit || distance < closestWallHit.distance) {
                            closestWallHit = { point: hitPoint, distance: distance };
                        }
                    }
                }

                if (closestWallHit) {
                    return new Vec3(closestWallHit.point.x, closestWallHit.point.y, 0);
                }
            }
        } catch (e) {
            console.warn('WZBPW_FrogController: Raycast failed:', e);
        }

        return defaultEndPoint;
    }

    /**
     * 将世界坐标转换为 Graphics 组件的本地坐标
     */
    private worldToGraphicsLocal(worldPos: Vec3): Vec3 {
        if (!this.aimLineGraphics) {
            return worldPos;
        }

        const uiTransform = this.aimLineGraphics.node.getComponent(UITransform);
        if (uiTransform) {
            const localPos = new Vec3();
            // 使用 convertToNodeSpaceAR 转换世界坐标到节点本地坐标
            uiTransform.convertToNodeSpaceAR(worldPos, localPos);
            
            // 如果 Graphics 节点的父节点不是根节点，可能需要额外处理
            // 这里先尝试直接使用世界坐标
            return localPos;
        }

        return worldPos;
    }

    /**
     * 清除瞄准线
     */
    public clearAimLine(): void {
        if (this.aimLineGraphics) {
            this.aimLineGraphics.clear();
        }
    }

    /**
     * 发射舌头
     * 这里触发舌头发射，实际逻辑在 TongueController 中
     */
    private shootTongue(): void {
        const gameManager = WZBPW_GameManager.instance;
        const uiManager = WZBPW_UIManager.instance;
        
        if (!gameManager) {
            return;
        }

        // 更新游戏状态为发射中
        gameManager.gameState = GameState.SHOOTING;

        // 扣减生命
        gameManager.useTongue();
        
        // 更新UI显示
        if (uiManager) {
            uiManager.updateLives(gameManager.remainingLives);
        }

        // 隐藏激光瞄准器
        if (this._laserAimer && this._laserAimerActive) {
            this._laserAimer.hide();
        }

        console.log('Shooting tongue in direction:', this._aimDirection, 'Remaining lives:', gameManager.remainingLives);

        // 调用 TongueController 的 shoot 方法
        if (this.tongueController) {
            this.tongueController.shoot(this._aimDirection, this.mouthPosition);
        } else {
            console.warn('WZBPW_FrogController: tongueController is null');
            // 如果没有舌头控制器，直接重置状态
            this.scheduleOnce(() => {
                if (gameManager.gameState === GameState.SHOOTING) {
                    gameManager.gameState = GameState.IDLE;
                }
            }, 0.5);
        }
    }

    /**
     * 设置激光瞄准器激活状态
     * @param active 是否激活
     */
    public setLaserAimerActive(active: boolean): void {
        this._laserAimerActive = active;

        // 动态查找激光瞄准器
        if (!this._laserAimer) {
            this._laserAimer = this.findLaserAimerInScene();
        }

        if (this._laserAimer) {
            if (active) {
                this._laserAimer.activate();
            } else {
                this._laserAimer.deactivate();
            }
        }

        console.log(`WZBPW_FrogController: Laser aimer ${active ? 'activated' : 'deactivated'}`);
    }

    /**
     * 在场景中查找激光瞄准器
     */
    private findLaserAimerInScene(): WZBPW_LaserAimer | null {
        const scene = director.getScene();
        if (!scene) return null;

        return this.findComponentRecursive(scene, WZBPW_LaserAimer);
    }

    /**
     * 递归查找组件
     */
    private findComponentRecursive<T extends Component>(node: any, componentClass: new () => T): T | null {
        const comp = node.getComponent(componentClass);
        if (comp) return comp;

        for (const child of node.children) {
            const found = this.findComponentRecursive(child, componentClass);
            if (found) return found;
        }

        return null;
    }
}
