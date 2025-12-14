import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { EventManager, MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
const { ccclass, property } = _decorator;

@ccclass('DMM_SoundManager')
export class DMM_SoundManager extends Component {
    public static Instance: DMM_SoundManager = null;

    @property(AudioClip)
    BGMs: AudioClip[] = [];

    AudioSources: Map<string, AudioSource> = new Map();

    private _musicName: string = "";

    protected onLoad(): void {
        DMM_SoundManager.Instance = this;

        EventManager.Scene.on(MyEvent.IsMusicOn, this.PlayAudioBySetPanel, this);

        this.loadAudio();
    }

    loadAudio() {
        const audios = this.getComponents(AudioSource);
        this.BGMs.forEach(e => {
            const audio = this.addComponent(AudioSource);
            audio.clip = e;
            audio.volume = 0.3;
            audio.loop = true;
            this.AudioSources.set(e.name, audio);
        })
    }

    PlayAudio(name: string = this._musicName) {
        if (!AudioManager.IsMusicOn) return;
        const audio = this.AudioSources.has(name);
        if (!audio) {
            console.error(`没找到name：${name}`);
            return;
        }
        this.AudioSources.get(name).play();
    }

    PlayAudioBySetPanel(isMusic) {
        if (isMusic) {
            this.PlayAudio(this._musicName);
            return;
        }

        this._musicName && this.AudioSources.get(this._musicName).stop();
    }

    randPlayBGM() {
        const random = Math.random();
        if (random < 0.333) {
            this._musicName = `恐怖背景音`;
            this.PlayAudio(`恐怖背景音`);
        } else if (random < 0.666) {
            this._musicName = `游戏背景音乐`;
            this.PlayAudio(`游戏背景音乐`);
        } else {
            this._musicName = `背景音乐`;
            this.PlayAudio(`背景音乐`);
        }
    }

    protected onDisable(): void {
        EventManager.Scene.off(MyEvent.IsMusicOn, this.PlayAudioBySetPanel, this);
    }
}

