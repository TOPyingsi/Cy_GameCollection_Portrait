import { _decorator, Component, Node, Prefab, instantiate, Vec2, v2, Vec3, v3, resources, JsonAsset, EventTouch, tween, Tween, director, Sprite, UIOpacity, AudioClip, AudioSource, Label } from 'cc';
import { JTLXC_Arrows } from './JTLXC_Arrows';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { ProjectEvent, ProjectEventManager } from '../../../Scripts/Framework/Managers/ProjectEventManager';
import { GameManager } from '../../../Scripts/GameManager';
import { Panel, UIManager } from '../../../Scripts/Framework/Managers/UIManager';
import Banner from '../../../Scripts/Banner';
import { JTLXC_GameData } from './JTLXC_GameData';

const { ccclass, property } = _decorator;

// 关卡数据接口
interface LevelData {
    width: number;
    height: number;
    arrows: Array<{
        x: number;
        y: number;
        direction: number;
        partsConfig: { length: number, rotation: number }[];
        partsConfigString?: string; // 新增字符串格式支持
    }>;
}

@ccclass('JTLXC_GameManager')
export class JTLXC_GameManager extends Component {
    public static Instance: JTLXC_GameManager = null;
    @property({ type: [AudioClip] })
    public Audios: AudioClip[] = [];//音效

    @property(Node)
    public GameNode: Node = null;//GameNode

    @property(Prefab)
    public dot: Prefab = null;//底部点的预制体

    @property(Prefab)
    public ArrowsPre: Prefab = null;//箭头预制体

    @property(Node)
    public Bg: Node = null;

    public Scenes: number = -1;//游戏当前关卡，默认为第1关

    public width: number = 8;//场景宽度(单位为底部点)
    public height: number = 12;//场景高度

    public MapData: number[][] = [];//地图数据

    // 网格大小
    private gridSize: number = 50;

    // 箭头列表
    private arrows: JTLXC_Arrows[] = [];

    // 网格世界坐标的起始点
    private gridOrigin: Vec2 = new Vec2(0, 0);


    private audiosource: AudioSource = null;

    public GameOver: boolean = false;//游戏是否结束
    public MaxScene: number = 50;
    protected onLoad(): void {
        JTLXC_GameManager.Instance = this;
    }
    start() {
        ProjectEventManager.emit(ProjectEvent.游戏开始, "");
        if (this.Scenes == -1) {
            this.Scenes = JTLXC_GameData.Instance.Scene;
        }
        this.Bg.getChildByPath("UI/关卡数").getComponent(Label).string = `关卡` + this.Scenes;
        // 初始化游戏
        this.initGame();
        this.audiosource = this.node.getComponent(AudioSource);
        this.schedule(() => {
            JTLXC_GameData.DateSave();
        }, 5);
    }

    // 初始化游戏
    initGame() {
        // 加载并初始化当前关卡
        this.loadLevel(this.Scenes);
    }

    // 加载指定关卡
    loadLevel(level: number) {
        const levelPath = `Scripts/Scene/JTLXC_Scene${level}`;
        BundleManager.GetBundle("123_JTLXC").load(levelPath, (err: Error | null, asset: JsonAsset) => {
            if (err) {
                console.error(`加载关卡${level}失败:`, err);
                // 如果关卡文件不存在，则使用随机生成
                this.initMapData();
                this.generateGameScene();

                return;
            }

            // 类型检查函数
            const isValidLevelData = (data: any): data is LevelData => {
                return data &&
                    typeof data.width === 'number' &&
                    typeof data.height === 'number' &&
                    Array.isArray(data.arrows);
            };

            const jsonData = asset.json;
            if (isValidLevelData(jsonData)) {
                console.log("完成场景数据读取");
                this.setupLevel(jsonData);
            } else {
                console.error(`关卡${level}数据格式不正确:`, jsonData);
                // 数据格式不正确时使用默认生成方式
                this.initMapData();
                this.generateGameScene();
            }
        });
    }

    // 设置关卡数据
    setupLevel(levelData: LevelData) {
        // 设置关卡尺寸
        this.width = levelData.width;
        this.height = levelData.height;

        // 计算网格起始点（居中对齐），确保不会超出边界
        this.gridOrigin.x = -(this.width * this.gridSize) / 2 + this.gridSize / 2;
        this.gridOrigin.y = -(this.height * this.gridSize) / 2 + this.gridSize / 2;

        // 确保宽度和高度为正数
        if (this.width <= 0) this.width = 8;
        if (this.height <= 0) this.height = 20;

        // 初始化地图数据
        this.initMapData();

        // 生成游戏场景
        this.generateGameSceneWithLevelData(levelData);

        // 添加调试命令
        this.addDebugCommands();

        // 发送关卡加载完成事件
        director.getScene().emit('level-loaded');
    }

    // 解析partsConfig字符串格式
    parsePartsConfigString(partsConfigString: string): { length: number, rotation: number }[] {
        if (!partsConfigString) return [];

        const parts: { length: number, rotation: number }[] = [];
        const segments = partsConfigString.split(',');

        for (const segment of segments) {
            const trimmedSegment = segment.trim();
            if (!trimmedSegment) continue;

            // 解析格式如 "上5" 或 "左2"
            const directionMatch = trimmedSegment.match(/^([上下左右])(\d+)$/);
            if (directionMatch) {
                const [, direction, lengthStr] = directionMatch;
                const length = parseInt(lengthStr);

                // 转换为方向 (0: 上, 1: 右, 2: 下, 3: 左) - 符合游戏内视觉方向
                let dir = 0;
                switch (direction) {
                    case '上': dir = 2; break;
                    case '右': dir = 1; break;
                    case '下': dir = 0; break;
                    case '左': dir = 3; break;
                }

                parts.push({ length, rotation: dir });
            }
        }

        // 转换为相对旋转格式
        if (parts.length > 1) {
            // 从第二个部分开始计算相对旋转
            for (let i = parts.length - 1; i > 0; i--) {
                const prevDir = parts[i - 1].rotation;
                const currDir = parts[i].rotation;

                // 计算相对旋转 (-1 左转, 0 直行, 1 右转)
                let relRot = currDir - prevDir;
                if (relRot == 3) relRot = -1;
                if (relRot == -3) relRot = 1;

                parts[i].rotation = relRot;
            }
        }

        // 第一个部分的旋转在createArrow中处理
        return parts;
    }

    // 添加调试命令
    addDebugCommands() {
        // 在控制台输入 debugMap() 可以查看当前地图状态
        (window as any).debugMap = () => {
            this.printCurrentMapState();
        };

        // 在控制台输入 reinitGame() 可以重新初始化游戏
        (window as any).reinitGame = () => {
            this.restartGame();
        };

        // 在控制台输入 nextLevel() 可以进入下一关
        (window as any).nextLevel = () => {
            this.Scenes++;
            this.restartGame();
        };
    }

    // 打印当前地图状态
    printCurrentMapState() {
        console.log("=== 当前地图状态 ===");
        let row = '';
        for (let y = this.height - 1; y >= 0; y--) {
            for (let x = 0; x < this.width; x++) {
                row += this.MapData[x][y] ? ' X ' : ' . ';
            }
            row += "\n"
        }
        console.log(row);
        console.log(`箭头数量: ${this.arrows.length}`);
        for (const arrow of this.arrows) {
            console.log(`箭头: 位置(${arrow.gridPosition.x}, ${arrow.gridPosition.y}), 方向: ${arrow.direction}`);
        }
    }

    // 初始化地图数据（确保彻底清空）
    initMapData() {
        this.MapData = [];
        for (let x = 0; x < this.width; x++) {
            this.MapData[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.MapData[x][y] = 0;
            }
        }
    }

    // 生成游戏场景
    generateGameScene() {
        // 生成网格点（可选的视觉元素）
        this.generateGridDots();

        // 生成箭头
        this.generateArrows();

        // 发送关卡加载完成事件
        director.getScene().emit('level-loaded');
    }

    // 根据关卡数据生成游戏场景
    generateGameSceneWithLevelData(levelData: LevelData) {
        // 清空现有箭头列表
        this.arrows = [];

        // 生成网格点（可选的视觉元素）
        this.generateGridDots();

        // 生成关卡定义的箭头
        for (const arrowData of levelData.arrows) {
            // 检查是否有字符串格式的partsConfig
            let partsConfig = arrowData.partsConfig;
            if (arrowData.partsConfigString) {
                partsConfig = this.parsePartsConfigString(arrowData.partsConfigString);
            }

            this.createArrow(arrowData.x, arrowData.y, arrowData.direction, partsConfig);
        }

        console.log(`关卡加载完成: ${levelData.arrows.length}个箭头`);

        // 打印当前地图状态
        this.printCurrentMapState();
    }

    // 生成网格点
    generateGridDots() {
        // 先清空现有的点
        this.GameNode.destroyAllChildren();

        // 为每个格子生成dot预制体
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                // 实例化dot预制体
                const dotNode = instantiate(this.dot);

                // 设置dot的父节点
                dotNode.parent = this.GameNode;

                // 计算dot的世界坐标位置
                const worldPosX = this.gridOrigin.x + x * this.gridSize;
                const worldPosY = this.gridOrigin.y + y * this.gridSize;

                // 设置dot位置
                dotNode.setPosition(worldPosX, worldPosY);
            }
        }
    }

    // 生成箭头（修复初始化问题）
    generateArrows() {
        // 清空现有箭头列表
        this.arrows = [];

        // 先完全清空地图数据
        this.initMapData();
        console.log("清空地图数据完成");

        // 生成一些随机箭头作为示例
        const arrowCount = 10;

        let placedArrows = 0;
        let attempts = 0;
        const maxAttempts = arrowCount * 50;

        while (placedArrows < arrowCount && attempts < maxAttempts) {
            attempts++;

            // 随机选择位置
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);

            // 检查位置是否已被占用
            if (this.MapData[x][y] !== 0) {
                // console.log(`位置(${x}, ${y}) 已被占用，跳过`);
                continue;
            }

            // 只生成上下两个方向（0:上, 2:下）
            const direction = Math.random() > 0.5 ? 0 : 2;

            // 随机生成箭头部分配置
            const partsConfig = this.generateRandomPartsConfig();

            // 限制箭头总长度
            let totalLength = 1;
            for (const part of partsConfig) {
                totalLength += part.length;
            }
            if (totalLength > 8) {
                continue;
            }

            // 检查箭头是否会超出边界
            if (!this.checkArrowBounds(x, y, direction, partsConfig)) {
                // console.log(`箭头超出边界: 位置(${x}, ${y}), 方向: ${direction}`);
                continue;
            }

            // 检查路径上是否有其他箭头
            if (!this.checkArrowPathClear(x, y, direction, partsConfig)) {
                // console.log(`路径不清晰: 位置(${x}, ${y}), 方向: ${direction}`);
                continue;
            }

            // 创建箭头
            this.createArrow(x, y, direction, partsConfig);
            placedArrows++;

            console.log(`成功创建箭头 ${placedArrows}: 位置(${x}, ${y}), 方向: ${direction}`);
        }

        console.log(`箭头生成完成: 成功生成 ${placedArrows} 个箭头，尝试次数: ${attempts}`);

        // 生成完成后验证地图数据
        this.validateMapDataAfterInit();

        // 打印当前地图状态
        this.printCurrentMapState();
    }

    // 生成随机的部分配置
    generateRandomPartsConfig(): { length: number, rotation: number }[] {
        const parts: { length: number, rotation: number }[] = [];
        const partCount = Math.floor(Math.random() * 3) + 1; // 1-3个部分（减少复杂度）

        for (let i = 0; i < partCount; i++) {
            // 长度为1-3格（减少长度）
            const length = Math.floor(Math.random() * 3) + 1;

            // 旋转角度：-1表示左转90度，0表示直行，1表示右转90度
            let rotation = 0;
            if (i > 0) { // 第一个部分不需要旋转
                const rotationType = Math.floor(Math.random() * 3);
                switch (rotationType) {
                    case 0: rotation = -1; break; // 左转
                    case 1: rotation = 0; break;  // 直行
                    case 2: rotation = 1; break;  // 右转
                }
            }

            parts.push({ length, rotation });
        }

        return parts;
    }

    // 检查箭头是否超出边界（使用相同的节点计算逻辑）
    checkArrowBounds(x: number, y: number, direction: number, partsConfig: { length: number, rotation: number }[]): boolean {
        // 使用相同的节点计算逻辑
        const nodePositions = this.calculateArrowNodePositions(x, y, direction, partsConfig);

        // 检查是否有重复位置（自相交）
        const positionSet = new Set<string>();
        for (const pos of nodePositions) {
            const key = `${pos.x},${pos.y}`;
            if (positionSet.has(key)) {
                console.log(`箭头自相交: 位置(${pos.x}, ${pos.y})`);
                return false;
            }
            positionSet.add(key);
        }

        // 检查所有位置是否都在边界内
        for (const pos of nodePositions) {
            if (pos.x < 0 || pos.x >= this.width || pos.y < 0 || pos.y >= this.height) {
                console.log(`箭头超出边界: 位置(${pos.x}, ${pos.y})`);
                return false;
            }
        }

        // console.log(`箭头边界检查通过: 共 ${nodePositions.length} 个节点`);
        return true;
    }

    // 检查箭头路径是否清晰（使用相同的节点计算逻辑）
    checkArrowPathClear(x: number, y: number, direction: number, partsConfig: { length: number, rotation: number }[]): boolean {
        // 使用相同的节点计算逻辑
        const nodePositions = this.calculateArrowNodePositions(x, y, direction, partsConfig);

        // 检查所有位置是否都为空
        for (const pos of nodePositions) {
            if (this.MapData[pos.x] && this.MapData[pos.x][pos.y] !== 0) {
                console.log(`路径检查失败: 位置(${pos.x}, ${pos.y}) 已被占用`);
                return false;
            }
        }

        // console.log(`路径检查通过: 所有 ${nodePositions.length} 个位置都为空`);
        return true;
    }

    // 创建箭头（确保地图数据正确更新）
    createArrow(gridX: number, gridY: number, direction: number, partsConfig: { length: number, rotation: number }[]) {
        // 先检查这个位置是否真的为空（双重检查）
        if (this.MapData[gridX][gridY] !== 0) {
            console.error(`创建箭头失败: 位置(${gridX}, ${gridY}) 已被占用`);
            return;
        }

        // 实例化箭头预制体
        const arrowNode = instantiate(this.ArrowsPre);

        // 设置箭头父节点
        arrowNode.parent = this.GameNode;

        // 获取箭头组件
        const arrowComponent = arrowNode.getComponent(JTLXC_Arrows);

        // 初始化箭头
        arrowComponent.init(direction, new Vec2(gridX, gridY), partsConfig, this);

        // 添加到箭头列表
        this.arrows.push(arrowComponent);

        // 更新地图数据（标记所有被箭头占据的位置）
        this.updateMapDataWithArrow(gridX, gridY, direction, partsConfig, 1);
    }

    // 更新地图数据（只标记子节点位置）
    updateMapDataWithArrow(
        startX: number,
        startY: number,
        direction: number,
        partsConfig: { length: number, rotation: number }[],
        value: number
    ) {
        // console.log(`更新地图数据: 起始位置(${startX}, ${startY}), 设置值: ${value}, 方向: ${direction}`);

        // 计算箭头所有子节点的位置（包括根节点和身体节点）
        const nodePositions = this.calculateArrowNodePositions(startX, startY, direction, partsConfig);

        // 标记所有子节点位置
        for (const pos of nodePositions) {
            if (pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height) {
                this.MapData[pos.x][pos.y] = value;
                // console.log(`标记子节点位置: (${pos.x}, ${pos.y}) = ${value}`);
            }
        }

        // console.log(`共标记了 ${nodePositions.length} 个子节点位置`);
    }

    // 计算箭头所有子节点的位置（包括根节点和身体节点）
    calculateArrowNodePositions(x: number, y: number, direction: number, partsConfig: { length: number, rotation: number }[]): Vec2[] {
        const positions: Vec2[] = [];

        // console.log(`计算箭头子节点位置: 起始位置(${x}, ${y}), 方向: ${direction}`);

        // 第一个子节点：箭头节点（位于起始位置）
        positions.push(new Vec2(x, y));
        // console.log(`子节点1（箭头）: (${x}, ${y})`);

        let currentX = x;
        let currentY = y;
        let currentDirection = direction;

        // 第二个子节点：第一个身体节点（在箭头正后方）
        let firstBodyX = currentX;
        let firstBodyY = currentY;

        switch (direction) {
            case 0: firstBodyY--; break; // 上 -> 上方 (Y坐标减少)
            case 1: firstBodyX--; break; // 右 -> 左方 (X坐标减少)
            case 2: firstBodyY++; break; // 下 -> 下方 (Y坐标增加)
            case 3: firstBodyX++; break; // 左 -> 右方 (X坐标增加)
        }

        // 检查第一个身体节点是否在边界内
        if (firstBodyX >= 0 && firstBodyX < this.width && firstBodyY >= 0 && firstBodyY < this.height) {
            positions.push(new Vec2(firstBodyX, firstBodyY));
            // console.log(`子节点2（第一个身体）: (${firstBodyX}, ${firstBodyY})`);
            currentX = firstBodyX;
            currentY = firstBodyY;
        } else {
            // console.log('第一个身体节点超出边界');
            return positions;
        }

        // 处理后续身体部分（从第三个子节点开始）
        for (let i = 0; i < partsConfig.length; i++) {
            const config = partsConfig[i];
            currentDirection = (currentDirection + config.rotation + 4) % 4;

            // console.log(`处理部分 ${i}: 长度 ${config.length}, 旋转 ${config.rotation}, 新方向 ${currentDirection}`);

            // 计算这一部分的所有节点位置
            for (let j = 0; j < config.length; j++) {
                switch (currentDirection) {
                    case 0: currentY--; break; // 上 (Y坐标减少)
                    case 1: currentX++; break; // 右 (X坐标增加)
                    case 2: currentY++; break; // 下 (Y坐标增加)
                    case 3: currentX--; break; // 左 (X坐标减少)
                }

                if (currentX >= 0 && currentX < this.width && currentY >= 0 && currentY < this.height) {
                    positions.push(new Vec2(currentX, currentY));
                    // console.log(`子节点${positions.length}（身体）: (${currentX}, ${currentY})`);
                } else {
                    // console.log(`节点超出边界，停止添加`);
                    return positions;
                }
            }
        }

        // console.log(`总共计算了 ${positions.length} 个子节点位置`);
        return positions;
    }


    // 检查游戏是否结束
    checkGameEnd(): boolean {
        if (this.GameOver) return;
        // 检查是否还有箭头存在
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.MapData[x][y] !== 0) {
                    // 还有箭头存在
                    return false;
                }
            }
        }
        // 所有箭头都被消除了
        this.handleGameWin();
        return true;
    }

    // 处理游戏胜利
    handleGameWin() {
        console.log("恭喜！游戏完成！");
        this.GameOver = true;
        this.scheduleOnce(() => {
            // 发送游戏结束事件
            ProjectEventManager.emit(ProjectEvent.游戏结束, "");

            // 显示胜利界面
            const winPanel = this.Bg.getChildByPath("UI/通关界面");
            if (winPanel) {
                this.OpenOrExitUI(winPanel, true);
            }
        }, 2)
    }

    // 重新开始游戏
    restartGame() {
        // 销毁现有的箭头
        for (let i = this.arrows.length - 1; i >= 0; i--) {
            if (this.arrows[i] && this.arrows[i].node && this.arrows[i].node.isValid) {
                this.arrows[i].node.destroy();
            }
        }

        // 清空箭头列表
        this.arrows = [];

        // 重新初始化游戏
        this.initGame();
    }

    // 修改检查箭头是否可以移动的方法
    checkArrowCanMove(startX: number, startY: number, direction: number): boolean {
        // 检查整条正前方路径是否通畅
        return this.checkArrowForwardPathClear(startX, startY, direction);
    }

    // 检查整条路径是否通畅（从头部到尾部）
    checkEntirePathClear(startX: number, startY: number, direction: number): boolean {
        // 查找对应的箭头
        const arrow = this.findArrowAtPosition(startX, startY);
        if (!arrow) return false;

        // 计算新的头部位置
        let newHeadX = startX;
        let newHeadY = startY;

        switch (direction) {
            case 0: // 上
                newHeadY++;
                break;
            case 1: // 右
                newHeadX++;
                break;
            case 2: // 下
                newHeadY--;
                break;
            case 3: // 左
                newHeadX--;
                break;
        }

        // 检查新头部位置是否被占用（除了自己的尾部）
        if (newHeadX >= 0 && newHeadX < this.width && newHeadY >= 0 && newHeadY < this.height) {
            // 获取箭头的尾部位置
            const tailPosition = arrow.nodeGridPositions[arrow.nodeGridPositions.length - 1];

            // 如果新头部位置不是自己的尾部，且被占用，则不能移动
            if (!(newHeadX === tailPosition.x && newHeadY === tailPosition.y)) {
                if (this.MapData[newHeadX] && this.MapData[newHeadX][newHeadY] !== 0) {
                    return false;
                }
            }
        }

        return true;
    }

    // 根据位置查找箭头
    findArrowAtPosition(x: number, y: number): JTLXC_Arrows | null {
        for (let i = 0; i < this.arrows.length; i++) {
            const arrow = this.arrows[i];
            if (arrow && arrow.gridPosition && arrow.gridPosition.x === x && arrow.gridPosition.y === y) {
                return arrow;
            }
        }
        return null;
    }

    // 检查箭头正前方整条路径是否通畅（改进版）
    checkArrowForwardPathClear(startX: number, startY: number, direction: number): boolean {
        // 先找到对应的箭头
        const arrow = this.findArrowAtPosition(startX, startY);
        if (!arrow) return false;

        let checkX = startX;
        let checkY = startY;

        // 沿着箭头方向一直检查到边界
        while (true) {
            // 计算下一个位置
            switch (direction) {
                case 0: // 上
                    checkY++;
                    break;
                case 1: // 右
                    checkX++;
                    break;
                case 2: // 下
                    checkY--;
                    break;
                case 3: // 左
                    checkX--;
                    break;
            }

            // 如果超出边界，说明整条路径都通畅
            if (checkX < 0 || checkX >= this.width || checkY < 0 || checkY >= this.height) {
                return true;
            }

            // 检查这个位置是否被占用
            if (this.MapData[checkX] && this.MapData[checkX][checkY] !== 0) {
                // 如果是被自己箭头的尾部占用，允许通过
                const tailPosition = arrow.nodeGridPositions[arrow.nodeGridPositions.length - 1];
                if (checkX === tailPosition.x && checkY === tailPosition.y) {
                    // 这是自己箭头的尾部，允许通过，继续检查下一个位置
                    continue;
                } else {
                    // 被其他箭头占用，路径不通
                    return false;
                }
            }
        }
    }

    // 生成完成后验证地图数据
    validateMapDataAfterInit() {
        console.log("=== 初始化后地图数据验证 ===");

        // 统计被占用的格子数量
        let occupiedCount = 0;
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.MapData[x][y] !== 0) {
                    occupiedCount++;
                }
            }
        }

        console.log(`地图占用统计: ${occupiedCount}/${this.width * this.height} 个格子被占用`);

        // 检查是否有箭头位置与地图数据不一致
        let errorCount = 0;
        for (const arrow of this.arrows) {
            const headX = arrow.gridPosition.x;
            const headY = arrow.gridPosition.y;

            if (this.MapData[headX][headY] === 0) {
                console.error(`错误: 箭头头部位置(${headX}, ${headY}) 在地图数据中未被标记`);
                errorCount++;
            }
        }

        if (errorCount === 0) {
            console.log("地图数据验证通过: 所有箭头位置正确标记");
        } else {
            console.error(`地图数据验证失败: 发现 ${errorCount} 个错误`);
        }
    }

    OnButtomClick(btn: EventTouch) {
        switch (btn.target.name) {
            case "设置":
                this.OpenOrExitUI(this.Bg.getChildByPath("UI/设置面板"), true);
                break;
            case "关闭设置面板":
                this.OpenOrExitUI(this.Bg.getChildByPath("UI/设置面板"), false);
                break;
            case "复活":
                Banner.Instance.ShowVideoAd(() => {
                    this.OpenOrExitUI(this.Bg.getChildByPath("UI/复活界面"), false);
                })
                break;
            case "返回主页":
                UIManager.ShowPanel(Panel.ReturnPanel);
                break;
            case "重新开始":
                director.loadScene(director.getScene().name);
                break;
            case "下一关":
                JTLXC_GameData.Instance.Scene++;
                if (JTLXC_GameData.Instance.Scene > this.MaxScene) {
                    JTLXC_GameData.Instance.Scene = 1;
                }
                director.loadScene(director.getScene().name);
                break;
            case "关闭胜利界面":
                this.OpenOrExitUI(this.Bg.getChildByPath("UI/胜利界面"), false);
                break;
            case "胜利界面下一关":
                JTLXC_GameData.Instance.Scene++;
                if (JTLXC_GameData.Instance.Scene > this.MaxScene) {
                    JTLXC_GameData.Instance.Scene = 1;
                }
                director.loadScene(director.getScene().name);
                break;
            case "胜利界面返回主页":
                UIManager.ShowPanel(Panel.ReturnPanel);
                break;
        }

    }


    //血量系统
    public HP: number = 3;//满血3
    public SubHp() {
        this.HP--;
        if (this.HP > 0) {
            this.ShowHp();
            return;
        }
        //弹出复活界面
        this.OpenOrExitUI(this.Bg.getChildByPath("UI/复活界面"), true);
    }
    //刷新血量显示
    ShowHp() {
        let nd: Node = this.Bg.getChildByPath("UI/爱心");
        for (let i = 0; i < 3; i++) {
            nd.children[i].getComponent(Sprite).grayscale = !(this.HP > i);
        }
    }

    //红血特效
    RedHpEffect() {
        let nd: Node = this.Bg.getChildByPath("下底色/红色特效");

        tween(nd.getComponent(UIOpacity))
            .to(0.6, { opacity: 120 })
            .delay(0.4)
            .to(0.6, { opacity: 0 })
            .start();
    }


    private tw: Tween = null;
    //打开界面
    OpenOrExitUI(nd: Node, IsOpen: boolean = true) {
        if (this.tw) {
            this.tw.stop();
        }
        if (IsOpen) {
            nd.active = true;
        }
        let panel = nd.getChildByName("面板");
        panel.scale = IsOpen ? v3(0, 0, 0) : v3(1, 1, 1);
        this.tw = tween(panel).to(0.4, { scale: IsOpen ? v3(1, 1, 1) : v3(0, 0, 0) }, { easing: IsOpen ? "backOut" : "backIn" })
            .call(() => {
                if (!IsOpen) {
                    nd.active = false;
                }
            }).start();
    }


    PlayAudio(id: number) {
        this.audiosource.playOneShot(this.Audios[id]);
    }

}