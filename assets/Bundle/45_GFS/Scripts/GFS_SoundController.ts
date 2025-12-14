import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import { AudioManager } from '../../../Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

export enum GFS_Sounds {
    DS_1 = "DS_1",
    DS_2 = "DS_2",
    NZ_1 = "NZ_1",
    NZ_2 = "NZ_2",
    人民币 = "人民币",
    八卦阵 = "八卦阵",
    化妆镜 = "化妆镜",
    太阳 = "太阳",
    失败 = "失败",
    宝剑 = "宝剑",
    昆仑甘露 = "昆仑甘露",
    月亮 = "月亮",
    朱砂口红 = "朱砂口红",
    桃木剑 = "桃木剑",
    母鸡 = "母鸡",
    男神海报 = "男神海报",
    符纸 = "符纸",
    纸币 = "纸币",
    胜利 = "胜利",
    蜡质口红 = "蜡质口红",
    酒 = "酒",
    铜镜 = "铜镜",
    黑狗 = "黑狗",
    黑狗血 = "黑狗血",
}

@ccclass('GFS_SoundController')
export class GFS_SoundController extends Component {
    public static Instance: GFS_SoundController = null;

    @property(AudioClip)
    AudioClips: AudioClip[] = [];

    Sounds: Map<string, AudioClip> = new Map();

    protected onLoad(): void {
        GFS_SoundController.Instance = this;
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


