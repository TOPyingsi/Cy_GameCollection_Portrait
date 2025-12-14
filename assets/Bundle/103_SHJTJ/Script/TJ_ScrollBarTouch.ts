import { _decorator, Component, Node, Vec2, EventTouch, UITransform, Vec3, v3, find, ScrollView, v2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TJ_ScrollBarTouch')
export class TJ_ScrollBarTouch extends Component {

    start() {
        this.node.on(Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }
    onDestroy() {
        this.node.off(Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }
    update(deltaTime: number) {

    }
    x = 1;
    _onTouchMove(event: EventTouch) {
        //获取一下当前的滚动视图的可滚动的最大偏移量
        let scrollView = find("Canvas/GameArea/ScrollView").getComponent(ScrollView);

        scrollView.vertical = true;


        let delta = event.getDelta().y;//移动的距离
        if (delta > 0) {

            if (this.x <= 1) {
                this.x = this.x + 0.01;
                scrollView.scrollTo(v2(0, this.x));
            }

        } else {
            if (this.x >= 0) {
                this.x = this.x - 0.01;
                scrollView.scrollTo(v2(0, this.x));
            }

        }

        scrollView.vertical = false;

    }

    _onTouchEnd(event: EventTouch){

    }
}