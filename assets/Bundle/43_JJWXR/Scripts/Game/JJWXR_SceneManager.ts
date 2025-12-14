import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_SceneManager')
export class JJWXR_SceneManager extends Component {

    public levelIndex: number = 0;

    @property({ type: Node })
    public sceneNode: Node[] = [];

    start() {
        // 读取本地数据，获取当前关卡数
        let curLevel = parseInt(localStorage.getItem('currentLevel')) % 6;
        if (curLevel == 0) curLevel = 6;
        let index = curLevel - 1;
        this.levelIndex = index;
        // let level = JSON.parse(localStorage.getItem('level01'));
        // this.levelIndex = level.level;

        // 加载场景节点
        // this.sceneNode = this.node.children;
        for (let i = 0; i < this.sceneNode.length; i++) {
            if (i == this.levelIndex) {
                this.sceneNode[i].active = true;
            }
            else {
                this.sceneNode[i].active = false;
            }
        }

    }

}