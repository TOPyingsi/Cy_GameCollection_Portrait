import { _decorator, Component, math, Node, tween, UIOpacity, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZJAB_Effect')
export class ZJAB_Effect extends Component {
    UIOpacity: UIOpacity = null;

    @property({ displayName: `距离` })
    Dis: number = 0;

    @property({ displayName: `时间` })
    Time: number = 0;


    protected onLoad(): void {
        this.UIOpacity = this.getComponent(UIOpacity);
    }

    init(angle: number) {
        const targetPos = this.node.getWorldPosition().clone().add3f(Math.cos(angle) * this.Dis, Math.sin(angle) * this.Dis, 0)
        tween(this.node)
            .to(this.Time, { worldPosition: targetPos }, { easing: `sineOut` })
            .start();
        tween(this.node)
            .to(this.Time, { angle: 360 }, { easing: `sineOut` })
            .start();
        tween(this.UIOpacity)
            .to(this.Time, { opacity: 100 }, { easing: `sineIn` })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}


