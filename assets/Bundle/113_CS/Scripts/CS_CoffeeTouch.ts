import { _decorator, AnimationComponent, Component, EventTouch, Node, ProgressBar, sp, v3 } from 'cc';
import { CS_GameMgr } from './CS_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('CS_CoffeeTouch')
export class CS_CoffeeTouch extends Component {

    public countBar: ProgressBar = null;
    public chargeBar: ProgressBar = null;

    public isStartCharge: boolean = false;

    public isConuting: boolean = true;

    public CountDown: number = 45;
    public chargeTime: number = 0;

    public isStartGame: boolean = false;

    start() {
        if (CS_GameMgr.instance.gameType === "木棍人") {
            return;
        }

        this.countBar = this.node.getChildByName("TimerBar").getComponent(ProgressBar);
        this.chargeBar = this.node.getChildByName("ChargeBar").getComponent(ProgressBar);

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.isStartCharge = true;
        this.isStartGame = true;
    }

    protected update(dt: number): void {
        if (!this.isStartGame) {
            return;
        }

        if (CS_GameMgr.instance.isGameOver) {
            return;
        }

        if (CS_GameMgr.instance.gameType === "咖啡女王") {
            if (!this.isConuting) {
                return;
            }

            this.CountDown -= dt;

            if (this.countBar.progress > 0) {
                this.countBar.progress = this.CountDown / 45;
            }
            else {
                this.countBar.progress = 0;
            }

            if (this.isStartCharge) {
                this.chargeTime += dt / 10;

                let hand = CS_GameMgr.instance.woodTarget.getChildByName("手持");
                hand.eulerAngles = hand.eulerAngles.add(v3(0, 0, 0.12));

                this.chargeBar.progress = this.chargeTime;

                if (this.chargeBar.progress >= 1) {
                    this.chargeBar.progress = 1;
                    this.chargeBar.node.active = false;
                    CS_GameMgr.instance.WoodWin();
                }
            }

        }
    }

    onTouchStart(event: EventTouch) {

    }

    onTouchMove(event: EventTouch) {

    }

    isPauseClick: boolean = false;
    onTouchEnd(event: EventTouch) {
        if (this.isPauseClick) {
            return;
        }

        this.isPauseClick = true;
        this.isConuting = false;

        this.refreshWood();

        CS_GameMgr.instance.onCoffeeTouch();

        //回头暂停倒计时和清空蓄力
        this.scheduleOnce(() => {
            this.isConuting = true;
            this.isPauseClick = false;
            this.startCharge();

            let woodAni = CS_GameMgr.instance.woodTarget.getComponent(sp.Skeleton);
            woodAni.setAnimation(0, "zoulu", true);

            let coffeeAni = CS_GameMgr.instance.coffeeTarget.getComponent(AnimationComponent);
            coffeeAni.play("卡布奇诺走路");

            CS_GameMgr.instance.woodTarget.getChildByName("手持").active = true;

            CS_GameMgr.instance.isScroll = true;

        }, 2.2);
    }

    //开始蓄力
    startCharge() {
        this.isStartCharge = true;
    }

    //重置蓄力
    refreshWood() {
        this.isStartCharge = false;

        this.chargeTime = 0;

        this.chargeBar.progress = 0;

        let hand = CS_GameMgr.instance.woodTarget.getChildByName("手持");
        hand.eulerAngles = v3(0, 0, -18);
    }

    off() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}


