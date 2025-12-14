import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import { AudioManager } from '../../../Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

export enum SNZL_Sounds {
    Click = "点击",
    Place = "放置",
}

@ccclass('SNZL_SoundController')
export class SNZL_SoundController extends Component {
    public static Instance: SNZL_SoundController = null;

    @property(AudioClip)
    Clips: AudioClip[] = [];

    MapClips: Map<string, AudioClip> = new Map();

    protected onLoad(): void {
        SNZL_SoundController.Instance = this;
        this.initAudioClip();
    }

    initAudioClip() {
        // this.Clips.forEach(e => {
        //     const sound: AudioSource = this.node.addComponent(AudioSource);
        //     sound.clip = e;
        //     this.Sounds.set(e.name, sound);
        // })

        this.Clips.forEach(e => {
            this.MapClips.set(e.name, e);
        })
    }

    playSoundByName(name: string) {
        const sound = this.MapClips.get(name);
        if (!sound) {
            console.error(`没找到音频${name}`);
        }
        AudioManager.Instance.PlaySFX(sound);
    }
}


