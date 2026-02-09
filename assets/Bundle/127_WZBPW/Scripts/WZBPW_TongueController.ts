import { _decorator, Component, Vec3, Graphics, Color, PhysicsSystem2D, ERaycast2DType, Vec2, UITransform, Node, director } from 'cc';
import { WZBPW_GameManager, GameState } from './WZBPW_GameManager';
import { WZBPW_MosquitoController } from './WZBPW_MosquitoController';
import { WZBPW_BoxController } from './WZBPW_BoxController';
import { WZBPW_StoneController } from './WZBPW_StoneController';
import { WZBPW_TNTController } from './WZBPW_TNTController';
const { ccclass, property } = _decorator;

/**
 * 舌头碰撞类型枚举
 */
export enum TongueHitType {
    WALL,           // 墙体 - 反弹
    MOSQUITO,       // 蚊子 - 捕获
    BOX,            // 箱子 - 立即收回并拉动
    STONE,          // 石头 - 立即收回并推动
    TNT,            // TNT - 立即收回并爆炸
    NONE            // 无碰撞
}

/**
 * 舌头路径点接口
 */
interface ITonguePathPoint {
    position: Vec3;              // 位置
    isReflectionPoint: boolean;  // 是否是反弹点
}

/**
 * 舌头控制器
 * 处理舌头的发射、延伸、反弹和收回逻辑
 */
@ccclass('WZBPW_TongueController')
export class WZBPW_TongueController extends Component {
    // 舌头最大长度
    @property
    public maxLength: number = 1000;

    // 舌头移动速度（像素/秒）
    @property
    public speed: number = 800;

    // 舌头绘制组件
    @property(Graphics)
    public tongueGraphics: Graphics | null = null;

    // 轨迹绘制组件（用于绘制收回后的浅色轨迹）
    @property(Graphics)
    public trailGraphics: Graphics | null = null;

    // 舌头颜色
    @property(Color)
    public tongueColor: Color = new Color(255, 100, 100, 255);

    // 轨迹颜色（浅色）
    @property(Color)
    public trailColor: Color = new Color(255, 200, 200, 100);

    // 舌头宽度
    @property
    public tongueWidth: number = 6;

    // 轨迹宽度
    @property
    public trailWidth: number = 4;

    // 当前已伸出长度
    private _currentLength: number = 0;

    // 舌头路径点（包含反弹点）
    private _pathPoints: ITonguePathPoint[] = [];

    // 是否正在伸出
    private _isExtending: boolean = false;

    // 是否正在收回
    private _isRetracting: boolean = false;

    // 当前舌头尖端位置
    private _currentTipPosition: Vec3 = new Vec3();

    // 当前移动方向
    private _currentDirection: Vec3 = new Vec3();

    // 舌头起点（青蛙嘴巴位置）
    private _startPosition: Vec3 = new Vec3();

    // 收回时的当前路径点索引（从后往前）
    private _retractionPathIndex: number = -1;

    // 捕获的蚊子列表
    private _caughtMosquitoes: WZBPW_MosquitoController[] = [];

    // 场景中所有蚊子的缓存（用于碰撞检测）
    private _mosquitosInScene: WZBPW_MosquitoController[] = [];

    // 场景中所有箱子的缓存（用于碰撞检测）
    private _boxesInScene: WZBPW_BoxController[] = [];

    // 场景中所有石头的缓存（用于碰撞检测）
    private _stonesInScene: WZBPW_StoneController[] = [];

    // 场景中所有TNT的缓存（用于碰撞检测）
    private _tntsInScene: WZBPW_TNTController[] = [];

    // 轨迹路径点（用于绘制收回后的轨迹）
    private _trailPathPoints: Vec3[] = [];

    /**
     * 获取舌头路径点（只读）
     */
    public get pathPoints(): ReadonlyArray<ITonguePathPoint> {
        return this._pathPoints;
    }

    /**
     * 是否正在伸出
     */
    public get isExtending(): boolean {
        return this._isExtending;
    }

    /**
     * 是否正在收回
     */
    public get isRetracting(): boolean {
        return this._isRetracting;
    }

    /**
     * 当前长度
     */
    public get currentLength(): number {
        return this._currentLength;
    }

    /**
     * 捕获的蚊子列表（只读）
     */
    public get caughtMosquitoes(): ReadonlyArray<WZBPW_MosquitoController> {
        return this._caughtMosquitoes;
    }

    /**
     * 初始化时缓存场景中的蚊子、箱子和石头
     */
    public refreshMosquitoCache(): void {
        this._mosquitosInScene = [];
        this._boxesInScene = [];
        this._stonesInScene = [];
        this._tntsInScene = [];

        // 查找场景中所有带有相关组件的节点
        const scene = director.getScene();
        if (scene) {
            this.findPropsRecursive(scene);
        }

        console.log('WZBPW_TongueController: Found', this._mosquitosInScene.length, 'mosquitos,',
            this._boxesInScene.length, 'boxes,', this._stonesInScene.length, 'stones,',
            this._tntsInScene.length, 'TNTs in scene');
    }

    /**
     * 递归查找蚊子、箱子和石头节点
     */
    private findPropsRecursive(node: Node): void {
        const mosquito = node.getComponent(WZBPW_MosquitoController);
        if (mosquito) {
            this._mosquitosInScene.push(mosquito);
        }

        const box = node.getComponent(WZBPW_BoxController);
        if (box) {
            this._boxesInScene.push(box);
        }

        const stone = node.getComponent(WZBPW_StoneController);
        if (stone) {
            this._stonesInScene.push(stone);
        }

        const tnt = node.getComponent(WZBPW_TNTController);
        if (tnt) {
            this._tntsInScene.push(tnt);
        }

        for (const child of node.children) {
            this.findPropsRecursive(child);
        }
    }

    /**
     * 发射舌头
     * @param direction 发射方向（归一化向量）
     */
    public shoot(direction: Vec3, startPosition: Vec3): void {
        // 如果舌头正在运动中，忽略此次发射
        if (this._isExtending || this._isRetracting) {
            console.warn('WZBPW_TongueController: Tongue is already in motion');
            return;
        }

        // 清除上次的轨迹
        this.clearTrail();

        // 重置状态
        this.reset();

        // 设置起点和方向
        this._startPosition.set(startPosition);
        this._currentTipPosition.set(startPosition);
        this._currentDirection.set(direction);
        this._currentDirection.normalize();

        // 添加起点到路径
        this._pathPoints.push({
            position: this._startPosition.clone(),
            isReflectionPoint: false
        });

        // 开始延伸
        this._isExtending = true;
        this._currentLength = 0;

        console.log('WZBPW_TongueController: Shooting tongue from', startPosition, 'in direction', direction);
    }

    /**
     * 更新舌头状态
     * @param dt 帧间隔时间
     */
    update(dt: number): void {
        if (this._isExtending) {
            this.updateExtension(dt);
        } else if (this._isRetracting) {
            this.updateRetraction(dt);
        }

        // 绘制舌头
        if (this._isExtending || this._isRetracting) {
            this.drawTongue();
        }

        // 绘制轨迹（收回时绘制）
        if (this._isRetracting) {
            this.drawTrail();
        }
    }

    /**
     * 更新舌头延伸逻辑
     * @param dt 帧间隔时间
     */
    private updateExtension(dt: number): void {
        // 计算本帧移动距离
        const moveDistance = this.speed * dt;

        // 保存旧的尖端位置
        const oldTipPosition = this._currentTipPosition.clone();

        // 计算新的尖端位置
        const newTipPosition = new Vec3(
            this._currentTipPosition.x + this._currentDirection.x * moveDistance,
            this._currentTipPosition.y + this._currentDirection.y * moveDistance,
            this._currentTipPosition.z
        );

        // 更新当前长度
        this._currentLength += moveDistance;

        // 检查是否达到最大长度
        if (this._currentLength >= this.maxLength) {
            // 达到最大长度，更新尖端位置
            this._currentTipPosition.set(newTipPosition);

            // 将终点添加到路径点（这样收回时会沿原路返回）
            this._pathPoints.push({
                position: this._currentTipPosition.clone(),
                isReflectionPoint: false
            });

            // 开始收回
            this.retract();
            return;
        }

        // 检查墙体碰撞
        const wallHit = this.checkWallCollision(this._currentTipPosition, newTipPosition);

        if (wallHit) {
            // 发生碰撞，处理反弹
            this.handleWallReflection(wallHit.point, wallHit.normal);
        } else {
            // 没有碰撞，正常移动
            this._currentTipPosition.set(newTipPosition);
        }

        // 检查箱子和石头碰撞（优先级高于蚊子）
        const propHit = this.checkPropCollision(this._currentTipPosition);
        if (propHit.type === TongueHitType.BOX) {
            // 击中箱子，立即收回并拉动箱子
            console.log('WZBPW_TongueController: Hit box, retracting and pulling');
            propHit.box!.onTongueHit(this._startPosition);
            this.retract();
            return;
        } else if (propHit.type === TongueHitType.STONE) {
            // 击中石头，立即收回并推动石头
            console.log('WZBPW_TongueController: Hit stone, retracting and pushing');
            propHit.stone!.onTongueHit(this._startPosition);
            this.retract();
            return;
        } else if (propHit.type === TongueHitType.TNT) {
            // 击中TNT，立即收回并触发爆炸
            console.log('WZBPW_TongueController: Hit TNT, retracting and exploding');
            propHit.tnt!.onTongueHit(this._startPosition);
            this.retract();
            return;
        }

        // 检查蚊子碰撞（检查移动路径上的所有点，防止跳过）
        this.checkAndCatchMosquitoesOnPath(oldTipPosition, this._currentTipPosition);
    }

    /**
     * 检查墙体碰撞
     * @param fromPos 起始位置
     * @param toPos 目标位置
     * @returns 碰撞信息，如果没有碰撞返回 null
     */
    private checkWallCollision(fromPos: Vec3, toPos: Vec3): { point: Vec3, normal: Vec3 } | null {
        try {
            // 使用物理系统的射线检测
            const results = PhysicsSystem2D.instance.raycast(
                new Vec2(fromPos.x, fromPos.y),
                new Vec2(toPos.x, toPos.y),
                ERaycast2DType.Closest
            );

            if (results && results.length > 0) {
                const hit = results[0];

                // 检查碰撞对象是否是墙体（通过标签或组件判断）
                // 这里假设墙体有特定的标签或组件
                const collider = hit.collider;
                if (collider && collider.node && collider.node.name.includes('Wall')) {
                    const hitPoint = new Vec3(hit.point.x, hit.point.y, 0);
                    const normal = new Vec3(hit.normal.x, hit.normal.y, 0);
                    normal.normalize();

                    return { point: hitPoint, normal: normal };
                }
            }
        } catch (e) {
            // 如果物理系统未初始化或出错，忽略碰撞检测
            console.warn('WZBPW_TongueController: Wall collision check failed:', e);
        }

        return null;
    }

    /**
     * 处理墙体反弹
     * @param hitPoint 碰撞点
     * @param normal 碰撞面法线
     */
    private handleWallReflection(hitPoint: Vec3, normal: Vec3): void {
        // 更新尖端位置到碰撞点
        this._currentTipPosition.set(hitPoint);

        // 记录反弹点
        this._pathPoints.push({
            position: hitPoint.clone(),
            isReflectionPoint: true
        });

        // 计算反射方向
        this._currentDirection = this.calculateReflection(hitPoint, normal, this._currentDirection);

        console.log('WZBPW_TongueController: Wall reflection at', hitPoint, 'new direction', this._currentDirection);
    }

    /**
     * 更新舌头收回逻辑
     * @param dt 帧间隔时间
     */
    private updateRetraction(dt: number): void {
        // 如果已经不在收回状态，直接返回
        if (!this._isRetracting) {
            return;
        }

        const moveDistance = this.speed * dt;

        // 如果路径点少于2个，直接完成
        if (this._pathPoints.length < 2) {
            this._currentTipPosition.set(this._startPosition);
            this.onRetractComplete();
            return;
        }

        // 如果已经回到起点
        if (this._retractionPathIndex < 0) {
            this._currentTipPosition.set(this._startPosition);
            this.onRetractComplete();
            return;
        }

        // 获取目标点
        const targetPoint = this._pathPoints[this._retractionPathIndex].position;

        // 计算方向和距离
        const dir = new Vec3();
        Vec3.subtract(dir, targetPoint, this._currentTipPosition);
        const dist = dir.length();

        // 如果本帧可以到达目标点
        if (dist <= moveDistance) {
            this._currentTipPosition.set(targetPoint);
            this._currentLength -= dist;
            this._retractionPathIndex--;

            // 如果还没回到起点且还有剩余距离，继续处理
            if (this._retractionPathIndex >= 0) {
                const remaining = moveDistance - dist;
                if (remaining > 0.01) {
                    this.updateRetraction(remaining / this.speed);
                }
            } else {
                // 已经回到起点
                this.onRetractComplete();
            }
            return;
        }

        // 正常移动
        dir.normalize();
        this._currentTipPosition.x += dir.x * moveDistance;
        this._currentTipPosition.y += dir.y * moveDistance;
        this._currentLength -= moveDistance;
        if (this._currentLength < 0) this._currentLength = 0;

        // 收回过程中也检查蚊子碰撞（立即吃掉）
        this.checkAndCatchMosquitoes(this._currentTipPosition);
    }

    /**
     * 开始收回舌头
     */
    public retract(): void {
        if (this._isRetracting) {
            return;
        }

        this._isExtending = false;
        this._isRetracting = true;

        // 保存当前路径点用于绘制轨迹
        this._trailPathPoints = this._pathPoints.map(p => p.position.clone());
        // 添加当前尖端位置作为轨迹终点
        this._trailPathPoints.push(this._currentTipPosition.clone());

        // 立即初始化收回路径索引，避免绘制时出现闪烁
        if (this._pathPoints.length >= 2) {
            this._retractionPathIndex = this._pathPoints.length - 2;
            // 确保尖端在最后一个路径点位置
            this._currentTipPosition.set(this._pathPoints[this._pathPoints.length - 1].position);
        } else {
            this._retractionPathIndex = -1;
        }

        // 更新游戏状态
        const gameManager = WZBPW_GameManager.instance;
        if (gameManager) {
            gameManager.gameState = GameState.RETRACTING;
        }

        console.log('WZBPW_TongueController: Retracting tongue');
    }

    /**
     * 收回完成时调用
     */
    private onRetractComplete(): void {
        // 防止重复调用
        if (!this._isRetracting) {
            return;
        }

        console.log('WZBPW_TongueController: Retraction complete');

        // 先停止收回状态，防止 reset 后又被 update 调用
        this._isRetracting = false;

        // 蚊子已经在碰撞时立即被吃掉了，这里不需要再处理

        // 重置状态
        this.reset();

        // 更新游戏状态为空闲
        const gameManager = WZBPW_GameManager.instance;
        if (gameManager) {
            gameManager.gameState = GameState.IDLE;
            gameManager.checkGameState();
        }
    }

    /**
     * 检查箱子、石头和TNT碰撞
     * @param point 检测点（舌头尖端位置）
     * @returns 碰撞信息
     */
    private checkPropCollision(point: Vec3): { type: TongueHitType, box?: WZBPW_BoxController, stone?: WZBPW_StoneController, tnt?: WZBPW_TNTController } {
        // 如果缓存为空，刷新缓存
        if (this._boxesInScene.length === 0 && this._stonesInScene.length === 0 && this._tntsInScene.length === 0) {
            this.refreshMosquitoCache();
        }

        // 检查TNT碰撞（优先级最高）
        for (const tnt of this._tntsInScene) {
            if (tnt && tnt.node && tnt.node.isValid) {
                if (this.checkPointInNode(point, tnt.node)) {
                    return { type: TongueHitType.TNT, tnt: tnt };
                }
            }
        }

        // 检查箱子碰撞
        for (const box of this._boxesInScene) {
            if (box && box.node && box.node.isValid) {
                if (this.checkPointInNode(point, box.node)) {
                    return { type: TongueHitType.BOX, box: box };
                }
            }
        }

        // 检查石头碰撞
        for (const stone of this._stonesInScene) {
            if (stone && stone.node && stone.node.isValid) {
                if (this.checkPointInNode(point, stone.node)) {
                    return { type: TongueHitType.STONE, stone: stone };
                }
            }
        }

        return { type: TongueHitType.NONE };
    }

    /**
     * 检查点是否在节点内
     * @param point 世界坐标点
     * @param node 节点
     * @returns 是否在节点内
     */
    private checkPointInNode(point: Vec3, node: Node): boolean {
        const uiTransform = node.getComponent(UITransform);
        if (!uiTransform) {
            return false;
        }

        // 将世界坐标转换为节点本地坐标
        const localPoint = new Vec3();
        uiTransform.convertToNodeSpaceAR(point, localPoint);

        // 获取节点的尺寸
        const width = uiTransform.width;
        const height = uiTransform.height;

        // 检查点是否在节点范围内
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        return localPoint.x >= -halfWidth && localPoint.x <= halfWidth &&
            localPoint.y >= -halfHeight && localPoint.y <= halfHeight;
    }

    /**
     * 检查并捕获蚊子
     * @param point 检测点（舌头尖端位置）
     */
    private checkAndCatchMosquitoes(point: Vec3): void {
        // 如果蚊子缓存为空，刷新缓存
        if (this._mosquitosInScene.length === 0) {
            this.refreshMosquitoCache();
        }

        for (const mosquito of this._mosquitosInScene) {
            if (mosquito && mosquito.node && mosquito.node.isValid && !mosquito.isCaught) {
                if (mosquito.checkCollision(point)) {
                    // 捕获蚊子
                    mosquito.onCaught(this.node, point);

                    // 让蚊子飞向青蛙嘴巴
                    mosquito.flyToFrogMouth(this._startPosition, () => {
                        // 到达青蛙嘴巴后，吃掉蚊子
                        if (mosquito && mosquito.node && mosquito.node.isValid) {
                            mosquito.onEaten();
                        }
                    });

                    console.log('WZBPW_TongueController: Mosquito caught, flying to frog mouth');
                }
            }
        }
    }

    /**
     * 检查移动路径上的蚊子碰撞（防止高速移动时跳过蚊子）
     * @param fromPos 起始位置
     * @param toPos 目标位置
     */
    private checkAndCatchMosquitoesOnPath(fromPos: Vec3, toPos: Vec3): void {
        // 如果蚊子缓存为空，刷新缓存
        if (this._mosquitosInScene.length === 0) {
            this.refreshMosquitoCache();
        }

        // 计算路径长度
        const pathLength = Vec3.distance(fromPos, toPos);
        
        // 如果路径太短，直接检查终点
        if (pathLength < 10) {
            this.checkAndCatchMosquitoes(toPos);
            return;
        }

        // 在路径上采样多个点进行检测
        const sampleCount = Math.ceil(pathLength / 20); // 每20像素采样一次
        
        // 记录已捕获的蚊子，避免重复捕获
        const caughtMosquitoes: WZBPW_MosquitoController[] = [];
        
        for (let i = 0; i <= sampleCount; i++) {
            const t = i / sampleCount;
            const samplePoint = new Vec3(
                fromPos.x + (toPos.x - fromPos.x) * t,
                fromPos.y + (toPos.y - fromPos.y) * t,
                fromPos.z
            );

            // 检查这个采样点
            for (const mosquito of this._mosquitosInScene) {
                if (mosquito && mosquito.node && mosquito.node.isValid && !mosquito.isCaught && !caughtMosquitoes.includes(mosquito)) {
                    if (mosquito.checkCollision(samplePoint)) {
                        // 捕获蚊子
                        mosquito.onCaught(this.node, samplePoint);

                        // 让蚊子飞向青蛙嘴巴
                        mosquito.flyToFrogMouth(this._startPosition, () => {
                            // 到达青蛙嘴巴后，吃掉蚊子
                            if (mosquito && mosquito.node && mosquito.node.isValid) {
                                mosquito.onEaten();
                            }
                        });

                        // 记录已捕获的蚊子
                        caughtMosquitoes.push(mosquito);

                        console.log('WZBPW_TongueController: Mosquito caught on path, flying to frog mouth');
                    }
                }
            }
        }
    }

    /**
     * 绘制舌头
     */
    public drawTongue(): void {
        if (!this.tongueGraphics) {
            console.warn('WZBPW_TongueController: tongueGraphics is null');
            return;
        }

        const graphics = this.tongueGraphics;

        // 清除之前的绘制
        graphics.clear();

        // 如果没有路径点或不在运动状态，不绘制
        if (this._pathPoints.length === 0) {
            return;
        }

        // 设置线条样式
        graphics.strokeColor = this.tongueColor;
        graphics.lineWidth = this.tongueWidth;
        graphics.lineCap = Graphics.LineCap.BUTT;
        graphics.lineJoin = Graphics.LineJoin.MITER;  // 设置线条连接样式

        // 将世界坐标转换为 Graphics 组件的本地坐标
        const localStart = this.worldToGraphicsLocal(this._pathPoints[0].position);
        graphics.moveTo(localStart.x, localStart.y);

        if (this._isExtending) {
            // 延伸时：绘制所有路径点，然后到当前尖端
            for (let i = 1; i < this._pathPoints.length; i++) {
                const localPoint = this.worldToGraphicsLocal(this._pathPoints[i].position);
                graphics.lineTo(localPoint.x, localPoint.y);
            }
            // 绘制到当前尖端位置
            const localTip = this.worldToGraphicsLocal(this._currentTipPosition);
            graphics.lineTo(localTip.x, localTip.y);
        } else if (this._isRetracting && this._retractionPathIndex >= 0) {
            // 收回时：绘制从起点到目标点，再到当前尖端
            // _retractionPathIndex 是当前目标点的索引
            // 绘制起点到目标点之间的所有点
            for (let i = 1; i <= this._retractionPathIndex && i < this._pathPoints.length; i++) {
                const localPoint = this.worldToGraphicsLocal(this._pathPoints[i].position);
                graphics.lineTo(localPoint.x, localPoint.y);
            }
            // 绘制到当前尖端位置
            const localTip = this.worldToGraphicsLocal(this._currentTipPosition);
            graphics.lineTo(localTip.x, localTip.y);
        } else if (this._isRetracting && this._retractionPathIndex < 0) {
            // 已经在回起点的最后一段，只绘制起点到当前尖端
            const localTip = this.worldToGraphicsLocal(this._currentTipPosition);
            graphics.lineTo(localTip.x, localTip.y);
        }

        graphics.stroke();
    }

    /**
     * 将世界坐标转换为 Graphics 组件的本地坐标
     */
    private worldToGraphicsLocal(worldPos: Vec3): Vec3 {
        if (!this.tongueGraphics) {
            return worldPos;
        }

        const uiTransform = this.tongueGraphics.node.getComponent(UITransform);
        if (uiTransform) {
            const localPos = new Vec3();
            uiTransform.convertToNodeSpaceAR(worldPos, localPos);
            return localPos;
        }

        return worldPos;
    }

    /**
     * 绘制轨迹（收回时留下的浅色路径）
     */
    private drawTrail(): void {
        if (!this.trailGraphics || this._trailPathPoints.length < 2) {
            return;
        }

        const graphics = this.trailGraphics;

        // 清除之前的绘制
        graphics.clear();

        // 设置线条样式
        graphics.strokeColor = this.trailColor;
        graphics.lineWidth = this.trailWidth;
        // graphics.lineCap = Graphics.LineCap.BUTT;
        // graphics.lineJoin = Graphics.LineJoin.MITER;  // 设置线条连接样式

        // 绘制完整轨迹
        const localStart = this.worldToTrailLocal(this._trailPathPoints[0]);
        graphics.moveTo(localStart.x, localStart.y);

        for (let i = 1; i < this._trailPathPoints.length; i++) {
            const localPoint = this.worldToTrailLocal(this._trailPathPoints[i]);
            graphics.lineTo(localPoint.x, localPoint.y);
        }

        graphics.stroke();
    }

    /**
     * 将世界坐标转换为轨迹 Graphics 组件的本地坐标
     */
    private worldToTrailLocal(worldPos: Vec3): Vec3 {
        if (!this.trailGraphics) {
            return worldPos;
        }

        const uiTransform = this.trailGraphics.node.getComponent(UITransform);
        if (uiTransform) {
            const localPos = new Vec3();
            uiTransform.convertToNodeSpaceAR(worldPos, localPos);
            return localPos;
        }

        return worldPos;
    }

    /**
     * 清除轨迹
     */
    public clearTrail(): void {
        this._trailPathPoints = [];
        if (this.trailGraphics) {
            this.trailGraphics.clear();
        }
    }

    /**
     * 重置舌头状态
     */
    public reset(): void {
        this._isExtending = false;
        this._isRetracting = false;
        this._currentLength = 0;
        this._pathPoints = [];
        this._caughtMosquitoes = [];
        this._currentTipPosition.set(0, 0, 0);
        this._currentDirection.set(0, 0, 0);
        this._startPosition.set(0, 0, 0);
        this._retractionPathIndex = -1;

        // 清除绘制
        if (this.tongueGraphics) {
            this.tongueGraphics.clear();
        }

        // 刷新蚊子缓存（下次发射时会重新获取）
        this._mosquitosInScene = [];
        this._boxesInScene = [];
        this._stonesInScene = [];
        this._tntsInScene = [];
    }

    /**
     * 计算反射方向
     * 使用反射公式：R = I - 2(I·N)N
     * @param _hitPoint 碰撞点（保留参数用于扩展）
     * @param normal 碰撞面法线（归一化）
     * @param inDirection 入射方向（归一化）
     * @returns 反射方向（归一化）
     */
    public calculateReflection(_hitPoint: Vec3, normal: Vec3, inDirection: Vec3): Vec3 {
        // 计算入射方向与法线的点积
        const dotProduct = Vec3.dot(inDirection, normal);

        // 反射公式：R = I - 2(I·N)N
        const reflection = new Vec3();
        reflection.x = inDirection.x - 2 * dotProduct * normal.x;
        reflection.y = inDirection.y - 2 * dotProduct * normal.y;
        reflection.z = inDirection.z - 2 * dotProduct * normal.z;

        // 归一化反射方向
        reflection.normalize();

        return reflection;
    }

    /**
     * 检测蚊子碰撞
     * @param point 检测点
     * @returns 碰撞的蚊子控制器，如果没有碰撞返回 null
     */
    public checkMosquitoCollision(point: Vec3): WZBPW_MosquitoController | null {
        // 如果蚊子缓存为空，刷新缓存
        if (this._mosquitosInScene.length === 0) {
            this.refreshMosquitoCache();
        }

        for (const mosquito of this._mosquitosInScene) {
            if (mosquito && mosquito.node && mosquito.node.isValid && !mosquito.isCaught) {
                if (mosquito.checkCollision(point)) {
                    return mosquito;
                }
            }
        }

        return null;
    }
}
