import { _decorator, Component, math, Node, NodeEventType, tween, v3 } from 'cc';
import { SHJNWDDY_GameMgr } from './SHJNWDDY_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('SHJNWDDY_Food')
export class SHJNWDDY_Food extends Component {

    @property()
    public foodIndex: number = 0;

    start() {
        this.node.on(NodeEventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(NodeEventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    protected onDestroy(): void {
        this.node.off(NodeEventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(NodeEventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart() {
        tween(this.node)
            .to(0.5, { scale: v3(1.1, 1.1, 1.1) }, { easing: "backOut" })
            .start();
    }

    onTouchMove() {

    }

    onTouchEnd(event: TouchEvent) {
        tween(this.node)
            .to(0.5, { scale: v3(1, 1, 1) }, { easing: "backOut" })
            .start();

        //首次被点击是玩家选择毒药
        //设置玩家毒药和电脑毒药
        if (SHJNWDDY_GameMgr.instance.isFirstClick) {

            SHJNWDDY_GameMgr.instance.initFoodIndex(this.foodIndex);

            this.node.off(NodeEventType.TOUCH_START, this.onTouchStart, this);
            this.node.off(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
            this.node.off(NodeEventType.TOUCH_END, this.onTouchEnd, this);
            this.node.off(NodeEventType.TOUCH_CANCEL, this.onTouchCancel, this);

            return;
        }

        if (!SHJNWDDY_GameMgr.instance.couldClick) {
            return;
        }

        SHJNWDDY_GameMgr.instance.PlayerEatFood(this.node, this.foodIndex);

        SHJNWDDY_GameMgr.instance.couldClick = false;

    }

    onTouchCancel() {
        tween(this.node)
            .to(0.5, { scale: v3(1, 1, 1) }, { easing: "backOut" })
            .start();
    }
}


