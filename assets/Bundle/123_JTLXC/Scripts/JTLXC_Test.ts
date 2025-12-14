import { _decorator, Component, Node, Prefab, Vec2, instantiate, EventTouch, Vec3, EventMouse, input, Input, KeyCode } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JTLXC_Test')
export class JTLXC_Test extends Component {

    @property(Prefab)
    public dot: Prefab = null;//底部点的预制体
    @property(Prefab)
    public ArrowsPre: Prefab = null;//箭头预制体

    public width: number = 25;
    public height: number = 35;

    // 存储所有箭头的二维数组
    private arrowsGrid: (Node | null)[][] = [];

    // 网格大小
    private gridSize: number = 50;

    // 背景节点
    private backgroundNode: Node = null;

    // 箭头身体占用的位置
    private arrowBodyPositions: { x: number, y: number }[][][] = [];

    // 箭头配置信息
    private arrowConfigs: { direction: number, bodies: { x: number, y: number }[] }[][] = [];

    // 当前选中的箭头
    private selectedArrow: { x: number, y: number } | null = null;

    // 双击检测
    private lastClickTime: number = 0;
    private doubleClickDelay: number = 300; // 双击间隔时间（毫秒）

    // 防抖定时器
    private debounceTimer: any = null;

    start() {
        this.initBackground();
        this.initArrowsGrid();

        // 监听键盘事件
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    // 键盘事件处理
    onKeyDown(event: any) {
        // 按L键输出整个网格状态
        if (event.keyCode === KeyCode.KEY_L) { // L键
            this.printGridState();
            return;
        }

        // 按M键输出场景JSON数据
        if (event.keyCode === KeyCode.KEY_M) { // M键
            this.printSceneJSON();
            return;
        }

        // 只有当选中箭头时才处理WASD按键
        if (this.selectedArrow) {
            switch (event.keyCode) {
                case KeyCode.KEY_W: // W键
                    this.addBodyInDirection(this.selectedArrow.x, this.selectedArrow.y, 2); // 下（与S键交换回来）
                    break;
                case KeyCode.KEY_A: // A键
                    this.addBodyInDirection(this.selectedArrow.x, this.selectedArrow.y, 3); // 左
                    break;
                case KeyCode.KEY_S: // S键
                    this.addBodyInDirection(this.selectedArrow.x, this.selectedArrow.y, 0); // 上（与W键交换回来）
                    break;
                case KeyCode.KEY_D: // D键
                    this.addBodyInDirection(this.selectedArrow.x, this.selectedArrow.y, 1); // 右
                    break;
            }
        }
    }

    // 添加身体节点到箭头
    addBodyToArrow(arrowX: number, arrowY: number, bodyX: number, bodyY: number) {
        // 检查身体位置是否有效
        if (bodyX >= 0 && bodyX < this.width && bodyY >= 0 && bodyY < this.height) {
            // 添加到身体位置数组
            this.arrowBodyPositions[arrowX][arrowY].push({ x: bodyX, y: bodyY });

            // 添加到配置中
            this.arrowConfigs[arrowX][arrowY].bodies.push({ x: bodyX, y: bodyY });

            // 刷新箭头显示
            this.refreshArrowDisplay(arrowX, arrowY);
        }
    }

    // 刷新箭头显示
    refreshArrowDisplay(arrowX: number, arrowY: number) {
        const arrowNode = this.arrowsGrid[arrowX][arrowY];
        if (arrowNode) {
            // 构建partsConfig
            const partsConfig: { length: number, rotation: number }[] = [];

            // 如果有额外的身体节点（除了默认的第一个）
            if (this.arrowConfigs[arrowX][arrowY].bodies.length > 1) {
                // 第一个身体节点已经在箭头初始化时自动创建，我们从第二个节点开始计算
                let currentDirection = this.arrowConfigs[arrowX][arrowY].direction;

                // 计算每一段的长度和方向
                for (let i = 1; i < this.arrowConfigs[arrowX][arrowY].bodies.length; i++) {
                    // 获取当前节点与前一个节点
                    const currentBody = this.arrowConfigs[arrowX][arrowY].bodies[i];
                    const previousBody = this.arrowConfigs[arrowX][arrowY].bodies[i - 1];

                    // 计算方向
                    const newDirection = this.calculateRotation(previousBody, currentBody);

                    // 计算旋转角度（相对于当前方向）
                    let rotation = 0;
                    if (newDirection !== currentDirection) {
                        // 计算从当前方向到新方向的旋转
                        rotation = (newDirection - currentDirection + 4) % 4;
                        // 处理特殊情况（例如从方向3到方向0应该是+1而不是-3）
                        if (rotation > 2) rotation -= 4;
                    }

                    // 添加到配置
                    partsConfig.push({
                        length: 1,
                        rotation: rotation
                    });

                    // 更新当前方向
                    currentDirection = newDirection;
                }
            }

            // 更新箭头显示
            const testArrowComponent: any = arrowNode.getComponent('JTLXC_TestArrows');
            if (testArrowComponent) {
                testArrowComponent.init(
                    this.arrowConfigs[arrowX][arrowY].direction,
                    new Vec2(arrowX, arrowY),
                    partsConfig,
                    this.width,
                    this.height
                );
            }
        }
    }

    // 计算从from点到to点的方向（基于绝对坐标系）
    calculateRotation(from: { x: number, y: number }, to: { x: number, y: number }): number {
        // 计算相对位置
        const dx = to.x - from.x;
        const dy = to.y - from.y;

        // 映射移动方向到绝对方向索引：
        // 0: 上 (dy = -1), 1: 右 (dx = +1), 2: 下 (dy = +1), 3: 左 (dx = -1)
        if (dx === 1 && dy === 0) return 1;   // 右
        if (dx === -1 && dy === 0) return 3;  // 左
        if (dx === 0 && dy === -1) return 0;  // 上
        if (dx === 0 && dy === 1) return 2;   // 下

        // 无效方向时默认返回上
        return 0;
    }

    // 在指定方向添加身体节点
    addBodyInDirection(arrowX: number, arrowY: number, direction: number) {
        // 获取箭头的最新身体节点作为起点
        const bodies = this.arrowConfigs[arrowX][arrowY].bodies;
        let startX = arrowX;
        let startY = arrowY;

        // 如果已经有身体节点，则使用最后一个身体节点的位置作为起点
        if (bodies.length > 0) {
            const lastBody = bodies[bodies.length - 1];
            startX = lastBody.x;
            startY = lastBody.y;
        }

        // 计算目标位置（基于最后一个身体节点的位置，按照绝对方向）
        let targetX = startX, targetY = startY;

        // 按照绝对方向计算目标位置（不考虑箭头当前朝向）
        // 注意：这里使用的是屏幕坐标系，Y轴向下为正方向
        switch (direction) {
            case 0: targetY--; break; // 上（Y坐标减少）
            case 1: targetX++; break; // 右（X坐标增加）
            case 2: targetY++; break; // 下（Y坐标增加）
            case 3: targetX--; break; // 左（X坐标减少）
        }

        // 检查目标位置是否有效且未被占用
        if (targetX >= 0 && targetX < this.width &&
            targetY >= 0 && targetY < this.height &&
            !this.isPositionOccupied(targetX, targetY)) {

            // 添加身体节点
            this.addBodyToArrow(arrowX, arrowY, targetX, targetY);
        }
    }

    // 初始化背景网格
    initBackground() {
        // 创建背景节点
        this.backgroundNode = new Node("Background");
        this.backgroundNode.parent = this.node;

        // 计算网格起始点
        const gridOriginX = -(this.width * this.gridSize) / 2 + this.gridSize / 2;
        const gridOriginY = -(this.height * this.gridSize) / 2 + this.gridSize / 2;

        // 创建网格点
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.dot) {
                    const dotNode = instantiate(this.dot);
                    dotNode.parent = this.backgroundNode;

                    const worldX = gridOriginX + x * this.gridSize;
                    const worldY = gridOriginY + y * this.gridSize;

                    dotNode.setPosition(worldX, worldY);

                    // 添加点击事件
                    dotNode.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
                        this.onGridClick(x, y, event);
                    });

                    // 添加右键事件（MOUSE_DOWN可以捕获右键）
                    dotNode.on(Node.EventType.MOUSE_DOWN, (event: EventMouse) => {
                        // 检查是否为右键
                        if (event.getButton() === EventMouse.BUTTON_RIGHT) {
                            this.onGridRightClick(x, y, event);
                        }
                    });
                }
            }
        }
    }

    // 初始化箭头网格数组
    initArrowsGrid() {
        this.arrowsGrid = [];
        this.arrowBodyPositions = [];
        this.arrowConfigs = [];
        for (let x = 0; x < this.width; x++) {
            this.arrowsGrid[x] = [];
            this.arrowBodyPositions[x] = [];
            this.arrowConfigs[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.arrowsGrid[x][y] = null;
                this.arrowBodyPositions[x][y] = []; // 初始化为空数组
                this.arrowConfigs[x][y] = { direction: 0, bodies: [] }; // 初始化配置
            }
        }
    }

    // 网格点击事件
    onGridClick(x: number, y: number, event: EventTouch) {
        // 阻止事件冒泡
        event.propagationStopped = true;

        // 检测双击
        const currentTime = Date.now();
        const isDoubleClick = (currentTime - this.lastClickTime) < this.doubleClickDelay;
        this.lastClickTime = currentTime;

        // 添加防抖标志，避免双击时执行两次操作
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }

        if (this.arrowsGrid[x][y]) {
            // 点击的是箭头
            if (isDoubleClick) {
                // 双击旋转箭头
                this.rotateArrow(x, y);
            } else {
                // 单击选中/取消选中箭头，设置防抖定时器
                this.debounceTimer = setTimeout(() => {
                    if (this.selectedArrow && this.selectedArrow.x === x && this.selectedArrow.y === y) {
                        // 取消选中
                        this.selectedArrow = null;
                    } else {
                        // 选中箭头
                        this.selectedArrow = { x, y };
                    }
                }, this.doubleClickDelay);
            }
        } else {
            // 点击的是空位置
            // 检查该位置是否被其他箭头的身体占用
            if (!this.isPositionOccupied(x, y)) {
                // 如果没有被占用，则创建新箭头
                this.createArrow(x, y);

                // 自动选中新创建的箭头
                this.selectedArrow = { x, y };
            } else {
                // 取消选中
                this.selectedArrow = null;
            }
        }
    }

    // 网格右键点击事件（删除箭头）
    onGridRightClick(x: number, y: number, event?: EventMouse) {
        // 阻止事件冒泡
        if (event) {
            event.propagationStopped = true;
        }

        // 检查该位置是否有箭头
        if (this.arrowsGrid[x][y]) {
            // 删除箭头
            this.deleteArrow(x, y);

            // 如果删除的是选中的箭头，则取消选中
            if (this.selectedArrow && this.selectedArrow.x === x && this.selectedArrow.y === y) {
                this.selectedArrow = null;
            }
        }
    }

    // 检查位置是否被占用
    isPositionOccupied(x: number, y: number): boolean {
        // 检查是否被其他箭头占用
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.arrowsGrid[i][j]) {
                    // 检查箭头本身位置
                    if (i === x && j === y) {
                        return true;
                    }

                    // 检查箭头身体位置
                    const bodies = this.arrowBodyPositions[i][j];
                    for (const body of bodies) {
                        if (body.x === x && body.y === y) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    // 创建箭头
    createArrow(x: number, y: number) {
        if (this.ArrowsPre) {
            const arrowNode = instantiate(this.ArrowsPre);
            arrowNode.parent = this.node;

            // 计算网格起始点
            const gridOriginX = -(this.width * this.gridSize) / 2 + this.gridSize / 2;
            const gridOriginY = -(this.height * this.gridSize) / 2 + this.gridSize / 2;

            // 设置箭头位置
            const worldX = gridOriginX + x * this.gridSize;
            const worldY = gridOriginY + y * this.gridSize;
            arrowNode.setPosition(worldX, worldY);

            // 存储到网格数组中
            this.arrowsGrid[x][y] = arrowNode;

            // 初始化箭头配置
            this.arrowConfigs[x][y] = {
                direction: 0, // 默认向上
                bodies: []
            };

            // 添加第一个身体节点（固定存在，在箭头正后方）
            this.addFirstBody(x, y);

            // 初始化TestArrows组件显示
            this.refreshArrowDisplay(x, y);
        }
    }

    // 添加第一个身体节点（在箭头正后方）
    addFirstBody(arrowX: number, arrowY: number) {
        const direction = this.arrowConfigs[arrowX][arrowY].direction;

        // 计算第一个身体节点位置（在箭头正后方）
        let bodyX = arrowX, bodyY = arrowY;
        switch (direction) {
            case 0: bodyY--; break; // 上：身体在下方（Y坐标减少）
            case 1: bodyX--; break; // 右：身体在左侧（X坐标减少）
            case 2: bodyY++; break; // 下：身体在上方（Y坐标增加）
            case 3: bodyX++; break; // 左：身体在右侧（X坐标增加）
        }

        // 检查身体位置是否有效
        if (bodyX >= 0 && bodyX < this.width && bodyY >= 0 && bodyY < this.height) {
            // 添加到身体位置数组
            this.arrowBodyPositions[arrowX][arrowY].push({ x: bodyX, y: bodyY });

            // 添加到配置中
            this.arrowConfigs[arrowX][arrowY].bodies.unshift({ x: bodyX, y: bodyY });

            console.log(`为箭头(${arrowX},${arrowY})添加第一个身体节点到(${bodyX},${bodyY})`);
        }
    }

    // 设置箭头方向
    setArrowDirection(arrowNode: Node, direction: number) {
        let arrowRotation = 0;
        switch (direction) {
            case 0: arrowRotation = 0; break;    // 上
            case 1: arrowRotation = -90; break;  // 右
            case 2: arrowRotation = 180; break;  // 下
            case 3: arrowRotation = 90; break;   // 左
        }
        arrowNode.angle = arrowRotation;
    }

    // 旋转箭头
    rotateArrow(x: number, y: number) {
        const arrowNode = this.arrowsGrid[x][y];
        if (arrowNode) {
            // 获取当前方向
            const currentDirection = this.arrowConfigs[x][y].direction;
            const newDirection = (currentDirection + 1) % 4;

            // 更新箭头方向
            this.arrowConfigs[x][y].direction = newDirection;

            // 重新计算第一个身体节点位置
            // 清除旧的第一个身体节点
            if (this.arrowConfigs[x][y].bodies.length > 0) {
                this.arrowConfigs[x][y].bodies.shift();
                this.arrowBodyPositions[x][y].shift();
            }

            // 添加新的第一个身体节点
            this.addFirstBody(x, y);

            // 刷新箭头显示以确保显示层与数据层一致
            this.refreshArrowDisplay(x, y);
        }
    }

    // 移动箭头
    moveArrow(fromX: number, fromY: number, toX: number, toY: number) {
        const arrowNode = this.arrowsGrid[fromX][fromY];
        if (arrowNode) {
            // 计算网格起始点
            const gridOriginX = -(this.width * this.gridSize) / 2 + this.gridSize / 2;
            const gridOriginY = -(this.height * this.gridSize) / 2 + this.gridSize / 2;

            // 更新箭头位置
            const worldX = gridOriginX + toX * this.gridSize;
            const worldY = gridOriginY + toY * this.gridSize;
            arrowNode.setPosition(worldX, worldY);

            // 更新网格数组
            this.arrowsGrid[toX][toY] = arrowNode;
            this.arrowsGrid[fromX][fromY] = null;

            // 更新身体位置信息
            this.arrowBodyPositions[toX][toY] = this.arrowBodyPositions[fromX][fromY];
            this.arrowBodyPositions[fromX][fromY] = [];

        }
    }

    // 删除箭头
    deleteArrow(x: number, y: number) {
        const arrowNode = this.arrowsGrid[x][y];
        if (arrowNode) {
            // 销毁箭头节点
            arrowNode.destroy();

            // 从网格数组中移除
            this.arrowsGrid[x][y] = null;

            // 清除身体位置信息
            this.arrowBodyPositions[x][y] = [];
            this.arrowConfigs[x][y] = { direction: 0, bodies: [] };
        }
    }

    // 输出整个网格状态
    printGridState() {
        console.log("=== 网格状态 ===");
        console.log("网格尺寸:", this.width, "x", this.height);
        console.log("选中的箭头:", this.selectedArrow);

        // 创建一个用于显示的二维数组
        let displayGrid: string[][] = [];
        for (let x = 0; x < this.width; x++) {
            displayGrid[x] = [];
            for (let y = 0; y < this.height; y++) {
                displayGrid[x][y] = ' . '; // 默认为空
            }
        }

        // 标记箭头位置
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.arrowsGrid[x][y]) {
                    const direction = this.arrowConfigs[x][y]?.direction || 0;
                    let dirChar = '^'; // 默认向上
                    switch (direction) {
                        case 0: dirChar = '^'; break; // 上
                        case 1: dirChar = '>'; break; // 右
                        case 2: dirChar = 'v'; break; // 下
                        case 3: dirChar = '<'; break; // 左
                    }

                    // 如果是选中的箭头，添加标记
                    if (this.selectedArrow && this.selectedArrow.x === x && this.selectedArrow.y === y) {
                        displayGrid[x][y] = `[${dirChar}]`;
                    } else {
                        displayGrid[x][y] = ` ${dirChar} `;
                    }
                }
            }
        }

        // 标记身体节点位置
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.arrowsGrid[x][y]) {
                    const bodies = this.arrowConfigs[x][y].bodies; // 使用arrowConfigs中的数据
                    for (const body of bodies) {
                        // 只有当该位置还没有被标记为箭头时才标记为身体
                        if (!this.arrowsGrid[body.x][body.y]) {
                            displayGrid[body.x][body.y] = ' # ';
                        }
                    }
                }
            }
        }

        // 打印网格
        console.log("当前网格布局:");
        let gridOutput = "";
        for (let y = 0; y < this.height; y++) {
            let row = "";
            for (let x = 0; x < this.width; x++) {
                row += displayGrid[x][y];
            }
            gridOutput += row + "\n";
        }
        console.log(gridOutput);

        // 打印箭头详细信息
        console.log("箭头详细信息:");
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.arrowsGrid[x][y]) {
                    const config = this.arrowConfigs[x][y];
                    console.log(`箭头(${x},${y}): 方向=${['上', '右', '下', '左'][config.direction]}, 身体节点数=${config.bodies.length}`);
                    if (config.bodies.length > 0) {
                        let bodiesStr = "";
                        for (let i = 0; i < config.bodies.length; i++) {
                            const body = config.bodies[i];
                            bodiesStr += `(${body.x},${body.y})`;
                            if (i < config.bodies.length - 1) bodiesStr += ", ";
                        }
                        console.log(`  身体节点: ${bodiesStr}`);
                    }
                }
            }
        }
    }

    // 输出场景JSON数据
    printSceneJSON() {
        console.log("=== 场景JSON数据 ===");

        // 构建场景数据对象
        const sceneData: any = {
            width: this.width,
            height: this.height,
            arrows: []
        };

        // 遍历所有箭头
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.arrowsGrid[x][y]) {
                    const config = this.arrowConfigs[x][y];

                    // 创建箭头对象
                    const arrow: any = {
                        x: x,
                        y: y,
                        direction: config.direction,
                        partsConfigString: ""
                    };

                    // 如果有身体节点，则生成partsConfigString
                    if (config.bodies.length > 1) {
                        // 生成partsConfigString
                        arrow.partsConfigString = this.generatePartsConfigString(config.bodies, x, y, config.direction);
                    } else if (config.bodies.length === 1) {
                        // 只有一个身体节点（第一节身体节点），返回"上0"
                        arrow.partsConfigString = "上0";
                    }

                    sceneData.arrows.push(arrow);
                }
            }
        }

        // 输出JSON
        console.log(JSON.stringify(sceneData, null, 2));
    }

    // 根据身体节点生成partsConfigString
    generatePartsConfigString(bodies: { x: number, y: number }[], arrowX: number, arrowY: number, arrowDirection: number): string {
        if (bodies.length <= 1) {
            // 只有箭头和第一节身体节点，或者只有箭头
            if (bodies.length === 1) {
                // 有第一节身体节点，返回"上0"
                return "上0";
            }
            // 只有箭头，返回空字符串
            return "";
        }

        let partsConfigString = "";

        // 记录当前方向段和计数
        let currentDirection = -1;
        let directionCount = 0;
        let parts: string[] = [];

        // 遍历所有身体节点（从第二个开始，因为第一个已经在箭头初始化时处理了）
        for (let i = 1; i < bodies.length; i++) {
            const body = bodies[i];
            const prevBody = bodies[i - 1];

            // 计算从当前节点到下一个节点的方向
            const dx = body.x - prevBody.x;
            const dy = body.y - prevBody.y;

            let direction = 0;
            // 注意：这里的方向映射需要与视觉上保持一致
            if (dx === 1 && dy === 0) direction = 1;   // 右
            else if (dx === -1 && dy === 0) direction = 3; // 左
            else if (dy === -1 && dx === 0) direction = 2; // 上 (注意：在网格坐标系中，y减小表示向上，但视觉上是向下)
            else if (dy === 1 && dx === 0) direction = 0;  // 下 (注意：在网格坐标系中，y增加表示向下，但视觉上是向上)

            // 如果方向改变或者这是最后一个节点
            if (direction !== currentDirection) {
                // 如果之前有记录的方向，则添加到parts中
                if (currentDirection !== -1) {
                    let directionStr = "";
                    switch (currentDirection) {
                        case 0: directionStr = "上"; break;
                        case 1: directionStr = "右"; break;
                        case 2: directionStr = "下"; break;
                        case 3: directionStr = "左"; break;
                    }
                    parts.push(`${directionStr}${directionCount}`);
                }

                // 更新当前方向和计数
                currentDirection = direction;
                directionCount = 1;
            } else {
                // 方向相同，增加计数
                directionCount++;
            }
        }

        // 处理最后一个方向段
        if (currentDirection !== -1) {
            let directionStr = "";
            switch (currentDirection) {
                case 0: directionStr = "上"; break;
                case 1: directionStr = "右"; break;
                case 2: directionStr = "下"; break;
                case 3: directionStr = "左"; break;
            }
            parts.push(`${directionStr}${directionCount}`);
        }

        partsConfigString = parts.join(",");
        return partsConfigString;
    }

    onDestroy() {
        // 取消键盘事件监听
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);

        // 清理防抖定时器
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }
    }
}