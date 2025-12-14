import { _decorator, AudioClip, AudioSource, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SXZW_AudioManage')
export class SXZW_AudioManage extends Component {

    private static _Instance: SXZW_AudioManage;

    public static get Instance() {
        if (this._Instance === null) console.error("audioManage is null!!!");
        return this._Instance;
    }

    @property(AudioSource)
    private audioSource: AudioSource

    @property(AudioClip)
    private menuClip: AudioClip

    @property(AudioClip)
    private gameClip: AudioClip

    @property(AudioClip)
    private bloodClip: AudioClip

    @property(AudioClip)
    private swooshesClip: AudioClip

    @property(AudioClip)
    private glassBreakClip: AudioClip

    @property(AudioClip)
    private dynamiteClip: AudioClip

    @property(AudioClip)
    private emitterClip: AudioClip

    @property(AudioClip)
    private winClip: AudioClip

    @property(AudioClip)
    private colliderClip: AudioClip

    @property(AudioClip)
    private startGameClip: AudioClip

    @property(AudioClip)
    private clickClip: AudioClip

    private audioSources: AudioSource[] = []

    private mute: boolean = false;

    public get isMute(): boolean {
        return this.mute;
    }
    public set isMute(mute: boolean) {
        this.mute = mute;
        sys.localStorage.setItem("sxzw_mute", mute ? "1" : "0");
        if (mute) {
            this.audioSource.stop()
            this.audioSources.forEach((a) => {
                a.stop()
            })
        } else {
            this.audioSource.play()
        }
    }

    protected onLoad(): void {
        const b = sys.localStorage.getItem("sxzw_mute");
        this.mute = b === "1";
        SXZW_AudioManage._Instance = this;
    }

    start() {

    }

    update(deltaTime: number) {

    }

    private playMusic(clip: AudioClip, loop: boolean = true) {
        this.audioSource.stop()
        this.audioSource.clip = clip;
        this.audioSource.loop = loop;
        if (this.mute) return;
        this.audioSource.play()
    }

    private playEffect(clip: AudioClip) {
        if (this.mute) return;
        let audio: AudioSource;
        for (let index = 0; index < this.audioSources.length; index++) {
            if (!this.audioSources[index].playing) {
                audio = this.audioSources[index];
                break;
            }
        }
        if (!audio) {
            audio = this.node.addComponent(AudioSource);
            this.audioSources.push(audio);
        }
        audio.playOneShot(clip)
    }

    playMenuMusic() {
        this.playMusic(this.menuClip);
    }
    playGameMusic() {
        this.playMusic(this.gameClip);
    }

    playBloodEffect() {
        this.playEffect(this.bloodClip)
    }

    playSwooshesEffect() {
        this.playEffect(this.swooshesClip);
    }

    playGlassBreakEffect() {
        this.playEffect(this.glassBreakClip)
    }
    playDynamiteEffect() {
        this.playEffect(this.dynamiteClip)
    }
    playEmitterEffect() {
        this.playEffect(this.emitterClip)
    }
    playWinEffect() {
        this.playEffect(this.winClip)
    }
    playColliderEffect() {
        this.playEffect(this.colliderClip)
    }
    playStartGameEffect() {
        this.playEffect(this.startGameClip)
    }
    playClickEffect() {
        this.playEffect(this.clickClip)
    }
}


