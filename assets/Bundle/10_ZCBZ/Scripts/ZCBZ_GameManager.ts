import { _decorator, Component, find, Label, Node, Prefab, tween } from 'cc';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('ZCBZ_GameManager')
export class ZCBZ_GameManager extends Component {
    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Prefab) answer: Prefab = null;
    @property(Label)
    label: Label = null; // 绑定 Label 组件
    public WinNumber: number = 0;
    public static Instance: ZCBZ_GameManager = null;

    protected onLoad(): void {

        ZCBZ_GameManager.Instance = this;
        this.gamePanel.winStr = "看来你的文化水平非常高";
        this.gamePanel.lostStr = "要细心一点哦，再试一次吧";
    }
    start() {

        this.gamePanel.answerPrefab = this.answer;
    }

    WinorLose() {
        if (this.WinNumber == 12) {
            this.scheduleOnce(() => {
                this.gamePanel.Win();
            }, 2);


        }
    }
    LabelChange() {
        this.label.getComponent(Label).string = this.WinNumber + "/12";
    }
}


