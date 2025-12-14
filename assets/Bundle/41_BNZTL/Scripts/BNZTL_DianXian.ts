import { _decorator, Component, EventTouch, find, Node, Sprite, Vec2, Vec3 } from 'cc';
import { BNZTL_GameManager } from './BNZTL_GameManager';
const { ccclass, property } = _decorator;

@ccclass('BNZTL_DianXian')
export class BNZTL_DianXian extends Component {
    private startpos: Vec2;
    private endpos: Vec2;
    @property(Node)
    DianXianCanva: Node = null;
    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    start() {

    }

    onTouchStart(event: EventTouch) {
        this.startpos = event.getUILocation();

    }
    onTouchMove(event: EventTouch) {

    }
    onTouchEnd(event: EventTouch) {
        this.endpos = event.getUILocation();
        this.Distance();
        if (this.node.name != "抽屉") {
            BNZTL_GameManager.Instance._gameSence += 1;
            this.node.getComponent(BNZTL_DianXian).enabled = false;
            this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }

    }
    Distance() {




        this.DianXianCanva.active = true;
        this.node.getComponent(Sprite).enabled = false;
        BNZTL_GameManager.Instance.Music(0);

    }

}


