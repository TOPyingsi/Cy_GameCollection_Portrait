import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import { AudioManager } from '../../../Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

export enum NZCK_Sounds {
    Click = "点击",
    Get = "获得卡片",
    SM = "撕膜",
}

@ccclass('NZCK_SoundController')
export class NZCK_SoundController extends Component {
    public static Instance: NZCK_SoundController = null;

    Sounds: Map<string, AudioClip> = new Map();

    protected onLoad(): void {
        NZCK_SoundController.Instance = this;
        this.loadSources();
    }

    loadSources() {
        const sources = this.getComponents(AudioSource);
        sources.forEach(e => {
            this.Sounds.set(e.clip.name, e.clip);
        })
    }

    PlaySound(key: string) {
        const sound = this.Sounds.get(key);
        if (!sound) {
            console.error(`没找到音乐${key}`);
            return;
        }
        AudioManager.Instance.PlaySFX(sound);
        // sound.play();
    }
}


