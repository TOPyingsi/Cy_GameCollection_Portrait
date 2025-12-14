import { _decorator, Component, director, EventTouch, instantiate, Label, math, Node, NodeEventType, Prefab, tween, v3, Vec3 } from 'cc';
import { ZDXS_GameData } from './ZDXS_GameData';
import { ZDXS_MenuManager } from './ZDXS_MenuManager';
import Banner from 'db://assets/Scripts/Banner';
import { ZDXS_MyEvent, ZDXS_EventManager } from './ZDXS_EventManager';
import { BundleManager } from 'db://assets/Scripts/Framework/Managers/BundleManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
import { ZDXS_Guide } from './ZDXS_Guide';
import { ZDXS_AudioManager } from './ZDXS_AudioManager';
import { ZDXS_AUDIO } from './ZDXS_Constant';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_GameManager')
export class ZDXS_GameManager extends Component {

    public static Instance: ZDXS_GameManager = null;
    public static BulletMaxCount: number = 5;

    @property(Label)
    Level: Label = null;

    @property(Node)
    TryPanel: Node = null;

    @property(Node)
    TryButton: Node = null;

    @property(Node)
    PassButton: Node = null;

    @property(Node)
    WinPanel: Node = null;

    @property(Node)
    WinStars: Node[] = [];

    @property(Label)
    WinGold: Label = null;

    @property(Node)
    WinButtons: Node[] = [];

    @property(Node)
    LosePanel: Node = null;

    @property(Node)
    Bullets: Node[] = [];

    @property(Node)
    LevelPanel: Node = null;

    @property(ZDXS_Guide)
    Guides: ZDXS_Guide[] = [];

    public EnemyCount: number = 0;
    public IsFire: boolean = true;//玩家能否发射
    public IsTry: boolean = false;  //是否是试用模式
    public IsWin: boolean = false;

    public TrySkin: number = 0;

    public Explosions: Node[] = [];

    private _curStarIndex: number = 0;
    private _awardGold: number = 0;
    private _winButtonClick: boolean = false;
    private _bulletCount: number = 0;

    protected onLoad(): void {
        ZDXS_GameManager.Instance = this;
    }
    OnButtonClick(event: EventTouch) {
        ZDXS_AudioManager.Instance.Play(ZDXS_AUDIO.按钮点击);
        switch (event.getCurrentTarget().name) {
            case "跳过":
                this.CloseTryPanel();
                break;
            case "试用":
                Banner.Instance.ShowVideoAd(() => {
                    this.IsTry = true;
                    ZDXS_EventManager.Emit(ZDXS_MyEvent.ZDXS_PLAYER_SKIN, this.TrySkin);
                    this.CloseTryPanel();
                })
                break;
            case "菜单":
                if (this.IsWin) return;
                director.loadScene("ZDXS_Menu", () => {
                    ZDXS_MenuManager.Instance.ShowPanel(ZDXS_MenuManager.Instance.Mode);
                })
                break;
            case "菜单_胜利结算":
                if (!this._winButtonClick) return;
                this._winButtonClick = false;
                ZDXS_GameData.Instance.Gold += this._awardGold;
                ZDXS_GameData.DateSave();
                ZDXS_EventManager.Emit(ZDXS_MyEvent.ZDXS_LABEL_CHANGE);
                this.scheduleOnce(() => {
                    this.WinPanel.active = false;
                    director.loadScene("ZDXS_Menu", () => {
                        ZDXS_MenuManager.Instance.ShowPanel(ZDXS_MenuManager.Instance.Mode);
                    })
                }, 1);
                break;
            case "菜单_失败结算":
                director.loadScene("ZDXS_Menu", () => {
                    ZDXS_MenuManager.Instance.ShowPanel(ZDXS_MenuManager.Instance.Mode);
                })
                break;
            case "重置":
                if (this.IsWin) return;
                this.LoadLevel();
                break;
            case "继续游戏":
                if (!this._winButtonClick) return;
                this._winButtonClick = false;
                ZDXS_GameData.Instance.Gold += this._awardGold;
                ZDXS_GameData.DateSave();
                ZDXS_EventManager.Emit(ZDXS_MyEvent.ZDXS_LABEL_CHANGE);
                this.scheduleOnce(() => {
                    this.WinPanel.active = false;
                    if (ZDXS_GameData.Instance.CurLevel >= 19) {
                        director.loadScene("ZDXS_Menu", () => {
                            ZDXS_MenuManager.Instance.ShowPanel(ZDXS_MenuManager.Instance.Mode);
                        })
                    } else {
                        ZDXS_GameData.Instance.CurLevel++;
                        this.LoadLevel();
                    }
                }, 1);
                break;
            case "奖励翻倍":
                // if (!this._winButtonClick) return;
                // this._winButtonClick = false;

                Banner.Instance.ShowVideoAd(() => {
                    ZDXS_GameData.Instance.Gold += this._awardGold * 2;
                    ZDXS_GameData.DateSave();
                    ZDXS_EventManager.Emit(ZDXS_MyEvent.ZDXS_LABEL_CHANGE);
                    this.scheduleOnce(() => {
                        this.WinPanel.active = false;
                        if (ZDXS_GameData.Instance.CurLevel >= 19) {
                            director.loadScene("ZDXS_Menu", () => {
                                ZDXS_MenuManager.Instance.ShowPanel(ZDXS_MenuManager.Instance.Mode);
                            })
                        } else {
                            ZDXS_GameData.Instance.CurLevel++;
                            this.LoadLevel();
                        }
                    }, 1);
                })
                break;
            case "重新来过":
                this.LosePanel.active = false;
                this.LoadLevel();
                break;
            case "跳过本关":
                Banner.Instance.ShowVideoAd(() => {
                    ZDXS_GameData.Instance.LevelStar[ZDXS_GameData.Instance.Mode][ZDXS_GameData.Instance.CurLevel] = 3;
                    ZDXS_GameData.Instance.Stars += 3;
                    this.LosePanel.active = false;
                    this.LoadLevel();
                })
                break;
        }
    }

    LoadLevel() {
        if (ZDXS_GameData.Instance.CurLevel == 0) {
            this.Guides[ZDXS_GameData.Instance.Mode].Show();
        } else {
            this.ShowTryPanel();
        }
        this.Level.string = `第 ${ZDXS_GameData.Instance.CurLevel + 1} 关`;
        this._bulletCount = ZDXS_GameManager.BulletMaxCount;
        this.ShowBullets();
        this.IsFire = true;
        this.EnemyCount = 0;
        this.Explosions = [];
        this.IsTry = false;
        this.IsWin = false;
        BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, `Prefabs/${ZDXS_GameData.Instance.Mode + 1}/${ZDXS_GameData.Instance.CurLevel + 1}`).then((prefab: Prefab) => {
            this.LevelPanel.removeAllChildren();
            const lv = instantiate(prefab);
            lv.parent = this.LevelPanel;
            lv.setPosition(Vec3.ZERO);
        });
    }

    ShowBullets() {
        for (let i = 0; i < this.Bullets.length; i++) {
            this.Bullets[i].active = i <= this._bulletCount - 1;
        }
    }

    ShowTryPanel() {
        if (ZDXS_GameData.Instance.HaveSkin.length >= 6) return;

        // 定义完整的数字集合
        const fullSet = [0, 1, 2, 3, 4, 5];

        // 过滤出不存在于 arr 中的数字
        const missingNumbers = fullSet.filter(num => !ZDXS_GameData.Instance.HaveSkin.includes(num));

        this.TrySkin = missingNumbers[math.randomRangeInt(0, missingNumbers.length)];

        this.TryPanel.active = true;
        tween(this.TryPanel)
            .by(0.5, { y: -500 }, { easing: `sineOut` })
            .call(() => {
                this.TryButton.active = true;
                this.PassButton.active = true;
            })
            .start();
    }

    CloseTryPanel() {
        this.TryButton.active = false;
        this.PassButton.active = false;
        tween(this.TryPanel)
            .by(0.5, { y: 500 }, { easing: `sineOut` })
            .call(() => {
                this.TryPanel.active = false;
                // this.TryPanel.setPosition(Vec3.ZERO);
            })
            .start();
    }

    ShowWinPanel(stars: number) {
        this._awardGold = 10 * stars;
        this._winButtonClick = true;

        this.WinStars.forEach(e => e.active = false);
        this.WinButtons.forEach(e => e.active = false);
        this.WinGold.string = this._awardGold.toString();
        this.WinPanel.active = true;
        this._curStarIndex = 0;
        this.ShowWInStar(stars, () => {
            this.WinButtons.forEach(e => e.active = true);
        })
        ZDXS_EventManager.Emit(ZDXS_MyEvent.ZDXS_PLAYER_WIN_SHOW);
    }

    ShowWInStar(count: number, cb?: Function) {
        if (count <= 0) {
            cb && cb();
            return;
        }
        const target: Node = this.WinStars[this._curStarIndex];
        this._curStarIndex++;
        target.active = true;
        target.scale = target.scale.add3f(0.5, 0.5, 0.5);
        tween(target)
            .by(0.3, { scale: v3(-0.5, -0.5, -0.5) }, { easing: `sineOut` })
            .call(() => {
                this.ShowWInStar(count - 1, cb);
            })
            .start();
    }

    ShowLosePanel() {
        this.LosePanel.active = true;
        this._awardGold = 10;
        ZDXS_GameData.Instance.Gold += this._awardGold;
        ZDXS_GameData.DateSave();
        ZDXS_EventManager.Emit(ZDXS_MyEvent.ZDXS_LABEL_CHANGE);
        ZDXS_EventManager.Emit(ZDXS_MyEvent.ZDXS_PLAYER_FAIL_SHOW);
    }

    RemoveEnemy() {
        this.EnemyCount--;
        if (this.EnemyCount <= 0) {
            console.log("游戏胜利！");
            this.Win();
        }
    }

    Fire() {
        this._bulletCount--;
        this.ShowBullets();
        if (this._bulletCount <= 0) {
            this.IsFire = false;
            this.scheduleOnce(() => {
                if (this.IsWin) return;
                console.log("游戏失败！");
                this.ShowLosePanel();
                ZDXS_AudioManager.Instance.Play(ZDXS_AUDIO.失败);
                ProjectEventManager.emit(ProjectEvent.游戏结束, "子弹先生");
            }, 3);
        }
    }

    Win() {
        ProjectEventManager.emit(ProjectEvent.游戏结束, "子弹先生");
        this.IsWin = true;
        this.IsFire = false;
        //结算星星
        let star: number = 1;
        if (this._bulletCount >= ZDXS_GameManager.BulletMaxCount - 2) {
            star = 3;
        } else if (this._bulletCount >= ZDXS_GameManager.BulletMaxCount - 4) {
            star = 2;
        }

        if (ZDXS_GameData.Instance.LevelStar[ZDXS_GameData.Instance.Mode].length >= ZDXS_GameData.Instance.CurLevel + 1) {
            //已经通过关卡
            if (ZDXS_GameData.Instance.LevelStar[ZDXS_GameData.Instance.Mode][ZDXS_GameData.Instance.CurLevel] < star) {
                ZDXS_GameData.Instance.Stars += star - ZDXS_GameData.Instance.LevelStar[ZDXS_GameData.Instance.Mode][ZDXS_GameData.Instance.CurLevel];
                ZDXS_GameData.Instance.LevelStar[ZDXS_GameData.Instance.Mode][ZDXS_GameData.Instance.CurLevel] = star;
                ZDXS_GameData.DateSave();
            }
        }
        else {
            ZDXS_GameData.Instance.Stars += star;
            ZDXS_GameData.Instance.LevelStar[ZDXS_GameData.Instance.Mode].push(star);
            ZDXS_GameData.DateSave();
        }
        ZDXS_AudioManager.Instance.Play(ZDXS_AUDIO.胜利);
        this.scheduleOnce(() => {
            this.ShowWinPanel(star);
        }, 2);
    }

}


