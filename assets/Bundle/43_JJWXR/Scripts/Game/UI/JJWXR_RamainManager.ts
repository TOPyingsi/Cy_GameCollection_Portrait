import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_RamainManager')
export class JJWXR_RamainManager extends Component {

    @property({ type: Node })
    public remainUINode: Node[] = [];

    remainCountIndex: number = 0;

    start() {
        let curLevel = parseInt(localStorage.getItem('currentLevel')) % 6; // 获取当前关卡
        if (curLevel == 0) curLevel = 6;
        this.remainCountIndex = curLevel - 1;
        for (let i = 0; i < this.remainUINode.length; i++) {
            if (i == this.remainCountIndex) {
                this.remainUINode[i].active = true;
            } else {
                this.remainUINode[i].active = false;
            }
        }
    }
}