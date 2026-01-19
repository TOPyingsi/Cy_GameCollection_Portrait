import { _decorator, Component, Node } from 'cc';
import { JJWXR_pigeon_RemianUI } from './JJWXR_pigeon_RemianUI';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_pigeon_RamainManager')
export class JJWXR_pigeon_RamainManager extends Component {

    public static instance: JJWXR_pigeon_RamainManager = null;

    onLoad() {
        JJWXR_pigeon_RamainManager.instance = this;
    }

    @property({ type: Node })
    public remainUINode: Node[] = [];

    remainCountIndex: number = 0;

    start() {
        let curLevel = parseInt(localStorage.getItem('JJWXR_pigeon_currentLevel')) % 6; // 获取当前关卡
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

    remainCountReduse() {
        const remainUINode = this.remainUINode[this.remainCountIndex];
        const remainUIComp = remainUINode.getComponent(JJWXR_pigeon_RemianUI);
        remainUIComp.remainCountReduse();
    }
}