import { _decorator, Component, director, EventTouch, math, Node, ParticleSystem2D, v3 } from 'cc';
import { TouchCtrl } from 'db://assets/Scripts/Framework/Managers/TouchCtrl';
import { XMT_GameMgr } from './XMT_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('XMT_TouchCtrl')
export class XMT_TouchCtrl extends TouchCtrl {

    isRe: boolean = false;

    protected onEnable(): void {
    }

    cancel() {
        console.log(1111);
        this.node.worldPosition = this.startPos;
        this.isRe = true;
    }

    onTouchMove(event: EventTouch, target?: any): void {
        if (this.isRe) {
            return;
        }

        target = XMT_GameMgr.instance.targetNodes[this.TouchID];

        super.onTouchMove(event, target);
    }

    touchStartEvent(endPos: math.Vec3): void {

        XMT_GameMgr.instance.playSFX("物品");

        switch (this.TouchID) {
            case 0:
            case 4:
            case 5:
                let particle2D = this.node.getChildByName("Particle2D").getComponent(ParticleSystem2D);
                particle2D.node.active = true;
                particle2D.resetSystem();
                break;
            default:
                break;
        }

    }

    touchEndEvent(endPos: math.Vec3): void {

        switch (this.TouchID) {
            case 0:
            case 4:
            case 5:
                let particle2D = this.node.getChildByName("Particle2D").getComponent(ParticleSystem2D);
                particle2D.node.active = false;
                particle2D.stopSystem();
                break;
            case 3:
                if (this.isTruePos) {
                    XMT_GameMgr.instance.targetNodes[2].active = false;
                    XMT_GameMgr.instance.targetNodes[3].active = true;
                    XMT_GameMgr.instance.nextLevel();
                }
                break;
            default:
                break;
        }

        this.isRe = false;
        director.getScene().emit("修马蹄_结束修");
    }

    DrawMask(touchPos: math.Vec3): void {
        director.getScene().emit("修马蹄_开始修", touchPos, this.TouchID);
    }

    ClearMask(touchPos: math.Vec3): void {
        director.getScene().emit("修马蹄_开始修", touchPos, this.TouchID);
    }
}


