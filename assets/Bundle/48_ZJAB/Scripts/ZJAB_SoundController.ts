import { _decorator, AudioClip, Component, } from 'cc';
import { AudioManager } from '../../../Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

export enum ZJAB_Sounds {
    胜利 = "胜利",
    失败 = "失败",
    AB_1 = "AB_1",
    BK = "BK",
    HY = "HY",
    NZ_1 = "NZ_1",
    NZ_2 = "NZ_2",
    NZ_3 = "NZ_3",
    SJ = "SJ",
    SJ_2 = "SJ_2",
    TZ_1 = "TZ_1",
    TZ_2 = "TZ_2",
    冰块 = "冰块",
    卡牌 = "卡牌",
    火焰 = "火焰",
}

@ccclass('ZJAB_SoundController')
export class ZJAB_SoundController extends Component {
    public static Instance: ZJAB_SoundController = null;

    @property(AudioClip)
    AudioClips: AudioClip[] = [];

    Sounds: Map<string, AudioClip> = new Map();

    protected onLoad(): void {
        ZJAB_SoundController.Instance = this;
        this.loadSources();
    }

    loadSources() {
        this.AudioClips.forEach(e => {
            this.Sounds.set(e.name, e);
        })
    }

    PlaySound(key: string) {
        const sound = this.Sounds.get(key);
        if (!sound) {
            console.error(`没找到音乐${key}`);
            return;
        }
        AudioManager.Instance.PlaySFX(sound);
    }
}


