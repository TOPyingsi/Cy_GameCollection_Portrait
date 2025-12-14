import { _decorator, Component, math, Node, sp } from 'cc';
import { ZDXS_ANI, ZDXS_ANI_WIN, ZDXS_PLAYER_SKIN } from './ZDXS_Constant';
import { ZDXS_EventManager, ZDXS_MyEvent } from './ZDXS_EventManager';
import { ZDXS_GameData } from './ZDXS_GameData';
import { ZDXS_GameManager } from './ZDXS_GameManager';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_PlayerShow')
export class ZDXS_PlayerShow extends Component {

    @property
    IsShopShow: boolean = false;

    @property
    IsTryShow: boolean = false;

    @property
    IsOvered: boolean = false;

    @property
    IsFalse: boolean = false;

    PlayerSpine: sp.Skeleton = null;
    private _cb: Function = null;
    protected onLoad(): void {
        this.PlayerSpine = this.getComponent(sp.Skeleton);
        if (!this.IsFalse) {
            this.PlayerSpine.setCompleteListener(() => { this.PlayAni() })
            this.PlayAni();
        }
        if (this.IsShopShow) this.ShowShop();
    }

    protected onEnable(): void {
        if (this.IsTryShow) this.ShowTry();
        if (this.IsShopShow) ZDXS_EventManager.On(ZDXS_MyEvent.ZDXS_PLAYER_SHOP_SHOW, this.ShowShop, this);
        if (this.IsOvered) {
            ZDXS_EventManager.On(ZDXS_MyEvent.ZDXS_PLAYER_WIN_SHOW, this.ShowWin, this);
            ZDXS_EventManager.On(ZDXS_MyEvent.ZDXS_PLAYER_FAIL_SHOW, this.ShowFail, this);
        }
    }

    protected onDisable(): void {
        if (this.IsShopShow) ZDXS_EventManager.Off(ZDXS_MyEvent.ZDXS_PLAYER_SHOP_SHOW, this.ShowShop, this);
        if (this.IsOvered) {
            ZDXS_EventManager.Off(ZDXS_MyEvent.ZDXS_PLAYER_WIN_SHOW, this.ShowWin, this);
            ZDXS_EventManager.Off(ZDXS_MyEvent.ZDXS_PLAYER_FAIL_SHOW, this.ShowFail, this);
        }
    }

    PlayAni() {
        const index = math.randomRangeInt(0, ZDXS_ANI_WIN.length);
        const ani: string = ZDXS_ANI_WIN[index];
        this.PlayerSpine.setAnimation(0, ani, false);
    }

    ShowShop() {
        const skinName: string = ZDXS_PLAYER_SKIN[ZDXS_GameData.Instance.CurSkin];
        this.PlayerSpine.setSkin(skinName);
    }

    ShowTry() {
        const skinName: string = ZDXS_PLAYER_SKIN[ZDXS_GameManager.Instance.TrySkin];
        this.PlayerSpine.setSkin(skinName);
    }

    ShowWin() {
        ZDXS_GameManager.Instance.IsTry ? this.ShowTry() : this.ShowShop();
        this.PlayAni();
    }


    ShowFail() {
        ZDXS_GameManager.Instance.IsTry ? this.ShowTry() : this.ShowShop();
        this.PlayerSpine.setAnimation(0, ZDXS_ANI.FAIL, true);
    }

}


