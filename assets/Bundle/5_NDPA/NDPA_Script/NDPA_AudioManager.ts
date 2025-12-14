import { _decorator, Component, AudioClip, AudioSource, tween, Tween, director, Prefab, instantiate } from 'cc';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

//名字需要和拖拽赋值的音频名字一致
export enum NDPA_Audios {
    BGMusci = "背景音乐",
    Click = "点击",
    PartClick = "按钮点击音效",
    RiseProgress = "涨进度条",
    OpenTreasureBox = "打开宝箱",
    Forbid = "禁止点击音效",
    PartFall = "零件落地",
    BankNote = "获得钞票",
    BattleMusic = "战斗背景音乐",
    Fire = "子弹发射",
    HitSton = "子弹击中石块",
    StonBroken = "石块破裂",
    HitDoor = "子弹击中门",
    HitTarget = "子弹击中靶子",
    HitEnemy = "子弹击中肉体",
    Upgrade = "升级",

    BallFall = "小球落地",
    Gold = "金币到账",
    Smile = "微笑",
    Cry = "大哭",
    Award = "打开宝箱",

    DMM_Player = "玩家被抓",
    DMM_AI = "AI被抓",
}

@ccclass('NDPA_AudioManager')
export class NDPA_AudioManager extends Component {
    private static _instance: NDPA_AudioManager = null;
    private static _loadingPromise: Promise<NDPA_AudioManager> | null = null;
    private static get Instance(): Promise<NDPA_AudioManager> {
        if (NDPA_AudioManager._instance == null) {
            if (NDPA_AudioManager._loadingPromise === null) {
                NDPA_AudioManager._loadingPromise = new Promise<NDPA_AudioManager>((resolve, reject) => {
                    BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, "Bundle/NDPA_Prefabs/AudioManager").then((prefab: Prefab) => {
                        let node = instantiate(prefab);
                        director.getScene()!.addChild(node);
                        // director.addPersistRootNode(node);
                        NDPA_AudioManager._instance = node.getComponent(NDPA_AudioManager);
                        resolve(NDPA_AudioManager._instance);
                    }).catch((error) => {
                        reject(error);
                    });
                });
            }
            return NDPA_AudioManager._loadingPromise;
        } else {
            return Promise.resolve(NDPA_AudioManager._instance);
        }
    }

    loadInstance(cb: Function = null) {
        BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, "Bundle/NDPA_Prefabs/AudioManager").then((prefab: Prefab) => {
            let node = instantiate(prefab);
            director.getScene()!.addChild(node);
            NDPA_AudioManager._instance = node.getComponent(NDPA_AudioManager);
            this.scheduleOnce(() => { NDPA_AudioManager.PlayMusic(NDPA_Audios.BGMusci); }, 0.1);
        })
    }

    static Mute: boolean = false;

    public static PlaySound(key: string, volume: number = 1, loop: boolean = false) {
        NDPA_AudioManager.Instance.then(a => a.PlaySound(key, volume, loop)).catch(error => console.error("Failed to play sound:", error));
    }

    public static StopSound(key: string) {
        NDPA_AudioManager.Instance.then(a => a.StopSound(key)).catch(error => console.error("Failed to stop sound:", error));
    }

    public static PlayMusic(key: string, volume: number = 1, loop: boolean = true) {
        NDPA_AudioManager.Instance.then(a => a.PlayMusic(key, volume, loop)).catch(error => console.error("Failed to play music:", error));
    }

    public static FadeSound(key: string, time: number, volume: number = 1) {
        NDPA_AudioManager.Instance.then(a => a.FadeSound(key, time, volume)).catch(error => console.error("Fade failed:", error));
    }

    public static PauseAll() {
        NDPA_AudioManager.Instance.then(a => a.PauseAll()).catch(error => console.error("PauseAll failed:", error));
    }

    public static ResumeAll() {
        NDPA_AudioManager.Instance.then(a => a.ResumeAll()).catch(error => console.error("ResumeAll failed:", error));
    }

    public static StopAll() {
        NDPA_AudioManager.Instance.then(a => a.StopAll()).catch(error => console.error("StopAll failed:", error));
    }

    //#region 节点方法

    @property(AudioClip)
    clips: AudioClip[] = [];

    playingAudios: AudioSource[] = [];

    audioSourceMap: Map<string, AudioSource> = new Map<string, AudioSource>();

    onLoad() {
        this.clips.forEach((sound) => {
            let audioSource = this.node.addComponent(AudioSource);
            audioSource.playOnAwake = false;
            audioSource.clip = sound;
            if (!this.audioSourceMap.has(sound.name)) {
                this.audioSourceMap.set(sound.name, audioSource);
            }
        });
    }

    private PlaySound(key: string, volume: number = 1, loop: boolean = false) {
        if (this.CheckNull(key)) return;
        if (NDPA_AudioManager.Mute) return;

        Tween.stopAllByTarget(this.audioSourceMap.get(key));

        this.audioSourceMap.get(key).loop = loop;
        this.audioSourceMap.get(key).volume = volume;
        this.audioSourceMap.get(key).play();
    }

    private PlayMusic(key: string, volume: number = 1, loop: boolean = true) {
        this.PlaySound(key, volume, loop);
    }

    private StopSound(key: string) {
        if (this.CheckNull(key)) return;
        this.audioSourceMap.get(key).stop();
    }

    private FadeSound(key: string, time: number, volume: number = 1) {
        if (this.CheckNull(key)) return;

        if (this.audioSourceMap.get(key)) {
            Tween.stopAllByTarget(this.audioSourceMap.get(key));
            this.PlaySound(key, volume);
        }

        tween(this.audioSourceMap.get(key)).to(time, { volume: 0 }).call(() => {
            this.StopSound(key);
        }).start();
    }

    private PauseAll() {
        this.playingAudios = [];
        for (const audioSource of this.audioSourceMap.values()) {
            if (audioSource.playing) {
                audioSource.pause();
                this.playingAudios.push(audioSource);
            }
        }
    }

    private ResumeAll() {
        this.playingAudios.forEach(audioSource => {
            audioSource.play();
        });
    }

    private StopAll() {
        for (const audioSource of this.audioSourceMap.values()) {
            if (audioSource.playing) {
                audioSource.stop();
            }
        }
    }

    private GetClip(key: string) {
        if (!this.audioSourceMap.get(key)) {
            console.error(`没有 Audio Source。`,);
            return null;
        } else {
            return this.audioSourceMap.get(key);
        }
    }

    private CheckNull(key: string): boolean {

        if (this.node == null) {
            console.error(`没有这个节点。`);
            this.loadInstance();
            return true;
        }

        if (!this.audioSourceMap.get(key)) {
            console.error(`没有 Audio Source。`,);
            return true;
        }

        return false;
    }

    //#endregion

}