import { _decorator, AudioClip, Component, Node } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('QC_AudioManager')
export class QC_AudioManager extends Component {
    public static instance: QC_AudioManager = null;

    @property(AudioClip) BGM: AudioClip = null;
    @property([AudioClip]) audios: AudioClip[] = [];

    protected onLoad(): void {
        QC_AudioManager.instance = this;
    }

    start() {
        AudioManager.Instance.PlayBGM(this.BGM);
    }

    playAudio(str: string): number {
        const audio = this.audios.find(audio => audio.name == str)
        if (audio) {
            AudioManager.Instance.PlaySFX(audio)
            return audio.getDuration();
        }
    }
}


