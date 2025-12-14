import { _decorator, Animation, AnimationClip, Component, Node, Sprite } from 'cc';
import { GDDSCBASMR_SupermarketPanel } from './GDDSCBASMR_SupermarketPanel';
import { GDDSCBASMR_MainPanel } from './GDDSCBASMR_MainPanel';
import { GDDSCBASMR_LivePanel } from './GDDSCBASMR_LivePanel';
import { GDDSCBASMR_EatPanel } from './GDDSCBASMR_EatPanel';
import { eventCenter } from './GDDSCBASMR_EventCenter';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_AniEvent')
export class GDDSCBASMR_AniEvent extends Component {

    static supermarketOpenShop = false;

    ani: Animation;

    start() {
        this.ani = this.getComponent(Animation);
    }

    PanelDefaultEnd() {
        if (!this.ani) this.ani = this.getComponent(Animation);
        if (this.ani.getState(this.ani.defaultClip.name).wrapMode == AnimationClip.WrapMode.Default) {
            this.node.active = false;
            if (GDDSCBASMR_AniEvent.supermarketOpenShop) {
                GDDSCBASMR_AniEvent.supermarketOpenShop = false;
                GDDSCBASMR_MainPanel.Instance.OpenShop();
            }
            // else if (this.node.name == "ParttimeFinishPanel") {
            //     GDDSCBASMR_MainPanel.Instance.parttimePanel.active = false;
            //     GDDSCBASMR_MainPanel.Instance._OpenMain();
            // }
        }
    }

    DoorEnd() {
        this.node.active = false;
    }

    CatchUp() {
        GDDSCBASMR_SupermarketPanel.Instance.CatchUp();
    }

    CatchEnd() {
        GDDSCBASMR_SupermarketPanel.Instance.CatchEnd();
    }

    BonusCheck(num: number) {
        eventCenter.emit("GDDSCBASMR_Bonus", num);
    }

    PhoneEnd() {
        GDDSCBASMR_LivePanel.Instance._InitRequest();
    }

    GiftTime() {
        if (this.ani.getState(this.ani.defaultClip.name).wrapMode == AnimationClip.WrapMode.Default) GDDSCBASMR_EatPanel.Instance._GiftTime();
    }

}


