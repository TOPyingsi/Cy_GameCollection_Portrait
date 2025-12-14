import { _decorator, Component, Node, Sprite } from 'cc';
import { MM_GameManager } from './MM_GameManager';
const { ccclass, property } = _decorator;

@ccclass('MM_PropCtrl')
export class MM_PropCtrl extends Component {

    buttonClick() {
        const manager = MM_GameManager.Instance;

        if (this.node == manager.playerDY || manager.selectedNodes.has(this.node)) return;

        // 取消之前的选择状态
        if (manager.selectProp) manager.activeSelect(manager.selectProp, false);

        // 设置当前选择
        this.node.getChildByName("Select").active = true;
        manager.selectProp = this.node;
        manager.confirm.node.active = true;
    }
}