import { _decorator, Component, EventTouch, Label, Node, Sprite, tween, Tween } from 'cc';
import { XCJZ_GameManager } from './XCJZ_GameManager';
import Banner from 'db://assets/Scripts/Banner';
import { XCJZ_EventManager, XCJZ_MyEvent } from './XCJZ_EventManager';
const { ccclass, property } = _decorator;


@ccclass('XCJZ_UnbeatableWindow')
export class XCJZ_UnbeatableWindow extends Component {

    @property(Sprite)
    TimerSprite: Sprite = null;

    @property(Label)
    TimerLabel: Label = null;

    @property
    Timer: number = 9;

    private _curTimer: number = 0;

    Show() {
        this.node.active = true;
        this._curTimer = this.Timer;
        this.TimerLabel.string = this._curTimer.toString();
    }

    StartTimer() {
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
        XCJZ_GameManager.Instance.IsUnbeatable = false;
    }

    CountDown() {
        this._curTimer--;
        this.TimerLabel.string = this._curTimer.toString();
        if (this._curTimer <= 0) {
            this.EndTimer();
        }
    }
}


