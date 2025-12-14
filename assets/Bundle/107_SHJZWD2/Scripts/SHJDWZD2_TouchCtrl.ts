import { _decorator, Component, EventTouch, math, Node } from 'cc';
import { TouchCtrl } from 'db://assets/Scripts/Framework/Managers/TouchCtrl';
import { SHJZWD2_GameMgr } from './SHJZWD2_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('SHJDWZD2_TouchCtrl')
export class SHJDWZD2_TouchCtrl extends TouchCtrl {

    onTouchMove(event: EventTouch, target?: any): void {
        let levelNode = SHJZWD2_GameMgr.instance.levelNodes[4];
        target = levelNode.children[0].children[0];
        super.onTouchMove(event, target);
    }

    touchEndEvent(endPos: math.Vec3): void {
        if (this.TouchID === 0) {
            this.node.children[0].active = true;
        }

        if (this.TouchID === 4) {
            if (this.isTruePos) {
                let levelNode = SHJZWD2_GameMgr.instance.levelNodes[4];
                levelNode.children[0].children[0].children[0].active = true;
            }
            else {
                this.node.worldPosition = this.startPos;
            }

        }

    }
}


