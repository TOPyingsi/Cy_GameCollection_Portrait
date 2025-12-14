import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import { XDMKQ_GameData } from './XDMKQ_GameData';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_AudioManager')
export class XDMKQ_AudioManager extends Component {

    public static Instance: XDMKQ_AudioManager = null;

    @property(AudioClip)
    AudioClips: AudioClip[] = [];

    MapAudioClip: Map<string, AudioClip> = new Map();
    TempAudioSource: AudioSource = null;
    CurMusic: AudioSource = null;

    CurPlaying: AudioSource[] = [];
    FreeAudioSource: AudioSource[] = [];

    protected onLoad(): void {
        if (XDMKQ_AudioManager.Instance != null) return;
        XDMKQ_AudioManager.Instance = this;
        this.Init()
    }

    protected update(dt: number): void {
        if (XDMKQ_GameManager.Instance && XDMKQ_GameManager.Instance.GamePause) return;

        for (let i = 0; i < this.CurPlaying.length; i++) {
            if (this.CurPlaying[i].state == AudioSource.AudioState.STOPPED) {
                this.CurPlaying.splice(i, 1);
                i--;
            }
        }
    }

    Init() {
        this.AudioClips.forEach(e => {
            this.MapAudioClip.set(e.name, e);
        })
    }

    PlayMusic(audioName: string, volume: number = XDMKQ_GameData.Instance.Music, loop: boolean = true) {
        if (!this.MapAudioClip.has(audioName)) {
            console.error("音频不存在");
            return;
        }
        if (this.CurMusic) this.ReleaseSource(this.CurMusic);

        this.CurMusic = this.GetFreeSource();
        this.CurMusic.clip = this.MapAudioClip.get(audioName);
        this.CurMusic.volume = volume;
        this.CurMusic.loop = loop;
        this.CurMusic.play();
    }

    PlaySource(audioName: string, volume: number = XDMKQ_GameData.Instance.Sound, loop: boolean = false) {
        if (!this.MapAudioClip.has(audioName)) {
            console.error("音频不存在");
            return;
        }
        this.TempAudioSource = this.GetFreeSource();
        this.TempAudioSource.clip = this.MapAudioClip.get(audioName);
        this.TempAudioSource.volume = volume;
        this.TempAudioSource.loop = loop;
        this.TempAudioSource.play();
        this.CurPlaying.push(this.TempAudioSource);
    }

    GamePause() {
        this.CurPlaying.forEach(e => {
            if (e.state == AudioSource.AudioState.PLAYING) {
                e.stop();
            }
        })
    }

    GameResume() {
        this.CurPlaying.forEach(e => {
            if (e.state == AudioSource.AudioState.PAUSED) {
                e.play();
            }
        })
    }

    ChangeVolume() {
        this.CurPlaying.forEach(e => {
            e.volume = XDMKQ_GameData.Instance.Sound;
        })
        this.CurMusic.volume = XDMKQ_GameData.Instance.Music;
    }

    CreateAudioSource() {
        const audioSource: AudioSource = this.node.addComponent(AudioSource);
        audioSource.clip = null;
        audioSource.loop = false;
        audioSource.playOnAwake = false;
        return audioSource;
    }

    GetFreeSource() {
        let source: AudioSource = null;
        this.FreeAudioSource.length > 0 ? source = this.FreeAudioSource.pop() : source = this.CreateAudioSource();
        return source;
    }

    ReleaseSource(source: AudioSource) {
        source.stop();
        source.clip = null;
        this.FreeAudioSource.push(source);
    }
}


