import { _decorator, Component, error, find, Label, Node, Sprite, Tween, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DMM_Timer')
export class DMM_Timer extends Component {
    @property({ displayName: "计时器额外string" })
    ExtraStr: string = "";

    Timer: Label = null;
    TimerIcon: Sprite = null;

    private _timer: number = 0;
    private _curTimer: number = 0;
    private _isRunning: boolean = false; // 标记计时器是否运行
    private _cb: Function = null;
    private _isStart: boolean = false;

    // protected onLoad(): void {

    // }

    // protected start(): void {
    //     this.startCountdown(30);
    // }

    startCountdown(time: number, cb: Function = null) {
        if (this._isStart) return;

        this.Timer = find("计时器/倒计时", this.node).getComponent(Label);
        this.TimerIcon = find("计时器/Icon", this.node).getComponent(Sprite);
        this.node.active = true;
        this._isStart = true;
        this._cb = cb;

        this._timer = time;
        this._curTimer = time;
        this._isRunning = true;
        this.schedule(this.countdown, 1);
        this.TimerIcon.fillRange = 0;
        this.startFillRange();
    }

    countdown() {
        if (this._isRunning) {
            this._curTimer--;
            if (this._curTimer < 0) {
                this._cb && this._cb();
                this.hideSelf();
                return;
            }

            let timerStr: string = "00:";
            if (this._curTimer < 10) {
                timerStr = timerStr + "0" + this._curTimer.toString();
            } else if (this._curTimer < 100) {
                timerStr = timerStr + this._curTimer.toString();
            }
            this.Timer.string = timerStr;
        }
    }

    stopCountdown() {
        this._isRunning = false;
        this.unschedule(this.countdown); // 停止调度
        Tween.stopAllByTarget(this.TimerIcon);
    }

    anewCountdown() {
        this._isRunning = true;
        this.schedule(this.countdown, 1);
        this.startFillRange();
    }

    startFillRange() {
        const rucation: number = this._curTimer;
        tween(this.TimerIcon)
            .to(30, { fillRange: 1 })
            .start();
    }

    hideSelf() {
        this._isStart = false;
        this.node.active = false;
    }
}


