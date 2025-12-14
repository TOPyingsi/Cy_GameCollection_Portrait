import { _decorator, AnimationComponent, Component, EventTouch, UITransform, v3, Vec3 } from 'cc';
import { TouchCtrl } from 'db://assets/Scripts/Framework/Managers/TouchCtrl';
import { WNJF_GameMgr } from './WNJF_GameMgr';
import { RoleType } from '../../61_AISHJTZ/Script/AISHJTZ_GameManager';
import { TimerControl } from 'db://assets/Scripts/Framework/Managers/TimerControl';
const { ccclass, property } = _decorator;

@ccclass('WNJF_TouchCtrl')
export class WNJF_TouchCtrl extends TouchCtrl {

    @property()
    public isWrongProp: boolean = false;

    @property()
    public couldInteract: boolean = true;

    @property()
    public isRightProp: boolean = false;

    @property()
    public weightNum: number = 0;
    start() {
        super.initData();

        super.start();
    }

    onTouchStart(event: EventTouch): void {
        if (WNJF_GameMgr.instance.isTalk) {
            return;
        }

        super.onTouchStart(event);

        //双击隐藏汉堡顶层
        if (this.node.name === "汉堡包") {
            this.currentTime = new Date().getTime();
            const timeDiff = this.currentTime - this.lastTouchTime;

            if (timeDiff > 0 && timeDiff < this.doubleClickInterval) {
                this.onDoubleClick();
                return;
            }

            this.lastTouchTime = this.currentTime;
        }

    }

    onTouchMove(event: EventTouch, target?: any): void {
        if (WNJF_GameMgr.instance.isTalk) {
            return;
        }

        if (this.isWrongProp || this.isRightProp) {
            target = WNJF_GameMgr.instance.PlayerNode;
        }


        super.onTouchMove(event, target);

    }

    onTouchEnd(event: EventTouch): void {
        if (WNJF_GameMgr.instance.isTalk) {
            return;
        }

        super.onTouchEnd(event);

        if (this.TouchID === 0) {
            const timeDiff = this.currentTime - this.lastTouchTime;

            if (timeDiff > 0 && timeDiff < this.doubleClickInterval) {
                // this.lastTouchTime = this.currentTime;
                return;
            }
            this.lastTouchTime = this.currentTime;
        }

    }

    touchStartEvent(touchPos: Vec3, target?: any): void {
        WNJF_GameMgr.instance.playMgrSFX("拿物品");
    }

    touchMoveEvent(touchPos: Vec3, target?: any): void {
        super.touchMoveEvent(touchPos, target);
    }

    touchEndEvent(endPos: Vec3): void {
        if (!this.couldInteract) {
            return;
        }

        if (this.node.name === "底层") {
            this.node.setSiblingIndex(0);
        }

        if (this.isTruePos) {
            if (this.isRightProp) {
                console.log("成功");

                this.node.active = false;

                let name = this.node.name;
                if (name === "梨子" || name === "苹果" || name === "蔬菜") {
                    WNJF_GameMgr.instance.playMgrSFX("吃");
                }

                WNJF_GameMgr.instance.Right(this.node.name, this.weightNum);
                return;

            }
            if (this.isWrongProp) {
                console.log("失败");

                this.node.active = false;

                WNJF_GameMgr.instance.Wrong();
                return;

            }
        }

        //判断是否碰撞到需要合成的道具,返回节点
        let target = this.isHitOther(endPos);
        let targetTs = target?.getComponent(WNJF_TouchCtrl);

        if (target) {
            let flag = false;
            //具体判断是哪些道具的合成
            switch (target.name) {
                case "梨子":

                    flag = this.isTouchSame(target, targetTs);
                    if (flag && !this.isComplex) {
                        WNJF_GameMgr.instance.isTalk = true;

                        this.node.active = false;

                        WNJF_GameMgr.instance.playSFX("浇水音效");
                    }

                    break;
                case "电视机":
                    flag = this.isTouchSame(target, targetTs);
                    if (flag && !this.isComplex) {
                        this.node.active = false;

                        WNJF_GameMgr.instance.playSFX("电视机音效");
                    }

                    break;
                case "太阳":
                    flag = this.isTouchSame(target, targetTs);
                    if (flag && !this.isComplex) {
                        this.node.active = false;

                        this.scheduleOnce(() => {
                            WNJF_GameMgr.instance.playSFX("火箭炸音效");
                        }, 0.5);
                    }
                    break;

                case "仙人掌":
                    flag = this.isTouchSame(target, targetTs);
                    if (flag && !this.isComplex) {
                        this.node.active = false;

                        // WNJF_GameMgr.instance.playSFX("火箭炸音效");
                    }
                    break;

                case "狗":
                    if (targetTs.TouchID === this.TouchID) {
                        WNJF_GameMgr.instance.playMgrSFX("放物品");

                        target.getChildByName(this.node.name).active = true;
                        this.node.active = false;

                        if (target.children[1].active && target.children[2].active) {
                            targetTs.couldMove = true;
                            targetTs.couldInteract = true;
                            targetTs.isRightProp = true;

                            target.name = "狗完成";
                        }
                    }

                    break;

                case "2":
                    break;
            }

        }
    }

    isComplex: boolean = false;
    isTouchSame(target: any, targetTs: any) {
        if (this.isComplex) {
            return;
        }
        if (targetTs.TouchID === this.TouchID) {

            this.playAni(target.name, target);

            return true;
        }
        return false;
    }

    playAni(aniName: string, target: any) {
        WNJF_GameMgr.instance.ani.once(AnimationComponent.EventType.FINISHED, () => {
            if (target.name === "梨子") {
                WNJF_GameMgr.instance.isTalk = false;
            }

            if (target.name !== "电视机") {
                target.children.splice(0, 1);
                target.children[0].active = true;
            }

            let touchTs = null;
            if (target.name === "电视机") {
                touchTs = target.children[1].getComponent(WNJF_TouchCtrl);
            }
            else {
                touchTs = target.children[0].getComponent(WNJF_TouchCtrl);
            }

            touchTs.couldMove = true;
            touchTs.initData();

            this.isComplex = true;
            touchTs.isComplex = true;
        });

        WNJF_GameMgr.instance.ani.play(aniName);
    }

    isHitOther(touchPos: Vec3) {
        for (let i = 0; i < WNJF_GameMgr.instance.complexProps.length; i++) {
            touchPos = touchPos.add(v3(this.OffsetX, this.OffsetY, 0));

            let target = WNJF_GameMgr.instance.complexProps[i];
            let uiTrans = target.getComponent(UITransform);

            let pointX = target.worldPosition.x - uiTrans.width / 2;
            let pointY = target.worldPosition.y - uiTrans.height / 2;

            if (touchPos.x > pointX
                && touchPos.y > pointY
                && touchPos.x < pointX + uiTrans.width
                && touchPos.y < pointY + uiTrans.height) {

                return WNJF_GameMgr.instance.complexProps[i];

            }

        }

        return null;
    }

    onDoubleClick(): void {

        this.node.children[2].destroy();

        let component = this.node.getComponent(WNJF_TouchCtrl);
        component.enabled = false;

        for (let i = 0; i < this.node.children.length; i++) {
            let touchTs = this.node.children[i].getComponent(WNJF_TouchCtrl);
            touchTs.couldMove = true;
            touchTs.node.worldPosition = touchTs.startPos;
        }
    }
}


