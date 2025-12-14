import { _decorator, Component, Enum, Node, tween, Tween, v3 } from 'cc';
import { NDPA_TRANSITION } from './NDPA_GameConstant';
const { ccclass, property } = _decorator;

@ccclass('NDPA_Transition')
export class NDPA_Transition extends Component {
    @property({ type: Enum(NDPA_TRANSITION) })
    Type: NDPA_TRANSITION;

    protected onEnable(): void {
        switch (this.Type) {
            case NDPA_TRANSITION.SET:
                this.node.scale = v3(0, 0, 0);
                tween(this.node)
                    .to(0.2, { scale: v3(1, 1, 1) }, { easing: `quadIn` })
                    .start();
                break;
            case NDPA_TRANSITION.SHOP:
                tween(this.node)
                    .to(0.1, { scale: v3(1.1, 1.1, 1.1) }, { easing: `quadIn` })
                    .to(0.1, { scale: v3(1, 1, 1) }, { easing: `quadOut` })
                    .start();
                break;
        }

    }
}


