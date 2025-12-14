import { _decorator, AudioClip, Component, Node, Prefab } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('GH_GameManager')
export class GH_GameManager extends Component {
    public static instance: GH_GameManager = null;

    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Node) gameArea: Node = null;
    @property(Node) mask: Node = null;
    @property(Node) label: Node = null;
    @property(Node) xyy: Node = null;
    @property(AudioClip) button: AudioClip = null;
    @property(AudioClip) ti: AudioClip = null;
    @property(AudioClip) mt: AudioClip = null;
    @property([AudioClip]) audios: AudioClip[] = []
    @property(AudioClip) bgm: AudioClip = null;
    @property(Prefab) answer: Prefab = null;

    protected onLoad(): void {
        GH_GameManager.instance = this;
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer;
        AudioManager.Instance.PlayBGM(this.bgm);
        this.mask.active = true;
        this.scheduleOnce(() => {
            this.label.active = false;
            this.xyy.active = true;
            this.scheduleOnce(() => {
                this.xyy.active = false;
                this.mask.active = false;
            }, 2)
        }, 2)
    }

    count: number = 0

    refresh() {
        this.count++
        console.log("count", this.count)
        if (this.count >= 8) {
            this.gamePanel.Win()
        }
    }

    playAudio(str: string) {
        try {
            const audio = this.audios.find(audio => audio.name == str)
            AudioManager.Instance.PlaySFX(audio);
            return audio.getDuration();
        } catch (error) {
            console.log(error)
        }

    }
}


