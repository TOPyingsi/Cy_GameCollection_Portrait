import { _decorator, Component, find, log, Node, Prefab, UITransform } from 'cc';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('CYTK_GameManger1')
export class CYTK_GameManger1 extends Component {
    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Prefab) answer: Prefab = null;
    public _win: number = 0;
    public static Instance: CYTK_GameManger1 = null;

    protected onLoad(): void {
        CYTK_GameManger1.Instance = this;
    }

    start() {

        this.gamePanel.answerPrefab = this.answer;
    }

    update(deltaTime: number) {

    }
    win() {

        if (this._win >= 5) {
            this.scheduleOnce(() => {

                this.gamePanel.Win();
                this._win = 0;
            }, 2)
        }
        console.log(this._win)

    }

}


