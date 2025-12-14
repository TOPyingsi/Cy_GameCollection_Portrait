import { _decorator, AudioClip, AudioSource, Component, Label, Node } from 'cc';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { GMJH_PropController } from './GMJH_PropController';
const { ccclass, property } = _decorator;

@ccclass('GMJH_AudioManager')
export class GMJH_AudioManager extends Component {

    public static Instance: GMJH_AudioManager;

    @property(AudioSource)
    audioSource: AudioSource = null;

    @property(AudioClip)
    BGM: AudioClip = null;

    @property(AudioClip)
    audio: AudioClip = null;

    @property([AudioClip])
    audios: AudioClip[] = [];

    protected onLoad(): void {
        GMJH_AudioManager.Instance = this;
    }

    playAudio(str?: string): Promise<void> {
        return new Promise((resolve) => {
            if (str) {
                const audio = this.audios.find(audio => audio.name == str);

                NodeUtil.GetNode("Label", GMJH_PropController.Instance.labelBG).getComponent(Label).string = str;
                GMJH_PropController.Instance.labelBG.active = true;
                if (audio) {
                    this.audioSource.playOneShot(audio);
                }
                this.scheduleOnce(() => {
                    GMJH_PropController.Instance.labelBG.active = false;
                    resolve();
                }, audio.getDuration());

            } else {
                this.audioSource.playOneShot(this.audio);
            }
        });
    }

    stopBGM() {
        this.audioSource.stop();
    }

    
}


