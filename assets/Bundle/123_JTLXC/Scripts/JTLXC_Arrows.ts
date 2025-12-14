import { _decorator, Component, Node, Vec2, Vec3, v3, EventTouch, UITransform, tween, Tween, instantiate, Sprite, Color, director, Graphics } from 'cc';
import { JTLXC_GameManager } from './JTLXC_GameManager';

const { ccclass, property } = _decorator;

@ccclass('JTLXC_Arrows')
export class JTLXC_Arrows extends Component {
    // 箭头方向
    public direction: number = 0; // 0: 上, 1: 右, 2: 下, 3: 左

    // 箭头在网格中的位置
    public gridPosition: Vec2 = new Vec2(0, 0);

    // 箭头各部分的配置信息
    public partsConfig: { length: number, rotation: number }[] = [];

    // 游戏管理器引用
    private gameManager: JTLXC_GameManager = null;

    // 箭头是否可以移动
    private canMove: boolean = true;

    // 网格大小
    private gridSize: number = 50;

    // 箭头各部分节点
    private partNodes: Node[] = [];

    // 格子预制体（用于复制）
    private cellPrefab: Node = null;

    // 箭头所有节点的网格位置记录
    public nodeGridPositions: Vec2[] = [];

    // 记录每个节点的朝向
    private nodeDirections: number[] = [];

    // 移动相关状态
    private isMoving: boolean = false;

    // 移动计时器
    private moveTimer: number = 0;
    private moveDuration: number = 10; // 移动20秒后销毁

    // 插入节点数量
    private readonly INSERT_NODE_COUNT: number = 4;

    // 移动速度（每秒移动的格子数）
    private moveSpeed: number = 80.0;

    // 移动进度（0-1）
    private moveProgress: number = 0;

    // 目标网格位置
    private targetGridPosition: Vec2 = new Vec2(0, 0);

    // 移动前的节点位置
    private previousNodePositions: Vec2[] = [];

    // 触摸开始位置
    private touchStartPos: Vec2 = new Vec2(0, 0);

    // 触摸结束位置
    private touchEndPos: Vec2 = new Vec2(0, 0);

    // 添加Graphics组件用于绘制路径
    private graphics: Graphics = null;

    start() {
        this.setupClickEvents();
    }

    update(deltaTime: number) {
        if (this.isMoving) {
            this.updateMovement(deltaTime);
        }
    }

    setupClickEvents() {
        // 为所有子节点添加点击事件（除了PathGraphics节点）
        for (let i = 0; i < this.node.children.length; i++) {
            const child = this.node.children[i];
            // 排除PathGraphics节点，避免影响触摸区域
            if (child.name === "PathGraphics") continue;

            child.on(Node.EventType.TOUCH_START, this.onArrowTouchStart, this);
            child.on(Node.EventType.TOUCH_END, this.onArrowTouchEnd, this);
            child.on(Node.EventType.TOUCH_CANCEL, this.onArrowTouchCancel, this);
        }
    }

    init(direction: number, gridPos: Vec2, partsConfig: { length: number, rotation: number }[], gameManager: JTLXC_GameManager) {
        this.direction = direction;
        this.gridPosition = gridPos.clone();
        this.gameManager = gameManager;
        this.canMove = true;
        this.isMoving = false;
        this.moveTimer = 0;
        this.moveProgress = 0;

        // 设置移动速度
        this.moveSpeed = 80.0; // 每秒移动2个格子

        // 处理partsConfig，如果第一个部分的旋转是绝对方向，则转换为相对方向
        this.partsConfig = [...partsConfig];
        if (this.partsConfig.length > 0) {
            // 计算第一节相对于箭头方向的旋转
            let relativeRotation = this.partsConfig[0].rotation - direction;
            if (relativeRotation > 1) relativeRotation -= 4;
            if (relativeRotation < -1) relativeRotation += 4;

            // 特殊情况处理
            if (Math.abs(relativeRotation) > 1) {
                if (direction === 0 && this.partsConfig[0].rotation === 1) relativeRotation = 1;  // 上到右，右转
                if (direction === 0 && this.partsConfig[0].rotation === 3) relativeRotation = -1; // 上到左，左转
                if (direction === 2 && this.partsConfig[0].rotation === 1) relativeRotation = -1; // 下到右，左转
                if (direction === 2 && this.partsConfig[0].rotation === 3) relativeRotation = 1;  // 下到左，右转
                if (direction === 1 && this.partsConfig[0].rotation === 0) relativeRotation = -1; // 右到上，左转
                if (direction === 1 && this.partsConfig[0].rotation === 2) relativeRotation = 1;  // 右到下，右转
                if (direction === 3 && this.partsConfig[0].rotation === 0) relativeRotation = 1;  // 左到上，右转
                if (direction === 3 && this.partsConfig[0].rotation === 2) relativeRotation = -1; // 左到下，左转
            }

            this.partsConfig[0].rotation = relativeRotation;
        }

        // 初始化箭头部件
        this.setupArrowParts();

        // 初始化图形绘制组件
        this.initGraphics();

        // 计算节点位置
        this.calculateNodeGridPositions();

        // 更新节点位置
        this.updateNodeWorldPositions();

        // 初始化移动持续时间
        this.moveDuration = 0.5; // 默认值，将在首次移动时重新计算
    }

    setupArrowParts() {
        // 清空现有节点列表
        this.partNodes = [];
        this.nodeGridPositions = [];
        this.nodeDirections = [];

        // 获取所有现有的子节点
        for (let i = 0; i < this.node.children.length; i++) {
            this.partNodes.push(this.node.children[i]);
        }

        // 保存身体预制体（第二个节点）
        if (this.partNodes.length > 1) {
            this.cellPrefab = this.partNodes[1];
            this.cellPrefab.active = false;
        } else {
            console.error("错误: 箭头预制体需要至少2个子节点");
            return;
        }

        // 计算需要创建的身体节点总数
        let totalNodesNeeded = 2; // 箭头(0) + 第一个身体(1)
        for (let i = 0; i < this.partsConfig.length; i++) {
            totalNodesNeeded += this.partsConfig[i].length;
        }

        // 计算总节点数（包括插入节点）
        const totalVisualNodesNeeded = totalNodesNeeded + (totalNodesNeeded - 1) * this.INSERT_NODE_COUNT;

        // 创建缺少的身体节点
        while (this.partNodes.length < totalVisualNodesNeeded) {
            if (this.cellPrefab) {
                const newCell = instantiate(this.cellPrefab);
                newCell.parent = this.node;
                newCell.active = false;
                newCell.on(Node.EventType.TOUCH_START, this.onArrowTouchStart, this);
                newCell.on(Node.EventType.TOUCH_END, this.onArrowTouchEnd, this);
                newCell.on(Node.EventType.TOUCH_CANCEL, this.onArrowTouchCancel, this);
                this.partNodes.push(newCell);
            } else {
                console.error("无法创建身体节点：预制体为空");
                break;
            }
        }

        // 确保所有节点都激活（稍后在arrangeParts中设置正确的位置和可见性）
        for (let i = 0; i < this.partNodes.length; i++) {
            // 不在这里激活节点，而是在arrangeParts中根据实际需要激活
            this.partNodes[i].active = false;
        }
    }

    calculateNodeGridPositions() {
        this.nodeGridPositions = [];
        this.nodeDirections = [];

        // 节点0: 箭头
        this.nodeGridPositions.push(new Vec2(this.gridPosition.x, this.gridPosition.y));
        this.nodeDirections.push(this.direction);

        let currentX = this.gridPosition.x;
        let currentY = this.gridPosition.y;
        let currentDirection = this.direction;

        // 节点1: 第一个身体（必须在箭头正后方）
        let firstBodyX = currentX;
        let firstBodyY = currentY;

        switch (currentDirection) {
            case 0: firstBodyY--; break; // 上 -> 上方 (Y坐标减少)
            case 1: firstBodyX--; break; // 右 -> 左方 (X坐标减少)
            case 2: firstBodyY++; break; // 下 -> 下方 (Y坐标增加)
            case 3: firstBodyX++; break; // 左 -> 右方 (X坐标增加)
        }

        if (this.isPositionValid(firstBodyX, firstBodyY)) {
            this.nodeGridPositions.push(new Vec2(firstBodyX, firstBodyY));
            this.nodeDirections.push(currentDirection);
            currentX = firstBodyX;
            currentY = firstBodyY;
        }

        // 处理后续身体部分（partsConfig定义的部分）
        for (let i = 0; i < this.partsConfig.length; i++) {
            const config = this.partsConfig[i];

            if (config.rotation !== 0) {
                currentDirection = (currentDirection + config.rotation + 4) % 4;
            }

            for (let j = 0; j < config.length; j++) {
                switch (currentDirection) {
                    case 0: currentY--; break; // 上 (Y坐标减少)
                    case 1: currentX++; break; // 右 (X坐标增加)
                    case 2: currentY++; break; // 下 (Y坐标增加)
                    case 3: currentX--; break; // 左 (X坐标减少)
                }

                if (this.isPositionValid(currentX, currentY)) {
                    this.nodeGridPositions.push(new Vec2(currentX, currentY));
                    this.nodeDirections.push(currentDirection);
                }
            }
        }
    }

    // 更新节点世界位置
    updateNodeWorldPositions() {
        // 计算网格起始点
        const gridOriginX = -(this.gameManager.width * this.gridSize) / 2 + this.gridSize / 2;
        const gridOriginY = -(this.gameManager.height * this.gridSize) / 2 + this.gridSize / 2;

        // 设置箭头根节点位置
        const rootWorldX = gridOriginX + this.gridPosition.x * this.gridSize;
        const rootWorldY = gridOriginY + this.gridPosition.y * this.gridSize;
        this.node.setPosition(rootWorldX, rootWorldY);

        // 更新所有逻辑节点位置
        for (let i = 0; i < this.partNodes.length; i++) {
            const node = this.partNodes[i];

            if (i < this.nodeGridPositions.length) {
                // 显示有历史位置的节点
                const gridPos = this.nodeGridPositions[i];
                const localX = (gridPos.x - this.gridPosition.x) * this.gridSize;
                const localY = (gridPos.y - this.gridPosition.y) * this.gridSize;

                node.setPosition(localX, localY);
                node.active = true;

                // 设置节点旋转
                this.updateNodeRotation(node, i);
            } else {
                // 隐藏多余的节点
                node.active = false;
            }
        }

        // 绘制路径
        this.drawPath();
    }

    // 在每两个节点之间插入额外的方块
    insertExtraNodesBetweenParts() {
        // 遍历所有节点对，在每对之间插入4个额外节点
        for (let i = 0; i < this.nodeGridPositions.length - 1; i++) {
            const startPos = this.nodeGridPositions[i];
            const endPos = this.nodeGridPositions[i + 1];

            // 在两点之间插入4个额外节点
            for (let j = 1; j <= this.INSERT_NODE_COUNT; j++) {
                const t = j / (this.INSERT_NODE_COUNT + 1); // 插值比例，如0.2, 0.4, 0.6, 0.8
                const interpX = startPos.x + (endPos.x - startPos.x) * t;
                const interpY = startPos.y + (endPos.y - startPos.y) * t;

                // 计算插入节点的索引 - 修正：从nodeGridPositions.length开始顺序排列
                const insertIndex = this.nodeGridPositions.length + (i * this.INSERT_NODE_COUNT) + (j - 1);

                // 确保有足够的节点
                if (insertIndex >= this.partNodes.length) {
                    continue;
                }

                // 设置插入节点的位置
                const node = this.partNodes[insertIndex];
                const localX = (interpX - this.gridPosition.x) * this.gridSize;
                const localY = (interpY - this.gridPosition.y) * this.gridSize;

                node.setPosition(localX, localY);
                node.active = true;

                // 设置插入节点的旋转（与起始节点相同）
                this.updateNodeRotation(node, i);
            }
        }

        // 隐藏多余的节点
        const totalNodesUsed = this.nodeGridPositions.length + (this.nodeGridPositions.length - 1) * this.INSERT_NODE_COUNT;
        for (let i = totalNodesUsed; i < this.partNodes.length; i++) {
            this.partNodes[i].active = false;
        }
    }

    // 更新节点旋转
    updateNodeRotation(node: Node, index: number) {
        if (index >= this.nodeDirections.length) return;

        let rotation = 0;
        const direction = this.nodeDirections[index];

        switch (direction) {
            case 0: rotation = 0; break;    // 上
            case 1: rotation = -90; break;  // 右
            case 2: rotation = 180; break;  // 下
            case 3: rotation = 90; break;   // 左
        }

        node.angle = rotation;
    }

    // 触摸开始事件
    onArrowTouchStart(event: EventTouch) {
        // 记录触摸开始位置
        this.touchStartPos.set(event.getUILocation());
    }

    // 触摸结束事件
    onArrowTouchEnd(event: EventTouch) {
        // 记录触摸结束位置
        this.touchEndPos.set(event.getUILocation());

        // 计算触摸开始和结束位置之间的距离
        const distance = Vec2.distance(this.touchStartPos, this.touchEndPos);

        // 只有当触摸开始和结束位置几乎相同时才触发点击事件（阈值设为5像素）
        if (distance < 5) {
            this.onArrowClick(event);
        }
    }

    // 触摸取消事件
    onArrowTouchCancel(event: EventTouch) {
        // 触摸取消时不触发点击事件
    }

    onArrowClick(event: EventTouch) {
        event.propagationStopped = true;

        if (!this.canMove || this.isMoving) return;

        const pathClear = this.checkPathClear();

        if (pathClear) {
            JTLXC_GameManager.Instance.PlayAudio(0);
            // 从地图数据中清除占用位置
            if (this.gameManager) {
                this.gameManager.updateMapDataWithArrow(
                    this.gridPosition.x,
                    this.gridPosition.y,
                    this.direction,
                    this.partsConfig,
                    0
                );
            }

            this.isMoving = true;
            this.canMove = false;

            // 开始移动
            this.prepareNextMove();
            JTLXC_GameManager.Instance.checkGameEnd();
            director.getScene().emit("箭头乐消除_教程", 0);
        } else {
            //错误
            // 将绘图组件颜色改为红色，并使用tween实现渐变效果
            if (this.graphics) {
                // 创建一个临时对象用于tween动画
                const colorObj = { r: 0, g: 0, b: 0 };
                const startColor = this.graphics.strokeColor.clone();
                const endColor = new Color(255, 100, 100);

                tween(colorObj)
                    .to(0.4, { r: endColor.r, g: endColor.g, b: endColor.b }, {
                        onUpdate: (target, ratio) => {
                            // 在动画过程中逐步更新颜色
                            const newColor = new Color(
                                Math.floor(startColor.r + (endColor.r - startColor.r) * ratio),
                                Math.floor(startColor.g + (endColor.g - startColor.g) * ratio),
                                Math.floor(startColor.b + (endColor.b - startColor.b) * ratio)
                            );
                            this.graphics.strokeColor = newColor;
                            this.drawPath(); // 重新绘制以应用颜色变化
                        }
                    })
                    .start();
                tween(this.node.getChildByName("箭头").getComponent(Sprite))
                    .to(0.4, { color: new Color(255, 100, 100) })
                    .start();
            }

            JTLXC_GameManager.Instance.RedHpEffect();
            JTLXC_GameManager.Instance.SubHp();
            JTLXC_GameManager.Instance.PlayAudio(1);
        }
    }

    // 准备下一次移动
    prepareNextMove() {
        // 计算目标位置
        this.targetGridPosition = this.calculateNewHeadPosition();

        // 保存移动前的所有节点位置（包括尾部）
        this.previousNodePositions = this.nodeGridPositions.map(pos => pos.clone());

        // 重置移动进度
        this.moveProgress = 0;
        this.moveTimer = 0;

        // 计算移动持续时间（基于移动速度）
        const distance = Math.sqrt(
            Math.pow(this.targetGridPosition.x - this.gridPosition.x, 2) +
            Math.pow(this.targetGridPosition.y - this.gridPosition.y, 2)
        );
        this.moveDuration = distance / this.moveSpeed;
    }

    // 逐帧更新移动
    updateMovement(deltaTime: number) {
        if (!this.isMoving) return;

        // 更新移动进度
        this.moveTimer += deltaTime;
        const newProgress = this.moveTimer / this.moveDuration;
        this.moveProgress = Math.min(newProgress, 1.0);

        // 计算插值根节点位置（使用更精确的计算）
        const interpRootX = this.gridPosition.x + (this.targetGridPosition.x - this.gridPosition.x) * this.moveProgress;
        const interpRootY = this.gridPosition.y + (this.targetGridPosition.y - this.gridPosition.y) * this.moveProgress;

        // 使用精确计算避免浮点误差
        const preciseRootX = Math.round(interpRootX * 1000) / 1000;
        const preciseRootY = Math.round(interpRootY * 1000) / 1000;

        // 更新根节点世界位置
        const gridOriginX = -(this.gameManager.width * this.gridSize) / 2 + this.gridSize / 2;
        const gridOriginY = -(this.gameManager.height * this.gridSize) / 2 + this.gridSize / 2;
        const rootWorldX = gridOriginX + preciseRootX * this.gridSize;
        const rootWorldY = gridOriginY + preciseRootY * this.gridSize;
        this.node.setPosition(rootWorldX, rootWorldY);

        // 计算新的节点位置（贪吃蛇式移动）
        const newPositions = this.calculateInterpolatedNodePositions();

        // 更新所有逻辑节点位置（使用相对于根节点的局部坐标）
        for (let i = 0; i < this.partNodes.length; i++) {
            const node = this.partNodes[i];

            if (i < newPositions.length) {
                const gridPos = newPositions[i];
                // 转换为相对于根节点的局部坐标，使用更高精度计算
                const localX = Math.round((gridPos.x - preciseRootX) * this.gridSize * 1000) / 1000;
                const localY = Math.round((gridPos.y - preciseRootY) * this.gridSize * 1000) / 1000;

                node.setPosition(localX, localY);
                node.active = true;

                // 设置节点旋转
                this.updateNodeRotation(node, i);
            } else {
                // 隐藏多余的节点
                node.active = false;
            }
        }

        // 绘制插值路径
        this.drawInterpolatedPath(newPositions, preciseRootX, preciseRootY);

        // 检查是否移动完成
        if (this.moveProgress >= 1.0) {
            this.onMoveStepComplete();
        }
    }

    // 更新插值位置
    updateInterpolatedPositions() {
        // 计算插值的根节点位置
        const interpRootX = this.gridPosition.x + (this.targetGridPosition.x - this.gridPosition.x) * this.moveProgress;
        const interpRootY = this.gridPosition.y + (this.targetGridPosition.y - this.gridPosition.y) * this.moveProgress;

        // 计算网格起始点（用于将网格坐标转换为世界坐标）
        const gridOriginX = -(this.gameManager.width * this.gridSize) / 2 + this.gridSize / 2;
        const gridOriginY = -(this.gameManager.height * this.gridSize) / 2 + this.gridSize / 2;

        // 设置箭头根节点的世界位置
        const rootWorldX = gridOriginX + interpRootX * this.gridSize;
        const rootWorldY = gridOriginY + interpRootY * this.gridSize;
        this.node.setPosition(rootWorldX, rootWorldY);

        // 计算新的节点位置（贪吃蛇式移动）
        const newPositions = this.calculateInterpolatedNodePositions();

        // 更新所有逻辑节点位置（使用相对于根节点的局部坐标）
        for (let i = 0; i < this.partNodes.length; i++) {
            const node = this.partNodes[i];

            if (i < newPositions.length) {
                const gridPos = newPositions[i];
                // 转换为相对于根节点的局部坐标
                const localX = (gridPos.x - interpRootX) * this.gridSize;
                const localY = (gridPos.y - interpRootY) * this.gridSize;

                node.setPosition(localX, localY);
                node.active = true;

                // 设置节点旋转
                this.updateNodeRotation(node, i);
            } else {
                // 隐藏多余的节点
                node.active = false;
            }
        }

        // 绘制插值路径
        this.drawInterpolatedPath(newPositions, interpRootX, interpRootY);
    }

    // 计算插值的节点位置
    calculateInterpolatedNodePositions(): Vec2[] {
        const newPositions: Vec2[] = [];

        // 头部位置直接插值，使用更高精度计算
        const headX = Math.round((this.gridPosition.x + (this.targetGridPosition.x - this.gridPosition.x) * this.moveProgress) * 1000) / 1000;
        const headY = Math.round((this.gridPosition.y + (this.targetGridPosition.y - this.gridPosition.y) * this.moveProgress) * 1000) / 1000;
        newPositions.push(new Vec2(headX, headY));

        // 其他节点依次向前移动（每个节点移动到前一个节点的位置）
        for (let i = 1; i < this.nodeGridPositions.length; i++) {
            const fromPos = this.previousNodePositions[i];
            const toPos = this.nodeGridPositions[i - 1]; // 移动到前一个节点的位置

            // 使用更高精度的插值计算
            const interpX = Math.round((fromPos.x + (toPos.x - fromPos.x) * this.moveProgress) * 1000) / 1000;
            const interpY = Math.round((fromPos.y + (toPos.y - fromPos.y) * this.moveProgress) * 1000) / 1000;

            newPositions.push(new Vec2(interpX, interpY));
        }

        return newPositions;
    }

    // 为插值位置插入额外的方块
    insertExtraNodesBetweenPartsForInterpolation(newPositions: Vec2[], interpRootX: number, interpRootY: number) {
        // 遍历所有节点对，在每对之间插入额外节点
        for (let i = 0; i < newPositions.length - 1; i++) {
            const startPos = newPositions[i];
            const endPos = newPositions[i + 1];

            // 计算插入节点的索引
            const insertIndex = newPositions.length + (i * this.INSERT_NODE_COUNT) + (0);

            // 确保有足够的节点
            if (insertIndex >= this.partNodes.length) {
                continue;
            }

            // 检查是否为转弯处（x和y坐标都不相同）
            if (startPos.x !== endPos.x && startPos.y !== endPos.y) {
                // 转弯情况 - 创建一个拐角点
                // 根据规范，拐角点由起点X和终点Y组成（或者是起点Y和终点X）
                // 判断哪种组合符合网格线要求
                let cornerPos: Vec2;
                if (startPos.x === Math.round(startPos.x) && startPos.y === Math.round(startPos.y) &&
                    endPos.x === Math.round(endPos.x) && endPos.y === Math.round(endPos.y)) {
                    // 如果起点和终点都是整数坐标，那么拐角点应该是 (startX, endY) 或 (endX, startY)
                    // 为了确保在网格线上，我们选择 (startX, endY)
                    cornerPos = new Vec2(startPos.x, endPos.y);
                } else {
                    // 使用精确计算避免浮点误差，确保与路径绘制保持一致
                    const dx = endPos.x - startPos.x;
                    const dy = endPos.y - startPos.y;

                    // 与drawInterpolatedPath方法保持一致的拐角点计算逻辑
                    // 使用更稳定的比较方法避免在dx和dy绝对值相等时的闪烁问题
                    if (Math.abs(dx) > Math.abs(dy) || (Math.abs(dx) === Math.abs(dy) && Math.abs(dx) > 0)) {
                        // 水平优先转向：→↑、→↓、←↑、←↓
                        // 拐角点为 (end.x, start.y)
                        cornerPos = new Vec2(
                            Math.round(endPos.x * 1000) / 1000,
                            Math.round(startPos.y * 1000) / 1000
                        );
                    } else if (Math.abs(dy) > 0) {
                        // 垂直优先转向：↑→、↑←、↓→、↓←
                        // 拐角点为 (start.x, end.y)
                        cornerPos = new Vec2(
                            Math.round(startPos.x * 1000) / 1000,
                            Math.round(endPos.y * 1000) / 1000
                        );
                    } else {
                        // 特殊情况不应该发生，但如果发生则使用中点
                        cornerPos = new Vec2(
                            Math.round((startPos.x + endPos.x) / 2 * 1000) / 1000,
                            Math.round((startPos.y + endPos.y) / 2 * 1000) / 1000
                        );
                    }
                }

                // 在转角处创建额外的节点，使用8个点确保连续性
                this.createInterpolatedNodesForCorner(startPos, cornerPos, endPos, i, newPositions.length, interpRootX, interpRootY);
            } else {
                // 直线情况 - 按照原来的方式插入节点
                this.createInterpolatedNodesForStraight(startPos, endPos, i, newPositions.length, interpRootX, interpRootY);
            }
        }

        // 隐藏多余的节点
        const totalNodesUsed = newPositions.length + (newPositions.length - 1) * this.INSERT_NODE_COUNT;
        for (let i = totalNodesUsed; i < this.partNodes.length; i++) {
            this.partNodes[i].active = false;
        }
    }

    // 为直线段创建插值节点
    createInterpolatedNodesForStraight(startPos: Vec2, endPos: Vec2, segmentIndex: number, baseIndex: number, interpRootX: number, interpRootY: number) {
        for (let j = 1; j <= this.INSERT_NODE_COUNT; j++) {
            // 使用线性插值计算，确保与拐角处的计算方式一致
            const t = j / (this.INSERT_NODE_COUNT + 1);
            const interpX = startPos.x + (endPos.x - startPos.x) * t;
            const interpY = startPos.y + (endPos.y - startPos.y) * t;

            const insertIndex = baseIndex + (segmentIndex * this.INSERT_NODE_COUNT) + (j - 1);

            if (insertIndex >= this.partNodes.length) {
                continue;
            }

            const node = this.partNodes[insertIndex];
            // 使用更高精度的局部坐标计算
            const localX = Math.round((interpX - interpRootX) * this.gridSize * 1000) / 1000;
            const localY = Math.round((interpY - interpRootY) * this.gridSize * 1000) / 1000;

            node.setPosition(localX, localY);
            node.active = true;
            this.updateNodeRotation(node, segmentIndex);
        }
    }

    // 为转角创建插值节点（根据规范使用8个点）
    createInterpolatedNodesForCorner(startPos: Vec2, cornerPos: Vec2, endPos: Vec2, segmentIndex: number, baseIndex: number, interpRootX: number, interpRootY: number) {
        // 规范要求使用8个插值点，前4个在起点到拐点间，后4个在拐点到终点间
        const totalInterpPoints = 8;
        const halfPoints = totalInterpPoints / 2;

        // 前半部分：起点到拐点
        for (let j = 1; j <= halfPoints; j++) {
            // 使用线性插值计算
            const t = j / (halfPoints + 1);
            const interpX = startPos.x + (cornerPos.x - startPos.x) * t;
            const interpY = startPos.y + (cornerPos.y - startPos.y) * t;

            const insertIndex = baseIndex + (segmentIndex * this.INSERT_NODE_COUNT) + (j - 1);

            if (insertIndex >= this.partNodes.length) {
                continue;
            }

            const node = this.partNodes[insertIndex];
            // 使用更高精度的局部坐标计算
            const localX = Math.round((interpX - interpRootX) * this.gridSize * 1000) / 1000;
            const localY = Math.round((interpY - interpRootY) * this.gridSize * 1000) / 1000;

            node.setPosition(localX, localY);
            node.active = true;
            this.updateNodeRotation(node, segmentIndex);
        }

        // 后半部分：拐点到终点
        for (let j = 1; j <= halfPoints; j++) {
            // 使用线性插值计算
            const t = j / (halfPoints + 1);
            const interpX = cornerPos.x + (endPos.x - cornerPos.x) * t;
            const interpY = cornerPos.y + (endPos.y - cornerPos.y) * t;

            const insertIndex = baseIndex + (segmentIndex * this.INSERT_NODE_COUNT) + (halfPoints + j - 1);

            if (insertIndex >= this.partNodes.length) {
                continue;
            }

            const node = this.partNodes[insertIndex];
            // 使用更高精度的局部坐标计算
            const localX = Math.round((interpX - interpRootX) * this.gridSize * 1000) / 1000;
            const localY = Math.round((interpY - interpRootY) * this.gridSize * 1000) / 1000;

            node.setPosition(localX, localY);
            node.active = true;
            // 注意：这部分使用下一个段的索引来更新旋转
            this.updateNodeRotation(node, segmentIndex + 1);
        }
    }

    // 移动步骤完成
    onMoveStepComplete() {
        // 更新网格位置
        this.gridPosition.set(this.targetGridPosition);

        // 更新节点位置（贪吃蛇式移动）
        this.updateNodePositionsForMovement();

        // 重置移动计时器
        this.moveTimer = 0;

        // 准备下一次移动
        this.prepareNextMove();
    }

    // 计算新的节点位置（贪吃蛇式移动）
    updateNodePositionsForMovement() {
        // 所有节点向前移动：节点i移动到节点i-1的位置
        for (let i = this.nodeGridPositions.length - 1; i > 0; i--) {
            this.nodeGridPositions[i].set(this.nodeGridPositions[i - 1]);
            this.nodeDirections[i] = this.nodeDirections[i - 1];
        }

        // 头部移动到新位置
        this.nodeGridPositions[0].set(this.targetGridPosition);
    }

    // 计算新的头部位置
    calculateNewHeadPosition(): Vec2 {
        const newHeadPos = this.gridPosition.clone();

        switch (this.direction) {
            case 0: newHeadPos.y++; break; // 上
            case 1: newHeadPos.x++; break; // 右
            case 2: newHeadPos.y--; break; // 下
            case 3: newHeadPos.x--; break; // 左
        }

        return newHeadPos;
    }

    // 检查位置是否有效（仅用于初始化）
    isPositionValid(x: number, y: number): boolean {
        return x >= 0 && x < this.gameManager.width &&
            y >= 0 && y < this.gameManager.height;
    }

    // 安排各部分的位置和旋转，实现真正的贪吃蛇效果
    arrangeParts() {
        if (this.partNodes.length === 0) return;

        // 重置所有节点的位置和激活状态
        for (let i = 0; i < this.partNodes.length; i++) {
            this.partNodes[i].setPosition(Vec3.ZERO);
            this.partNodes[i].active = false; // 默认隐藏所有节点
        }

        // 激活箭头节点
        if (this.partNodes.length > 0) {
            this.partNodes[0].active = true;
        }

        // 设置整个箭头的旋转（而不是只旋转头部）
        let arrowRotation = 0;
        switch (this.direction) {
            case 0: arrowRotation = 0; break;    // 上
            case 1: arrowRotation = -90; break;  // 右
            case 2: arrowRotation = 180; break;  // 下
            case 3: arrowRotation = 90; break;   // 左
        }
        this.node.angle = arrowRotation;

        // 当前位置（相对于箭头根节点的本地坐标）和方向
        let currentX = 0;
        let currentY = 0;

        // 放置第一个身体节点（在箭头正后方）
        if (this.partNodes.length > 1) {
            switch (this.direction) {
                case 0: currentY -= 1; break; // 上 -> 上方 (Y坐标减少)
                case 1: currentX -= 1; break; // 右 -> 左方 (X坐标减少)
                case 2: currentY += 1; break; // 下 -> 下方 (Y坐标增加)
                case 3: currentX += 1; break; // 左 -> 右方 (X坐标增加)
            }

            // 设置第一个身体节点位置
            const localX = currentX * this.gridSize;
            const localY = currentY * this.gridSize;
            this.partNodes[1].setPosition(localX, localY);
            this.partNodes[1].active = true;
        }

        // 处理partsConfig定义的部分
        let currentDirection = this.direction;
        let nodeIndex = 2; // 从第二个身体节点开始

        for (let i = 0; i < this.partsConfig.length; i++) {
            const config = this.partsConfig[i];

            // 应用旋转（相对于前一部分）
            const newDirection = (currentDirection + config.rotation + 4) % 4;

            // 放置这一部分的所有节点
            for (let j = 0; j < config.length && nodeIndex < this.partNodes.length; j++) {
                // 根据新方向更新坐标（注意：这里是相对于箭头本地坐标系）
                switch (newDirection) {
                    case 0: currentY -= 1; break; // 上 -> Y减小
                    case 1: currentX += 1; break; // 右 -> X增大
                    case 2: currentY += 1; break; // 下 -> Y增大
                    case 3: currentX -= 1; break; // 左 -> X减小
                }

                // 计算相对于箭头根节点的位置（本地坐标）
                const localX = currentX * this.gridSize;
                const localY = currentY * this.gridSize;

                // 设置节点位置
                this.partNodes[nodeIndex].setPosition(localX, localY);
                this.partNodes[nodeIndex].active = true;

                nodeIndex++;
            }

            // 更新当前方向
            currentDirection = newDirection;
        }

        // 隐藏多余的节点
        for (let i = nodeIndex; i < this.partNodes.length; i++) {
            this.partNodes[i].active = false;
        }
    }

    // 销毁箭头
    destroyArrow() {
        this.isMoving = false;

        if (this.node && this.node.isValid) {
            this.node.destroy();
        }
    }

    checkPathClear(): boolean {
        if (this.gameManager) {
            return this.gameManager.checkArrowCanMove(this.gridPosition.x, this.gridPosition.y, this.direction);
        }
        return false;
    }

    onDestroy() {
        if (this.node && this.node.isValid) {
            for (let i = 0; i < this.node.children.length; i++) {
                const child = this.node.children[i];
                if (child && child.isValid) {
                    child.off(Node.EventType.TOUCH_START, this.onArrowTouchStart, this);
                    child.off(Node.EventType.TOUCH_END, this.onArrowTouchEnd, this);
                    child.off(Node.EventType.TOUCH_CANCEL, this.onArrowTouchCancel, this);
                }
            }
        }
    }

    // 初始化Graphics组件
    initGraphics() {
        // 查找或创建Graphics节点
        let graphicsNode = this.node.getChildByName("PathGraphics");
        if (!graphicsNode) {
            graphicsNode = new Node("PathGraphics");
            graphicsNode.addComponent(Graphics);
            graphicsNode.parent = this.node;
            graphicsNode.setSiblingIndex(0); // 确保路径在最底层
        }

        this.graphics = graphicsNode.getComponent(Graphics);
        this.graphics.lineWidth = 14; // 设置线条宽度为14，与方块一致
        this.graphics.strokeColor = Color.BLACK.clone();
    }

    // 绘制路径
    drawPath() {
        if (!this.graphics) return;

        // 清除之前的绘制
        this.graphics.clear();

        // 绘制路径
        const positions: Vec2[] = [];
        for (let i = 0; i < this.nodeGridPositions.length; i++) {
            const gridPos = this.nodeGridPositions[i];
            // 转换为本地坐标（相对于根节点）
            const localX = (gridPos.x - this.gridPosition.x) * this.gridSize;
            const localY = (gridPos.y - this.gridPosition.y) * this.gridSize;
            positions.push(new Vec2(localX, localY));
        }

        if (positions.length > 0) {
            this.graphics.moveTo(positions[0].x, positions[0].y);
            for (let i = 1; i < positions.length; i++) {
                const prev = positions[i - 1];
                const curr = positions[i];

                // 检查是否形成拐角（x和y坐标都不相同）
                if (prev.x !== curr.x && prev.y !== curr.y) {
                    // 这是一个拐角，我们需要根据实际转向方向来确定拐角点
                    // 计算水平和垂直方向的移动
                    const dx = curr.x - prev.x;
                    const dy = curr.y - prev.y;

                    // 保持与drawInterpolatedPath方法一致的拐角点计算逻辑
                    // 使用更稳定的比较方法避免在dx和dy绝对值相等时的闪烁问题
                    let cornerX, cornerY;
                    if (Math.abs(dx) > Math.abs(dy) || (Math.abs(dx) === Math.abs(dy) && Math.abs(dx) > 0)) {
                        // 水平优先转向：→↑、→↓、←↑、←↓
                        // 拐角点为 (curr.x, prev.y)
                        cornerX = Math.round(curr.x * 1000) / 1000;
                        cornerY = Math.round(prev.y * 1000) / 1000;
                    } else if (Math.abs(dy) > 0) {
                        // 垂直优先转向：↑→、↑←、↓→、↓←
                        // 拐角点为 (prev.x, curr.y)
                        cornerX = Math.round(prev.x * 1000) / 1000;
                        cornerY = Math.round(curr.y * 1000) / 1000;
                    } else {
                        // 特殊情况：dx和dy都为0，不应该发生，但为了安全起见直接连线
                        this.graphics.lineTo(curr.x, curr.y);
                        continue;
                    }

                    // 绘制到拐角点
                    this.graphics.lineTo(cornerX, cornerY);
                }

                // 绘制到当前点
                this.graphics.lineTo(curr.x, curr.y);
            }
        }

        this.graphics.stroke();
    }

    // 更新插值位置时的绘制
    drawInterpolatedPath(newPositions: Vec2[], interpRootX: number, interpRootY: number) {
        if (!this.graphics || newPositions.length <= 1) return;

        // 清除之前的绘制
        this.graphics.clear();

        // 设置线条宽度和颜色为黑色
        this.graphics.lineWidth = 14; // 设置线条宽度为14，与方块一致
        this.graphics.strokeColor = Color.BLACK;

        // 将所有网格坐标转换为本地坐标，使用更高的精度处理
        const localPositions: Vec2[] = [];
        for (let i = 0; i < newPositions.length; i++) {
            const gridPos = newPositions[i];
            // 使用更精确的计算方式避免浮点误差累积
            const localX = Math.round((gridPos.x - interpRootX) * this.gridSize * 1000) / 1000;
            const localY = Math.round((gridPos.y - interpRootY) * this.gridSize * 1000) / 1000;
            localPositions.push(new Vec2(localX, localY));
        }

        // 绘制连续路径，严格按照网格线方向绘制
        this.graphics.moveTo(localPositions[0].x, localPositions[0].y);
        for (let i = 1; i < localPositions.length; i++) {
            const prev = localPositions[i - 1];
            const curr = localPositions[i];

            // 检查是否形成拐角（x和y坐标都不相同）
            if (prev.x !== curr.x && prev.y !== curr.y) {
                // 这是一个拐角，我们需要根据实际转向方向来确定拐角点
                // 计算水平和垂直方向的移动
                const dx = curr.x - prev.x;
                const dy = curr.y - prev.y;

                // 保持与drawPath方法一致的拐角点计算逻辑
                // 使用更稳定的比较方法避免在dx和dy绝对值相等时的闪烁问题
                let cornerX, cornerY;
                if (Math.abs(dx) >= Math.abs(dy)) {
                    // 水平优先转向：→↑、→↓、←↑、←↓
                    // 拐角点为 (curr.x, prev.y)
                    cornerX = Math.round(curr.x * 1000) / 1000;
                    cornerY = Math.round(prev.y * 1000) / 1000;
                } else if (Math.abs(dy) > 0) {
                    // 垂直优先转向：↑→、↑←、↓→、↓←
                    // 拐角点为 (prev.x, curr.y)
                    cornerX = Math.round(prev.x * 1000) / 1000;
                    cornerY = Math.round(curr.y * 1000) / 1000;
                } else {
                    // 特殊情况：dx和dy都为0，不应该发生，但为了安全起见直接连线
                    this.graphics.lineTo(curr.x, curr.y);
                    continue;
                }

                // 绘制到拐角点
                this.graphics.lineTo(cornerX, cornerY);
            }

            // 绘制到当前点
            this.graphics.lineTo(curr.x, curr.y);
        }

        this.graphics.stroke();
    }

    // 网格坐标转世界坐标
    gridToWorld(gridPos: Vec2): Vec2 {
        const gridOriginX = -(this.gameManager.width * this.gridSize) / 2 + this.gridSize / 2;
        const gridOriginY = -(this.gameManager.height * this.gridSize) / 2 + this.gridSize / 2;
        return new Vec2(
            gridOriginX + gridPos.x * this.gridSize - this.gridPosition.x * this.gridSize,
            gridOriginY + gridPos.y * this.gridSize - this.gridPosition.y * this.gridSize
        );
    }
}