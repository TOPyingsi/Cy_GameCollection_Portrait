import { _decorator, AnimationComponent, Component, director, EventTouch, Node, UITransform, v3, Vec3 } from 'cc';
import { NYSJ_GameManager } from './NYSJ_GameManager';
import { NYSJ_AudioMgr } from './NYSJ_AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('NYSJ_Jiaodai')
export class NYSJ_Jiaodai extends Component {
    @property(Node)
    public SJK: Node = null;
    @property()
    public decorateID: number = 0;

    private startPos: Vec3 = null;

    start() {
        this.scheduleOnce(() => {
            this.startPos = this.node.worldPosition.clone();

            this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
            this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
            this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
            this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        }, 1);

    }

    update(deltaTime: number) {

    }

    touchStart(event: EventTouch) {
        // 获取触摸位置
        const touchPos = event.getUILocation();

        // 设置节点位置
        this.node.worldPosition = v3(touchPos.x, touchPos.y, 0);

        NYSJ_AudioMgr.instance.playEffect("物品");

    }

    touchMove(event: EventTouch) {
        // 获取触摸位置
        const touchPos = event.getUILocation();
        // 计算偏移量
        const offset = new Vec3(touchPos.x, touchPos.y, 0).subtract(this.startPos);
        // 设置节点位置
        this.node.worldPosition = offset.add(this.startPos);

    }

    touchEnd(event: EventTouch) {
        const touchPos = event.getUILocation();
        let uiTrans = this.SJK.getComponent(UITransform);
        let pointX = this.SJK.worldPosition.x - uiTrans.width / 2;
        let pointY = this.SJK.worldPosition.y - uiTrans.height / 2;

        if (touchPos.x >= pointX && touchPos.y >= pointY
            && touchPos.x <= uiTrans.width + pointX
            && touchPos.y <= uiTrans.height + pointY) {

            console.log("碰到手机壳了");
            console.log(NYSJ_GameManager.instance.index);
            //胶带动画
            if (NYSJ_GameManager.instance.index === 2) {
                let anim = this.node.parent.getComponent(AnimationComponent);

                anim.once(AnimationComponent.EventType.FINISHED, this.next, this);

                anim.play();

                NYSJ_AudioMgr.instance.stopEffect();
                NYSJ_AudioMgr.instance.playEffect("撕胶带");

                return;
            }
            if (NYSJ_GameManager.instance.index > 2 && this.node.name != "胶带卷") {
                //贴装饰品,需与Finnal节点的子节点顺序一致
                NYSJ_AudioMgr.instance.right();

                director.getScene().emit("奶油手机_贴装饰", this.decorateID);
                this.node.destroy();
            }

        }
        this.node.worldPosition = this.startPos;
    }

    public next() {
        NYSJ_GameManager.instance.nextStep();
        NYSJ_GameManager.instance.nextClear(2);
    }
}


