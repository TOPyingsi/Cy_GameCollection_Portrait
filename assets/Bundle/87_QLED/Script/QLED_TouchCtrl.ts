import { _decorator, Camera, Collider, Collider2D, Component, director, EventTouch, geometry, ITriggerEvent, Node, PhysicsSystem, RaycastResult2D, UITransform, v3, Vec3 } from 'cc';
import { QLED_GameMgr } from './QLED_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('QLED_TouchCtrl')
export class QLED_TouchCtrl extends Component {
    // @property(Node)
    // public SJK: Node = null;

    @property()
    public clearIndex: number = 0;

    //记录初始位置
    private startPos: Vec3 = new Vec3();

    private isWrong: boolean = false;

    private clearNode: Node = null;


    start() {
        this.startPos = this.node.worldPosition.clone();

        if (this.clearIndex === 1) {
            this.clearNode = QLED_GameMgr.instance.clearNodes[this.clearIndex + 2].parent.parent;
        }
        else {
            this.clearNode = QLED_GameMgr.instance.clearNodes[this.clearIndex + 2];
        }

        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);

    }

    update(deltaTime: number) {

    }

    touchStart(event: EventTouch) {
        // 获取触摸位置
        const touchPos = event.getUILocation();

        // 设置节点位置
        this.node.worldPosition = v3(touchPos.x, touchPos.y, 0);

        this.isWrong = false;
    }

    touchMove(event: EventTouch) {
        if (this.isWrong) {
            return;
        }
        // 获取触摸位置
        const touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        // 计算偏移量
        const offset = new Vec3(touchPos.x, touchPos.y, 0).subtract(this.startPos);
        // 设置节点位置
        this.node.worldPosition = offset.add(this.startPos);

        let uiTrans = this.clearNode.getComponent(UITransform);
        let pointX = this.clearNode.worldPosition.x - uiTrans.width / 2;
        let pointY = this.clearNode.worldPosition.y - uiTrans.height / 2;

        if (touchPos.x >= pointX && touchPos.y >= pointY
            && touchPos.x <= uiTrans.width + pointX
            && touchPos.y <= uiTrans.height + pointY) {
            // console.log("碰到耳朵了");

            director.getScene().emit("清理耳朵_开始清理", touchPos, this.clearIndex);


        }

    }

    touchEnd(event: EventTouch) {

        QLED_GameMgr.instance.audio.stop();

        director.getScene().emit("清理耳朵_清理结束");
        // NYSJ_AudioMgr.instance.stopEffect();

        this.node.worldPosition = this.startPos;
    }

}


