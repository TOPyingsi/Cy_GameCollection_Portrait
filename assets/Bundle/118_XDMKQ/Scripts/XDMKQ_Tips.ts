import { _decorator, Component, Label, Node, tween, Tween, UIOpacity } from 'cc';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_Tips')
export class XDMKQ_Tips extends Component {

    UIOpacity: UIOpacity = null;
    TipsLabel: Label = null;

    protected onLoad(): void {
        this.UIOpacity = this.getComponent(UIOpacity);
        this.TipsLabel = this.node.getChildByName("Tips").getComponent(Label);
    }

    protected onEnable(): void {
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_TIPS_SHOW, this.ShowTips, this);
    }

    protected onDisable(): void {
        XDMKQ_EventManager.Off(XDMKQ_MyEvent.XDMKQ_TIPS_SHOW, this.ShowTips, this);
    }

    ShowTips(tips: string) {
        Tween.stopAllByTarget(this.UIOpacity);
        this.UIOpacity.opacity = 255;
        this.TipsLabel.string = tips;
        tween(this.UIOpacity)
            .delay(2)
            .to(1, { opacity: 0 }, { easing: `backInOut` })
            .start();
    }

}


