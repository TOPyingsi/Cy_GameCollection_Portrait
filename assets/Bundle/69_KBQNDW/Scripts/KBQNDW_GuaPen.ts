import { _decorator, Component, EventTouch, Input, input, log, Node, UITransform, Vec2 } from 'cc';
import { KBQNDW_GlobalDt } from './KBQNDW_GlobalDt';
const { ccclass, property } = _decorator;

@ccclass('KBQNDW_GuaPen')
export class KBQNDW_GuaPen extends Component {
    @property({ tooltip: "滑动最小距离（像素）" })
    minSwipeDistance: number = 50;

    private touchStartPos: Vec2 | null = null;
    private touchStartTime: number = 0;

    onLoad() {
        // 注册触摸事件
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onDestroy() {
        // 移除事件监听
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event: EventTouch) {
        let transform = this.node.getComponent(UITransform)
        if (!transform.getBoundingBoxToWorld().contains(event.getUILocation())) {
            return;
        }
        this.touchStartPos = event.getLocation();
        this.touchStartTime = Date.now();
    }

    onTouchEnd(event: EventTouch) {
        this.processSwipe(event);
    }

    onTouchCancel(event: EventTouch) {
        this.processSwipe(event);
    }

    private processSwipe(event: EventTouch) {
        if (!this.touchStartPos) return;

        const touchEndPos = event.getLocation();
        const delta = new Vec2(touchEndPos.x - this.touchStartPos.x, touchEndPos.y - this.touchStartPos.y);

        // 判断滑动距离是否达标
        if (delta.length() >= this.minSwipeDistance) {
            this.detectSwipeDirection(delta);
        }

        this.touchStartPos = null;
    }

    private detectSwipeDirection(delta: Vec2) {
        const absX = Math.abs(delta.x);
        const absY = Math.abs(delta.y);

        // 判断主导滑动方向（增加对角线方向的检测）
        if (absX > absY) {
            if (delta.x > 0) {
                console.log("向右滑动");
                // 触发自定义事件：this.node.emit('swipe-right');
            } else {
                console.log("向左滑动");
            }
        } else {
            if (delta.y > 0) {
                console.log("向上滑动");
                let n:Node = this.node.parent.getChildByName("xigua");
                n.active = true;
                let n1 = this.node.parent.getChildByName("xi");
                KBQNDW_GlobalDt.Instance.addTriggerN(n1);
            } else {
                console.log("向下滑动");
            }
        }

        // 可选：检测对角线方向
        if (absX > this.minSwipeDistance * 0.7 && absY > this.minSwipeDistance * 0.7) {
            if (delta.x > 0 && delta.y > 0) console.log("右上滑动");
            else if (delta.x > 0 && delta.y < 0) console.log("右下滑动");
            else if (delta.x < 0 && delta.y > 0) console.log("左上滑动");
            else if (delta.x < 0 && delta.y < 0) console.log("左下滑动");
        }
    }
}


