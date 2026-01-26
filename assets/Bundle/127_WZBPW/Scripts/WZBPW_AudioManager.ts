import { _decorator, Component, AudioClip, AudioSource, director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 音频管理器 - 单例模式
 * 管理游戏中的所有音效和背景音乐
 */
@ccclass('WZBPW_AudioManager')
export class WZBPW_AudioManager extends Component {
    // 单例实例
    private static _instance: WZBPW_AudioManager | null = null;

    // 背景音乐
    @property(AudioClip)
    public bgMusic: AudioClip | null = null;

    // 青蛙叫声（吃蚊子）
    @property(AudioClip)
    public frogCallSound: AudioClip | null = null;

    // 失败音效
    @property(AudioClip)
    public failureSound: AudioClip | null = null;

    // 胜利音效
    @property(AudioClip)
    public victorySound: AudioClip | null = null;

    // 音频源组件（用于播放背景音乐）
    private _bgMusicSource: AudioSource | null = null;

    // 音频源组件（用于播放音效）
    private _sfxSource: AudioSource | null = null;

    /**
     * 获取单例实例
     */
    public static get instance(): WZBPW_AudioManager | null {
        return WZBPW_AudioManager._instance;
    }

    onLoad() {
        // 单例模式：确保只有一个实例
        if (WZBPW_AudioManager._instance === null) {
            WZBPW_AudioManager._instance = this;
            director.addPersistRootNode(this.node); // 跨场景保持
        } else if (WZBPW_AudioManager._instance !== this) {
            this.destroy();
            return;
        }

        // 创建背景音乐音频源
        this._bgMusicSource = this.node.addComponent(AudioSource);
        if (this._bgMusicSource) {
            this._bgMusicSource.loop = true;
            this._bgMusicSource.playOnAwake = false;
            this._bgMusicSource.volume = 0.5; // 背景音乐音量稍低
        }

        // 创建音效音频源
        this._sfxSource = this.node.addComponent(AudioSource);
        if (this._sfxSource) {
            this._sfxSource.loop = false;
            this._sfxSource.playOnAwake = false;
            this._sfxSource.volume = 1.0;
        }

        // 开始播放背景音乐
        this.playBGMusic();
    }

    onDestroy() {
        if (WZBPW_AudioManager._instance === this) {
            WZBPW_AudioManager._instance = null;
        }
    }

    /**
     * 播放背景音乐（循环）
     */
    public playBGMusic(): void {
        if (!this._bgMusicSource || !this.bgMusic) {
            console.warn('WZBPW_AudioManager: BGMusic source or clip not found');
            return;
        }

        this._bgMusicSource.clip = this.bgMusic;
        this._bgMusicSource.play();
        console.log('WZBPW_AudioManager: Playing background music');
    }

    /**
     * 停止背景音乐
     */
    public stopBGMusic(): void {
        if (this._bgMusicSource) {
            this._bgMusicSource.stop();
        }
    }

    /**
     * 播放青蛙叫声（吃蚊子时）
     */
    public playFrogCall(): void {
        if (!this._sfxSource || !this.frogCallSound) {
            console.warn('WZBPW_AudioManager: Frog call sound not found');
            return;
        }

        this._sfxSource.playOneShot(this.frogCallSound, 1.0);
        console.log('WZBPW_AudioManager: Playing frog call sound');
    }

    /**
     * 播放失败音效
     */
    public playFailureSound(): void {
        if (!this._sfxSource || !this.failureSound) {
            console.warn('WZBPW_AudioManager: Failure sound not found');
            return;
        }

        this._sfxSource.playOneShot(this.failureSound, 1.0);
        console.log('WZBPW_AudioManager: Playing failure sound');
    }

    /**
     * 播放胜利音效
     */
    public playVictorySound(): void {
        if (!this._sfxSource || !this.victorySound) {
            console.warn('WZBPW_AudioManager: Victory sound not found');
            return;
        }

        this._sfxSource.playOneShot(this.victorySound, 1.0);
        console.log('WZBPW_AudioManager: Playing victory sound');
    }

    /**
     * 设置背景音乐音量
     * @param volume 音量 (0-1)
     */
    public setBGMusicVolume(volume: number): void {
        if (this._bgMusicSource) {
            this._bgMusicSource.volume = Math.max(0, Math.min(1, volume));
        }
    }

    /**
     * 设置音效音量
     * @param volume 音量 (0-1)
     */
    public setSFXVolume(volume: number): void {
        if (this._sfxSource) {
            this._sfxSource.volume = Math.max(0, Math.min(1, volume));
        }
    }
}
