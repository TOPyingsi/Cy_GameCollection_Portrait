import { _decorator, Animation, Component, Node } from 'cc';
import { TalkingLarry_GameManager } from './TalkingLarry_GameManager';
const { ccclass, property } = _decorator;

@ccclass('TalkingLarry_AniEvent')
export class TalkingLarry_AniEvent extends Component {

    ani: Animation;

    reviveTime = 0;

    protected onLoad(): void {
        this.ani = this.node.getComponent(Animation);
    }

    SingStop() {
        if (!TalkingLarry_GameManager.Instance.isTouch) {
            this.ani.play("Idle");
            TalkingLarry_GameManager.Instance.audio.stop();
        }
    }

    SingEnd() {
        TalkingLarry_GameManager.Instance.Boom();
    }

    Revive() {
        TalkingLarry_GameManager.Instance.Revive();
    }

    ReviveEnd() {
        this.reviveTime++;
        if (this.reviveTime == 2) {
            TalkingLarry_GameManager.Instance.dontCancel = false;
            this.ani.play("Idle");
            this.reviveTime = 0;
        }
    }

    EatEnd() {
        this.ani.play("Idle");
        TalkingLarry_GameManager.Instance.dontCancel = false;
    }
}


