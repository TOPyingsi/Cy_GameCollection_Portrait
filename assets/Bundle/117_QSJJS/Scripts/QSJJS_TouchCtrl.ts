import { _decorator, Component, EventTouch, Node, tween, v3, Vec3 } from 'cc';
import { QSJJS_GameMgr } from './QSJJS_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('QSJJS_TouchCtrl')
export class QSJJS_TouchCtrl extends Component {

    private FireEffect: Node = null;
    start() {
        this.FireEffect = this.node.getChildByName("FireEffect");
        this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
    }

    update(deltaTime: number) {

    }

    touchEnd(event: EventTouch) {
        if (QSJJS_GameMgr.instance.GameOver) {
            return;
        }
        this.handAni();
    }

    handAni() {

        tween(this.node)
            .to(0.1, { scale: v3(1, 1.1, 1) })
            .call(() => {
                this.FireEffect.active = true;
                QSJJS_GameMgr.instance.Fire();

                tween(this.node)
                    .to(0.1, { scale: v3(1, 1, 1) })
                    .call(() => {
                        this.FireEffect.active = false;

                    })
                    .start();

            })
            .start();
    }
}


