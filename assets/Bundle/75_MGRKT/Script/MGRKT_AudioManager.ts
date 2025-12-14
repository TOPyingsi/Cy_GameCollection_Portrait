import { _decorator, AudioClip, Component, Node } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('MGRKT_AudioManager')
export class MGRKT_AudioManager extends Component {
    public static instance: MGRKT_AudioManager = null;

    @property([AudioClip]) audioClips: AudioClip[] = [];
    @property(AudioClip) R: AudioClip = null;
    @property(AudioClip) BGM: AudioClip = null;

    protected onLoad(): void {
        MGRKT_AudioManager.instance = this;
    }

    protected start(): void {
        AudioManager.Instance.PlayBGM(this.BGM);
    }

    playAudio(name: string): number {
        const clip = this.audioClips.find(x => x.name == name)
        if (clip) {
            AudioManager.Instance.PlaySFX(clip);
            return clip.getDuration();
        }
    }

}


