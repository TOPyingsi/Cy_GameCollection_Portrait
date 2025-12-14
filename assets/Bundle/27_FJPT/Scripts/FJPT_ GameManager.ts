import { _decorator, Component, find, Node, Prefab } from 'cc';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { FJPT_GridSence } from './FJPT_GridSence';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('FJPT__GameManager')
export class FJPT__GameManager extends Component {
    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Prefab) answer: Prefab = null;

    public static Instance: FJPT__GameManager = null;
    protected onLoad(): void {
        FJPT__GameManager.Instance = this;
    }
    start() {

        this.gamePanel.answerPrefab = this.answer;

    }

    WinorLose() {
        const isWin = FJPT_GridSence.Instance.gridManager.grid.every(row => row.every(cell => cell === 1));
        if (isWin) {


            this.gamePanel.Win();

        }

    }

}
