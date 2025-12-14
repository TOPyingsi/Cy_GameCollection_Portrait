import { _decorator, AudioClip, Component, director, Label, Node, tween, v3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import PrefsManager from 'db://assets/Scripts/Framework/Managers/PrefsManager';
import UI_BreatheAni from 'db://assets/Scripts/Framework/UI/UI_BreatheAni';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('KDZLM_GameManager')
export class KDZLM_GameManager extends Component {
    public static instance: KDZLM_GameManager;

    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Label) currentScore: Label = null;
    @property(Label) highestScore: Label = null;
    @property(Node) startGameButton: Node = null;
    @property(Node) newRecord: Node = null;
    @property(AudioClip) clip: AudioClip = null;

    private score: number = 0;

    protected onLoad(): void {
        KDZLM_GameManager.instance = this;
        director.getScene().on("TOUCH_START", this.TOUCH_START, this);
    }

    protected start(): void {
        this.gamePanel.StopTimer()
        this.initUI()
    }

    startGame() {
        this.startGameButton.active = false
        director.getScene().emit('startGame', true)
        this.gamePanel.StartTimer()
    }

    initUI() {
        this.currentScore.string = '0'
        const score = PrefsManager.GetNumber(`${director.getScene().name}_highestScore`)
        this.highestScore.string = score ? `最高分数\n${score}` : `最高分数\n${0}`;
    }

    updateScore(score: number) {
        this.currentScore.string = score.toString()
    }

    TOUCH_START() {
        this.score++;
        AudioManager.Instance.PlaySFX(this.clip);
        this.updateScore(this.score);
    }

    gameOver() {
        if (this.score == 0) {
            this.gamePanel.Lost();
        } else {
            const score = PrefsManager.GetNumber(`${director.getScene().name}_highestScore`)
            if (this.score > score) {
                PrefsManager.SetNumber(`${director.getScene().name}_highestScore`, this.score);
                this.newRecord.active = true;
            }
            this.scheduleOnce(() => {
                this.gamePanel.Win();
            }, 1)
        }
    }


}


