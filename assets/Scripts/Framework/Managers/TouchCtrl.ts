import { _decorator, Component, director, Enum, EventTouch, Node, NodeEventType, UITransform, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export enum myEventType {
    "None" = -1,
    "单击触发" = 1,
    "双击触发" = 2,
    "长按触发" = 3,
    "拖拽触发" = 4,
    "拖拽松开触发" = 5,
    "拖拽消除遮罩" = 6,
    "拖拽显示遮罩" = 7,
    "拖拽移动" = 8

}

@ccclass('TouchCtrl')
export class TouchCtrl extends Component {
    //道具ID
    @property()
    public TouchID: number = 0;
    //是否解锁
    @property()
    public isLock: boolean = true;
    @property()
    public couldMove: boolean = true;
    @property()
    public isTopLayer: boolean = false;
    //偏移X
    @property()
    public OffsetX: number = 0;
    //偏移Y
    @property()
    public OffsetY: number = 0;
    //清除遮罩事件的画笔宽度
    @property()
    public LineWidth: number = 50;
    //绘画完成最大比例
    @property()
    public drawMax: number = 40;
    //清除完成最大比例
    @property()
    public clearMax: number = 55;

    @property({ type: Enum(myEventType), displayName: "事件类型" })
    public myEventType: myEventType = myEventType.None;

    protected currentTime: number = 0;
    protected lastTouchTime: number = 0;
    protected doubleClickInterval: number = 250; // 双击间隔时间，单位为毫秒

    protected isTruePos: boolean = false;

    protected startPos: Vec3 = null;
    protected startChildID: number = null;

    protected longPressTime: number = 0;

    start() {
        if (this.isTopLayer) {
            this.TopLayer();
        }

        switch (this.myEventType) {
            case -1:
                return;
            case 1:
                this.node.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
                break;

            case 2:
                this.node.on(NodeEventType.TOUCH_START, this.onTouchStart, this);
                this.node.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
                break;

            case 3:
                break;
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                this.node.on(NodeEventType.TOUCH_START, this.onTouchStart, this);
                this.node.on(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
                this.node.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
                this.node.on(NodeEventType.TOUCH_CANCEL, this.onTouchEnd, this);
                break;

        }

        this.childrenInit();

        console.log("注销触摸事件");

    }

    public initData() {
        this.startPos = this.node.worldPosition.clone();
        this.startChildID = this.node.getSiblingIndex();
    }

    onTouchStart(event: EventTouch) {
        if (!this.couldMove) {
            return;
        }
        if (this.isTopLayer) {
            this.node.parent = this.curParent;
        }

        if (this.myEventType === 2) {
            this.currentTime = new Date().getTime();
            const timeDiff = this.currentTime - this.lastTouchTime;

            if (timeDiff > 0 && timeDiff < this.doubleClickInterval) {
                this.onDoubleClick();
                return;
            }

            this.lastTouchTime = this.currentTime;
        }

        let touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        this.node.worldPosition = touchPos;

        this.touchStartEvent(touchPos);
    }

    onTouchMove(event: EventTouch, target?: any) {
        if (!this.couldMove) {
            return;
        }

        if (this.isTopLayer && this.node.parent !== this.curParent) {
            this.node.parent = this.curParent;
        }

        //触摸点
        let touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        //偏移
        let offset = touchPos.subtract(this.startPos);
        //更新结点位置
        this.node.worldPosition = offset.add(this.startPos);

        this.touchMoveEvent(touchPos, target);
    }

    onTouchEnd(event: EventTouch) {
        if (!this.couldMove) {
            return;
        }

        if (this.isTopLayer) {
            this.node.parent = this.startParent;
        }

        if (this.myEventType === 2) {
            const timeDiff = this.currentTime - this.lastTouchTime;

            if (timeDiff > 0 && timeDiff < this.doubleClickInterval) {
                // this.lastTouchTime = this.currentTime;
                return;
            }
            this.lastTouchTime = this.currentTime;
        }

        let touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        if (this.myEventType === 1 || this.myEventType === 8) {
            this.touchEndEvent(touchPos);
            return;
        }

        this.node.worldPosition = this.startPos;

        this.touchEndEvent(touchPos);
    }

    //触摸取消
    onTouchCancel(event: EventTouch) {

    }

    //开始触摸事件接口
    touchStartEvent(endPos: Vec3) {

    }

    /*触摸移动事件接口*/
    touchMoveEvent(touchPos: Vec3, target?: any) {

        touchPos = touchPos.add(v3(this.OffsetX, this.OffsetY, 0));

        if (target) {
            let uiTrans = target.getComponent(UITransform);

            let pointX = target.worldPosition.x - uiTrans.width / 2;
            let pointY = target.worldPosition.y - uiTrans.height / 2;

            if (touchPos.x > pointX
                && touchPos.y > pointY
                && touchPos.x < pointX + uiTrans.width
                && touchPos.y < pointY + uiTrans.height) {
                this.isTruePos = true;

                if (this.myEventType === 6) {
                    this.ClearMask(touchPos);
                }

                if (this.myEventType === 7) {
                    this.DrawMask(touchPos);
                }

            }
            else {
                this.isTruePos = false;
            }
        }
    }


    /*触摸结束事件接口*/
    touchEndEvent(endPos: Vec3) {

    }

    //清除接口
    ClearMask(touchPos: Vec3) {

    }

    //绘画接口
    DrawMask(touchPos: Vec3) {

    }

    startParent: Node = null;
    curParent: Node = null;
    //将结点设置为最顶层接口
    TopLayer() {
        this.startParent = this.node.parent;
        this.curParent = director.getScene().getChildByName("Canvas").getChildByName("GameArea");
    }

    //双击接口
    onDoubleClick() {

    }

    //长按接口
    LongClick() {

    }

    //子类初始化接口
    childrenInit() {

    }

    protected onEnable(): void {
        this.start();
    }

    protected onDisable(): void {
        this.node.off(NodeEventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(NodeEventType.TOUCH_CANCEL, this.onTouchEnd, this);
        console.log("注销触摸事件");
    }
}


