import { _decorator, AudioClip, AudioSource, Component, EventTouch, find, Node, Sprite, SpriteFrame, tween, Tween, UIOpacity, v3 } from 'cc';
import { SHJYYH_ITEM } from './SHJYYH_Contant';
import { AudioManager } from '../../../Scripts/Framework/Managers/AudioManager';
import { SHJYYH_Item2 } from './SHJYYH_Item2';
import { GamePanel } from '../../../Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SHJYYH_UIManager')
export class SHJYYH_UIManager extends Component {

    @property(SpriteFrame)
    TipsSFs: SpriteFrame[] = [];

    @property(AudioClip)
    AudioClips: AudioClip[] = [];

    @property(Sprite)
    TipsSprite: Sprite = null;

    Audios: Map<string, AudioSource> = new Map();
    RandArr: SHJYYH_ITEM[] = [];
    IsPlaying: boolean = false;
    CurItem: SHJYYH_ITEM = SHJYYH_ITEM.Item1;

    private _tipsUIOPacity: UIOpacity = null;
    private _lose: Node = null;
    private _playNode: Node = null;
    private _audioNode: Node = null;
    private _play: Node = null;
    private _pause: Node = null;

    private _slip: Node = null;
    private _wide: number = 590;
    private _curAudioSource: AudioSource = null;
    private _isClick: boolean = false;

    protected onLoad(): void {

        GamePanel.Instance.time = 600;

        this._tipsUIOPacity = find("Tips", this.node).getComponent(UIOpacity);
        this._lose = find("Lose", this.node);
        this._playNode = find("UI/Play", this.node);
        this._audioNode = find("UI/Audio", this.node);
        this._play = find("UI/Play/Play", this.node);
        this._pause = find("UI/Play/Stop", this.node);
        this._slip = find("UI/进度/Slip", this.node);

        this.node.on(AudioSource.EventType.ENDED, this.EndAudio, this);
    }


    protected onDisable(): void {
        this.node.off(AudioSource.EventType.ENDED, this.EndAudio, this);
    }

    protected start(): void {
        this.shuffle();
        this.loadAudio();
        this.nextWave();
    }

    shuffle() {
        // 获取 enum 的值
        const enumValues: SHJYYH_ITEM[] = Object.values(SHJYYH_ITEM).filter(value => value as number >= 0) as SHJYYH_ITEM[];
        // 打乱数组
        this.RandArr = enumValues.sort(() => Math.random() - 0.5);
    }

    loadAudio() {
        for (let i = 0; i < this.AudioClips.length; i++) {
            const audioSource: AudioSource = this.node.addComponent(AudioSource);
            audioSource.clip = this.AudioClips[i];
            audioSource.loop = false;
            audioSource.playOnAwake = false;
            this.Audios.set(i.toString(), audioSource);
        }
    }

    PlayAudio(item: number) {
        if (!AudioManager.IsMusicOn) return;
        const audio = this.Audios.has(item.toString());
        if (!audio) {
            console.error(`没找到name：${item}`);
            return;
        }
        this._curAudioSource = this.Audios.get(item.toString());
        this._curAudioSource.play();
    }

    PauseAudio() {
        if (this._curAudioSource) this._curAudioSource.pause();
    }

    ResumeAudio() {
        if (this._curAudioSource) this._curAudioSource.play();
    }

    AgainAudio() {
        if (this._curAudioSource) {
            this._curAudioSource.stop();
            this._curAudioSource.play();
        }
    }

    EndAudio() {
        this._isClick = true;
        this.IsPlaying = false;
        this.switchButton();
        this.endShowBar();
    }

    ButtonClick(event: EventTouch) {
        const target: Node = event.getCurrentTarget();
        switch (target.name) {
            case "Play":
                this.Play();
                break;
            case "Resume":
                this.IsPlaying = true;
                this._playNode.active = true;
                this._audioNode.active = false;
                this.switchButton();
                this.ResumeAudio();
                break;
            case "Again":
                this.IsPlaying = true;
                this._playNode.active = true;
                this._audioNode.active = false;
                this.switchButton();
                this.AgainAudio();
                break;
            case "Item":
                if (!this._isClick) {
                    this.showTips();
                    return;
                }
                const item: SHJYYH_Item2 = target.getComponent(SHJYYH_Item2);
                if (!item.IsClick) return;
                if (item.Type != this.CurItem) {
                    //游戏失败
                    this.showLose();
                } else {
                    item.showTips();
                    this.nextWave();
                }
                this._isClick = false;
        }
    }

    Play() {
        if (this.IsPlaying) {
            //暂停
            this._playNode.active = false;
            this._audioNode.active = true;
            this.PauseAudio();
        } else {
            this.PlayAudio(this.CurItem);
            this.startShowBar();
        }
        this.IsPlaying = !this.IsPlaying;
        this.switchButton();
    }

    switchButton() {
        this._play.active = !this.IsPlaying;
        this._pause.active = this.IsPlaying;
    }

    startShowBar() {
        this.unschedule(this.showBar);
        this.schedule(this.showBar, 0.1);
    }

    endShowBar() {
        this.unschedule(this.showBar);
        this._slip.setPosition(v3(-this._wide / 2, 0, 0));
    }

    showBar() {
        if (!this._curAudioSource) return;
        const time = this._curAudioSource.duration;
        this._curAudioSource.currentTime;
        const x = -this._wide / 2 + this._curAudioSource.currentTime / this._curAudioSource.duration * this._wide;
        this._slip.setPosition(v3(x, 0, 0));
    }

    nextWave() {
        if (this.RandArr.length <= 0) {
            GamePanel.Instance.Win();
            return;
        }
        this._playNode.active = true;
        this._audioNode.active = false;
        this._play.active = true;
        this._pause.active = false;
        this.IsPlaying = false;
        this.CurItem = this.RandArr.shift();
        this.PauseAudio();
        this._curAudioSource = null;
        this.TipsSprite.spriteFrame = this.TipsSFs[this.CurItem];
        this.endShowBar();
        this._isClick = false;
    }

    showTips() {
        Tween.stopAllByTarget(this._tipsUIOPacity);
        this._tipsUIOPacity.opacity = 255;
        tween(this._tipsUIOPacity)
            .delay(2)
            .to(1, { opacity: 0 }, { easing: `sineOut` })
            .start();
    }

    showLose() {
        Tween.stopAllByTarget(this._lose);
        tween(this._lose)
            .to(2, { scale: v3(1.5, 1.5, 1) }, { easing: `sineOut` })
            .call(() => {
                GamePanel.Instance.Lost();
            })
            .start();
    }

}


