import { _decorator, Component, director, EventTouch, instantiate, Label, math, Node, Prefab, Sprite, SpriteFrame, Tween, tween, Vec2 } from 'cc';
import { XCJZ_EventManager, XCJZ_MyEvent } from './XCJZ_EventManager';
import { XCJZ_AudioManager } from './XCJZ_AudioManager';
import { XCJZ_GameWinWindow } from './XCJZ_GameWinWindow';
import { XCJZ_MenuManager } from './XCJZ_MenuManager';
import { XCJZ_GameData } from './XCJZ_GameData';
import { XCJZ_BLOCK, XCJZ_MUSIC, XCJZ_MUSIC_CONFIG } from './XCJZ_Constant';
import { BundleManager } from 'db://assets/Scripts/Framework/Managers/BundleManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
import { XCJZ_ResurgenceWindow } from './XCJZ_ResurgenceWindow';
import { XCJZ_MapController } from './XCJZ_MapController';
import { XCJZ_UnbeatableWindow } from './XCJZ_UnbeatableWindow';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('XCJZ_GameManager')
export class XCJZ_GameManager extends Component {

    public static Instance: XCJZ_GameManager = null;
    public static Music: XCJZ_MUSIC = XCJZ_MUSIC.MUSIC1;

    @property
    IsTest: boolean = false;

    @property
    PlayerArea: Vec2 = new Vec2();

    @property
    public MapSpeed: number = 0;

    @property(Node)
    Map: Node = null;

    @property(XCJZ_GameWinWindow)
    public GameWinWindow: XCJZ_GameWinWindow = null;

    @property(Node)
    public GameFailWindow: Node = null;

    @property(Node)
    Icon: Node = null;

    @property(Node)
    Tips: Node = null;

    @property(Node)
    TipsHand: Node = null;

    @property(Prefab)
    PlayerPrefabs: Prefab[] = [];

    @property(Node)
    Player: Node = null;

    @property(XCJZ_ResurgenceWindow)
    ResurgenceWindow: XCJZ_ResurgenceWindow = null;

    @property(Sprite)
    MusicEffectSprites: Sprite[] = [];

    @property(Label)
    MusicName: Label = null;

    @property(Node)
    Stars: Node[] = [];

    @property(Node)
    Collect: Node = null;

    @property
    Duration: number = 0.3;

    @property(XCJZ_UnbeatableWindow)
    UnbeatableWindow: XCJZ_UnbeatableWindow = null;

    @property(Node)
    GameBG: Node[] = [];

    @property(Node)
    GameCat: Node[] = [];

    GameTimer: number = 0;
    IsUnbeatable: boolean = false;

    public GamePause: boolean = true;
    public GameOver: boolean = false;

    private _timer: number = 0;
    protected onLoad(): void {
        XCJZ_GameManager.Instance = this;
        XCJZ_AudioManager.Instance.PlayMusic(XCJZ_MUSIC_CONFIG.get(XCJZ_GameData.Instance.CurMusic).MusicName);
        XCJZ_AudioManager.Instance.StopMusic();
        this.GameTimer = XCJZ_AudioManager.Instance.GetCurMusicDuration();
        this.LoadPlayer();
    }

    protected start(): void {
        this.ShowBG();
        this.ShowTips();
    }

    protected onEnable(): void {
        XCJZ_EventManager.On(XCJZ_MyEvent.PLAYER_RESUME, this.Resume, this);
        XCJZ_EventManager.On(XCJZ_MyEvent.PLAYER_PAUSE, this.Pause, this);
        XCJZ_EventManager.On(XCJZ_MyEvent.RESURGENCE, this.Resurgence, this);

    }

    protected onDisable(): void {
        XCJZ_EventManager.Off(XCJZ_MyEvent.PLAYER_RESUME, this.Resume, this);
        XCJZ_EventManager.Off(XCJZ_MyEvent.PLAYER_PAUSE, this.Pause, this);
    }

    protected update(dt: number): void {
        this._timer += dt;
        if (this._timer > this.Duration) {
            this.PlayMusicEffect();
        }
    }

    Pause() {
        this.GamePause = true;
        XCJZ_AudioManager.Instance.PauseMusic();
    }

    Resume() {
        this.GamePause = false;
        XCJZ_AudioManager.Instance.ResumeMusic();
        this.CloseTips();
        if (this.IsUnbeatable) this.UnbeatableWindow.StartTimer();
    }

    OnButtonClick(event: EventTouch) {
        switch (event.getCurrentTarget().name) {
            case "CloseWindow":
                director.loadScene("XCJZ_Menu", () => {
                    XCJZ_MenuManager.Instance.ShowLoading(() => {
                        XCJZ_MenuManager.Instance.CloseWindow();
                    });
                });
                break;
            case "重新挑战":
                XCJZ_GameManager.Music = XCJZ_GameData.Instance.CurMusic;
                director.loadScene("XCJZ_Menu", () => {
                    XCJZ_MenuManager.Instance.ShowLoading(() => {
                        XCJZ_EventManager.Emit(XCJZ_MyEvent.XCJZ_MUSIC_ITEM_CLICK, XCJZ_GameManager.Music);
                        director.loadScene("XCJZ_Game");
                    });
                });
                break;
            case "收藏":
                XCJZ_GameData.Instance.Collect(XCJZ_GameData.Instance.CurMusic);
                this.Collect.active = XCJZ_GameData.Instance.CollectMusic.includes(XCJZ_GameData.Instance.CurMusic);
                break;
            case "已收藏":
                XCJZ_GameData.Instance.CancelCollect(XCJZ_GameData.Instance.CurMusic);
                this.Collect.active = XCJZ_GameData.Instance.CollectMusic.includes(XCJZ_GameData.Instance.CurMusic);
                break;
        }
    }

    ShowWinWindow(count: number) {
        ProjectEventManager.emit(ProjectEvent.游戏结束, "炫彩节奏");
        this.GameWinWindow.Show(count);
    }

    ShowFailWindow() {
        ProjectEventManager.emit(ProjectEvent.游戏结束, "炫彩节奏");
        this.GameFailWindow.active = true;
        XCJZ_AudioManager.Instance.ResumeMusic();
        this.ShowIcon();
        this.PlayMusicEffect();

        for (let i = 0; i < this.Stars.length; i++) {
            this.Stars[i].active = i < XCJZ_GameData.Instance.GetStarCount(XCJZ_GameData.Instance.CurMusic);
        }

        this.MusicName.string = XCJZ_MUSIC_CONFIG.get(XCJZ_GameData.Instance.CurMusic).MusicName;
        this.Collect.active = XCJZ_GameData.Instance.CollectMusic.includes(XCJZ_GameData.Instance.CurMusic);
    }

    ShowIcon() {
        this.LoadIcon();
        tween(this.Icon)
            .by(4, { angle: 360 })
            .repeatForever()
            .start()
    }

    LoadIcon() {
        let IconName: string = ""
        if (XCJZ_GameData.Instance.CurMusic == XCJZ_MUSIC.MUSIC1) {
            IconName = "刀马刀马_1";
        } else if (XCJZ_GameData.Instance.CurMusic == XCJZ_MUSIC.MUSIC2) {
            IconName = "库里库里_1";
        } else {
            IconName = math.clamp(XCJZ_GameData.Instance.CurMusic - 2, 0, 21).toString() + "_1";
        }

        BundleManager.LoadSpriteFrame(GameManager.GameData.DefaultBundle, `Sprites/Icons/${IconName}`).then((spriteFrame: SpriteFrame) => {
            this.Icon.getComponent(Sprite).spriteFrame = spriteFrame;
        });
    }

    ShowTips() {
        this.Tips.active = true;
        tween(this.TipsHand)
            .to(1, { x: 200 }, { easing: `linear` })
            .to(1, { x: -200 }, { easing: `linear` })
            .union()
            .repeatForever()
            .start();
    }

    CloseTips() {
        this.Tips.active = false;
        Tween.stopAllByTarget(this.TipsHand);
    }

    LoadPlayer() {
        this.Player.removeAllChildren();
        const player: Node = instantiate(this.PlayerPrefabs[XCJZ_GameData.Instance.CurShop]);
        player.parent = this.Player;
    }

    ShowResurgenceWindow() {
        this.Map.active = false;
        this.ResurgenceWindow.Show();
    }

    Resurgence() {
        this.Map.active = true;
        this.GameOver = false;
        this.ShowTips();
    }

    GetBlockNode(block: XCJZ_BLOCK, spawn: number): Node | null {
        return this.Map.getComponent(XCJZ_MapController).GetBlockNode(block, spawn);
    }

    PlayMusicEffect() {
        this._timer = 0;
        this.MusicEffectSprites.forEach(sprite => {
            Tween.stopAllByTarget(sprite);
            tween(sprite)
                .to(this.Duration, { fillRange: Math.random() }, { easing: `sineInOut` })
                .repeatForever()
                .start();
        });
    }

    ShowUnbeatableWindow() {
        this.IsUnbeatable = true;
        this.UnbeatableWindow.Show();
    }

    ShowBG() {
        const bgIndex: number = math.randomRangeInt(0, this.GameBG.length);
        for (let i = 0; i < this.GameBG.length; i++) {
            this.GameBG[i].active = i == bgIndex;
        }

        // const catIndex: number = math.randomRangeInt(0, this.GameCat.length);
        // for (let i = 0; i < this.GameCat.length; i++) {
        //     this.GameCat[i].active = i == catIndex;
        // }
    }
}


