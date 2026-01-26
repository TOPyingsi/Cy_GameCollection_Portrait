import { _decorator, Component, Node, sys } from 'cc';
import { WZBPW_AudioManager } from './WZBPW_AudioManager';
const { ccclass, property } = _decorator;

// 本地存储键名
const SOUND_ENABLED_KEY = "WZBPW_SOUND_ENABLED";
const MUSIC_ENABLED_KEY = "WZBPW_MUSIC_ENABLED";

/**
 * 声音控制面板
 * 控制音效和音乐的开关
 */
@ccclass('WZBPW_SoundPanel')
export class WZBPW_SoundPanel extends Component {
    // 声音面板节点（整个面板）
    @property(Node)
    public soundPanelNode: Node | null = null;

    // 声音开关节点
    @property(Node)
    public soundOnNode: Node | null = null;

    @property(Node)
    public soundOffNode: Node | null = null;

    // 音乐开关节点
    @property(Node)
    public musicOnNode: Node | null = null;

    @property(Node)
    public musicOffNode: Node | null = null;

    // 声音和音乐状态
    private _soundEnabled: boolean = true;
    private _musicEnabled: boolean = true;

    onLoad() {
        // 加载保存的设置
        this.loadSettings();

        // 初始化UI显示
        this.updateSoundUI();
        this.updateMusicUI();

        // 隐藏面板
        if (this.soundPanelNode) {
            this.soundPanelNode.active = false;
        }
    }

    /**
     * 打开声音面板
     */
    public openPanel(): void {
        if (this.soundPanelNode) {
            this.soundPanelNode.active = true;
            console.log('WZBPW_SoundPanel: Panel opened');
        }
    }

    /**
     * 关闭声音面板
     */
    public closePanel(): void {
        if (this.soundPanelNode) {
            this.soundPanelNode.active = false;
            console.log('WZBPW_SoundPanel: Panel closed');
        }
    }

    /**
     * 点击声音开按钮
     */
    public onSoundOnClick(): void {
        this._soundEnabled = false;
        this.updateSoundUI();
        this.applySoundSettings();
        this.saveSettings();
        console.log('WZBPW_SoundPanel: Sound disabled');
    }

    /**
     * 点击声音关按钮
     */
    public onSoundOffClick(): void {
        this._soundEnabled = true;
        this.updateSoundUI();
        this.applySoundSettings();
        this.saveSettings();
        console.log('WZBPW_SoundPanel: Sound enabled');
    }

    /**
     * 点击音乐开按钮
     */
    public onMusicOnClick(): void {
        this._musicEnabled = false;
        this.updateMusicUI();
        this.applyMusicSettings();
        this.saveSettings();
        console.log('WZBPW_SoundPanel: Music disabled');
    }

    /**
     * 点击音乐关按钮
     */
    public onMusicOffClick(): void {
        this._musicEnabled = true;
        this.updateMusicUI();
        this.applyMusicSettings();
        this.saveSettings();
        console.log('WZBPW_SoundPanel: Music enabled');
    }

    /**
     * 更新声音UI显示
     */
    private updateSoundUI(): void {
        if (this.soundOnNode) {
            this.soundOnNode.active = this._soundEnabled;
        }
        if (this.soundOffNode) {
            this.soundOffNode.active = !this._soundEnabled;
        }
    }

    /**
     * 更新音乐UI显示
     */
    private updateMusicUI(): void {
        if (this.musicOnNode) {
            this.musicOnNode.active = this._musicEnabled;
        }
        if (this.musicOffNode) {
            this.musicOffNode.active = !this._musicEnabled;
        }
    }

    /**
     * 应用声音设置到音频管理器
     */
    private applySoundSettings(): void {
        const audioManager = WZBPW_AudioManager.instance;
        if (audioManager) {
            // 设置音效音量：开启为1.0，关闭为0
            audioManager.setSFXVolume(this._soundEnabled ? 1.0 : 0);
        }
    }

    /**
     * 应用音乐设置到音频管理器
     */
    private applyMusicSettings(): void {
        const audioManager = WZBPW_AudioManager.instance;
        if (audioManager) {
            if (this._musicEnabled) {
                // 开启音乐
                audioManager.setBGMusicVolume(0.5);
                audioManager.playBGMusic();
            } else {
                // 关闭音乐
                audioManager.stopBGMusic();
            }
        }
    }

    /**
     * 保存设置到本地存储
     */
    private saveSettings(): void {
        sys.localStorage.setItem(SOUND_ENABLED_KEY, this._soundEnabled ? '1' : '0');
        sys.localStorage.setItem(MUSIC_ENABLED_KEY, this._musicEnabled ? '1' : '0');
    }

    /**
     * 从本地存储加载设置
     */
    private loadSettings(): void {
        try {
            const soundData = sys.localStorage.getItem(SOUND_ENABLED_KEY);
            const musicData = sys.localStorage.getItem(MUSIC_ENABLED_KEY);

            // 严格检查：只有明确是 '1' 或 '0' 才使用，否则使用默认值
            if (soundData === '1') {
                this._soundEnabled = true;
            } else if (soundData === '0') {
                this._soundEnabled = false;
            } else {
                // null、空字符串、undefined 等情况，默认开启
                this._soundEnabled = true;
                console.log('WZBPW_SoundPanel: Sound setting not found, defaulting to enabled');
            }
            
            if (musicData === '1') {
                this._musicEnabled = true;
            } else if (musicData === '0') {
                this._musicEnabled = false;
            } else {
                // null、空字符串、undefined 等情况，默认开启
                this._musicEnabled = true;
                console.log('WZBPW_SoundPanel: Music setting not found, defaulting to enabled');
            }

            // 应用加载的设置
            this.applySoundSettings();
            this.applyMusicSettings();

            console.log(`WZBPW_SoundPanel: Settings loaded - Sound: ${this._soundEnabled}, Music: ${this._musicEnabled}`);
        } catch (e) {
            console.warn('WZBPW_SoundPanel: Failed to load settings, using defaults');
            // 出错时也使用默认值
            this._soundEnabled = true;
            this._musicEnabled = true;
            this.applySoundSettings();
            this.applyMusicSettings();
        }
    }
}
