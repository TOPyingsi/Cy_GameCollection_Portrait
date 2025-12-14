import { _decorator, Component, find, Node, Prefab } from 'cc';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('GKDR_GameManager')
export class GKDR_GameManager extends Component {
    public static Instance: GKDR_GameManager = null;
    @property(GamePanel)
    gamePanel: GamePanel = null;
    @property(Prefab) answer: Prefab = null;
    protected onLoad(): void {
        GKDR_GameManager.Instance = this;
    }
    start() {

    }
    update() {

    }
    WinorLose() {

        let parentNode = find("Canvas/工作台");
        if (this.checkAllChildrenHaveChildren(parentNode)) {
            find("Canvas/完成").active = true;
        }



    }
    checkAllChildrenHaveChildren(parentNode: Node): boolean {
        // 遍历父节点的所有子节点
        for (let childNode of parentNode.children) {
            // 如果某个子节点没有子节点，返回 false
            if (childNode.children.length === 0) {
                return false;
            }
        }
        // 所有子节点都有子节点，返回 true
        return true;
    }

}


