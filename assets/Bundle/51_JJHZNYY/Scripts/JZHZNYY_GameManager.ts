import { _decorator, Component, Node, ProgressBar } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('JZHZNYY_GameManager')
export class JZHZNYY_GameManager extends Component {
    @property(Node)
    ProGressBar: Node = null;
    @property(GamePanel) gamePanel: GamePanel = null;
    public static Instance: JZHZNYY_GameManager = null;
    protected onLoad(): void {
        JZHZNYY_GameManager.Instance = this;
        // AudioManager.Instance.PlaySFX();
    }
    start() {
        this.schedule(this.UpdateProgressBar, 0.3);
    }

    update(deltaTime: number) {

    }
    UpdateProgressBar() {
        if (this.ProGressBar.getComponent(ProgressBar).progress <= 0) {
            return
        }
        this.ProGressBar.getComponent(ProgressBar).progress -= 0.02;

    }
    停止递减() {
        this.unschedule(this.UpdateProgressBar);
    }
    Win() {
        this.gamePanel.Win();
    }
}


