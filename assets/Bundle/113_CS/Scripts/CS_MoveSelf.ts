import { _decorator, Component, Node, tween, v3 } from 'cc';
import { CS_GameMgr } from './CS_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('CS_MoveSelf')
export class CS_MoveSelf extends Component {

    isScroll: boolean = false;
    start() {
        switch (this.node.name) {
            case "Bg":
                this.isScroll = true;
                break;
            default:
                this.moveSelf();
                break;
        }
    }

    update(deltaTime: number) {
        if (this.isScroll && CS_GameMgr.instance.isScroll) {
            let x = this.node.x - (deltaTime * 200);
            this.node.position = v3(x, this.node.y, this.node.z);

            if (this.node.position.x <= -2934) {
                this.node.position = v3(0, 0, 0);
            }
        }
    }

    sign: number = 1;
    moveSelf() {
        tween(this.node)
            .by(0.5, { scale: v3(0, 0.02 * this.sign, 0) })
            .call(() => {
                this.sign = -this.sign;

                this.moveSelf();

            })
            .start();
    }

    offset: number = 0;
    scrollBg() {


    }
}


