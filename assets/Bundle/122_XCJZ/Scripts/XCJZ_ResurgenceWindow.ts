import { _decorator, Component, EventTouch, Label, Node, Sprite, tween, Tween } from 'cc';
import { XCJZ_GameManager } from './XCJZ_GameManager';
import Banner from 'db://assets/Scripts/Banner';
import { XCJZ_EventManager, XCJZ_MyEvent } from './XCJZ_EventManager';
const { ccclass, property } = _decorator;

@ccclass('XCJZ_ResurgenceWindow')
export class XCJZ_ResurgenceWindow extends Component {

    @property(Sprite)
    TimerSprite: Sprite = null;

    @property(Label)
    TimerLabel: Label = null;

    @property
    Timer: number = 9;

    private _curTimer: number = 0;

    Show() {
        this.node.active = true;
        this.StartTimer();
    }

    StartTimer() {
        this._curTimer = this.Timer;
        this.TimerLabel.string = this._curTimer.toString();
        this.schedule(this.CountDown, 1);

        Tween.stopAllByTarget(this.TimerSprite);
        this.TimerSprite.fillRange = 1;
        tween(this.TimerSprite)
            .to(this.Timer, { fillRange: 0 })
            .start();
    }

    EndTimer() {
        this.unschedule(this.CountDown);
        this.node.active = false;
        XCJZ_GameManager.Instance.ShowFailWindow();
    }

    CountDown() {
        this._curTimer--;
        this.TimerLabel.string = this._curTimer.toString();
        if (this._curTimer <= 0) {
            this.EndTimer();
        }
    }

    OnButtonClick(event: EventTouch) {
        switch (event.getCurrentTarget().name) {
            case "继续挑战":
                Banner.Instance.ShowVideoAd(() => {
                    //复活
                    XCJZ_EventManager.Emit(XCJZ_MyEvent.RESURGENCE);
                    XCJZ_GameManager.Instance.ShowUnbeatableWindow();
                    this.node.active = false;
                })
                break;
            case "放弃机会":
                this.node.active = false;
                XCJZ_GameManager.Instance.ShowFailWindow();
                break;
        }
    }


}


