import { _decorator, Component, Node, Vec2, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JTLXC_TestArrows')
export class JTLXC_TestArrows extends Component {
    // 箭头方向
    public direction: number = 0; // 0: 上, 1: 右, 2: 下, 3: 左

    // 箭头在网格中的位置
    public gridPosition: Vec2 = new Vec2(0, 0);

    // 箭头各部分的配置信息
    public partsConfig: { length: number, rotation: number }[] = [];

    // 网格大小
    private gridSize: number = 50;
    
    // 网格尺寸
    private width: number = 10;
    private height: number = 10;

    // 箭头各部分节点
    private partNodes: Node[] = [];

    // 格子预制体（用于复制）
    private cellPrefab: Node = null;

    // 箭头所有节点的网格位置记录
    public nodeGridPositions: Vec2[] = [];

    // 记录每个节点的朝向
    private nodeDirections: number[] = [];

    // 插入节点数量
    private readonly INSERT_NODE_COUNT: number = 4;

    /**
     * 初始化箭头
     * @param direction 箭头方向
     * @param gridPos 网格位置
     * @param partsConfig 身体部分配置
     * @param width 网格宽度
     * @param height 网格高度
     */
    init(direction: number, gridPos: Vec2, partsConfig: { length: number, rotation: number }[], width: number = 10, height: number = 10) {
        this.direction = direction;
        this.gridPosition = gridPos.clone();
        this.partsConfig = [...partsConfig];
        this.width = width;
        this.height = height;

        // 初始化箭头部件
        this.setupArrowParts();

        // 计算节点位置
        this.calculateNodeGridPositions();

        // 更新节点位置
        this.updateNodeWorldPositions();
    }

    // 初始化箭头部件
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

    // 计算节点网格位置
    calculateNodeGridPositions() {
        this.nodeGridPositions = [];
        this.nodeDirections = [];

        // 节点0: 箭头
        this.nodeGridPositions.push(new Vec2(this.gridPosition.x, this.gridPosition.y));
        // 注意：这里不推入方向到nodeDirections数组，箭头方向由this.direction单独维护

        // 节点1: 第一个身体（必须在箭头正后方）
        let firstBodyX = this.gridPosition.x;
        let firstBodyY = this.gridPosition.y;

        switch (this.direction) {
            case 0: firstBodyY--; break; // 上 -> 上方 (Y坐标减少)
            case 1: firstBodyX--; break; // 右 -> 左方 (X坐标减少)
            case 2: firstBodyY++; break; // 下 -> 下方 (Y坐标增加)
            case 3: firstBodyX++; break; // 左 -> 右方 (X坐标增加)
        }

        if (this.isPositionValid(firstBodyX, firstBodyY)) {
            this.nodeGridPositions.push(new Vec2(firstBodyX, firstBodyY));
            this.nodeDirections.push(this.direction);
        }

        // 处理后续身体部分（partsConfig定义的部分）
        let currentX = firstBodyX;
        let currentY = firstBodyY;
        let currentDirection = this.direction;
        
        for (let i = 0; i < this.partsConfig.length; i++) {
            const config = this.partsConfig[i];

            // 应用旋转（相对于前一部分）
            if (config.rotation !== 0) {
                // 调整方向（处理负数取模问题）
                currentDirection = (currentDirection + config.rotation + 4) % 4;
            }

            // 放置这一部分的所有节点
            for (let j = 0; j < config.length; j++) {
                // 根据新方向更新坐标
                switch (currentDirection) {
                    case 0: currentY--; break; // 上 -> Y减小
                    case 1: currentX++; break; // 右 -> X增大
                    case 2: currentY++; break; // 下 -> Y增大
                    case 3: currentX--; break; // 左 -> X减小
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
        // 计算网格起始点（使用实际的网格尺寸）
        const gridOriginX = -(this.width * this.gridSize) / 2 + this.gridSize / 2;
        const gridOriginY = -(this.height * this.gridSize) / 2 + this.gridSize / 2;

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

        // 在每两个节点之间插入额外的方块
        this.insertExtraNodesBetweenParts();
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

                // 计算插入节点的索引
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
        // 箭头节点（索引0）使用this.direction确定旋转
        if (index === 0) {
            let rotation = 0;
            switch (this.direction) {
                case 0: rotation = 0; break;    // 上
                case 1: rotation = -90; break;  // 右
                case 2: rotation = 180; break;  // 下
                case 3: rotation = 90; break;   // 左
            }
            node.angle = rotation;
            return;
        }

        // 身体节点使用nodeDirections数组确定旋转
        const bodyIndex = index - 1; // 身体节点索引需要减1（因为索引0是箭头）
        if (bodyIndex >= this.nodeDirections.length) return;

        let rotation = 0;
        const direction = this.nodeDirections[bodyIndex];

        switch (direction) {
            case 0: rotation = 0; break;    // 上
            case 1: rotation = -90; break;  // 右
            case 2: rotation = 180; break;  // 下
            case 3: rotation = 90; break;   // 左
        }

        node.angle = rotation;
    }

    // 检查位置是否有效（仅用于初始化）
    isPositionValid(x: number, y: number): boolean {
        // 对于测试脚本，我们不做边界检查，只要坐标是合理的数值就可以
        return isFinite(x) && isFinite(y);
    }
}