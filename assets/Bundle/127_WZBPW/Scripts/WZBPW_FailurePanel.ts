import { _decorator, Component, Node } from 'cc';
import { WZBPW_GameManager, GameState } from './WZBPW_GameManager';
import { WZBPW_UIManager } from './WZBPW_UIManager';
import { WZBPW_LevelManager } from './WZBPW_LevelManager';
import { WZBPW_AudioManager } from './WZBPW_AudioManager';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

/**
 * 失败界面控制器
 * 处理失败界面的两阶段交互：
 * 阶段1 (Node1): 显示"继续游戏"和"残忍拒绝"按钮
 * 阶段2 (Node2): 显示"再试一次"按钮
 */
@ccclass('WZBPW_FailurePanel')
export class WZBPW_FailurePanel extends Component {
    // Node1: 第一阶段节点（继续游戏 / 残忍拒绝）
    @property(Node)
    public node1: Node | null = null;

    // Node2: 第二阶段节点（挑战失败 / 再试一次）
    @property(Node)
    public node2: Node | null = null;

    onLoad() {
        // 初始化：显示 Node1，隐藏 Node2
        this.showNode1();

        // 播放失败音效
        const audioManager = WZBPW_AudioManager.instance;
        if (audioManager) {
            audioManager.playFailureSound();
        }
    }

    /**
     * 显示 Node1（第一阶段）
     */
    private showNode1(): void {
        if (this.node1) {
            this.node1.active = true;
        }
        if (this.node2) {
            this.node2.active = false;
        }
    }

    /**
     * 显示 Node2（第二阶段）
     */
    private showNode2(): void {
        if (this.node1) {
            this.node1.active = false;
        }
        if (this.node2) {
            this.node2.active = true;
        }
    }

    /**
     * 点击"继续游戏"按钮（Node1）
     * 给玩家增加5条生命，继续当前游戏
     */
    public onContinueGameClick(): void {
        const gameManager = WZBPW_GameManager.instance;
        const uiManager = WZBPW_UIManager.instance;

        if (!gameManager) {
            console.error('WZBPW_FailurePanel: GameManager instance not found');
            return;
        }

        // 显示广告，广告看完后才执行后续操作
        Banner.Instance.ShowVideoAd(() => {
            // 广告看完后的回调
            console.log('WZBPW_FailurePanel: Ad watched, adding 5 lives');
            
            // 增加5条生命
            gameManager.remainingLives += 5;

            // 更新UI显示
            if (uiManager) {
                uiManager.updateLives(gameManager.remainingLives);
            }

            // 恢复游戏状态为IDLE，允许继续游戏
            gameManager.gameState = GameState.IDLE;
            gameManager.isGameActive = true;

            // 隐藏失败界面
            if (uiManager) {
                uiManager.hideAllPanels();
            }

            console.log(`WZBPW_FailurePanel: Continue game, added 5 lives. Current lives: ${gameManager.remainingLives}`);
        });
    }

    /**
     * 点击"残忍拒绝"按钮（Node1）
     * 切换到 Node2 显示
     */
    public onRejectClick(): void {
        console.log('WZBPW_FailurePanel: Rejected continue, showing retry option');
        this.showNode2();
    }

    /**
     * 点击"再试一次"按钮（Node2）
     * 重新开始当前关卡
     * Requirements: 7.1, 7.2, 7.3, 9.2
     */
    public onRetryClick(): void {
        const gameManager = WZBPW_GameManager.instance;
        const uiManager = WZBPW_UIManager.instance;
        const levelManager = WZBPW_LevelManager.instance;

        if (!gameManager) {
            console.error('WZBPW_FailurePanel: GameManager instance not found');
            return;
        }

        // 隐藏失败界面
        if (uiManager) {
            uiManager.hideAllPanels();
        }

        // 重新加载当前关卡
        if (levelManager) {
            levelManager.reloadCurrentLevel();
        } else {
            console.error('WZBPW_FailurePanel: LevelManager instance not found');
            // 降级方案：只重置游戏状态
            gameManager.startLevel(gameManager.currentLevel);
            if (uiManager) {
                uiManager.updateLives(gameManager.remainingLives);
            }
        }
    }

    /**
     * 点击返回首页按钮
     */
    public onHomeClick(): void {
        const uiManager = WZBPW_UIManager.instance;
        const levelManager = WZBPW_LevelManager.instance;

        // 隐藏失败界面
        if (uiManager) {
            uiManager.hideAllPanels();
        }

        // 返回首页
        if (levelManager) {
            levelManager.returnToHome();
        } else {
            console.error('WZBPW_FailurePanel: LevelManager instance not found');
        }
    }
}
