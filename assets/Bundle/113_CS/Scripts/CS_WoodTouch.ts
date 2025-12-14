import { _decorator, Component, director, EventTouch, Node, ProgressBar, v3 } from 'cc';
import { CS_GameMgr } from './CS_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('CS_WoodTouch')
export class CS_WoodTouch extends Component {

    public progressBar: ProgressBar = null;

    public isStartCharge: boolean = false;

    second: number = 0;
    start() {
        if (CS_GameMgr.instance.gameType === "咖啡女王") {
            return;
        }

        this.progressBar = this.node.getComponentInChildren(ProgressBar);

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    gameTimer: number = 0;
    timer: number = 0;
    protected update(dt: number): void {
        if (CS_GameMgr.instance.isGameOver) {
            return;
        }

        if (this.gameTimer < 45) {
            this.gameTimer += dt;

            if (this.gameTimer >= 45) {
                this.gameTimer = 45;
                director.getScene().emit("刺杀_木棍人可赢");
                console.log("木棍人可赢");
            }
        }

        if (this.isStartCharge) {

            this.timer += dt / 10;

            // console.log(this.timer);

            CS_GameMgr.instance.onWoodTouch();

            this.progressBar.progress = this.timer;

            if (this.progressBar.progress >= 1) {
                this.progressBar.progress = 1;
                this.progressBar.node.active = false;
                CS_GameMgr.instance.WoodWin();
            }
        }
    }

    onTouchStart(event: EventTouch) {
        this.isStartCharge = true;
    }

    onTouchMove(event: EventTouch) {

    }

    onTouchEnd(event: EventTouch) {
        this.isStartCharge = false;
        this.timer = 0;
        this.progressBar.progress = 0;
        CS_GameMgr.instance.onWoodTouchEnd();
    }

    off() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

}


