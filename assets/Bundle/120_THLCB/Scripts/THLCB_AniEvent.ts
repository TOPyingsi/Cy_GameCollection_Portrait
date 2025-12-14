import { _decorator, Animation, AnimationClip, Component, Node, Sprite } from 'cc';
import { THLCB_SupermarketPanel } from './THLCB_SupermarketPanel';
import { THLCB_MainPanel } from './THLCB_MainPanel';
import { THLCB_LivePanel } from './THLCB_LivePanel';
import { THLCB_EatPanel } from './THLCB_EatPanel';
import { eventCenter } from './THLCB_EventCenter';
const { ccclass, property } = _decorator;

@ccclass('THLCB_AniEvent')
export class THLCB_AniEvent extends Component {

    static supermarketOpenShop = false;

    ani: Animation;

    start() {
        this.ani = this.getComponent(Animation);
    }

    PanelDefaultEnd() {
        if (!this.ani) this.ani = this.getComponent(Animation);
        if (this.ani.getState(this.ani.defaultClip.name).wrapMode == AnimationClip.WrapMode.Default) {
            this.node.active = false;
            if (THLCB_AniEvent.supermarketOpenShop) {
                THLCB_AniEvent.supermarketOpenShop = false;
                THLCB_MainPanel.Instance.OpenShop();
            }
            // else if (this.node.name == "ParttimeFinishPanel") {
            //     THLCB_MainPanel.Instance.parttimePanel.active = false;
            //     THLCB_MainPanel.Instance._OpenMain();
            // }
        }
    }

    DoorEnd() {
        this.node.active = false;
    }

    CatchUp() {
        THLCB_SupermarketPanel.Instance.CatchUp();
    }

    CatchEnd() {
        THLCB_SupermarketPanel.Instance.CatchEnd();
    }

    BonusCheck(num: number) {
        eventCenter.emit("THLCB_Bonus", num);
    }

    PhoneEnd() {
        THLCB_LivePanel.Instance._InitRequest();
    }

    GiftTime() {
        if (this.ani.getState(this.ani.defaultClip.name).wrapMode == AnimationClip.WrapMode.Default) THLCB_EatPanel.Instance._GiftTime();
    }

}


