import { _decorator, Camera, Collider, Collider2D, Component, director, EventTouch, geometry, ITriggerEvent, Node, PhysicsSystem, RaycastResult2D, UITransform, v3, Vec3 } from 'cc';
import { NYSJ_AudioMgr } from './NYSJ_AudioMgr';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('NYSJ_TouchCtrl')
export class NYSJ_TouchCtrl extends Component {
    @property(Node)
    public SJK: Node = null;

    @property()
    public clearIndex: number = 0;

    //记录初始位置
    private startPos: Vec3 = new Vec3();

    private isWrong: boolean = false;

    start() {
        this.scheduleOnce(() => {
            this.startPos = this.node.worldPosition.clone();

            this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
            this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
            this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
            this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);

            director.getScene().on("奶油手机_步骤错误", () => {
                this.isWrong = true;

                this.node.worldPosition = this.startPos;
            }, this);

            director.getScene().on("奶油手机_强制下一关", (propID: number) => {
                if (propID === this.clearIndex) {
                    this.resetProp();
                }
            }, this);
        }, 1);

    }

    update(deltaTime: number) {

    }

    ForceReset: boolean = false;
    touchStart(event: EventTouch) {
        if (this.ForceReset) {
            return;
        }
        // 获取触摸位置
        const touchPos = event.getUILocation();

        // 设置节点位置
        this.node.worldPosition = v3(touchPos.x, touchPos.y, 0);

        this.isWrong = false;
    }

    touchMove(event: EventTouch) {
        if (this.ForceReset) {
            return;
        }
        if (this.isWrong) {
            return;
        }
        // 获取触摸位置
        const touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        // 计算偏移量
        const offset = new Vec3(touchPos.x, touchPos.y, 0).subtract(this.startPos);
        // 设置节点位置
        this.node.worldPosition = offset.add(this.startPos);

        let uiTrans = this.SJK.getComponent(UITransform);
        let pointX = this.SJK.worldPosition.x - uiTrans.width / 2;
        let pointY = this.SJK.worldPosition.y - uiTrans.height / 2;

        if (touchPos.x >= pointX && touchPos.y >= pointY
            && touchPos.x <= uiTrans.width + pointX
            && touchPos.y <= uiTrans.height + pointY) {
            console.log("碰到手机壳了");

            director.getScene().emit("擦手机壳_开始清灰", touchPos, this.clearIndex);

        }

    }

    touchEnd(event: EventTouch) {
        director.getScene().emit("擦手机壳_清灰结束");
        NYSJ_AudioMgr.instance.stopEffect();

        this.node.worldPosition = this.startPos;
    }

    resetProp() {
        console.log("强制重置");
        this.ForceReset = true;
        director.getScene().emit("擦手机壳_清灰结束");
        NYSJ_AudioMgr.instance.stopEffect();
        this.node.worldPosition = this.startPos;

        if (this.clearIndex === 7) {
            this.node.active = false;
        }
    }
}


