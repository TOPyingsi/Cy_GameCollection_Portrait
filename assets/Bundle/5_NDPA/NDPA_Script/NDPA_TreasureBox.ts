import { _decorator, Component, Enum, EventTouch, instantiate, Animation, Node, Prefab, NodeEventType, Label, Sprite, SpriteFrame } from 'cc';
import { NDPA_MZNums, NDPA_NUMBER, NDPA_TREASUREBOX } from './NDPA_GameConstant';
import { NDPA_GameManager } from './NDPA_GameManager';
import { NDPA_TreasurePanel } from './NDPA_TreasurePanel';
import { NDPA_MZAward } from './NDPA_MZAward';
import { NDPA_AudioManager, NDPA_Audios } from './NDPA_AudioManager';
import { NDPA_GoldAwad } from './NDPA_GoldAwad';
import { NDPA_PrefsManager } from './NDPA_PrefsManager';
import { NDPA_GameUtil } from './NDPA_GameUtil';
import { NDPA_EventManager, NDPA_MyEvent } from './NDPA_EventManager';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

export enum Ani {
    Idle = "TreasureBoxIdle",
    Open = "TreasureBoxOpen",
}

@ccclass('NDPA_TreasureBox')
export class NDPA_TreasureBox extends Component {
    @property({ type: Enum(NDPA_TREASUREBOX) })
    Type: NDPA_TREASUREBOX = NDPA_TREASUREBOX.GOLD;

    @property(Prefab)
    AwardPrefab: Prefab = null;

    @property
    MZNum: number = 0;

    GoldNum: number = 0;
    TreasureBox: Node = null;
    Open: Node = null;
    Animation: Animation = null;
    NumLabel: Label = null;
    MZSprite: Sprite = null;
    isClick: boolean = false;//宝箱是否被打开
    cb: Function = null;;
    Path: string = "";
    MZNumber: NDPA_NUMBER;

    protected onLoad(): void {
        this.Open = this.node.getChildByName("Open");
        this.TreasureBox = this.node.getChildByName("宝箱");
        this.Animation = this.TreasureBox.getComponent(Animation);

        this.init();

        this.node.on(Node.EventType.TOUCH_END, this.click, this);

        this.Animation.on(Animation.EventType.FINISHED, () => {
            this.cb && this.cb();
        }, this);

        NDPA_TreasurePanel.Instance.TreasureBoxCount++;
    }

    init() {
        this.GoldNum = NDPA_GameUtil.GetRandomInt(70, 120);
        if (this.Type == NDPA_TREASUREBOX.GOLD) {
            this.NumLabel = this.Open.getChildByName("数量").getComponent(Label);
            this.NumLabel.string = String(this.GoldNum);
        } else if (this.Type == NDPA_TREASUREBOX.CAP) {
            this.MZSprite = this.Open.getChildByName("帽子").getComponent(Sprite);
            this.MZNumber = NDPA_GameUtil.getNonIntersectForNumber(NDPA_MZNums, NDPA_PrefsManager.Instance.userData.HaveMZ, this.MZNum)
            if (NDPA_GameUtil.getNonIntersectForNumber(NDPA_MZNums, NDPA_PrefsManager.Instance.userData.HaveMZ, this.MZNum)) {
                this.Path = "Bundle/NDPA_Sprites/帽子/" + (this.MZNumber - 1);
                BundleManager.LoadSpriteFrame(GameManager.GameData.DefaultBundle, this.Path).then((sf: SpriteFrame) => {
                    this.MZSprite.spriteFrame = sf;
                })
            } else {
                this.Type = NDPA_TREASUREBOX.GOLD;
            }
        }
    }

    playAni(ani: Ani, cb: Function = null) {
        this.Animation.play(ani);
        this.cb = cb;
    }

    click(event: EventTouch) {
        if (this.isClick) {
            NDPA_AudioManager.PlaySound(NDPA_Audios.Forbid);
            return;
        }
        if (!NDPA_GameManager.Instance.isClick) return;
        if (!NDPA_TreasurePanel.Instance.isClick) return;

        NDPA_GameManager.Instance.isClick = false;
        this.isClick = true;
        NDPA_AudioManager.PlaySound(NDPA_Audios.OpenTreasureBox);

        if (this.Type == NDPA_TREASUREBOX.GOLD) {
            this.playAni(Ani.Open, () => {
                NDPA_AudioManager.PlaySound(NDPA_Audios.Gold);
                this.TreasureBox.active = false;
                this.Open.active = true;
                const node = instantiate(this.AwardPrefab);
                node.parent = NDPA_GameManager.Instance.Canvas;
                node.children.forEach(e => {
                    e.getComponent(NDPA_GoldAwad).init(this.node.worldPosition, NDPA_GameManager.Instance.GoldAwardTarget.worldPosition);
                })
                this.scheduleOnce(() => {
                    NDPA_GameManager.Instance.isClick = true;
                    NDPA_GameManager.Instance.showGold(this.GoldNum);
                    NDPA_TreasurePanel.Instance.TreasureBoxCount--;
                    NDPA_TreasurePanel.Instance.useYS();
                }, 1);
            })
        } else if (this.Type == NDPA_TREASUREBOX.CAP) {
            this.playAni(Ani.Open, () => {
                this.TreasureBox.active = false;
                this.Open.active = true;

                BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, "Bundle/NDPA_Prefabs/MZAward").then((prefab: Prefab) => {
                    const mz: Node = instantiate(prefab);
                    mz.parent = NDPA_GameManager.Instance.Canvas;
                    mz.getComponent(NDPA_MZAward).init(this.node.worldPosition, NDPA_TreasurePanel.Instance.getMZWorldPos(), this.Path, () => {
                        NDPA_GameManager.Instance.isClick = true;
                        NDPA_TreasurePanel.Instance.showMZPannel();
                        NDPA_TreasurePanel.Instance.MZAwardNumber = this.MZNumber;
                        NDPA_EventManager.Scene.emit(NDPA_MyEvent.NDPA_SHOWMZ, this.Path);
                        NDPA_TreasurePanel.Instance.TreasureBoxCount--;
                        NDPA_TreasurePanel.Instance.useYS();
                    })
                })

            })
        }
    }

}


