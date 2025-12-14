import { _decorator, Component, EventTouch, math, Node, Sprite, SpriteFrame } from 'cc';
import { TouchCtrl } from 'db://assets/Scripts/Framework/Managers/TouchCtrl';
import { SHJDMM_GameMgr } from './SHJDMM_GameMgr';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SHJDMM_TouchCtrl')
export class SHJDMM_TouchCtrl extends TouchCtrl {

    @property(SpriteFrame)
    public spriteFrame1: SpriteFrame = null;

    @property(SpriteFrame)
    public spriteFrame2: SpriteFrame = null;

    @property()
    needFlip: boolean = false;

    private flip: boolean = false;

    start(): void {
        this.initData();
        super.start();
    }

    currentTime: number = 0;
    lastTouchTime: number = 0;
    doubleClickInterval: number = 250;
    onTouchStart(event: EventTouch): void {
        if (!SHJDMM_GameMgr.instance.couldHide) {
            return;
        }

        SHJDMM_GameMgr.instance.plsySFX("点击");

        if (this.needFlip) {

            this.currentTime = new Date().getTime();
            const timeDiff = this.currentTime - this.lastTouchTime;

            if (timeDiff > 0 && timeDiff < this.doubleClickInterval) {
                this.onDoubleClick();
                return;
            }
        }

        super.onTouchStart(event);
    }

    onTouchMove(event: EventTouch, target?: any): void {
        if (!SHJDMM_GameMgr.instance.couldHide) {
            return;
        }

        let level = SHJDMM_GameMgr.instance.level;

        let levelMgr = SHJDMM_GameMgr.instance.levelNodes[level];

        let levelNode = levelMgr.getChildByName("check").children;

        target = levelNode[this.TouchID];

        super.onTouchMove(event, target);
    }

    onTouchEnd(event: EventTouch): void {
        if (!SHJDMM_GameMgr.instance.couldHide) {
            return;
        }

        if (this.needFlip) {
            const timeDiff = this.currentTime - this.lastTouchTime;

            if (timeDiff > 0 && timeDiff < this.doubleClickInterval) {
                // this.lastTouchTime = this.currentTime;
                return;
            }

            this.lastTouchTime = this.currentTime;

        }

        super.onTouchEnd(event);
    }

    touchEndEvent(endPos: math.Vec3): void {
        if (SHJDMM_GameMgr.instance.level === 1 && this.needFlip && !this.flip) {
            SHJDMM_GameMgr.instance.check[this.TouchID] = false;
            return;
        }

        if (this.isTruePos) {
            SHJDMM_GameMgr.instance.check[this.TouchID] = true;
        }
        else {
            SHJDMM_GameMgr.instance.check[this.TouchID] = false;
        }

        console.log(SHJDMM_GameMgr.instance.check);
    }

    onDoubleClick(): void {

        let sprite = this.node.getComponent(Sprite);

        if (this.flip) {
            sprite.spriteFrame = this.spriteFrame1;
        }
        else {
            sprite.spriteFrame = this.spriteFrame2;
        }

        this.flip = !this.flip;

    }
}


