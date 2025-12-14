import { _decorator, AudioClip, AudioSource, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BNSXL_AudioManager')
export class BNSXL_AudioManager extends Component {
    public static Instance: BNSXL_AudioManager;

    @property(AudioSource) audioSource: AudioSource = null;
    @property([AudioClip]) audios: AudioClip[] = [];

    protected onLoad(): void {
        BNSXL_AudioManager.Instance = this;
    }

    playAudio(str: string): number {
        this.audioSource.stop();
        const clip = this.audios.find(au => au.name === str);
        if (clip) {
            this.audioSource.playOneShot(clip);
            return clip.getDuration();
        } else {
            console.warn(`音频 "${str}" 未找到`);
        }
    }
}


