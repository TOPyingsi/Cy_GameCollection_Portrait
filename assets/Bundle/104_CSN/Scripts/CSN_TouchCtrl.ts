import { _decorator, animation, AnimationComponent, Color, Component, director, EventTouch, Node, UITransform, v3, Vec3 } from 'cc';
import { CSN_GameMgr } from './CSN_GameMgr';
import CSN_ClearMask from './CSN_ClearMask';
import { CSN_Juan } from './CSN_Juan';
import { TouchCtrl } from 'db://assets/Scripts/Framework/Managers/TouchCtrl';
const { ccclass, property } = _decorator;

@ccclass('CSN_TouchCtrl')
export class CSN_TouchCtrl extends TouchCtrl {

    @property(Color)
    color: Color = new Color();

    public couldMove: boolean = false;

    onTouchStart(event: EventTouch): void {
        if (CSN_GameMgr.instance.gameOver) {
            return;
        }

        if (this.TouchID === 0 || this.TouchID === 1) {
            this.couldMove = true;
        }

        if (this.TouchID === 3 && this.isLock) {
            return;
        }

        super.onTouchStart(event);
    }

    touchStartEvent(endPos: Vec3): void {
        if (CSN_GameMgr.instance.gameOver) {
            return;
        }

    }

    onTouchMove(event: EventTouch, target?: any): void {
        if (CSN_GameMgr.instance.gameOver) {
            return;
        }

        if (this.ForceReset && this.TouchID === 4) {
            this.ForceReset = false;
        }

        if (this.ForceReset) {
            return;
        }

        let flag1 = this.TouchID === 8 || this.TouchID === 9;
        if (flag1 && !this.couldMove) {
            return;
        }

        if (this.TouchID === 4 && this.isLock) {
            return;
        }

        if (this.TouchID === 5) {
            if (CSN_GameMgr.instance.juanNum === 7) {
                this.node.worldPosition = this.startPos;
                this.node.active = false;
                return;
            }
            target = CSN_GameMgr.instance.stepNodes[4];
            super.onTouchMove(event, target);

            if (this.isTruePos) {
                CSN_GameMgr.instance.showMilk();
                this.node.active = false;
            }

            return;
        }

        target = CSN_GameMgr.instance.targets[this.TouchID];
        super.onTouchMove(event, target);
    }

    curID: number = -1;
    touchMoveEvent(touchPos: Vec3, target?: any): void {
        if (CSN_GameMgr.instance.gameOver) {
            return;
        }

        if (this.TouchID === 4) {

            touchPos.add(v3(this.OffsetX, this.OffsetY, 0));

            for (let i = 0; i < CSN_GameMgr.instance.juanTargets.length; i++) {
                let node = CSN_GameMgr.instance.juanTargets[i];

                let uiTrans = node.getComponent(UITransform);

                let pointX = node.worldPosition.x - uiTrans.width / 2;
                let pointY = node.worldPosition.y - uiTrans.height / 2;

                if (touchPos.x > pointX
                    && touchPos.y > pointY
                    && touchPos.x < pointX + uiTrans.width
                    && touchPos.y < pointY + uiTrans.height) {
                    this.isTruePos = true;

                    console.log("碰到第" + i + "个");

                    this.curID = i;

                    director.getScene().emit("炒酸奶_开始卷", touchPos, this.curID);

                }
                else {
                    this.isTruePos = false;
                }
            }
        }
        else {
            let flag1 = this.TouchID === 8 || this.TouchID === 9;

            if (flag1) {
                target = CSN_GameMgr.instance.stepNodes[4];
                super.touchMoveEvent(touchPos, target);

                return;
            }
            super.touchMoveEvent(touchPos, target);

        }
    }

    onTouchEnd(event: EventTouch): void {
        if (CSN_GameMgr.instance.gameOver) {
            return;
        }

        if (this.ForceReset) {
            return;
        }

        if (this.TouchID === 4 && this.isLock) {
            return;
        }
        let flag1 = this.TouchID === 8 || this.TouchID === 9;

        if (flag1 && this.isTruePos) {

            let target = CSN_GameMgr.instance.stepNodes[4];

            if (this.TouchID === 8) {
                target.children[target.children.length - 2].active = true;
            }
            else {
                target.children[target.children.length - 1].active = true;
            }

            CSN_GameMgr.instance.win();

        }
        super.onTouchEnd(event);

    }

    touchEndEvent(touchPos: Vec3): void {
        if (this.isLock) {
            return;
        }

        let target = CSN_GameMgr.instance.targets;
        let props = CSN_GameMgr.instance.propsTs;

        // if (this.TouchID === 1 || this.TouchID === 3) {
        //     director.getScene().emit("炒酸奶_结束绘画");
        // }

        if (this.isTruePos) {
            switch (this.TouchID) {
                case 0:

                    let clearTs = target[this.TouchID + 2].getComponent(CSN_ClearMask);
                    clearTs.isLock = false;

                    this.node.active = false;

                    let ani = CSN_GameMgr.instance.getComponent(AnimationComponent);

                    ani.once(AnimationComponent.EventType.FINISHED, () => {
                        CSN_GameMgr.instance.propsTs[1].isLock = false;
                        CSN_GameMgr.instance.changeLevel0();
                    }, this);

                    ani.play("milk");

                    CSN_GameMgr.instance.nextStep();
                    break;
                case 2:
                    director.getScene().emit("炒酸奶_更换颜色", this.color);
                    CSN_GameMgr.instance.nextStep();

                    break;
                case 4:
                    director.getScene().emit("炒酸奶_结束卷");
                    break;

            }

        }

    }

    ClearMask(touchPos: Vec3): void {
        if (this.isLock) {
            return;
        }
        let juan = CSN_GameMgr.instance.juanTargets;

        let clearTs = juan[this.curID].getComponent(CSN_Juan);

        console.log("开始卷");
        director.getScene().emit("炒酸奶_开始卷", touchPos, this.curID);

    }

    DrawMask(touchPos: Vec3): void {
        if (this.isLock) {
            return;
        }
        let target = CSN_GameMgr.instance.targets;

        let clearTs = target[this.TouchID + 1].getComponent(CSN_ClearMask);

        clearTs.LineWidth = this.LineWidth;
        clearTs.drawMax = this.drawMax;
        clearTs.clearMax = this.clearMax;

        director.getScene().emit("炒酸奶_开始绘画", touchPos, this.TouchID);

    }

    ForceReset: boolean = false;
    resetProp() {
        // console.log("强制重置");
        if (this.TouchID !== 3) {
            this.ForceReset = true;
        }
        director.getScene().emit("炒酸奶_结束绘画");
        this.node.worldPosition = this.startPos;
    }

    start(): void {
        super.start();
        super.initData();
        director.getScene().on("炒酸奶_强制下一关", (propName: number) => {
            if (propName === this.TouchID) {
                console.log(this.node.name);
                this.resetProp();
            }
        }, this);
    }

    protected override onEnable(): void {
        if (this.TouchID !== 3) {
            super.start();
        }
    }

    ReOn() {
        super.start();
    }
}


