import { _decorator, AudioClip, AudioSource, Component, director, Node } from 'cc';
import { XCJZ_GameData } from './XCJZ_GameData';
const { ccclass, property } = _decorator;

@ccclass('XCJZ_AudioManager')
export class XCJZ_AudioManager extends Component {

    public static Instance: XCJZ_AudioManager = null;

    @property(AudioClip)
    AudioClips: AudioClip[] = [];

    MapAudioClip: Map<string, AudioClip> = new Map();
    TempAudioSource: AudioSource = null;
    CurMusic: AudioSource = null;

    CurPlaying: AudioSource[] = [];
    FreeAudioSource: AudioSource[] = [];
    protected onLoad(): void {
        if (XCJZ_AudioManager.Instance != null) return;
        XCJZ_AudioManager.Instance = this;
        director.addPersistRootNode(this.node);
        this.Init()
    }

    Init() {
        this.AudioClips.forEach(e => {
            this.MapAudioClip.set(e.name, e);
        })
    }

    PlayMusic(audioName: string, volume: number = XCJZ_GameData.Instance.Music, loop: boolean = true) {
        if (!this.MapAudioClip.has(audioName)) {
            console.error("音频不存在");
            return;
        }

        // this.StopMusic();
        if (!this.CurMusic) this.CurMusic = this.GetFreeSource();

        this.CurMusic.stop();
        this.CurMusic.clip = this.MapAudioClip.get(audioName);
        this.CurMusic.volume = volume;
        this.CurMusic.loop = loop;
        this.CurMusic.play();
    }

    StopMusic() {
        if (this.CurMusic) this.CurMusic.stop();
    }

    PauseMusic() {
        if (this.CurMusic) this.CurMusic.pause();
    }

    ResumeMusic() {
        if (this.CurMusic) this.CurMusic.play();
    }

    GetCurMusicDuration() {
        return this.CurMusic.duration;
    }

    PlaySource(audioName: string, volume: number = XCJZ_GameData.Instance.Sound, loop: boolean = false) {
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
            e.volume = XCJZ_GameData.Instance.Sound;
        })
        this.CurMusic.volume = XCJZ_GameData.Instance.Music;
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


