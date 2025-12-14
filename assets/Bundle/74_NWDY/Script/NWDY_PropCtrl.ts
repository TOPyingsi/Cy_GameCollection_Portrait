import { _decorator, Component, Node, Sprite } from 'cc';
import { NWDY_GameManager } from './NWDY_GameManager';
const { ccclass, property } = _decorator;

@ccclass('NWDY_PropCtrl')
export class NWDY_PropCtrl extends Component {

    buttonClick() {
        const manager = NWDY_GameManager.Instance;

        if (this.node == manager.playerDY || manager.selectedNodes.has(this.node)) return;

        // 取消之前的选择状态
        if (manager.selectProp) manager.activeSelect(manager.selectProp, false);

        // 设置当前选择
        this.node.getChildByName("Select").active = true;
        manager.selectProp = this.node;
        manager.confirm.node.active = true;
    }
}