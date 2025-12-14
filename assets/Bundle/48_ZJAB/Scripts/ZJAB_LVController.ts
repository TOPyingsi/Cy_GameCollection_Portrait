import { _decorator, Component, director, find, Label, Node, Prefab, Rect, Sprite, SpriteFrame, tween, UIOpacity, UITransform, v3 } from 'cc';
import { GamePanel } from '../../../Scripts/UI/Panel/GamePanel';
import { ZJAB_NZ } from './ZJAB_NZ';
import { ZJAB_TZ } from './ZJAB_TZ';
import { ZJAB_AB } from './ZJAB_AB';
import { ZJAB_TouchController } from './ZJAB_TouchController';
import { ZJAB_SoundController, ZJAB_Sounds } from './ZJAB_SoundController';
import { ZJAB_ItemManager } from './ZJAB_ItemManager';
import { MyEvent } from '../../../Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from '../../../Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('GFS_LVController')
export class ZJAB_LVController extends Component {

    public static Instance: ZJAB_LVController = null;

    @property(Prefab)
    Answer: Prefab = null;

    BG: Sprite = null;
    MaskUIOpacity: UIOpacity
    TipsNode: Node = null;
    TipsLabel: Label = null;

    FirstAct: Node = null;
    SecondAct: Node = null;

    Fire: Node = null;
    NZ: Node = null;
    MW: Node = null;

    EffectHQ: Node = null;
    //win节点下的
    WinNode: Node = null;
    Icon: Node = null;
    Talk: Node = null;
    D_Left: Node = null;
    D_Right: Node = null;
    ChangeNode: Node = null;
    EndNode: Node = null;

    private _index: number = 0;

    protected onLoad(): void {
        ZJAB_LVController.Instance = this;

        // GamePanel.Instance.answerPrefab = this.Answer!;
        // this.BG = find("背景", this.node).getComponent(Sprite);
        this.MaskUIOpacity = find("Mask", this.node).getComponent(UIOpacity);
        this.TipsNode = find("Tips", this.node);
        this.TipsLabel = find("Tips/Tips", this.node).getComponent(Label);

        this.FirstAct = find("第一幕", this.node);
        this.SecondAct = find("第二幕", this.node);

        this.Fire = find("第一幕/火", this.node);
        this.NZ = find("第一幕/灵珠", this.node);
        this.MW = find("第一幕/魔丸", this.node);

        this.WinNode = find("第一幕/Win", this.node);
        this.EffectHQ = find("第一幕/火圈", this.node);
        this.Icon = find("第一幕/Win/Icon", this.node);
        this.Talk = find("第一幕/Win/Talk", this.node);
        this.D_Left = find("第一幕/Win/左鼎", this.node);
        this.D_Right = find("第一幕/Win/右鼎", this.node);
        this.ChangeNode = find("第一幕/Win/变身", this.node);
        this.EndNode = find("第一幕/Win/结算", this.node);
    }

    protected start(): void {
        // this.switchBG();
        // this.gameStart();
        if (this.NZ) {
            tween(this.NZ)
                .to(1, { scale: v3(1.2, 1.2, 1.2) }, { easing: `sineOut` })
                .to(1, { scale: v3(1, 1, 1) }, { easing: `sineOut` })
                .union()
                .repeatForever()
                .start();
        }
        if (this.MW) {
            tween(this.MW)
                .to(1, { scale: v3(1.2, 1.2, 1.2) }, { easing: `sineOut` })
                .to(1, { scale: v3(1, 1, 1) }, { easing: `sineOut` })
                .union()
                .repeatForever()
                .start();
        }
        if (this.EffectHQ) {
            tween(this.EffectHQ)
                .by(2, { angle: 360 })
                .repeatForever()
                .start();
        }
        GamePanel.Instance.answerPrefab = this.Answer;
        GamePanel.Instance.time = 300;
        if (ProjectEventManager.GameStartIsShowTreasureBox) director.getScene().once(MyEvent.TreasureBoxDestroy, this.gameStart, this);
        else this.gameStart();

    }


    gameStart() {
        ZJAB_TZ.Instance.showTalk(0, () => {
            ZJAB_AB.Instance.showTalk(0, () => {
                ZJAB_NZ.Instance.showTalk(0, () => {
                    this.showMask(
                        () => {
                            this.FirstAct.active = false;
                            this.SecondAct.active = true;
                            ZJAB_NZ.Instance.initPos();
                            ZJAB_NZ.Instance.showIconByIndex(0);
                            ZJAB_NZ.Instance.showFinish();
                        },
                        () => {
                            ZJAB_SoundController.Instance.PlaySound(ZJAB_Sounds.NZ_2);
                            this.showTips("我得尽快用这鼎中的三味真火重塑肉身才能救敖丙", () => {
                                ZJAB_TouchController.Instance.IsTouch = true;
                                ZJAB_ItemManager.Instance.gameStart();
                            }, 5)
                        })
                }, 5)
            }, 5)
        }, 6)
    }

    showMask(cb1: Function = null, cb2: Function = null) {
        tween(this.MaskUIOpacity)
            .to(1, { opacity: 255 }, { easing: `sineIn` })
            .call(() => {
                cb1 && cb1();
            })
            .to(1, { opacity: 0 }, { easing: `sineIn` })
            .call(() => {
                cb2 && cb2();
            })
            .start();
    }

    showTips(tips: string, cb: Function = null, time: number = 4) {
        this.TipsNode.active = true;
        this.TipsLabel.string = tips;
        this.scheduleOnce(() => {
            this.TipsNode.active = false;
            cb && cb();
        }, time);
    }

    backScene(isWin: boolean) {
        this.showMask(
            () => {
                ZJAB_NZ.Instance.backStartPos();
                this.FirstAct.active = true;
                this.SecondAct.active = false;
                if (isWin) {
                    ZJAB_NZ.Instance.node.active = false;
                    this.WinNode.active = true;
                }
            },
            () => {
                if (isWin) {
                    this.win();
                } else {
                    this.fail();
                }
            }
        )
    }

    fail() {
        ZJAB_NZ.Instance.showTalk(1, () => {
            ZJAB_TZ.Instance.showTalk(1, () => {
                //变成仙丹 
                this.Fire.active = true;
                this.scheduleOnce(() => {
                    ZJAB_SoundController.Instance.PlaySound(ZJAB_Sounds.失败);
                    ZJAB_NZ.Instance.node.active = false;
                    ZJAB_AB.Instance.node.active = false;
                    this.NZ.active = true;
                    this.MW.active = true;
                    this.scheduleOnce(() => {
                        GamePanel.Instance.Lost();
                    }, 1);
                }, 1);
            }, 5)
        }, 3)
    }

    win() {
        ZJAB_SoundController.Instance.PlaySound(ZJAB_Sounds.胜利);
        this.Talk.active = true;
        this.Fire.active = true;
        this.EffectHQ.active = true;
        this.scheduleOnce(() => {
            this.Talk.active = false;
            this.Fire.active = false;
            this.EffectHQ.active = false;

            ZJAB_AB.Instance.change();
            ZJAB_TZ.Instance.change();
            this.scheduleOnce(() => {
                ZJAB_AB.Instance.node.active = false;
                this.change();
                this.breach();
            }, 1);
        }, 1.5);
    }

    breach() {
        tween(this.D_Left)
            .by(0.2, { angle: 4 }, { easing: `sineOut` })
            .by(2, { position: v3(0, -2000, 0) }, { easing: `sineOut` })
            .start();
        tween(this.D_Right)
            .by(0.2, { angle: -4 }, { easing: `sineOut` })
            .by(2, { position: v3(0, -2000, 0) }, { easing: `sineOut` })
            .start();
    }

    change() {
        this.ChangeNode.active = true;
        this.Icon.active = false;
        tween(this.ChangeNode)
            .by(1, { position: v3(0, 2000, 0) }, { easing: `sineOut` })
            .call(() => {
                ZJAB_TZ.Instance.node.active = false;
                this.showFight();
                this.scheduleOnce(() => {
                    GamePanel.Instance.Win();
                }, 2)
            })
            .start();
    }

    showFight() {
        this.EndNode.active = true;
        this.schedule(() => {
            this.EndNode.scale = v3(-this.EndNode.scale.x, 1, 1);
        }, 0.1)
    }
}


