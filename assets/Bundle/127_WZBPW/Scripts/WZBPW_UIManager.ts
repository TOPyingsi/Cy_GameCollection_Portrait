import { _decorator, Component, Node, Label, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

/**
 * UI管理器
 * 控制胜利/失败界面显示和生命数显示
 */
@ccclass('WZBPW_UIManager')
export class WZBPW_UIManager extends Component {
    // 单例实例
    private static _instance: WZBPW_UIManager | null = null;

    // 生命数显示标签
    @property(Label)
    public livesLabel: Label | null = null;

    // 关卡显示标签
    @property(Label)
    public levelLabel: Label | null = null;

    // 胜利界面预制体
    @property(Prefab)
    public victoryPanelPrefab: Prefab | null = null;

    // 失败界面预制体
    @property(Prefab)
    public failurePanelPrefab: Prefab | null = null;

    // UI容器节点（用于放置弹窗）
    @property(Node)
    public panelContainer: Node | null = null;

    // 胜利界面节点（场景中已存在的）
    @property(Node)
    public victoryPanelNode: Node | null = null;

    // 失败界面节点（场景中已存在的）
    @property(Node)
    public failurePanelNode: Node | null = null;

    // 当前显示的面板
    private _currentPanel: Node | null = null;

    /**
     * 获取单例实例
     */
    public static get instance(): WZBPW_UIManager | null {
        return WZBPW_UIManager._instance;
    }

    onLoad() {
        // 单例模式：确保只有一个实例
        if (WZBPW_UIManager._instance === null) {
            WZBPW_UIManager._instance = this;
        } else if (WZBPW_UIManager._instance !== this) {
            this.destroy();
            return;
        }

        // 初始化时隐藏胜利和失败面板
        if (this.victoryPanelNode) {
            this.victoryPanelNode.active = false;
        }
        if (this.failurePanelNode) {
            this.failurePanelNode.active = false;
        }
    }

    onDestroy() {
        if (WZBPW_UIManager._instance === this) {
            WZBPW_UIManager._instance = null;
        }
    }

    /**
     * 更新生命显示
     * @param count 当前生命数
     */
    public updateLives(count: number): void {
        if (this.livesLabel) {
            this.livesLabel.string = count.toString();
        }
    }

    /**
     * 更新关卡显示
     * @param level 当前关卡号
     */
    public updateLevel(level: number): void {
        if (this.levelLabel) {
            this.levelLabel.string = `关卡 ${level}`;
        }
    }

    /**
     * 显示胜利界面
     */
    public showVictoryPanel(): void {
        this.hideAllPanels();
        
        // 优先使用直接引用的胜利面板节点
        if (this.victoryPanelNode) {
            this.victoryPanelNode.active = true;
            console.log('WZBPW_UIManager: Showing VictoryPanel');
            return;
        }

        // 如果没有直接引用，尝试从 panelContainer 查找
        if (this.panelContainer) {
            const existingPanel = this.panelContainer.getChildByName('VictoryPanel');
            if (existingPanel) {
                existingPanel.active = true;
                console.log('WZBPW_UIManager: Showing existing VictoryPanel from container');
                return;
            }
        }

        // 如果场景中没有，则从预制体实例化
        if (this.victoryPanelPrefab && this.panelContainer) {
            this._currentPanel = instantiate(this.victoryPanelPrefab);
            this.panelContainer.addChild(this._currentPanel);
            this._currentPanel.setSiblingIndex(this.panelContainer.children.length - 1);
            console.log('WZBPW_UIManager: Instantiated VictoryPanel from prefab');
        }
    }

    /**
     * 显示失败界面
     */
    public showFailurePanel(): void {
        this.hideAllPanels();
        
        // 优先使用直接引用的失败面板节点
        if (this.failurePanelNode) {
            this.failurePanelNode.active = true;
            console.log('WZBPW_UIManager: Showing FailurePanel');
            return;
        }

        // 如果没有直接引用，尝试从 panelContainer 查找
        if (this.panelContainer) {
            const existingPanel = this.panelContainer.getChildByName('FailurePanel');
            if (existingPanel) {
                existingPanel.active = true;
                console.log('WZBPW_UIManager: Showing existing FailurePanel from container');
                return;
            }
        }

        // 如果场景中没有，则从预制体实例化
        if (this.failurePanelPrefab && this.panelContainer) {
            this._currentPanel = instantiate(this.failurePanelPrefab);
            this.panelContainer.addChild(this._currentPanel);
            this._currentPanel.setSiblingIndex(this.panelContainer.children.length - 1);
            console.log('WZBPW_UIManager: Instantiated FailurePanel from prefab');
        }
    }

    /**
     * 隐藏所有弹窗
     */
    public hideAllPanels(): void {
        // 隐藏直接引用的面板
        if (this.victoryPanelNode) {
            this.victoryPanelNode.active = false;
        }
        if (this.failurePanelNode) {
            this.failurePanelNode.active = false;
        }

        // 销毁动态创建的面板
        if (this._currentPanel) {
            this._currentPanel.destroy();
            this._currentPanel = null;
        }

        // 隐藏 panelContainer 中的面板（兼容旧方式）
        if (this.panelContainer) {
            for (const child of this.panelContainer.children) {
                if (child.name === 'VictoryPanel' || child.name === 'FailurePanel') {
                    child.active = false;
                }
            }
        }

        console.log('WZBPW_UIManager: All panels hidden');
    }
}
