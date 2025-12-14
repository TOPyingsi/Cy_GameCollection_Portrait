import { _decorator, Component, Node, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WHFX_MoveSelf')
export class WHFX_MoveSelf extends Component {
    @property()
    x: number = 0;
    @property()
    y: number = 0;
    @property()
    z: number = 0;

    sign: number = 1;

    start() {
        switch (this.node.name) {
            case "老头":
            case "老奶奶":
                this.manMove();
            default:
                this.moveSelf();
                break;
        }
    }

    update(deltaTime: number) {

    }

    moveSelf() {
        tween(this.node)
            .by(0.1, { eulerAngles: v3(this.x * this.sign, this.y * this.sign, this.z * this.sign) })
            .call(() => {
                this.sign = -this.sign;
                this.moveSelf();
            })
            .start();
    }

    manSign: number = 1;
    manMove() {
        tween(this.node)
            .by(0.7, { scale: v3(0, 0.05 * this.manSign, 0) })
            .call(() => {
                this.manSign = -this.manSign;
                this.manMove();
            })
            .start();
    }
}


