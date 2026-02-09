import { _decorator, Component, Node } from 'cc';
import { WZBPW_LevelManager } from './WZBPW_LevelManager';
import { WZBPW_GameManager, GameState } from './WZBPW_GameManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

/**
 * 暂停面板
 * 提供继续、刷新、主页三个功能
 */
@ccclass('WZBPW_PausePanel')
export class WZBPW_PausePanel extends Component {
    // 暂停面板节点（整个面板）
    @property(Node)
    public pausePanelNode: Node | null = null;

    // 游戏暂停前的状态
    private _previousGameState: GameState = GameState.IDLE;

    onLoad() {
        // 初始化时隐藏面板
        if (this.pausePanelNode) {
            this.pausePanelNode.active = false;
        }
    }

    /**
     * 打开暂停面板
     */
    public openPanel(): void {
        const gameManager = WZBPW_GameManager.instance;
        
        if (gameManager) {
            // 保存当前游戏状态
            this._previousGameState = gameManager.gameState;
            
            // 暂停游戏（设置为非活动状态）
            gameManager.isGameActive = false;
        }

        if (this.pausePanelNode) {
            this.pausePanelNode.active = true;
            console.log('WZBPW_PausePanel: Panel opened, game paused');
        }
    }

    /**
     * 关闭暂停面板
     */
    public closePanel(): void {
        if (this.pausePanelNode) {
            this.pausePanelNode.active = false;
            console.log('WZBPW_PausePanel: Panel closed');
        }
    }

    /**
     * 继续游戏按钮点击
     * 关闭面板，恢复游戏状态
     */
    public onContinueClick(): void {
        const gameManager = WZBPW_GameManager.instance;
        
        if (gameManager) {
            // 恢复游戏状态
            gameManager.isGameActive = true;
            gameManager.gameState = this._previousGameState;
        }

        this.closePanel();
        console.log('WZBPW_PausePanel: Game resumed');
    }

    /**
     * 刷新按钮点击
     * 重新开始当前关卡
     */
    public onRefreshClick(): void {
        const levelManager = WZBPW_LevelManager.instance;
        
        if (levelManager) {
            // 关闭面板
            this.closePanel();
            
            // 重新加载当前关卡
            levelManager.reloadCurrentLevel();
            
            console.log('WZBPW_PausePanel: Level restarted');
        } else {
            console.error('WZBPW_PausePanel: LevelManager instance not found');
        }
    }

    /**
     * 主页按钮点击
     * 返回主页
     */
    public onHomeClick(): void {
        const levelManager = WZBPW_LevelManager.instance;
        
        if (levelManager) {
            // 关闭面板
            this.closePanel();
            
            // 返回主页
            levelManager.returnToHome();

            ProjectEventManager.emit(ProjectEvent.返回主页, "蚊子别跑蛙");
            
            console.log('WZBPW_PausePanel: Returned to home');
        } else {
            console.error('WZBPW_PausePanel: LevelManager instance not found');
        }
    }
}
