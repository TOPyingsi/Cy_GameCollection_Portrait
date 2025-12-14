import { _decorator, AudioSource, Component, Animation, Node, Vec3, animation, AnimationClip, tween, v3, Tween } from 'cc';
import { JZHZZWB_Item } from './JZHZZWB_Item';
import { JZHZZWB_TYPE } from './JZHZZWB_Constant';
import { JZHZZWB_GameManager } from './JZHZZWB_GameManager';
import { EventManager, MyEvent } from '../../../Scripts/Framework/Managers/EventManager';
import { AudioManager } from '../../../Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('JZHZZWB_LVController')
export class JZHZZWB_LVController extends Component {
    public static Instance: JZHZZWB_LVController = null;

    @property(AnimationClip)
    AnimationClips: AnimationClip[] = [];

    @property(Node)
    Hand: Node = null;

    @property(Node)
    ContentPanel: Node = null;

    @property(Node)
    FinishPanel: Node = null;

    Items: JZHZZWB_Item[] = [];
    Sounds: Map<string, AudioSource> = new Map();
    CurItems: number = 0;
    CurPlaying: AudioSource[] = [];

    IsDes: boolean = false;

    protected onLoad(): void {
        JZHZZWB_LVController.Instance = this;
    }

    protected start(): void {
        this.initAudios();
        this.showHand();
    }

    showHand() {
        tween(this.Hand)
            .by(1, { position: v3(0, 500, 0) }, { easing: `sineOut` })
            .delay(0.5)
            .by(0.1, { position: v3(0, -500, 0) }, { easing: `sineOut` })
            .delay(0.5)
            .union()
            .repeatForever()
            .start();
    }

    closeHand() {
        if (this.IsDes) return;
        this.IsDes = true;
        Tween.stopAllByTarget(this.Hand);
        this.Hand.destroy();
    }

    initAudios() {
        const audios = this.node.getComponents(AudioSource);
        audios.forEach(e => {
            this.Sounds.set(e.clip.name, e);
        })
    }

    check(type: JZHZZWB_TYPE, pos: Vec3) {
        const checked = this.Items.filter(e => e.check(type, pos));
        if (checked.length > 0) {
            this.CurItems--;
            if (this.CurItems <= 0) {
                this.ContentPanel.active = false;
                this.FinishPanel.active = true;
            }
            return true;
        }
        return false;
    }

    playSound(type: JZHZZWB_TYPE) {
        const sound = this.Sounds.get(type.toString());
        if (!sound) {
            console.error(`没找到音乐${type}`);
            return;
        }
        this.addPlaying(sound);
        // console.log(AudioManager.IsSoundOn);
        if (AudioManager.IsSoundOn) sound.play();
    }


    stopSound(type: JZHZZWB_TYPE) {
        const sound = this.Sounds.get(type.toString());
        if (!sound) {
            console.error(`没找到音乐${type}`);
            return;
        }
        this.removePlaying(sound);
        sound.stop();
    }

    playAll() {
        this.CurPlaying.forEach(e => e.play());
    }

    stopAll() {
        this.Sounds.forEach(e => e.stop());
    }

    addPlaying(sound: AudioSource) {
        const index = this.CurPlaying.findIndex(e => e == sound);
        if (index == -1) {
            this.CurPlaying.push(sound);
        }
    }

    removePlaying(sound: AudioSource) {
        const index = this.CurPlaying.findIndex(e => e == sound);
        if (index != -1) {
            this.CurPlaying.splice(index, 1);
        }
    }

    gameOver() {
        console.error(`游戏结束！`);
        this.stopAll();
        JZHZZWB_GameManager.Instance.GamePanel.Win();
    }

    SetMusic(value: boolean) {
        console.error("SetMusic", value);
        if (value) {
            //静音
        }
    }

    SetSound(value: boolean) {
        console.error("SetSound", value);
        if (value) {
            this.playAll();
        } else {
            this.stopAll();
        }
    }

    protected onEnable(): void {
        EventManager.Scene.on(MyEvent.IsMusicOn, this.SetMusic, this);
        EventManager.Scene.on(MyEvent.IsSoundOn, this.SetSound, this);
    }

    protected onDisable(): void {
        EventManager.Scene.off(MyEvent.IsMusicOn, this.SetMusic, this);
        EventManager.Scene.off(MyEvent.IsSoundOn, this.SetSound, this);

    }

}


