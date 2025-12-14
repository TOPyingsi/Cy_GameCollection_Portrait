import { _decorator, Component, Node, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NYSJ_Shine')
export class NYSJ_Shine extends Component {
    @property()
    scale: number = 1;
    @property()
    interval: number = 2;

    private sign: number = 1;
    start() {
        this.shine();
    }

    shine() {
        tween(this.node)
            .by(this.interval, { scale: v3(this.scale * this.sign, this.scale * this.sign, this.scale * this.sign) }, { easing: "backOut" })
            .call(() => {
                this.sign = -this.sign;
                this.shine();
            })
            .start();
    }
}


