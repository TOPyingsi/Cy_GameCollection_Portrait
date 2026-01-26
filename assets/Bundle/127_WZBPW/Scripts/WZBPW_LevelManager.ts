import { _decorator, Component, Node, Prefab, instantiate, director } from 'cc';
import { WZBPW_GameManager } from './WZBPW_GameManager';
import { WZBPW_UIManager } from './WZBPW_UIManager';
import { WZBPW_MosquitoController } from './WZBPW_MosquitoController';
import { WZBPW_SkinManager } from './WZBPW_SkinManager';
const { ccclass, property } = _decorator;

/**
 * 关卡管理器
 * 负责加载、卸载和管理关卡预制体
 */
@ccclass('WZBPW_LevelManager')
export class WZBPW_LevelManager extends Component {
    // 单例实例
    private static _instance: WZBPW_LevelManager | null = null;

    // 关卡预制体数组（25个关卡）
    @property([Prefab])
    public levelPrefabs: Prefab[] = [];

    // 关卡容器节点
    @property(Node)
    public levelContainer: Node | null = null;

    // UI节点（游戏开始时显示）
    @property(Node)
    public uiNode: Node | null = null;

    // 开始游戏按钮节点（WMUI节点，返回首页时显示）
    @property(Node)
    public startGameButtonNode: Node | null = null;

    // 当前加载的关卡节点
    private currentLevelNode: Node | null = null;

    /**
     * 获取单例实例
     */
    public static get instance(): WZBPW_LevelManager | null {
        return WZBPW_LevelManager._instance;
    }

    onLoad() {
        // 单例模式：确保只有一个实例
        if (WZBPW_LevelManager._instance === null) {
            WZBPW_LevelManager._instance = this;
        } else if (WZBPW_LevelManager._instance !== this) {
            this.destroy();
            return;
        }

        // 初始化时隐藏UI节点
        if (this.uiNode) {
            this.uiNode.active = false;
        }

        // 初始化时显示开始游戏按钮
        if (this.startGameButtonNode) {
            this.startGameButtonNode.active = true;
        }
    }

    onDestroy() {
        if (WZBPW_LevelManager._instance === this) {
            WZBPW_LevelManager._instance = null;
        }
    }

    /**
     * 开始游戏（从首页点击"开始游戏"按钮调用）
     * 显示UI节点，隐藏开始游戏按钮，加载第一关或上次保存的关卡
     */
    public startGame(): void {
        const gameManager = WZBPW_GameManager.instance;
        
        if (!gameManager) {
            console.error('WZBPW_LevelManager: GameManager instance not found');
            return;
        }

        // 隐藏开始游戏按钮
        if (this.startGameButtonNode) {
            this.startGameButtonNode.active = false;
        }

        // 显示UI节点
        if (this.uiNode) {
            this.uiNode.active = true;
        }

        // 加载上次保存的关卡进度
        const savedLevel = gameManager.loadProgress();
        
        // 如果已经通关（第25关），从第1关重新开始
        let levelToLoad = savedLevel;
        if (savedLevel >= 25) {
            levelToLoad = 1;
            console.log('WZBPW_LevelManager: Game completed, restarting from level 1');
        }
        
        this.loadLevel(levelToLoad);

        console.log(`WZBPW_LevelManager: Game started, loading level ${levelToLoad}`);
    }

    /**
     * 加载指定关卡
     * @param levelIndex 关卡索引 (1-25)
     */
    public loadLevel(levelIndex: number): void {
        const gameManager = WZBPW_GameManager.instance;
        const uiManager = WZBPW_UIManager.instance;

        if (!gameManager) {
            console.error('WZBPW_LevelManager: GameManager instance not found');
            return;
        }

        // 验证关卡索引
        if (levelIndex < 1 || levelIndex > 25) {
            console.error(`WZBPW_LevelManager: Invalid level index ${levelIndex}, must be between 1 and 25`);
            return;
        }

        // 卸载当前关卡
        this.unloadCurrentLevel();

        // 检查关卡预制体是否存在
        const prefabIndex = levelIndex - 1; // 数组索引从0开始
        if (prefabIndex >= this.levelPrefabs.length || !this.levelPrefabs[prefabIndex]) {
            console.error(`WZBPW_LevelManager: Level ${levelIndex} prefab not found`);
            return;
        }

        // 实例化关卡预制体
        const levelPrefab = this.levelPrefabs[prefabIndex];
        this.currentLevelNode = instantiate(levelPrefab);

        // 添加到关卡容器
        if (this.levelContainer) {
            this.levelContainer.addChild(this.currentLevelNode);
        } else {
            console.error('WZBPW_LevelManager: Level container not found');
            return;
        }

        // 初始化游戏管理器状态
        gameManager.startLevel(levelIndex);

        // 统计关卡中的蚊子数量
        this.scheduleOnce(() => {
            const mosquitoCount = this.countMosquitoesInScene();
            gameManager.setMosquitoCount(mosquitoCount);
            
            // 应用保存的皮肤到关卡中的青蛙
            const skinManager = WZBPW_SkinManager.instance;
            if (skinManager) {
                skinManager.applySkinToAllFrogs();
            }
        }, 0.1); // 延迟一帧，确保关卡节点已完全加载

        // 更新UI显示
        if (uiManager) {
            uiManager.updateLives(gameManager.remainingLives);
            uiManager.updateLevel(levelIndex);
        }

        console.log(`WZBPW_LevelManager: Level ${levelIndex} loaded successfully`);
    }

    /**
     * 统计场景中的蚊子数量
     */
    private countMosquitoesInScene(): number {
        let count = 0;
        const scene = director.getScene();
        if (scene) {
            this.countMosquitoesRecursive(scene, (c) => { count = c; });
        }
        return count;
    }

    /**
     * 递归统计蚊子数量
     */
    private countMosquitoesRecursive(node: Node, callback: (count: number) => void): void {
        let count = 0;
        this.findMosquitoesRecursive(node, () => { count++; });
        callback(count);
    }

    /**
     * 递归查找蚊子
     */
    private findMosquitoesRecursive(node: Node, onFound: () => void): void {
        const mosquito = node.getComponent(WZBPW_MosquitoController);
        if (mosquito && !mosquito.isCaught) {
            onFound();
        }
        for (const child of node.children) {
            this.findMosquitoesRecursive(child, onFound);
        }
    }

    /**
     * 卸载当前关卡
     */
    public unloadCurrentLevel(): void {
        if (this.currentLevelNode) {
            this.currentLevelNode.destroy();
            this.currentLevelNode = null;
            console.log('WZBPW_LevelManager: Current level unloaded');
        }
    }

    /**
     * 重新加载当前关卡
     */
    public reloadCurrentLevel(): void {
        const gameManager = WZBPW_GameManager.instance;

        if (!gameManager) {
            console.error('WZBPW_LevelManager: GameManager instance not found');
            return;
        }

        const currentLevel = gameManager.currentLevel;
        console.log(`WZBPW_LevelManager: Reloading level ${currentLevel}`);
        this.loadLevel(currentLevel);
    }

    /**
     * 加载下一关
     */
    public loadNextLevel(): void {
        const gameManager = WZBPW_GameManager.instance;

        if (!gameManager) {
            console.error('WZBPW_LevelManager: GameManager instance not found');
            return;
        }

        const nextLevel = gameManager.currentLevel + 1;

        // 如果已经是最后一关，不加载下一关
        if (nextLevel > 25) {
            console.log('WZBPW_LevelManager: Already at last level (25)');
            return;
        }

        // 保存进度
        gameManager.currentLevel = nextLevel;
        gameManager.saveProgress();

        // 加载下一关
        this.loadLevel(nextLevel);
    }

    /**
     * 返回首页
     * 隐藏UI节点，显示开始游戏按钮，卸载当前关卡
     */
    public returnToHome(): void {
        // 卸载当前关卡
        this.unloadCurrentLevel();

        // 隐藏UI节点
        if (this.uiNode) {
            this.uiNode.active = false;
        }

        // 显示开始游戏按钮
        if (this.startGameButtonNode) {
            this.startGameButtonNode.active = true;
        }

        console.log('WZBPW_LevelManager: Returned to home screen');
    }
}
