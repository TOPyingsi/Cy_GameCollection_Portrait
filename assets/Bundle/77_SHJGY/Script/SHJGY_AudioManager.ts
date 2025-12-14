import { _decorator, AudioClip, Component, Node } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SHJGY_AudioManager')
export class SHJGY_AudioManager extends Component {

    public static instance: SHJGY_AudioManager = null;

    @property(AudioClip) BGM: AudioClip = null;
    @property([AudioClip]) audios: AudioClip[] = [];

    protected onLoad(): void {
        SHJGY_AudioManager.instance = this;
    }

    protected start(): void {
        AudioManager.Instance.PlayBGM(this.BGM);
    }

    playAudio(str: string): number {
        if (str) {
            const audio = this.audios.find(audio => audio.name == str)
            AudioManager.Instance.PlaySFX(audio);
            return audio.getDuration();
        }
    }
}


