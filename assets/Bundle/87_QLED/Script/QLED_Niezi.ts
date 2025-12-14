import { _decorator, AnimationComponent, Collider2D, Component, director, EventTouch, ITriggerEvent, Node, UITransform, v2, v3, Vec3 } from 'cc';
import { QLED_GameMgr } from './QLED_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('QLED_Niezi')
export class QLED_Niezi extends Component {

    private jiaodaiNode: Node = null;
    private jiejiaNum: number = 0;

    private startPos: Vec3 = null;
    private isPickup: boolean = false;

    start() {

        this.startPos = this.node.worldPosition.clone();

        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);

        // this.conlider.on("onTriggerEnter", this.onTriggerEnter, this);
    }


    touchStart(event: EventTouch) {
        // 获取触摸位置
        const touchPos = event.getUILocation();

        // 设置节点位置
        this.node.worldPosition = v3(touchPos.x, touchPos.y, 0);

    }

    touchMove(event: EventTouch) {

        //正在夹取
        if (this.isPickup) {
            return;
        }

        // 获取触摸位置
        const touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        // 计算偏移量
        const offset = new Vec3(touchPos.x, touchPos.y, 0).subtract(this.startPos);
        // 设置节点位置
        this.node.worldPosition = offset.add(this.startPos);

        //结痂步骤没到
        if (!QLED_GameMgr.instance.jiejiaStart) {
            return;
        }

        for (let i = 0; i < QLED_GameMgr.instance.jiejiaNodes.length; i++) {

            let obj = QLED_GameMgr.instance.jiejiaMap.get("结痂" + i.toString());

            //未被摘除
            if (!obj[1]) {
                let uiTrans = obj[0].getComponent(UITransform);
                let pointX = obj[0].worldPosition.x - uiTrans.width / 2;
                let pointY = obj[0].worldPosition.y - uiTrans.height / 2;

                if (touchPos.x > pointX
                    && touchPos.y > pointY
                    && touchPos.x < pointX + uiTrans.width
                    && touchPos.y < pointY + uiTrans.height) {

                    obj[1] = true;

                    obj[2].on(AnimationComponent.EventType.FINISHED, () => {

                        this.jiejiaNum++;
                        if (this.jiejiaNum === 9) {
                            QLED_GameMgr.instance.startPlaster();
                        }

                    }, this);

                    obj[2].play();

                    this.isPickup = true;

                    this.node.worldPosition = this.startPos;

                    return;
                }
            }

        }

    }

    touchEnd(event: EventTouch) {

        // this.jiaodaiNode.destroy();
        if (this.jiaodaiNode) {
            this.jiaodaiNode.active = false;
            this.jiaodaiNode = null;
        }

        this.node.worldPosition = this.startPos;

        this.isPickup = false;
    }

}


