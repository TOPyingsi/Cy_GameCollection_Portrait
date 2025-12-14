import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import { MHLX_GameManager } from './MHLX_GameManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('MHLX_FailPanel')
export class MHLX_FailPanel extends Component {

    @property(Node)
    title: Node;

    protected onEnable(): void {
        tween(this.title)
            .to(0.5, { scale: Vec3.ONE }, { easing: EasingType.backOut })
            .start();
    }

    Restart() {
        tween(this.title)
            .to(0.5, { scale: Vec3.ZERO }, { easing: EasingType.backIn })
            .call(() => { this.node.active = false; })
            .start();
        MHLX_GameManager.Instance._Play();
    }

    Back() {
        GameManager.Instance.ReturnAndShowMoreGame();
    }

}


