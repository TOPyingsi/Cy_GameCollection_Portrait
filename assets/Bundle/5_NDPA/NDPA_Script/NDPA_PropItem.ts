import { _decorator, Component, Enum, instantiate, Label, Node, Prefab } from 'cc';
import { NDPA_NUMBER, NDPA_PROPTYPE } from './NDPA_GameConstant';
import { NDPA_GameManager } from './NDPA_GameManager';
import { NDPA_Shop } from './NDPA_Shop';
import { NDPA_AudioManager, NDPA_Audios } from './NDPA_AudioManager';
import { NDPA_GoldAwad } from './NDPA_GoldAwad';
import { NDPA_PrefsManager } from './NDPA_PrefsManager';
import { NDPA_GameUtil } from './NDPA_GameUtil';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('NDPA_PropItem')
export class NDPA_PropItem extends Component {
    @property({ type: Enum(NDPA_PROPTYPE) })
    Type: NDPA_PROPTYPE = NDPA_PROPTYPE.TIPS;

    @property
    Price: number = 0;

    @property(Label)
    PriceLabel: Label = null;

    @property(Label)
    PropLabel: Label = null;

    protected start(): void {
        this.PriceLabel.string = String(this.Price);
    }

    show() {
        this.PropLabel.string = String(NDPA_PrefsManager.Instance.userData[NDPA_GameUtil.GetEnumKeyByValue(NDPA_PROPTYPE, this.Type)]);
    }

    buy() {
        //购买商品
        if (NDPA_PrefsManager.Instance.userData.Gold >= this.Price) {
            NDPA_GameManager.Instance.isClick = false;
            NDPA_GameManager.Instance.showGold(-this.Price);
            NDPA_PrefsManager.Instance.userData[NDPA_GameUtil.GetEnumKeyByValue(NDPA_PROPTYPE, this.Type)]++;
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
                    this.show();
                }, 1);
            })
        } else {
            NDPA_AudioManager.PlaySound(NDPA_Audios.Forbid);
            NDPA_Shop.Instance.showVideoPanel();
        }
    }

    protected onEnable(): void {
        this.show();
    }

}


