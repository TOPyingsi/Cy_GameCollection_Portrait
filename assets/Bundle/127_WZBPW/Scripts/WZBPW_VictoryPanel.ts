import { _decorator, Component, Node,Animation } from 'cc';
import { WZBPW_GameManager } from './WZBPW_GameManager';
import { WZBPW_UIManager } from './WZBPW_UIManager';
import { WZBPW_LevelManager } from './WZBPW_LevelManager';
import { WZBPW_AudioManager } from './WZBPW_AudioManager';
import { ProjectEventManager, ProjectEvent } from '../../../Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

/**
 * 胜利界面控制器
 * 处理胜利界面的按钮点击事件
 * 如果是最后一关（第25关），隐藏"下一关"按钮
 */
@ccclass('WZBPW_VictoryPanel')
export class WZBPW_VictoryPanel extends Component {
    // 下一关按钮节点
    @property(Node)
    public nextLevelButton: Node | null = null;

    // 返回主页按钮节点
    @property(Node)
    public homeButton: Node | null = null;

    @property(Node)
    public crownAniNode: Node | null = null;   // 皇冠动画
    @property(Node)
    public starAniNode: Node | null = null;
    

    onLoad() {
        // onLoad 只在第一次加载时调用
    }

    onEnable() {
        // 每次面板显示时都检查并更新按钮
        this.checkAndUpdateButtons();
        
        // 播放动画
        this.playAniOnce(this.crownAniNode);
        this.playAniOnce(this.starAniNode);
        
        // 如果是第25关，3秒后自动返回首页
        const gameManager = WZBPW_GameManager.instance;
        if (gameManager && gameManager.currentLevel >= 25) {
            this.scheduleOnce(() => {
                console.log('WZBPW_VictoryPanel: Level 25 completed, auto returning to home');
                this.onHomeClick();
            }, 3.0); // 3秒后自动返回首页
        }
    }

    /** 辅助：让某个节点上的 Animation 重新播放一次 */
    private playAniOnce(aniNode: Node | null) {
        if (!aniNode) return;
        const anim = aniNode.getComponent(Animation);
        if (!anim) {
            console.warn(`节点 ${aniNode.name} 上没有 Animation 组件`);
            return;
        }
        // 停止旧动画并从头播放
        anim.stop();
        anim.play();
    }
    

    /**
     * 检查当前关卡并更新按钮显示状态
     */
    private checkAndUpdateButtons(): void {
        const gameManager = WZBPW_GameManager.instance;

        if (!gameManager) {
            console.error('WZBPW_VictoryPanel: GameManager instance not found');
            return;
        }

        // 播放胜利音效
        const audioManager = WZBPW_AudioManager.instance;
        if (audioManager) {
            audioManager.playVictorySound();
        }

        // 如果是第25关（最后一关），隐藏"下一关"按钮
        if (gameManager.currentLevel >= 25) {
            if (this.nextLevelButton) {
                this.nextLevelButton.active = false;
            }
            console.log('WZBPW_VictoryPanel: Last level (25), hiding next level button');
        } else {
            if (this.nextLevelButton) {
                this.nextLevelButton.active = true;
            }
        }
    }

    /**
     * 点击下一关按钮
     * Requirements: 6.2, 6.3, 9.1
     */
    public onNextLevelClick(): void {
        const gameManager = WZBPW_GameManager.instance;
        const uiManager = WZBPW_UIManager.instance;
        const levelManager = WZBPW_LevelManager.instance;

        if (!gameManager) {
            console.error('WZBPW_VictoryPanel: GameManager instance not found');
            return;
        }

        // 隐藏胜利界面
        if (uiManager) {
            uiManager.hideAllPanels();
        }

        // 如果是第25关，不应该执行到这里（按钮已隐藏）
        if (gameManager.currentLevel >= 25) {
            console.warn('WZBPW_VictoryPanel: Next level button should be hidden on level 25');
            return;
        }

        // 发送页面转换事件（第一关除外，即从第2关开始发送）
        if (gameManager.currentLevel > 1) {
            ProjectEventManager.emit(ProjectEvent.页面转换, "蚊子别跑蛙");
        }

        // 加载下一关
        if (levelManager) {
            levelManager.loadNextLevel();
        } else {
            console.error('WZBPW_VictoryPanel: LevelManager instance not found');
        }
    }

    /**
     * 点击返回主页按钮
     */
    public onHomeClick(): void {
        const uiManager = WZBPW_UIManager.instance;
        const levelManager = WZBPW_LevelManager.instance;

        // 隐藏胜利界面
        if (uiManager) {
            uiManager.hideAllPanels();
        }

        // 返回首页
        if (levelManager) {
            levelManager.returnToHome();
        } else {
            console.error('WZBPW_VictoryPanel: LevelManager instance not found');
        }
    }
}
