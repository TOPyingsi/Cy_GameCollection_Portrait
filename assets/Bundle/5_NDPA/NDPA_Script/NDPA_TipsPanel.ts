import { _decorator, Component, Node } from 'cc';
import { NDPA_PROPTYPE } from './NDPA_GameConstant';
import { NDPA_GameManager } from './NDPA_GameManager';
import { NDPA_Shop } from './NDPA_Shop';
import { NDPA_TipsManager } from './NDPA_TipsManager';
import Banner from '../../../Scripts/Banner';
import { NDPA_AudioManager, NDPA_Audios } from './NDPA_AudioManager';
import { NDPA_PrefsManager } from './NDPA_PrefsManager';
const { ccclass, property } = _decorator;

@ccclass('NDPA_TipsPanel')
export class NDPA_TipsPanel extends Component {

    @property(Node)
    TipsBtnNode: Node = null;

    @property(Node)
    NextBtnNode: Node = null;

    show(type: NDPA_PROPTYPE) {
        this.NextBtnNode.active = false;
        this.TipsBtnNode.active = false;
        if (NDPA_PROPTYPE.NEXT == type) {
            this.NextBtnNode.active = true;
        } else if (NDPA_PROPTYPE.TIPS == type) {
            this.TipsBtnNode.active = true;
        }
    }

    goShop() {
        NDPA_AudioManager.PlaySound(NDPA_Audios.Click);
        this.node.active = false;
        NDPA_GameManager.Instance.shopBtn();
        NDPA_Shop.Instance.checked("2");
    }

    TipsBtn() {
        NDPA_AudioManager.PlaySound(NDPA_Audios.Click);
        Banner.Instance.ShowVideoAd(() => {
            this.node.active = false;
            NDPA_AudioManager.PlaySound(NDPA_Audios.Award);
            NDPA_PrefsManager.Instance.userData.TIPS++;
            NDPA_GameManager.Instance.restart();
        })
    }

    NextBtn() {
        NDPA_AudioManager.PlaySound(NDPA_Audios.Click);
        Banner.Instance.ShowVideoAd(() => {
            this.node.active = false;
            NDPA_AudioManager.PlaySound(NDPA_Audios.Award);
            NDPA_PrefsManager.Instance.userData.NEXT++;
            NDPA_GameManager.Instance.restart();
        })
    }

    close() {
        NDPA_TipsManager.Instance.gameResume();
        this.node.active = false;
    }
}


