import { _decorator, AudioClip, Component, Node } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
const { ccclass, property } = _decorator;

@ccclass('TJ_AudioManager')
export class TJ_AudioManager extends Component {
    public static instance: TJ_AudioManager = null;

    @property(AudioClip) bgm: AudioClip = null;
    @property(AudioClip) fail: AudioClip = null;
    @property([AudioClip]) audios: AudioClip[] = [];

    protected onLoad(): void {
        TJ_AudioManager.instance = this;
    }

    start() {
        AudioManager.Instance.PlayBGM(this.bgm);
    }

    playAudio(name: string): number {
        const audio = this.audios.find(audio => audio.name == name)
        if (audio) {
            AudioManager.Instance.PlaySFX(audio)
            return audio.getDuration();
        } else {
            console.log("没有找到音频：" + name)
            const random = Tools.GetRandomInt(0, this.audios.length)
            AudioManager.Instance.PlaySFX(this.audios[random])
            return this.audios[random].getDuration();
        }
    }

    playFail() {
        AudioManager.Instance.PlaySFX(this.fail)
    }
}


