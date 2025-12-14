import { _decorator, Component, EventTouch, Node, NodeEventType, UITransform, v3, Vec3 } from 'cc';
import { TouchCtrl } from 'db://assets/Scripts/Framework/Managers/TouchCtrl';
import { WHFX_GameMgr } from './WHFX_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('WHFX_TouchCtrl')
export class WHFX_TouchCtrl extends TouchCtrl {
    @property(Node)
    oldmanNode: Node = null;

    start() {
        this.initData();
        super.start();
    }

    onTouchStart(event: EventTouch): void {
        super.onTouchStart(event);
    }

    onTouchMove(event: EventTouch): void {
        super.onTouchMove(event);
        // let touchPos = v3(event.getLocation().x, event.getLocation().y, 0);
        // this.touchMoveEvent(touchPos);
    }

    onTouchEnd(event: EventTouch): void {
        super.onTouchEnd(event);
        if (this.isTopLayer) {
            this.node.setSiblingIndex(this.startChildID);
        }

    }

    touchStartEvent(endPos: Vec3): void {
        WHFX_GameMgr.instance.playSFX("拿物品");
    }

    curTarget: Node = null;
    override touchMoveEvent(touchPos: Vec3, target?: any): void {
        if (this.node.name === "钻戒") {
            target = this.oldmanNode;
            let uiTrans = target.getComponent(UITransform);

            let pointX = target.worldPosition.x - uiTrans.width / 2;
            let pointY = target.worldPosition.y - uiTrans.height / 2;

            if (touchPos.x > pointX
                && touchPos.y > pointY
                && touchPos.x < pointX + uiTrans.width
                && touchPos.y < pointY + uiTrans.height) {
                this.isTruePos = true;
                this.curTarget = target;
                // console.log(111);
            }
            else {
                this.isTruePos = false;
                // console.error("错误位置");
            }
            return;
        }
        for (let i = 0; i < WHFX_GameMgr.instance.targets.length; i++) {
            target = WHFX_GameMgr.instance.targets[i];
            let uiTrans = target.getComponent(UITransform);

            let pointX = target.worldPosition.x - uiTrans.width / 2;
            let pointY = target.worldPosition.y - uiTrans.height / 2;

            if (touchPos.x > pointX
                && touchPos.y > pointY
                && touchPos.x < pointX + uiTrans.width
                && touchPos.y < pointY + uiTrans.height) {
                this.isTruePos = true;
                this.curTarget = target;
                // console.log(111);
                break;
            }
            else {
                this.isTruePos = false;
                // console.error("错误位置");
            }
        }

    }
    override touchEndEvent(endPos: Vec3): void {
        if (this.myEventType === 1) {
            console.log("单击");
            switch (this.node.name) {
                case "新窗户1":
                    this.node.active = false;
                    WHFX_GameMgr.instance.initBg();
                    break;
                case "新垃圾桶":
                    this.node.getChildByName("钻戒").active = true;
                    this.node.off(NodeEventType.TOUCH_END, this.onTouchEnd, this);
                    break;
                case "新门":
                    this.node.getChildByName("新门").active = false;
                    this.node.getChildByName("新门开").active = true;
                    WHFX_GameMgr.instance.initCar();
                    break;
                case "西装老头":
                    this.node.children[0].active = false;
                    this.node.children[1].active = true;
                    break;
            }

            return;
        }

        if (this.isTruePos) {
            if (this.node.name === "钻戒") {
                this.node.active = false;
                this.oldmanNode.getChildByName("钻戒").active = true;
                WHFX_GameMgr.instance.getTarget();
                return;
            }

            let index = WHFX_GameMgr.instance.targets.indexOf(this.curTarget);
            WHFX_GameMgr.instance.targets.splice(index, 1);

            this.curTarget.children[0].active = false;
            this.curTarget.children[1].active = true;
            WHFX_GameMgr.instance.getTarget();
            this.node.destroy();
        }
    }
}


