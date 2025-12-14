import { _decorator, AudioClip, AudioSource, Component, director, find, Node, Sprite, Tween, tween } from 'cc';
import { AudioManager } from '../../../Scripts/Framework/Managers/AudioManager';
import { EventManager, MyEvent } from '../../../Scripts/Framework/Managers/EventManager';
const { ccclass, property } = _decorator;

@ccclass('SHJYYH_Item')
export class SHJYYH_Item extends Component {

    AudioNode: Node = null;
    AudioSprite: Sprite = null;
    AudioSource: AudioSource = null;

    private _isClick: boolean = false;

    protected onLoad(): void {
        this.AudioNode = find("Audio", this.node);
        this.AudioSprite = find("Audio/Audio", this.node).getComponent(Sprite);
        this.AudioSource = this.node.getComponent(AudioSource);

        this.node.on(Node.EventType.TOUCH_END, this.Click, this);
        this.node.on(AudioSource.EventType.ENDED, this.Stop, this);
        EventManager.Scene.on(MyEvent.IsSoundOn, this.PlayAudioBySetPanel, this);
        director.getScene().on("SHJYYH_Item", this.stopAll, this);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_END, this.Click, this);
        this.node.off(AudioSource.EventType.ENDED, this.Stop, this);
        EventManager.Scene.off(MyEvent.IsSoundOn, this.PlayAudioBySetPanel, this);
    }

    Click() {
        if (!this._isClick) this.Play();
        else this.Stop();
    }

    Play() {
        director.getScene().emit("SHJYYH_Item");
        this._isClick = true;
        this.ShowAudio();
        if (AudioManager.IsSoundOn) {
            this.AudioSource.play();
        }
    }

    Stop() {
        this._isClick = false;
        this.closeAudis();
        if (this.AudioSource.playing) this.AudioSource.stop();
    }

    ShowAudio() {
        this.AudioNode.active = true;
        const rand = Math.random();
        tween(this.AudioSprite)
            .to(0.4, { fillRange: rand }, { easing: `sineOut` })
            .call(() => { this.ShowAudio() })
            .start();
    }

    closeAudis() {
        this.AudioNode.active = false;
        Tween.stopAllByTarget(this.AudioSprite);
        this.AudioSprite.fillRange = 0;
    }

    PlayAudioBySetPanel(isSound) {
        if (isSound && this._isClick) {
            this.Play();
            return;
        }
        if (this._isClick) this.AudioSource.stop();
    }

    stopAll() {
        this._isClick = false;
        this.Stop();
    }

}


