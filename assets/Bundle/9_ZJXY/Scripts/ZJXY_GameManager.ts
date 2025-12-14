import { _decorator, Collider2D, Component, director, find, Node, Physics2DUtils, PolygonCollider2D, Prefab, RigidBody2D } from 'cc';
import Banner from 'db://assets/Scripts/Banner';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('ZJXY_GameManager')
export class ZJXY_GameManager extends Component {
    //@property(Node) 
    // Btn_More: Node;
    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Prefab) answer: Prefab = null;
    public WinorLose: boolean = null;
    public WinNumber: number = 0;
    public change: number = 0;

    public static Instance: ZJXY_GameManager = null;

    protected onLoad(): void {
        ZJXY_GameManager.Instance = this;

    }

    start() {
        // if (Banner.IsShowServerBundle == false) {
        //     this.Btn_More.active = false
        // }
        // else {
        //     this.Btn_More.active = true;
        // }
        this.gamePanel.winStr = "小鱼得救了";
        this.gamePanel.lostStr = "小鱼(╯▽╰ )好香啊~~";
        this.gamePanel.answerPrefab = this.answer;
    }

    GameJudgment() {
        if (ZJXY_GameManager.Instance.WinorLose == true && this.change == 0) {

            this.gamePanel.Win();
            find("Canvas/地图/鱼缸").getComponent(PolygonCollider2D).enabled = false;
            this.WinNumber = 0;
        }
        else if (ZJXY_GameManager.Instance.WinorLose == false) {
            this.gamePanel.Lost();
            find("Canvas/地图/鱼缸").getComponent(PolygonCollider2D).enabled = false;
            this.change = 1;
        }
    }
    NumberJudgment() {
        if (this.WinNumber >= 12 && this.WinorLose != false) {
            this.WinorLose = true;

            this.GameJudgment();
        }
    }
}


