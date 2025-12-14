import { _decorator, Component, EventTouch, Node, tween, UITransform, v3, Vec3 } from 'cc';
import { BLXXPT_GameMgr, BLXXPT_PuzzleData } from './BLXXPT_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('BLXXPT_Puzzle')
export class BLXXPT_Puzzle extends Component {

    public flip: boolean = false;

    public puzzleIndex: number = 0;

    private puzzleData: BLXXPT_PuzzleData = null;

    private startPos: Vec3 = new Vec3();

    private currentTime: number = 0;
    private lastTouchTime: number = 0;
    private doubleClickInterval: number = 250; // 双击间隔时间，单位为毫秒

    private chirdrenIndex: number = 0;


    start() {

        this.startPos = this.node.worldPosition.clone();

        this.chirdrenIndex = this.node.getSiblingIndex();

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

    }

    onTouchStart(event: EventTouch) {
        BLXXPT_GameMgr.instance.playSFX("点击");

        let chirdrenLength = this.node.children.length;
        this.node.setSiblingIndex(chirdrenLength - 1);

        this.currentTime = new Date().getTime();
        const timeDiff = this.currentTime - this.lastTouchTime;

        if (timeDiff > 0 && timeDiff < this.doubleClickInterval) {
            this.onDoubleClick();
            return;
        }

        this.lastTouchTime = this.currentTime;

        // //获取触摸位置
        // let touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        // //设置节点位置
        // this.node.worldPosition = touchPos;

    }

    onTouchMove(event: EventTouch) {

        // 获取触摸位置
        const touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        // 计算偏移量
        const offset = v3(touchPos.x, touchPos.y, 0).subtract(this.startPos);
        // 设置节点位置
        this.node.worldPosition = offset.add(this.startPos);

        this.isTouchRight(touchPos);
    }

    onTouchEnd(event: EventTouch) {
        const timeDiff = this.currentTime - this.lastTouchTime;

        if (timeDiff > 0 && timeDiff < this.doubleClickInterval) {
            // this.lastTouchTime = this.currentTime;
            return;
        }

        this.lastTouchTime = this.currentTime;

        if (this.puzzleData) {

            //拼图正确
            if (this.puzzleData.isRight) {

                //显示拼图
                this.puzzleData.uiOpacity.opacity = 255;
                //隐藏当前拼图
                this.node.active = false;

                //删除已完成拼图减少循环遍历次数
                BLXXPT_GameMgr.instance.puzzleMap.delete(this.puzzleData.name);

                BLXXPT_GameMgr.instance.puzzles.splice(this.puzzleData.index, 1);

                //获得拼图
                BLXXPT_GameMgr.instance.getPuzzle();

                BLXXPT_GameMgr.instance.playSFX("正确")

                this.node.worldPosition = this.startPos;

                return;
            }


        }

        if (timeDiff > 0 && timeDiff < this.doubleClickInterval) {
            // this.lastTouchTime = this.currentTime;
            return;
        }

        this.node.worldPosition = this.startPos;

        this.node.setSiblingIndex(this.chirdrenIndex - 1);

        // 获取触摸位置
        const touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        // 计算偏移量
        const offset = v3(touchPos.x, touchPos.y, 0).subtract(this.startPos);

        console.log(offset.length());

        let width = this.getComponent(UITransform).width;
        let height = this.getComponent(UITransform).height;

        if (offset.length() < width / 2 || offset.length() < height / 2) {
            return;
        }

        BLXXPT_GameMgr.instance.playSFX("复位");
    }

    isTouchRight(touchPos: Vec3) {
        let length = BLXXPT_GameMgr.instance.puzzles.length;

        for (let i = 0; i < length; i++) {
            let puzzleData = BLXXPT_GameMgr.instance.puzzleMap.get(this.node.name);

            if (this.puzzleIndex !== puzzleData.index) {
                continue;
            }
            else {
                this.puzzleData = puzzleData;
            }

            let uiTrans = puzzleData.puzzle.getComponent(UITransform);
            let pointX = puzzleData.puzzle.worldPosition.x - uiTrans.width / 2;
            let pointY = puzzleData.puzzle.worldPosition.y - uiTrans.height / 2;

            if (touchPos.x > pointX
                && touchPos.y > pointY
                && touchPos.x < pointX + uiTrans.width
                && touchPos.y < pointY + uiTrans.height) {

                if (this.flip) {
                    return;
                }
                puzzleData.isRight = true;
                puzzleData.puzzle.active = true;
            }
            else {
                puzzleData.isRight = false;
                puzzleData.puzzle.active = false;
            }

        }

    }

    private isFliping: boolean = false;

    onDoubleClick() {

        if (this.isFliping) {
            return;
        }

        this.isFliping = true;

        console.log("双击事件触发");

        tween(this.node)
            .by(0.8, { eulerAngles: v3(0, 180, 0) })
            .call(() => {
                this.flip = !this.flip;
                this.isFliping = false;
                BLXXPT_GameMgr.instance.playSFX("翻转结束");

            })
            .start();
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}


