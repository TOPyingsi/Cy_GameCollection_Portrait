import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('NYSJ_AudioMgr')
export class NYSJ_AudioMgr extends Component {
    // @property(AudioClip)
    // BGM: AudioClip = null;
    @property({ type: [AudioClip] })
    public effectAudio: AudioClip[] = [];
    private audio: AudioSource = null;

    public static instance: NYSJ_AudioMgr = null;

    protected start(): void {
        NYSJ_AudioMgr.instance = this;
        this.audio = this.node.getComponent(AudioSource);
        // AudioManager.Instance.PlayBGM(this.BGM);
    }

    playEffect(name: string) {
        if (!AudioManager.IsSoundOn) {
            return;
        }

        if (this.audio.playing) {
            return;
        }

        for (let i = 0; i < this.effectAudio.length; i++) {
            if (name === this.effectAudio[i].name) {
                let cilp = this.effectAudio[i];
                this.audio.clip = cilp;
                this.audio.play();
                break;
            }
        }

    }

    stopEffect() {
        this.audio.stop();
        AudioManager.Instance.StopSFX();
    }

    right() {
        AudioManager.Instance.PlaySFX(this.effectAudio[0]);
    }

    wrong() {
        AudioManager.Instance.PlaySFX(this.effectAudio[1]);
    }
}


