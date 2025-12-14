import { _decorator, Component, EventTouch, instantiate, Node, Prefab, Sprite, SpriteFrame, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { NDPA_MZItem } from './NDPA_MZItem';
import { NDPA_PropItem } from './NDPA_PropItem';
import { NDPA_GameManager } from './NDPA_GameManager';
import { NDPA_GoldAwad } from './NDPA_GoldAwad';
import Banner from '../../../Scripts/Banner';
import { NDPA_AudioManager, NDPA_Audios } from './NDPA_AudioManager';
import { NDPA_PrefsManager } from './NDPA_PrefsManager';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { NDPA_DWItem } from './NDPA_DWItem';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('NDPA_Shop')
export class NDPA_Shop extends Component {

    public static Instance: NDPA_Shop = null;

    @property(Node)
    DWPanel: Node = null;

    @property(Node)
    MZPanel: Node = null;

    @property(Node)
    PropPanel: Node = null;

    @property(Node)
    VideoPanel: Node = null;

    @property(SpriteFrame)
    NormalSF: SpriteFrame = null;

    @property(SpriteFrame)
    ClickSF: SpriteFrame = null;

    @property(Sprite)
    DWSprite: Sprite = null;

    @property(Sprite)
    MZSprite: Sprite = null;

    @property(Sprite)
    PropSprite: Sprite = null;

    TargetPanel: Node = null;
    TargetType: string = "1";

    CenterPos: Vec3;

    protected onLoad(): void {
        NDPA_Shop.Instance = this;
    }

    protected start(): void {
        this.CenterPos = v3(NDPA_GameManager.Instance.Canvas.getComponent(UITransform).width / 2, NDPA_GameManager.Instance.Canvas.getComponent(UITransform).height / 2);
        this.checked();
    }

    checkedBtn(even: EventTouch, type: string) {
        if (this.TargetType === type) return;
        this.checked(type);
    }

    checked(type: string = "0") {
        NDPA_AudioManager.PlaySound(NDPA_Audios.Click);
        if (this.TargetPanel && this.TargetPanel.active) this.TargetPanel.active = false;
        this.DWSprite.spriteFrame = this.NormalSF;
        this.MZSprite.spriteFrame = this.NormalSF;
        this.PropSprite.spriteFrame = this.NormalSF;
        if (type == "0") {
            this.DWSprite.spriteFrame = this.ClickSF;
            this.TargetPanel = this.DWPanel;
        } else if (type == "1") {
            this.MZSprite.spriteFrame = this.ClickSF;
            this.TargetPanel = this.MZPanel;
        } else if (type == "2") {
            this.PropSprite.spriteFrame = this.ClickSF;
            this.TargetPanel = this.PropPanel;
        }
        this.TargetPanel.active = true;
        this.TargetType = type;
    }

    DWItemBtn(event: EventTouch) {
        if (!NDPA_GameManager.Instance.isClick) return;

        const item: NDPA_DWItem = event.target.getComponent(NDPA_DWItem);
        //玩家点击item 如果已经拥有就使用她 不然就购买
        if (item.IsHave) {
            NDPA_AudioManager.PlaySound(NDPA_Audios.Click);
            item.use();
        } else {
            item.buy();
        }
    }


    MZItemBtn(event: EventTouch) {
        if (!NDPA_GameManager.Instance.isClick) return;

        const item: NDPA_MZItem = event.target.getComponent(NDPA_MZItem);
        //玩家点击item 如果已经拥有就使用她 不然就购买
        if (item.IsHave) {
            NDPA_AudioManager.PlaySound(NDPA_Audios.Click);
            item.use();
        } else {
            item.buy();
        }
    }

    PropItemBtn(event: EventTouch) {
        if (!NDPA_GameManager.Instance.isClick) return;
        const item: NDPA_PropItem = event.target.getComponent(NDPA_PropItem);
        item.buy();
    }

    showVideoPanel() {
        this.VideoPanel.active = true;
    }

    closeVideoPanel() {
        NDPA_AudioManager.PlaySound(NDPA_Audios.Click);
        this.VideoPanel.active = false;
    }

    playVideo() {
        NDPA_AudioManager.PlaySound(NDPA_Audios.Click);
        Banner.Instance.ShowVideoAd(() => {
            NDPA_GameManager.Instance.isClick = false;
            this.closeVideoPanel();
            BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, "Bundle/NDPA_Prefabs/GoldAward").then((prefab: Prefab) => {
                NDPA_AudioManager.PlaySound(NDPA_Audios.Gold);
                const award: Node = instantiate(prefab);
                award.parent = NDPA_GameManager.Instance.Canvas;
                award.children.forEach(e => {
                    e.getComponent(NDPA_GoldAwad).init(this.CenterPos, NDPA_GameManager.Instance.GoldAwardTarget.worldPosition);
                })
                this.scheduleOnce(() => {
                    NDPA_GameManager.Instance.isClick = true;
                    NDPA_GameManager.Instance.showGold(500);
                    NDPA_PrefsManager.Instance.saveData();
                }, 1)
            })
        })
    }
}


