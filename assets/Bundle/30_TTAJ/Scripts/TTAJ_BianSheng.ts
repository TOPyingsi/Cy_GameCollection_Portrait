import { _decorator, Animation, animation, Component, EventTouch, find, Node, Sprite, tween, Vec2, Vec3 } from 'cc';
import { TTAJ_GameManager } from './TTAJ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('TTAJ_BianSheng')
export class TTAJ_BianSheng extends Component {
    public startpos: number = null;
    public endpos: number = null;
    public Lenth: number = null;
    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {

    }

    onTouchMove(event: EventTouch) {

    }
    onTouchEnd() {

        this.DongHua();
    }
    DongHua() {

        if (TTAJ_GameManager.Instance.Level1 > 2)
            tween(this.node)
                .call(() => {
                    this.node.children[0].getComponent(Animation).play();
                })
                .delay(0.5)
                .call(() => {
                    this.node.getComponent(Sprite).enabled = false;
                    this.node.children[0].active = false;
                    find("Canvas/背景/无量仙翁/变身").active = true;
                    find("Canvas/放大镜/放大镜/无量仙翁").children[0].active = true;
                    if (find("Canvas/放大镜/放大镜/无量仙翁/麻花") != null) {
                        find("Canvas/放大镜/放大镜/无量仙翁/麻花").active = true;
                    }

                    find("Canvas/放大镜/放大镜/无量仙翁").getComponent(Sprite).enabled = false;
                })
                .start();

    }
}


