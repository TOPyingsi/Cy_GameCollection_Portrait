import { _decorator, Component, Enum, EventTouch, find, Node, Label, Sprite, Tween, tween, Vec3, director, SpriteFrame, math } from 'cc';
import { XCJZ_MUSIC_ITEM_TYPE, XCJZ_MUSIC, XCJZ_MUSIC_CONFIG, XCJZ_MUSIC_TITLE, XCJZ_MUSIC_CLASS } from './XCJZ_Constant';
import { XCJZ_EventManager, XCJZ_MyEvent } from './XCJZ_EventManager';
import { XCJZ_GameData } from './XCJZ_GameData';
import Banner from 'db://assets/Scripts/Banner';
import { XCJZ_MenuManager } from './XCJZ_MenuManager';
import { BundleManager } from 'db://assets/Scripts/Framework/Managers/BundleManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
import { XCJZ_AudioManager } from './XCJZ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XCJZ_MusicItem')
export class XCJZ_MusicItem extends Component {

    @property({ type: Enum(XCJZ_MUSIC) })
    Music: XCJZ_MUSIC = XCJZ_MUSIC.MUSIC1;

    @property({ type: Enum(XCJZ_MUSIC_TITLE) })
    Title: XCJZ_MUSIC_TITLE = XCJZ_MUSIC_TITLE.NEW;

    @property({ type: Enum(XCJZ_MUSIC_ITEM_TYPE) })
    Item: XCJZ_MUSIC_ITEM_TYPE = XCJZ_MUSIC_ITEM_TYPE.今日礼物;

    @property
    Drution = 0.5;

    Checked: Node = null;
    Play: Node = null;
    Pause: Node = null;
    SingerName: Label = null;
    MusicName: Label = null;
    MusicEffect: Node = null;
    Sprites: Sprite[] = [];

    Collect: Node = null;
    Stars: Node = null;
    AllStar: Node[] = [];
    Challenge: Node = null;
    Video: Node = null;
    Diamond: Node = null;
    HOT: Node = null;
    NEW: Node = null;

    Icon: Sprite = null;

    private _isClick: boolean = false;
    private _timer: number = 0;
    private _playing: boolean = false;
    private _v_0: Vec3 = new Vec3();
    private _v_1: Vec3 = new Vec3();
    private _parent: Node = null;
    private _music: XCJZ_MUSIC_CLASS = new XCJZ_MUSIC_CLASS("", "");
    public get musicName(): string {
        return this._music.MusicName;
    }

    protected onLoad(): void {
        this.Checked = find("Checked", this.node);
        this.Play = find("播放", this.node);
        this.Pause = find("暂停", this.node);
        this.SingerName = find("SingerName", this.node).getComponent(Label);
        this.MusicName = find("Layout/MusicName", this.node).getComponent(Label);
        this.MusicEffect = find("Layout/MusicEffect", this.node);
        this.MusicEffect.children.forEach(item => item.getComponent(Sprite) && this.Sprites.push(item.getComponent(Sprite)));
        this.Collect = find("收藏/已收藏", this.node);
        this.Stars = find("Stars", this.node);
        this.Stars.children.forEach(e => this.AllStar.push(e.getChildByName("Star")));
        this.Challenge = find("挑战", this.node);
        this.Video = find("视频解锁", this.node);
        this.Diamond = find("钻石解锁", this.node);
        this.HOT = find("HOT", this.node);
        this.NEW = find("NEW", this.node);

        this.Icon = find("Icon", this.node).getComponent(Sprite);

        if (XCJZ_MUSIC_CONFIG.has(this.Music)) {
            this._music = XCJZ_MUSIC_CONFIG.get(this.Music);
            this.SingerName.string = this._music.SigerName;
            this.MusicName.string = this._music.MusicName;
        }

        this._parent = this.node.parent;

        this.node.on(Node.EventType.TOUCH_END, this.Click, this);
    }

    protected start(): void {
        XCJZ_MenuManager.Instance.AddItem(this.Item, this);
        this.LoadIcon();
    }

    protected onEnable(): void {
        XCJZ_EventManager.On(XCJZ_MyEvent.XCJZ_MUSIC_ITEM_CLICK, this.ClickItem, this);
        XCJZ_EventManager.On(XCJZ_MyEvent.XCJZ_MUSIC_STAR_SHOW, this.Show, this);

    }

    protected onDisable(): void {
        XCJZ_EventManager.Off(XCJZ_MyEvent.XCJZ_MUSIC_ITEM_CLICK, this.ClickItem, this);
        XCJZ_EventManager.Off(XCJZ_MyEvent.XCJZ_MUSIC_STAR_SHOW, this.Show, this);
    }

    protected update(dt: number): void {
        if (!this._isClick) return;
        if (!this.MusicEffect.active) return;

        this._timer += dt;
        if (this._timer > this.Drution) {
            this.PlayMusicEffect();
        }
    }

    LoadIcon() {
        let IconName: string = ""
        if (this.Music == XCJZ_MUSIC.MUSIC1) {
            IconName = "刀马刀马";
        } else if (this.Music == XCJZ_MUSIC.MUSIC2) {
            IconName = "库里库里";
        } else {
            IconName = math.clamp(this.Music - 2, 0, 21).toString();
        }

        BundleManager.LoadSpriteFrame(GameManager.GameData.DefaultBundle, `Sprites/Icons/${IconName}`).then((spriteFrame: SpriteFrame) => {
            this.Icon.spriteFrame = spriteFrame;
        });
    }

    Click() {
        // console.error(this._music.MusicName, this._isClick, this._playing);
        if (!this._isClick) return;
        if (this._playing) return;
        if (XCJZ_GameData.Instance.CurMusic == this.Music) {
            //继续播放
            this.ShowButton(true);
            XCJZ_EventManager.Emit(XCJZ_MyEvent.XCJZ_MUSIC_PLAY);
            this.PlayMusicEffect();
            XCJZ_AudioManager.Instance.ResumeMusic();
        } else {
            //切换音乐
            XCJZ_EventManager.Emit(XCJZ_MyEvent.XCJZ_MUSIC_ITEM_CLICK, this.Music);
            // XCJZ_GameData.Instance.CurMusic = this.Music;
            XCJZ_GameData.DateSave();
        }
    }

    OnButtonClick(event: EventTouch) {
        if (!this._isClick) return;
        switch (event.getCurrentTarget().name) {
            case "暂停":
                XCJZ_EventManager.Emit(XCJZ_MyEvent.XCJZ_MUSIC_PAUSE);
                this.ShowButton(false);
                XCJZ_AudioManager.Instance.PauseMusic();
                break;
            case "收藏":
                XCJZ_GameData.Instance.Collect(this.Music);
                this.Show();
                break;
            case "已收藏":
                XCJZ_GameData.Instance.CancelCollect(this.Music);
                this.Show();
                break;
            case "挑战":
                // console.log("挑战");
                if (this.Title == XCJZ_MUSIC_TITLE.NEW) {
                    this.Title = XCJZ_MUSIC_TITLE.NONE;
                    this.ShowTitle();
                }
                XCJZ_MenuManager.Instance.ShowLoading(() => {
                    XCJZ_GameData.Instance.CurMusic = this.Music;
                    director.loadScene("XCJZ_Game");
                });
                break;
            case "视频解锁":
                Banner.Instance.ShowVideoAd(() => {
                    XCJZ_GameData.Instance.AddMusic(this.Music);
                    this.Show();
                    this.Click();
                })
                break;
            case "钻石解锁":
                if (XCJZ_GameData.Instance.Diamond >= 400) {
                    XCJZ_MenuManager.Instance.ShowDiamond(-400);
                    // XCJZ_GameData.Instance.ChangeDiamond(-400);
                    XCJZ_GameData.Instance.AddMusic(this.Music);
                    this.Show();
                    this.Click();
                } else {
                    XCJZ_MenuManager.Instance.ShowWindow(XCJZ_MenuManager.Instance.GetDiamondWindow);
                }
                break;
        }
    }

    ShowButton(play: boolean) {
        this._playing = play;
        this.Pause.active = play;
        this.Play.active = !play;
        this.MusicEffect.active = play;
    }

    ClickItem(music: XCJZ_MUSIC) {
        this.Checked.active = music == this.Music;
        this.ShowButton(music == this.Music);
        if (music == this.Music) {
            XCJZ_EventManager.Emit(XCJZ_MyEvent.XCJZ_MUSIC_PLAY);
            this.PlayMusicEffect();
            // let musicName: string = ""
            // if (this.Music == XCJZ_MUSIC.MUSIC1 || this.Music == XCJZ_MUSIC.MUSIC2) {
            //     musicName = XCJZ_MUSIC_CONFIG.get(this.Music).MusicName;
            // } else {
            //     musicName = math.random() < 0.5 ? "刀马刀马" : "库里库里";
            // }
            XCJZ_AudioManager.Instance.PlayMusic(XCJZ_MUSIC_CONFIG.get(this.Music).MusicName);
            XCJZ_GameData.Instance.CurMusic = this.Music;
        }

    }

    PlayMusicEffect() {
        this._timer = 0;
        this.Sprites.forEach(sprite => {
            Tween.stopAllByTarget(sprite);
            tween(sprite)
                .to(this.Drution, { fillRange: Math.random() }, { easing: `sineInOut` })
                .start();
        });
    }

    Show() {
        this.Collect.active = XCJZ_GameData.Instance.CollectMusic.includes(this.Music);
        const have: boolean = XCJZ_GameData.Instance.HaveMusic.includes(this.Music);
        this.Diamond.active = !have;
        this.Video.active = !have;
        this.Challenge.active = have;
        this.Stars.active = have;

        if (have && XCJZ_MUSIC_CONFIG.has(this.Music)) {
            this.ShowStar(XCJZ_GameData.Instance.GetStarCount(this.Music));
        }
        this.ShowTitle();
    }

    ShowStar(count: number) {
        for (let i = 0; i < this.AllStar.length; i++) {
            this.AllStar[i].active = i < count;
        }
    }

    ShowTitle() {
        this.HOT.active = this.Title == XCJZ_MUSIC_TITLE.HOT;
        this.NEW.active = this.Title == XCJZ_MUSIC_TITLE.NEW;
    }

    Open() {
        this.node.parent = this._parent;
        this.node.active = true;
        this._isClick = false;
        this._v_0 = this.node.position.clone();
        this._v_0.x = 1200;
        this.node.setPosition(this._v_0);
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .to(0.3, { x: 0 }, { easing: `sineInOut` })
            .call(() => {
                this._isClick = true;
                this.Show();
            })
            .start();
    }

    Close() {
        this._isClick = false;
        this._v_1 = this.node.worldPosition.clone();
        this.node.parent = XCJZ_MenuManager.Instance.MainPanel;
        this.node.setWorldPosition(this._v_1);
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .to(0.3, { x: -1200 }, { easing: `sineInOut` })
            .call(() => {
                this.node.active = false;
            })
            .start();
        if (XCJZ_GameData.Instance.CurMusic == this.Music) XCJZ_MenuManager.Instance.RandomPlayMusic();
    }

    ChangeParent(parent: Node) {
        this._parent = parent;
        this.node.parent = parent;
    }
}


