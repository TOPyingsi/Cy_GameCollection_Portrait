import { _decorator, Component, Node, Prefab } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('NZJFS_GameManager')
export class NZJFS_GameManager extends Component {
    public static Instance: NZJFS_GameManager = null;
    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Prefab) answer: Prefab = null;
    @property(Node)
    TipsManager: Node = null;
    public GameLevel: number = 0;
    protected onLoad(): void {
        this.gamePanel.winStr = "鉴定为真粉丝";
        this.gamePanel.lostStr = "看来你是假粉丝";
        NZJFS_GameManager.Instance = this;
        this.gamePanel.answerPrefab = this.answer;
    }
    TipsActive() {
        this.TipsManager.active = true;
    }
    start() {


    }

    Lose() {
        this.gamePanel.Lost();
    }
    win() {

        this.gamePanel.Win();

    }
}


