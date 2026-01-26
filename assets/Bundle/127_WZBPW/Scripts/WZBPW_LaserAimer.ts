import { _decorator, Component, Vec3, Graphics, Color, PhysicsSystem2D, ERaycast2DType, Vec2, UITransform, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 激光瞄准器道具
 * 显示完整的舌头弹射轨迹
 */
@ccclass('WZBPW_LaserAimer')
export class WZBPW_LaserAimer extends Component {
    // 是否激活
    @property
    public isActive: boolean = false;

    // 激光瞄准器的最大长度（可自定义）
    @property
    public maxLength: number = 5000;

    // 轨迹绘制组件
    @property(Graphics)
    public trajectoryGraphics: Graphics | null = null;

    // 轨迹颜色
    @property(Color)
    public trajectoryColor: Color = new Color(0, 255, 0, 150);

    // 轨迹线宽
    @property
    public trajectoryWidth: number = 20;

    // 最大反弹次数（防止无限循环）
    @property
    public maxBounces: number = 20;

    onLoad() {
        // 如果没有指定 trajectoryGraphics，尝试创建一个
        if (!this.trajectoryGraphics) {
            const graphicsNode = new Node('LaserTrajectoryGraphics');
            graphicsNode.setParent(this.node);
            
            const uiTransform = graphicsNode.addComponent(UITransform);
            uiTransform.setContentSize(1080, 1920);
            uiTransform.setAnchorPoint(0.5, 0.5);
            
            this.trajectoryGraphics = graphicsNode.addComponent(Graphics);
            
            console.log('WZBPW_LaserAimer: Created trajectory graphics node');
        }
    }

    /**
     * 激活激光瞄准器
     */
    public activate(): void {
        this.isActive = true;
        console.log('WZBPW_LaserAimer: Activated');
    }

    /**
     * 停用激光瞄准器
     */
    public deactivate(): void {
        this.isActive = false;
        this.clearTrajectory();
        console.log('WZBPW_LaserAimer: Deactivated');
    }

    /**
     * 隐藏激光瞄准器（发射舌头时调用）
     */
    public hide(): void {
        this.clearTrajectory();
    }

    /**
     * 更新瞄准（瞄准时调用）
     * @param startPos 起始位置（青蛙嘴巴）
     * @param direction 瞄准方向
     */
    public updateAim(startPos: Vec3, direction: Vec3): void {
        if (!this.isActive) {
            console.log('WZBPW_LaserAimer: updateAim called but not active');
            return;
        }
        console.log(`WZBPW_LaserAimer: updateAim called, maxLength: ${this.maxLength}`);
        // 使用自己配置的最大长度
        this.drawFullTrajectory(startPos, direction, this.maxLength);
    }

    /**
     * 绘制完整轨迹
     * @param startPos 起始位置
     * @param direction 初始方向
     * @param maxLength 最大长度
     */
    public drawFullTrajectory(startPos: Vec3, direction: Vec3, maxLength: number): void {
        if (!this.isActive || !this.trajectoryGraphics) {
            return;
        }

        // 计算完整路径
        const pathPoints = this.calculateFullPath(startPos, direction, maxLength);

        // 清除之前的绘制
        this.trajectoryGraphics.clear();

        if (pathPoints.length < 2) {
            return;
        }

        // 计算实际路径长度用于调试
        let actualLength = 0;
        for (let i = 1; i < pathPoints.length; i++) {
            actualLength += Vec3.distance(pathPoints[i - 1], pathPoints[i]);
        }
        console.log(`WZBPW_LaserAimer: Path points: ${pathPoints.length}, Max length: ${maxLength}, Actual length: ${actualLength.toFixed(2)}`);

        // 设置线条样式
        this.trajectoryGraphics.strokeColor = this.trajectoryColor;
        this.trajectoryGraphics.lineWidth = this.trajectoryWidth;
        this.trajectoryGraphics.lineCap = Graphics.LineCap.BUTT;  // 设置线条端点样式为平头，避免末端变粗
        this.trajectoryGraphics.lineJoin = Graphics.LineJoin.MITER;  // 设置线条连接样式

        // 绘制路径（使用正确的坐标转换）
        const localStart = this.worldToGraphicsLocal(pathPoints[0]);
        this.trajectoryGraphics.moveTo(localStart.x, localStart.y);

        for (let i = 1; i < pathPoints.length; i++) {
            const localPoint = this.worldToGraphicsLocal(pathPoints[i]);
            this.trajectoryGraphics.lineTo(localPoint.x, localPoint.y);
        }

        this.trajectoryGraphics.stroke();
    }

    /**
     * 计算完整路径
     * @param startPos 起始位置
     * @param direction 初始方向（归一化）
     * @param maxLength 最大长度
     * @returns 路径点数组
     */
    public calculateFullPath(startPos: Vec3, direction: Vec3, maxLength: number): Vec3[] {
        const pathPoints: Vec3[] = [];
        
        // 添加起点
        pathPoints.push(startPos.clone());

        let currentPos = startPos.clone();
        let currentDir = direction.clone();
        currentDir.normalize();
        let totalLength = 0;  // 已经走过的总长度
        let bounceCount = 0;

        // 模拟舌头延伸和反弹
        while (totalLength < maxLength && bounceCount < this.maxBounces) {
            // 计算剩余可走的长度
            const remainingLength = maxLength - totalLength;
            
            // 如果剩余长度太短，直接结束
            if (remainingLength < 1) {
                break;
            }
            
            // 计算下一个检测点（直接用剩余长度，让射线检测来判断碰撞）
            const nextPos = new Vec3(
                currentPos.x + currentDir.x * remainingLength,
                currentPos.y + currentDir.y * remainingLength,
                currentPos.z
            );

            // 检查墙体碰撞
            const wallHit = this.checkWallCollision(currentPos, nextPos);

            if (wallHit) {
                // 发生碰撞，添加碰撞点
                pathPoints.push(wallHit.point.clone());

                // 计算已走过的距离
                const distanceTraveled = Vec3.distance(currentPos, wallHit.point);
                totalLength += distanceTraveled;

                // 如果已经达到最大长度，停止
                if (totalLength >= maxLength) {
                    break;
                }

                // 计算反射方向
                const reflectionDir = this.calculateReflection(wallHit.normal, currentDir);
                
                // 更新当前位置：使用更大的偏移量，确保离开墙面
                // 对于浅角度，需要更大的偏移来避免重复检测
                const offsetDistance = 15; // 增加偏移距离
                currentPos.set(
                    wallHit.point.x + wallHit.normal.x * offsetDistance,
                    wallHit.point.y + wallHit.normal.y * offsetDistance,
                    wallHit.point.z
                );

                // 更新方向
                currentDir = reflectionDir;

                bounceCount++;
            } else {
                // 没有碰撞，直接到达终点
                pathPoints.push(nextPos.clone());
                totalLength = maxLength;  // 已经到达最大长度
                break;
            }
        }

        return pathPoints;
    }

    /**
     * 检查墙体碰撞
     * @param fromPos 起始位置
     * @param toPos 目标位置
     * @returns 碰撞信息，如果没有碰撞返回 null
     */
    private checkWallCollision(fromPos: Vec3, toPos: Vec3): { point: Vec3, normal: Vec3 } | null {
        try {
            // 使用物理系统的射线检测，获取所有碰撞体
            const results = PhysicsSystem2D.instance.raycast(
                new Vec2(fromPos.x, fromPos.y),
                new Vec2(toPos.x, toPos.y),
                ERaycast2DType.All
            );

            if (results && results.length > 0) {
                // 找到最近的墙体
                let closestWallHit: { point: Vec3, normal: Vec3, distance: number } | null = null;

                for (const hit of results) {
                    const collider = hit.collider;
                    // 只处理墙体
                    if (collider && collider.node && collider.node.name.includes('Wall')) {
                        const hitPoint = new Vec3(hit.point.x, hit.point.y, 0);
                        const distance = Vec3.distance(fromPos, hitPoint);

                        if (!closestWallHit || distance < closestWallHit.distance) {
                            const normal = new Vec3(hit.normal.x, hit.normal.y, 0);
                            normal.normalize();
                            closestWallHit = { point: hitPoint, normal: normal, distance: distance };
                        }
                    }
                }

                if (closestWallHit) {
                    return { point: closestWallHit.point, normal: closestWallHit.normal };
                }
            }
        } catch (e) {
            console.warn('WZBPW_LaserAimer: Wall collision check failed:', e);
        }

        return null;
    }

    /**
     * 计算反射方向
     * 使用反射公式：R = I - 2(I·N)N
     * @param normal 碰撞面法线（归一化）
     * @param inDirection 入射方向（归一化）
     * @returns 反射方向（归一化）
     */
    private calculateReflection(normal: Vec3, inDirection: Vec3): Vec3 {
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
     * 清除轨迹绘制
     */
    public clearTrajectory(): void {
        if (this.trajectoryGraphics) {
            this.trajectoryGraphics.clear();
        }
    }

    /**
     * 将世界坐标转换为 Graphics 组件的本地坐标
     */
    private worldToGraphicsLocal(worldPos: Vec3): Vec3 {
        if (!this.trajectoryGraphics) {
            return worldPos;
        }

        const uiTransform = this.trajectoryGraphics.node.getComponent(UITransform);
        if (uiTransform) {
            const localPos = new Vec3();
            uiTransform.convertToNodeSpaceAR(worldPos, localPos);
            return localPos;
        }

        return worldPos;
    }
}
