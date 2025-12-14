import { _decorator, Component, Node, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('YJDJ_MoveSelf')
export class YJDJ_MoveSelf extends Component {

    sign: number = 1;
    start() {
        if (this.node.name === "蚊子移动") {
            this.MosquitoMove();
            return;
        }
        this.moveSelf();
    }

    moveSelf() {
        tween(this.node)
            .by(1, { scale: v3(0, 0.01 * this.sign, 0) })
            .call(() => {
                this.sign = -this.sign;

                this.moveSelf();

            })
            .start();
    }

    //蚊子移动
    MosquitoMove() {
        tween(this.node)
            .by(1, { position: v3(200 * this.sign, 0, 0) })
            .call(() => {
                this.sign = -this.sign;
                this.node.eulerAngles = this.node.eulerAngles.add(v3(0, 180, 0));
                this.MosquitoMove();

            })
            .start();
    }
}


