import { _decorator, Animation, AnimationClip, Component, Node, Sprite } from 'cc';
import { SHJCB_SupermarketPanel } from './SHJCB_SupermarketPanel';
import { SHJCB_MainPanel } from './SHJCB_MainPanel';
import { SHJCB_LivePanel } from './SHJCB_LivePanel';
import { SHJCB_EatPanel } from './SHJCB_EatPanel';
import { eventCenter } from './SHJCB_EventCenter';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_AniEvent')
export class SHJCB_AniEvent extends Component {

    static supermarketOpenShop = false;

    ani: Animation;

    start() {
        this.ani = this.getComponent(Animation);
    }

    PanelDefaultEnd() {
        if (!this.ani) this.ani = this.getComponent(Animation);
        if (this.ani.getState(this.ani.defaultClip.name).wrapMode == AnimationClip.WrapMode.Default) {
            this.node.active = false;
            if (SHJCB_AniEvent.supermarketOpenShop) {
                SHJCB_AniEvent.supermarketOpenShop = false;
                SHJCB_MainPanel.Instance.OpenShop();
            }
            // else if (this.node.name == "ParttimeFinishPanel") {
            //     SHJCB_MainPanel.Instance.parttimePanel.active = false;
            //     SHJCB_MainPanel.Instance._OpenMain();
            // }
        }
    }

    DoorEnd() {
        this.node.active = false;
    }

    CatchUp() {
        SHJCB_SupermarketPanel.Instance.CatchUp();
    }

    CatchEnd() {
        SHJCB_SupermarketPanel.Instance.CatchEnd();
    }

    BonusCheck(num: number) {
        eventCenter.emit("SHJCB_Bonus", num);
    }

    PhoneEnd() {
        SHJCB_LivePanel.Instance._InitRequest();
    }

    GiftTime() {
        if (this.ani.getState(this.ani.defaultClip.name).wrapMode == AnimationClip.WrapMode.Default) SHJCB_EatPanel.Instance._GiftTime();
    }

}


