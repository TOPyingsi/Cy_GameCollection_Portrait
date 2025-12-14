import { _decorator, Component, find, Node, Prefab } from 'cc';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('TZHZ_GameManager')
export class TZHZ_GameManager extends Component {
    public static Instance: TZHZ_GameManager = null;

    @property(GamePanel)
    gamePanel: GamePanel = null;
    @property(Prefab) answer: Prefab = null;

    // @property(Prefab)
    // answer: Prefab = null;

    protected onLoad(): void {
        TZHZ_GameManager.Instance = this;
    }
    start() {
        // this.gamePanel.answerPrefab = this.answer;


    }

    WinorLose() {

        let parentNode = find("Canvas/工作台");
        if (this.checkAllChildrenHaveChildren(parentNode) && find("Canvas/菜单栏/背景/选框").active == true) {
            find("Canvas/完成").active = true;
        }
        else {
            find("Canvas/完成").active = false;
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


