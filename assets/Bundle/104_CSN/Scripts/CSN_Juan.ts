import { _decorator, Color, Component, director, Mask, Node, rect, Rect, Sprite, UITransform, v3, Vec2, Vec3 } from 'cc';
import { CSN_GameMgr } from './CSN_GameMgr';
import { RoleType } from '../../61_AISHJTZ/Script/AISHJTZ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('CSN_Juan')
export class CSN_Juan extends Mask {
    @property()
    public isLock: boolean = true;
    @property()
    public maskIndex: number = 0;

    @property(Node)
    juanNode: Node = null;

    ticketNode: UITransform;

    isWrong: boolean = false;
    isFinish: boolean = false;

    JinDuTiao: Sprite = null;
    startPos: Vec3 = null;
    start() {

        // this.node.on(Node.EventType.TOUCH_START, this.touchStartEvent, this);
        // this.node.on(Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
        this.startPos = this.juanNode.worldPosition.clone();

        this.ticketNode = this.node.children[0].getComponent(UITransform);

        this.JinDuTiao = this.ticketNode.getComponent(Sprite);

        director.getScene().on("炒酸奶_开始卷", this.TouchMove, this);
        director.getScene().on("炒酸奶_结束卷", this.touchEnd, this);

        // this.node.on(Node.EventType.TOUCH_START, this.TouchStart, this);
        // this.node.on(Node.EventType.TOUCH_MOVE, this.TouchMove, this);
    }

    height: number = 0;
    curPercent: number = 0;
    /**
     * 处理触摸移动事件
     * @param pos - 触摸位置，使用 Vec3 对象表示
     * @param offsetX - 相对于触摸位置的X轴偏移量，默认为0
     * @param offsetY - 相对于触摸位置的Y轴偏移量，默认为0
     */
    touchMoveEvent(pos: Vec3, index: number, offsetX: number = 0, offsetY: number = 0) {
        if (this.isFinish) {
            return;
        }
        if (this.isWrong) {
            return;
        }

        if (!this.juanNode.active) {
            this.juanNode.active = true;
        }

        let offset = pos.subtract(this.startPos.clone());

        let curHeight = pos.y - this.startPos.y + 50;

        this.height = curHeight - this.startPos.y;

        let percent = - (this.height / this.ticketNode.height) - 3;

        if (percent < this.curPercent) {
            this.JinDuTiao.fillRange = percent;
            this.juanNode.worldPosition = this.startPos.clone().add(v3(0, offset.y, 0));

            if (percent <= 0.1) {
                this.JinDuTiao.fillRange = 0;
                this.isFinish = true;
                CSN_GameMgr.instance.juanNum++;

                this.juanNode.position = v3(this.juanNode.position.x, -250, this.juanNode.position.z);

                console.log(CSN_GameMgr.instance.juanNum);

                if (CSN_GameMgr.instance.juanNum >= 7) {
                    CSN_GameMgr.instance.level++;
                    CSN_GameMgr.instance.finnalInit();
                }

                this.curPercent = percent;

                return;
            }
        }
        this.curPercent = percent;
    }

    /**
     * 处理触摸开始事件
     * 
     * 此函数将触摸位置转换到节点的本地空间，并根据偏移量调整位置，然后调用clearMask方法清除该位置的遮罩
     * 主要用于在触摸开始时，根据触摸位置更新游戏中的遮罩状态
     * 
     * @param event 触摸事件对象，包含触摸的位置信息
     * @param offsetX x轴上的偏移量，默认为0，用于调整触摸位置
     * @param offsetY y轴上的偏移量，默认为0，用于调整触摸位置
     */
    public TouchStart(event, index: number, offsetX: number = 0, offsetY: number = 0) {
        if (this.isLock) {
            return;
        }
        if (this.maskIndex !== index) {
            return;
        }

        // this.touchStartEvent(point, offsetX, offsetY);
    }

    /**
     * 处理触摸移动事件，以刮卡片效果
     * @param event 触摸事件对象
     * @param offsetX X轴偏移量，默认为0
     * @param offsetY Y轴偏移量，默认为0
     */
    public TouchMove(event, index: number, offsetX: number = 0, offsetY: number = 0) {
        if (this.isLock) {
            return;
        }

        if (this.isFinish) {
            return;
        }

        if (this.maskIndex !== index) {
            this.isWrong = true;
            return;
        }
        else {
            this.isWrong = false;
        }

        this.touchMoveEvent(event, offsetX, offsetY);
        // 输出刮开比例
        // console.log("刮开比例" + (this.ClearRate * 100).toFixed(1) + "%");
    }

    public touchEnd() {
        if (this.isLock) {
            return;
        }

        if (this.isWrong) {
            return;
        }

        if (!this.isFinish) {
            return;
        }
        else {
            this.isLock = true;


        }

    }

}


