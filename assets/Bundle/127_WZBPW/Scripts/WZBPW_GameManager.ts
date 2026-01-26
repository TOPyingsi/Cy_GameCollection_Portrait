import { _decorator, Component, sys } from 'cc';
import { WZBPW_UIManager } from './WZBPW_UIManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

/**
 * 游戏状态枚举
 */
export enum GameState {
    IDLE,           // 空闲状态，等待玩家操作
    AIMING,         // 瞄准中
    SHOOTING,       // 舌头发射中
    RETRACTING,     // 舌头收回中
    VICTORY,        // 胜利
    FAILURE         // 失败
}

// 本地存储键名
const STORAGE_KEY = "WZBPW_GAME_PROGRESS";

/**
 * 游戏进度数据结构
 */
interface IGameProgress {
    currentLevel: number;        // 当前进度关卡 (1-25)
    lastPlayTime: number;        // 上次游戏时间戳
}

/**
 * 游戏管理器 - 单例模式
 * 控制游戏流程和状态
 */
@ccclass('WZBPW_GameManager')
export class WZBPW_GameManager extends Component {
    // 单例实例
    private static _instance: WZBPW_GameManager | null = null;

    // 当前关卡 (1-25)
    @property
    public currentLevel: number = 1;

    // 剩余生命 (0-5)
    @property
    public remainingLives: number = 5;

    // 当前关卡蚊子数量
    @property
    public mosquitoCount: number = 0;

    // 已吃掉的蚊子数量
    @property
    public eatenCount: number = 0;

    // 游戏是否进行中
    public isGameActive: boolean = false;

    // 当前游戏状态
    public gameState: GameState = GameState.IDLE;

    /**
     * 获取单例实例
     */
    public static get instance(): WZBPW_GameManager | null {
        return WZBPW_GameManager._instance;
    }

    onLoad() {
        ProjectEventManager.emit(ProjectEvent.游戏开始, "蚊子别跑蛙");
        // 单例模式：确保只有一个实例
        if (WZBPW_GameManager._instance === null) {
            WZBPW_GameManager._instance = this;
        } else if (WZBPW_GameManager._instance !== this) {
            this.destroy();
            return;
        }
    }

    onDestroy() {
        if (WZBPW_GameManager._instance === this) {
            WZBPW_GameManager._instance = null;
        }
    }

    /**
     * 开始指定关卡
     * @param levelIndex 关卡索引 (1-25)
     */
    public startLevel(levelIndex: number): void {
        this.currentLevel = levelIndex;
        this.remainingLives = 5;  // 每关5次机会
        this.eatenCount = 0;
        this.mosquitoCount = 0;   // 重置蚊子数量，等待关卡加载后设置
        this.isGameActive = true;
        this.gameState = GameState.IDLE;

        // 通知所有需要重置的组件（比如激光按钮）
        this.notifyLevelStart();
    }

    /**
     * 通知关卡开始（用于重置道具状态等）
     */
    private notifyLevelStart(): void {
        // 查找并通知激光按钮重置状态
        const scene = this.node.scene;
        if (scene) {
            const laserButtons = scene.getComponentsInChildren('WZBPW_LaserButton');
            for (const button of laserButtons) {
                if (button && typeof (button as any).onLevelStart === 'function') {
                    (button as any).onLevelStart();
                }
            }
        }
    }

    /**
     * 设置当前关卡的蚊子数量
     * @param count 蚊子数量
     */
    public setMosquitoCount(count: number): void {
        this.mosquitoCount = count;
        console.log(`WZBPW_GameManager: Mosquito count set to ${count}`);
    }

    /**
     * 使用一次舌头，返回是否还有剩余生命
     * @returns 是否还有剩余生命
     */
    public useTongue(): boolean {
        if (this.remainingLives > 0) {
            this.remainingLives -= 1;
        }
        return this.remainingLives > 0;
    }

    /**
     * 蚊子被吃掉时调用
     */
    public onMosquitoEaten(): void {
        this.eatenCount += 1;
        console.log(`WZBPW_GameManager: Mosquito eaten, count: ${this.eatenCount}/${this.mosquitoCount}`);
        
        // 立即检查是否胜利（蚊子被吃掉后可能达成胜利条件）
        this.checkVictoryCondition();
    }

    /**
     * 检查胜利条件（可以在任何时候调用）
     */
    private checkVictoryCondition(): void {
        // 胜利条件：所有蚊子都被吃掉
        if (this.eatenCount >= this.mosquitoCount && this.mosquitoCount > 0) {
            this.gameState = GameState.VICTORY;
            this.isGameActive = false;
            
            const uiManager = WZBPW_UIManager.instance;
            if (uiManager) {
                uiManager.showVictoryPanel();
            }
            
            console.log('WZBPW_GameManager: Victory! All mosquitoes eaten');
        }
    }

    /**
     * 检查胜负状态（只在舌头完全收回后调用）
     */
    public checkGameState(): void {
        // 只有在舌头收回完成（IDLE状态）时才判断胜负
        if (this.gameState !== GameState.IDLE) {
            console.log(`WZBPW_GameManager: Not checking game state, current state: ${this.gameState}`);
            return;
        }

        const uiManager = WZBPW_UIManager.instance;

        console.log(`WZBPW_GameManager: Checking game state - lives: ${this.remainingLives}, eaten: ${this.eatenCount}, total: ${this.mosquitoCount}`);

        // 优先判断胜利条件：所有蚊子都被吃掉（即使生命为0也算胜利）
        if (this.eatenCount >= this.mosquitoCount && this.mosquitoCount > 0) {
            this.gameState = GameState.VICTORY;
            this.isGameActive = false;
            
            // 显示胜利界面
            if (uiManager) {
                uiManager.showVictoryPanel();
            }
            
            console.log('WZBPW_GameManager: Victory! All mosquitoes eaten');
            return;
        }

        // 失败条件：生命耗尽且还有蚊子未被吃掉
        if (this.remainingLives <= 0 && this.eatenCount < this.mosquitoCount) {
            this.gameState = GameState.FAILURE;
            this.isGameActive = false;
            
            // 显示失败界面
            if (uiManager) {
                uiManager.showFailurePanel();
            }
            
            console.log('WZBPW_GameManager: Failure! No lives remaining');
            return;
        }
    }

    /**
     * 保存进度到本地存储
     */
    public saveProgress(): void {
        const progress: IGameProgress = {
            currentLevel: this.currentLevel,
            lastPlayTime: Date.now()
        };
        sys.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }

    /**
     * 加载进度，返回关卡号
     * @returns 关卡号 (1-25)，默认返回1
     */
    public loadProgress(): number {
        try {
            const data = sys.localStorage.getItem(STORAGE_KEY);
            if (data) {
                const progress: IGameProgress = JSON.parse(data);
                return progress.currentLevel || 1;
            }
        } catch (e) {
            console.warn('WZBPW_GameManager: Failed to load progress, starting from level 1');
        }
        return 1;
    }

    /**
     * 只有在 IDLE 状态才能开始瞄准
     */
    public canStartAiming(): boolean {
        return this.gameState === GameState.IDLE && this.remainingLives > 0;
    }

    /**
     * 只有在 AIMING 状态才能发射
     */
    public canShoot(): boolean {
        return this.gameState === GameState.AIMING;
    }
}
