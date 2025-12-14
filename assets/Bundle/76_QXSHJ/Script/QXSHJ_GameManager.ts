import { _decorator, AudioClip, Component, director, Node, Prefab } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('QXSHJ_GameManager')
export class QXSHJ_GameManager extends Component {
    public static instance: QXSHJ_GameManager = null;

    mtrCount: number = 0;

    rzCount: number = 0;

    hp: number = 3;

    @property(AudioClip) bgm: AudioClip = null;

    @property([Node]) hpActive: Node[] = [];
    @property([Node]) hpInactive: Node[] = [];

    @property(GamePanel) gamePanel: GamePanel = null;

    @property(Prefab) answer: Prefab = null;

    protected onLoad(): void {
        QXSHJ_GameManager.instance = this;
        director.getScene().on("WIN", this.win, this);
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer;

        AudioManager.Instance.PlayBGM(this.bgm);
    }

    updateHP() {
        this.hpActive[this.hpActive.length - this.hp].active = false;
        this.hpInactive[this.hpInactive.length - this.hp].active = true;
        this.hp--;
        if (this.hp == 0) {
            this.gamePanel.Lost();
        }
    }

    win() {
        this.scheduleOnce(() => {
            console.log("win")
            this.gamePanel.Win();
        }, 1)
    }

}


