import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_AudioManager')
export class SHJCB_AudioManager extends Component {

    private static instance: SHJCB_AudioManager;
    public static get Instance(): SHJCB_AudioManager {
        return this.instance;
    }

    @property([AudioClip])
    clips: AudioClip[] = [];

    audio: AudioSource;

    protected onLoad(): void {
        SHJCB_AudioManager.instance = this;
        this.audio = this.getComponent(AudioSource);
        this._PlayMusic();
    }

    _PlayMusic() {
        AudioManager.Instance.PlayBGM(this.clips[0]);
    }

    _PlaySPMKMusic() {
        AudioManager.Instance.PlayBGM(this.clips[2]);
    }

    _PlayPTMusic() {
        AudioManager.Instance.PlayBGM(this.clips[22]);
    }

    _PlayLiveMusic() {
        AudioManager.Instance.PlayBGM(this.clips[42]);
    }

    _PlayCookMusic() {
        AudioManager.Instance.PlayBGM(this.clips[46]);
    }

    _PLayLoopSound(num: number) {
        this.audio.clip = this.clips[num];
        this.audio.play();
    }

    _StopLoopSound() {
        this.audio.stop();
    }

    _PlaySound(num: number) {
        if (this.clips[num]) AudioManager.Instance.PlaySFX(this.clips[num]);
    }

}