import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import { MHLX_GameManager } from './MHLX_GameManager';
const { ccclass, property } = _decorator;

@ccclass('MHLX_WinPanel')
export class MHLX_WinPanel extends Component {

    @property(Node)
    title: Node;

    protected onEnable(): void {
        tween(this.title)
            .to(0.5, { scale: Vec3.ONE }, { easing: EasingType.backOut })
            .delay(0.5)
            .to(0.5, { scale: Vec3.ZERO }, { easing: EasingType.backIn })
            .call(() => { MHLX_GameManager.Instance._Next(); })
            .start();
    }

}


