import { _decorator, Component, Enum, instantiate, Label, Node, Prefab } from 'cc';
import { NDPA_DW, NDPA_NUMBER } from './NDPA_GameConstant';
import { NDPA_PrefsManager } from './NDPA_PrefsManager';
import { NDPA_EventManager, NDPA_MyEvent } from './NDPA_EventManager';
import { NDPA_GameManager } from './NDPA_GameManager';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { NDPA_AudioManager, NDPA_Audios } from './NDPA_AudioManager';
import { NDPA_GoldAwad } from './NDPA_GoldAwad';
import { NDPA_Shop } from './NDPA_Shop';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('NDPA_DWItem')
export class NDPA_DWItem extends Component {
    @property({ type: Enum(NDPA_DW) })
    Number: NDPA_DW = NDPA_DW.狗熊;

    @property
    Price: number = 0;

    @property(Label)
    PriceLabel: Label = null;

    Have: Node = null;
    No: Node = null;
    Using: Node = null;

    IsHave: boolean = false;
    IsUsing: boolean = false;

    protected onLoad(): void {
        this.Have = this.node.getChildByName("已购买");
        this.No = this.node.getChildByName("未购买");
        this.Using = this.node.getChildByName("正在使用");
    }

    protected start(): void {
        this.PriceLabel.string = String(this.Price);
        this.show();
    }

    show() {
        if (NDPA_PrefsManager.Instance.userData.HaveDW.find(e => e == this.Number)) {
            this.IsHave = true;
            this.Have.active = true;
            this.No.active = false;
        } else {
            this.IsHave = false;
            this.Have.active = false;
            this.No.active = true;
        }

        if (NDPA_PrefsManager.Instance.userData.UseDW == this.Number) {
            this.IsUsing = true;
            this.Using.active = true;
        } else {
            this.IsUsing = false;
            this.Using.active = false;
        }
    }

    use() {
        this.IsUsing = !this.IsUsing;
        if (this.IsUsing) {
            NDPA_PrefsManager.Instance.userData.UseDW = this.Number;
            NDPA_PrefsManager.Instance.saveData();
        }
        NDPA_EventManager.Scene.emit(NDPA_MyEvent.NDPA_SHOWDWITEM);
    }

    buy() {
        //购买商品
        if (NDPA_PrefsManager.Instance.userData.Gold >= this.Price) {
            NDPA_GameManager.Instance.isClick = false;
            NDPA_GameManager.Instance.showGold(-this.Price);
            NDPA_PrefsManager.Instance.userData.HaveDW.push(this.Number);
            NDPA_PrefsManager.Instance.saveData();
            BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, "Bundle/NDPA_Prefabs/GoldAward").then((prefab: Prefab) => {
                NDPA_AudioManager.PlaySound(NDPA_Audios.Gold);
                const award: Node = instantiate(prefab);
                award.parent = NDPA_GameManager.Instance.Canvas;
                award.children.forEach(e => {
                    e.getComponent(NDPA_GoldAwad).init(NDPA_GameManager.Instance.GoldAwardTarget.worldPosition, this.node.worldPosition);
                })
                this.scheduleOnce(() => {
                    NDPA_GameManager.Instance.isClick = true;
                    this.IsHave = true;
                    this.use();
                }, 1);
            })
        } else {
            NDPA_AudioManager.PlaySound(NDPA_Audios.Forbid);
            NDPA_Shop.Instance.showVideoPanel();
        }
    }

    protected onEnable(): void {
        NDPA_EventManager.ON(NDPA_MyEvent.NDPA_SHOWDWITEM, this.show, this);
    }

    protected onDisable(): void {
        NDPA_EventManager.OFF(NDPA_MyEvent.NDPA_SHOWDWITEM, this.show, this);
    }

}


