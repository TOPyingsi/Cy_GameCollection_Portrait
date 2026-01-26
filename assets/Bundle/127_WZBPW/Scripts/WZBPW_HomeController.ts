import { _decorator, Component, Node } from 'cc';
import { WZBPW_LevelManager } from './WZBPW_LevelManager';
import { Panel, UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
const { ccclass, property } = _decorator;

/**
 * 首页控制器
 * 处理首页的"开始游戏"按钮点击事件
 */
@ccclass('WZBPW_HomeController')
export class WZBPW_HomeController extends Component {
    /**
     * 点击"开始游戏"按钮
     * 显示UI节点，加载第一关或上次保存的关卡
     */
    public onStartGameClick(): void {
        const levelManager = WZBPW_LevelManager.instance;

        if (!levelManager) {
            console.error('WZBPW_HomeController: LevelManager instance not found');
            return;
        }

        // 开始游戏
        levelManager.startGame();

        console.log('WZBPW_HomeController: Start game button clicked');

        this.node.active = false;
    }

    FanHui() {
        UIManager.ShowPanel(Panel.ReturnPanel);
    }
}
