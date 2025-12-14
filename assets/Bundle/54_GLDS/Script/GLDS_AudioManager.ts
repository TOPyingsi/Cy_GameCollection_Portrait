import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GLDS_AudioManager')
export class GLDS_AudioManager extends Component {

    public static Instance: GLDS_AudioManager = null;

    @property(AudioClip) xiaochu: AudioClip = null;
    @property(AudioClip) qie: AudioClip = null;
    private audioSource: AudioSource = null;


    protected onLoad(): void {
        GLDS_AudioManager.Instance = this;

        this.audioSource = this.node.getComponent(AudioSource);
    }

    playXC() {
        this.audioSource.playOneShot(this.xiaochu);
    }

    playQie() {
        this.audioSource.playOneShot(this.qie);
    }
}


