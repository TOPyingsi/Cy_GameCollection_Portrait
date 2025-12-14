import { _decorator, Component, EventTouch, math, Node, UITransform, v3 } from 'cc';
import { TouchCtrl } from 'db://assets/Scripts/Framework/Managers/TouchCtrl';
import { SHJWZ_GameMgr } from './SHJWZ_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('SHJWZ_TouchCtrl')
export class SHJWZ_TouchCtrl extends TouchCtrl {


    start(): void {
        this.initData();
        super.start();
    }

    onTouchStart(event: EventTouch): void {

        if (SHJWZ_GameMgr.instance.isTalk) {
            return;
        }

        SHJWZ_GameMgr.instance.playMgrSFX("点击");

        this.node.scale = v3(3, 3, 3);

        super.onTouchStart(event);
    }

    onTouchMove(event: EventTouch, target?: any): void {

        if (SHJWZ_GameMgr.instance.isTalk) {
            return;
        }

        if (this.isTopLayer && this.node.parent !== this.curParent) {
            this.node.scale = v3(3, 3, 3);
        }

        let targetNode = SHJWZ_GameMgr.instance.getCurTarget();

        target = targetNode;

        super.onTouchMove(event, target);
    }

    onTouchEnd(event: EventTouch): void {

        if (SHJWZ_GameMgr.instance.isTalk) {
            return;
        }

        let touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        this.node.parent = this.startParent;

        this.node.position = this.startPos;

        this.node.scale = v3(1, 1, 1);

        this.touchEndEvent(touchPos);

    }

    touchEndEvent(endPos: math.Vec3): void {
        let isIDTrue = (SHJWZ_GameMgr.instance.curID === this.TouchID);

        if (this.isTruePos) {

            if (isIDTrue) {
                console.log("正确");
                SHJWZ_GameMgr.instance.check(true);

                if (SHJWZ_GameMgr.instance.rightNum === 12) {
                    SHJWZ_GameMgr.instance.targetView.setCurrentPageIndex(11);
                }

                this.Right();
            }
            else {
                console.log("错误");
                SHJWZ_GameMgr.instance.wrongNode.worldPosition = endPos;
                SHJWZ_GameMgr.instance.check(false);
            }

        }
        else {

            this.node.parent = this.startParent;

            this.node.position = this.startPos;

            this.node.scale = v3(1, 1, 1);

        }

    }

    public initData(): void {
        this.startPos = this.node.position.clone();
    }

    Right() {

        this.node.parent.active = false;
        this.node.parent.removeFromParent();

        //道具栏删除当前结点
        let content = SHJWZ_GameMgr.instance.targetView.content;
        let uiTrans = content.getComponent(UITransform);
        uiTrans.width -= 250;
        this.node.parent.destroy();

        SHJWZ_GameMgr.instance.targetTsArr[this.TouchID].enabled = false;
        // SHJWZ_GameMgr.instance.touchTsArr[this.TouchID].enabled = false;
    }

}


