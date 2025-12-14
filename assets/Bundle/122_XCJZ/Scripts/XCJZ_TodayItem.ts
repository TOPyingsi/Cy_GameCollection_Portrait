import { _decorator, Component, Label, math, Node, Sprite, SpriteFrame, Tween, tween } from 'cc';
import { XCJZ_MusicItem } from './XCJZ_MusicItem';
import { XCJZ_MUSIC, XCJZ_MUSIC_CONFIG } from './XCJZ_Constant';
import { XCJZ_EventManager, XCJZ_MyEvent } from './XCJZ_EventManager';
import { XCJZ_MenuManager } from './XCJZ_MenuManager';
import { BundleManager } from 'db://assets/Scripts/Framework/Managers/BundleManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
import { XCJZ_AudioManager } from './XCJZ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XCJZ_TodayItem')
export class XCJZ_TodayItem extends Component {

    @property(Node)
    BG: Node = null;

    @property(Node)
    Icon: Node = null;

    @property(Label)
    MusicName: Label = null;

    @property(Node)
    Checked: Node = null;

    @property(Node)
    JT: Node = null;

    Music: XCJZ_MUSIC = XCJZ_MUSIC.MUSIC1;

    protected onLoad(): void {
        this.BG.on(Node.EventType.TOUCH_END, this.Click, this);
    }

    protected onEnable(): void {
        XCJZ_EventManager.On(XCJZ_MyEvent.XCJZ_TODAY_SHOW, this.Show, this);
    }

    protected onDisable(): void {
        XCJZ_EventManager.Off(XCJZ_MyEvent.XCJZ_TODAY_SHOW, this.Show, this);
    }

    Init(music: XCJZ_MusicItem) {
        this.Music = music.Music;
        this.MusicName.string = music.musicName;
        this.ShowJT();
        this.LoadIcon();
    }

    Show(music: XCJZ_MUSIC) {
        if (music == this.Music) {
            this.ShowIcon();
            this.Checked.active = true;
            XCJZ_MenuManager.Instance.TodayItemChecked = music;
            XCJZ_EventManager.Emit(XCJZ_MyEvent.XCJZ_MUSIC_PLAY);
            // let musicName: string = ""
            // if (this.Music == XCJZ_MUSIC.MUSIC1 || this.Music == XCJZ_MUSIC.MUSIC2) {
            //     musicName = XCJZ_MUSIC_CONFIG.get(this.Music).MusicName;
            // } else {
            //     musicName = math.random() < 0.5 ? "刀马刀马" : "库里库里";
            // }
            // XCJZ_AudioManager.Instance.PlayMusic(musicName);
            XCJZ_AudioManager.Instance.PlayMusic(XCJZ_MUSIC_CONFIG.get(this.Music).MusicName);
        } else {
            this.CloseIcon();
            this.Checked.active = false;
        }
    }

    Click() {
        XCJZ_EventManager.Emit(XCJZ_MyEvent.XCJZ_TODAY_SHOW, this.Music);
    }

    ShowIcon() {
        Tween.stopAllByTarget(this.Icon);
        tween(this.Icon)
            .by(4, { angle: 360 })
            .repeatForever()
            .start()
    }


    CloseIcon() {
        Tween.stopAllByTarget(this.Icon);
        // this.Icon.angle = 0;
    }

    ShowJT() {
        Tween.stopAllByTarget(this.JT);
        tween(this.JT)
            .by(0.3, { y: -25 }, { easing: `linear` })
            .by(0.6, { y: 50 }, { easing: `linear` })
            .by(0.3, { y: -25 }, { easing: `linear` })
            .union()
            .repeatForever()
            .start()
    }

    LoadIcon() {
        let IconName: string = ""
        if (this.Music == XCJZ_MUSIC.MUSIC1) {
            IconName = "刀马刀马_1";
        } else if (this.Music == XCJZ_MUSIC.MUSIC2) {
            IconName = "库里库里_1";
        } else {
            IconName = math.clamp(this.Music - 2, 0, 21).toString() + "_1";
        }

        BundleManager.LoadSpriteFrame(GameManager.GameData.DefaultBundle, `Sprites/Icons/${IconName}`).then((spriteFrame: SpriteFrame) => {
            this.Icon.getComponent(Sprite).spriteFrame = spriteFrame;
        });
    }
}


