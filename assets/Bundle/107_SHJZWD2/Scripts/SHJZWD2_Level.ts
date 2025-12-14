import { _decorator, Component, Node, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SHJZWD2_Level')
export class SHJZWD2_Level extends Component {

    public isMove: boolean = true;

    sign: number = 1;
    moveSelf() {
        if (!this.isMove) {
            return;
        }

        tween(this.node)
            .by(1, { scale: v3(0.01 * this.sign, 0.01 * this.sign, 0) })
            .call(() => {
                this.sign = -this.sign;

                this.moveSelf();

            })
            .start();

    }

}


