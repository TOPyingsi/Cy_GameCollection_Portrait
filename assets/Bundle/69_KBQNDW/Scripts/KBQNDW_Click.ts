import { _decorator, Component, EventTouch, input, Input, log, Node, UITransform } from 'cc';
import { KBQNDW_GlobalDt } from './KBQNDW_GlobalDt';
const { ccclass, property } = _decorator;

@ccclass('KBQNDW_Click')
export class KBQNDW_ChuangHu extends Component {
    @property({ tooltip: "双击时间间隔（毫秒）" })
    doubleClickInterval: number = 300;

    @property({ tooltip: "单击延迟（毫秒）" })
    clickDelay: number = 200;

    private lastClickTime: number = 0;
    private clickTimer: number | null = null;
    private playArea: Node;

    onLoad() {
        this.playArea = this.node.parent;
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        if (this.clickTimer) clearTimeout(this.clickTimer);
    }

    onTouchStart(event: EventTouch) {
        let transform = this.node.getComponent(UITransform)
        if (!transform.getBoundingBoxToWorld().contains(event.getUILocation())) {
            return;
        }

        const now = Date.now();

        if (now - this.lastClickTime < this.doubleClickInterval) {
            // 取消之前的单击定时器
            if (this.clickTimer) {
                clearTimeout(this.clickTimer);
                this.clickTimer = null;
            }

            this.onDoubleClick(event);
            this.lastClickTime = 0;
        } else {
            this.lastClickTime = now;

            // 设置单击定时器
            this.clickTimer = setTimeout(() => {
                this.onSingleClick(event);
                this.clickTimer = null;
            }, this.clickDelay);
        }
    }

    onSingleClick(event: EventTouch) {

        if (this.node.name === "men") {
            this.playArea.getChildByName("浴室").active = true;
            let n: Node = this.playArea.getChildByName("gangling");
            n.active = true;
            // KBQNDW_GlobalDt.Instance.addTriggerN(n);

        }
        else if (this.node.name === "dianshi") {
            let n: Node = this.playArea.getChildByName("jiejie");
            n.active = true;
            KBQNDW_GlobalDt.Instance.addTriggerN(n);
        } else {
            return;
        }

    }

    onDoubleClick(event: EventTouch) {
        if (this.node.name === "window") {
            this.playArea.getChildByName("窗户").active = true;
            this.playArea.getChildByName("飞机鳄鱼").active = true;
            let n: Node = this.playArea.getChildByName("飞机鳄鱼");
            KBQNDW_GlobalDt.Instance.addTriggerN(n);
        } else {
            return;
        }

    }
}


