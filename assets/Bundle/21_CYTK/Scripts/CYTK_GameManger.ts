import { _decorator, Component, find, log, Node, Prefab, UITransform } from 'cc';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('CYTK_GameManger')
export class CYTK_GameManger extends Component {
    public _win: number = 0;
    public static Instance: CYTK_GameManger = null;
    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Prefab) answer: Prefab = null;
    protected onLoad(): void {
        CYTK_GameManger.Instance = this;
    }
    start() {
        this.gamePanel.answerPrefab = this.answer;
    }

    update(deltaTime: number) {

    }
    win() {

        if (this._win >= 4) {
            this.scheduleOnce(() => {

                this.gamePanel.Win();
                this._win = 0;
            }, 2)
        }


    }

}


