import { _decorator, Component, Node, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WNJF_MoveSelf')
export class WNJF_MoveSelf extends Component {

    start() {

        if (this.node.name === "抖动") {
            this.douMove();
            return;
        }

        this.moveSelf();

    }

    sign = 1;
    moveSelf() {
        tween(this.node)
            .by(0.7, { scale: v3(0, 0.02 * this.sign, 0) })
            .call(() => {
                this.sign = -this.sign;

                this.moveSelf();

            })
            .start();
    }

    douSign = 1;
    douMove() {
        tween(this.node)
            .by(0.3, { eulerAngles: v3(0, 0, 10 * this.douSign) })
            .call(() => {
                this.douSign = -this.douSign;

                this.douMove();

            })
            .start();

    }
}


