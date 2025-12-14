import { _decorator, AudioClip, AudioSource, Component, Node, Prefab } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('BNZTL_GameManager')
export class BNZTL_GameManager extends Component {
    public static Instance: BNZTL_GameManager = null;
    public _gameSence: number = 0;
    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Prefab) answer: Prefab = null;
    @property({ type: [AudioClip] }) YingYue: Array<AudioClip> = [];
    protected onLoad(): void {
        BNZTL_GameManager.Instance = this;
        this.gamePanel.winStr = "成功逃离，受死吧仙翁";
        this.gamePanel.lostStr = "哦豁，被发现喽";
        this.gamePanel.answerPrefab = this.answer;
    }
    start() {

    }

    update(deltaTime: number) {

    }
    win() {
        this.gamePanel.Win();
    }
    Lost() {
        this.gamePanel.Lost();
    }
    Music(e) {
        this.node.getComponent(AudioSource).clip = this.YingYue[e];
        AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
    }
}


