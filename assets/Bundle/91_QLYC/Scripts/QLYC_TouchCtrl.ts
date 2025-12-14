import { _decorator, Component, director, EventTouch, Node, UITransform, v3, Vec3 } from 'cc';
import { QLYC_GameMgr } from './QLYC_GameMgr';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
// import { QLED_GameMgr } from './QLED_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('QLYC_TouchCtrl')
export class QLYC_TouchCtrl extends Component {
    // @property(Node)
    // public SJK: Node = null;

    @property()
    public clearIndex: number = 0;

    //记录初始位置
    private startPos: Vec3 = new Vec3();

    private isWrong: boolean = false;

    private clearNode: Node = null;


    start() {
        this.startPos = this.node.position.clone();

        this.clearNode = QLYC_GameMgr.instance.clearNodes[this.clearIndex];

        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);

        director.getScene().on("清理牙齿_强制结束", this.touchEnd, this);
    }

    touchStart(event: EventTouch) {
        QLYC_GameMgr.instance.playSFX("物品");

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

            director.getScene().emit("清理牙齿_开始清理", touchPos, this.clearIndex);

            if (this.clearIndex == 0) {
                QLYC_GameMgr.instance.playEffect("牙结石");
            }
            else {
                QLYC_GameMgr.instance.playEffect("刷牙");
            }
        }

    }

    touchEnd(event: EventTouch) {
        QLYC_GameMgr.instance.stopSFX();

        director.getScene().emit("清理牙齿_清理结束");

        this.node.position = this.startPos;
    }

}


