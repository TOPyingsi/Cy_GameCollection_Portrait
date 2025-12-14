import { _decorator, AudioClip, Component, director, Node, AudioSource } from 'cc';
import { ZDXS_GameData } from './ZDXS_GameData';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_AudioManager')
export class ZDXS_AudioManager extends Component {
    public static Instance: ZDXS_AudioManager = null;

    @property({ type: [AudioClip] })
    Audios: AudioClip[] = [];

    MapSources: Map<string, AudioSource> = new Map();
    protected onLoad(): void {
        if (ZDXS_AudioManager.Instance) return;
        ZDXS_AudioManager.Instance = this;
        director.addPersistRootNode(this.node);
        this.Load();
    }

    // 通过音频资源数组加载所有 AudioSource
    Load() {
        for (let i = 0; i < this.Audios.length; i++) {
            let audioSource = this.node.addComponent(AudioSource);
            audioSource.clip = this.Audios[i];
            audioSource.playOnAwake = false;
            this.MapSources.set(this.Audios[i].name, audioSource);
        }
    }

    //通过名字播放音乐
    Play(name: string) {
        if (ZDXS_GameData.Instance.Mute) return;

        let audioSource = this.MapSources.get(name);
        if (audioSource) {
            audioSource.play();
        }
    }

    PlayMusic() {
        if (ZDXS_GameData.Instance.Mute) return;
        let audioSource = this.MapSources.get("BG");
        if (audioSource) {
            audioSource.play();
            audioSource.loop = true;
        }
    }

    StopMusic() {
        let audioSource = this.MapSources.get("BG");
        if (audioSource) {
            audioSource.stop();
        }
    }

}


