import { _decorator, Component, Node, randomRange, tween, Tween, v3, Vec3 } from 'cc';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { SHJCB_MainPanel } from './SHJCB_MainPanel';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import { SHJCB_AudioManager } from './SHJCB_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_Coin')
export class SHJCB_Coin extends Component {

    price = 0;

    protected onEnable(): void {
        let pos = v3(randomRange(-150, 150), randomRange(-150, 150));
        this.node.setScale(Vec3.ZERO);
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .by(0.5, { position: pos, scale: Vec3.ONE }, { easing: EasingType.quadOut })
            .to(0.5, { worldPosition: SHJCB_MainPanel.Instance.coinLabel.node.parent.children[0].getWorldPosition() }, { easing: EasingType.quadIn })
            .call(() => {
                SHJCB_AudioManager.Instance._PlaySound(20);
                let num = parseInt(SHJCB_MainPanel.Instance.coinLabel.string) + this.price;
                SHJCB_MainPanel.Instance.coinLabel.string = num.toString();
                PoolManager.PutNode(this.node);
            })
            .start();
    }

}