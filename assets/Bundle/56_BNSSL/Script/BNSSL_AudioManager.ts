import { _decorator, AudioClip, AudioSource, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BNSSL_AudioManager')
export class BNSSL_AudioManager extends Component {
    public static Instance: BNSSL_AudioManager;

    @property(AudioSource) audioSource: AudioSource = null;
    @property([AudioClip]) audios: AudioClip[] = [];


    protected onLoad(): void {
        BNSSL_AudioManager.Instance = this;
    }

    playAudio(str: string): number {
        if (!this.audioSource) {
            console.error("audioSource 未绑定");
            return 0;
        }
        if (this.audioSource.clip) this.audioSource.stop();

        const clip = this.audios.find(au => au.name === str);
        if (clip) {
            this.audioSource.playOneShot(clip);
            return clip.getDuration();
        } else {
            console.warn(`音频 "${str}" 未找到`);
        }
    }
}


