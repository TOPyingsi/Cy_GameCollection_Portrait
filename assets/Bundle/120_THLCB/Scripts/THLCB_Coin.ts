import { _decorator, Component, Node, randomRange, tween, Tween, v3, Vec3 } from 'cc';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { THLCB_MainPanel } from './THLCB_MainPanel';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import { THLCB_AudioManager } from './THLCB_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('THLCB_Coin')
export class THLCB_Coin extends Component {

    price = 0;

    protected onEnable(): void {
        let pos = v3(randomRange(-150, 150), randomRange(-150, 150));
        this.node.setScale(Vec3.ZERO);
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .by(0.5, { position: pos, scale: Vec3.ONE }, { easing: EasingType.quadOut })
            .to(0.5, { worldPosition: THLCB_MainPanel.Instance.coinLabel.node.parent.children[0].getWorldPosition() }, { easing: EasingType.quadIn })
            .call(() => {
                THLCB_AudioManager.Instance._PlaySound(20);
                let num = parseInt(THLCB_MainPanel.Instance.coinLabel.string) + this.price;
                THLCB_MainPanel.Instance.coinLabel.string = num.toString();
                PoolManager.PutNode(this.node);
            })
            .start();
    }

}