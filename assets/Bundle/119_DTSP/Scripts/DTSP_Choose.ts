import { _decorator, AnimationComponent, Button, Component, director, Label, Node, Sprite } from 'cc';
import { DTSP_GameMgr } from './DTSP_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('DTSP_Choose')
export class DTSP_Choose extends Component {
    @property()
    PlayerID: number = 1;

    public rightBtn: Button = null;
    public rightEffect: Node = null;
    public rightSp: Sprite = null;
    public wrongBtn: Button = null;
    public wrongEffect: Node = null;
    public wrongSp: Sprite = null;

    public questionArray: { Question: string, Answer: boolean }[] = [];
    public questionLabel: Label = null;

    private timer: number = 0;
    private timerLabel: Label = null;
    private timerEffect: Node = null;

    start() {
        this.initData();
        director.getScene().on("答题赛跑_开始倒计时", this.StartTimer, this);
        director.getScene().on("答题赛跑_停止倒计时", this.StopTimer, this);
        director.getScene().on("答题赛跑_下一题", this.nextQuestion, this);
    }

    update(deltaTime: number) {

    }

    isStartTimer: boolean = false;
    nextQuestion() {
        if (this.isStartTimer) {
            return;
        }

        this.isStartTimer = true;

        this.restart();
        DTSP_GameMgr.Instance.Player1.restart();
        DTSP_GameMgr.Instance.Player2.restart();

        if (this.questionArray.length > 0) {
            this.questionLabel.string = this.questionArray[0].Question;
            this.StartTimer();
        } else {
            switch (DTSP_GameMgr.Instance.Winner()) {
                case 1:
                    // 玩家1胜利

                    break;
                case 2:
                    // 玩家2胜利
                    break;
                case 3:
                    // 平局
                    break;
            }
            this.node.active = false;
            return;
        }

        this.questionArray.shift();

    }

    public restart() {
        this.rightBtn.enabled = true;
        this.wrongBtn.enabled = true;
        this.rightEffect.active = false;
        this.wrongEffect.active = false;
        this.timerEffect.active = false;
    }

    updateTimer() {
        this.timer += 1;
        if (this.timer > 10) {
            this.timer = 0;
            let ani = this.timerEffect.getComponent(AnimationComponent);
            ani.stop();
            this.StopTimer();
            DTSP_GameMgr.Instance.TimeOver();
            return;
        }

        this.timerLabel.string = (10 - this.timer).toFixed(0).toString();
        if (this.timer >= 7) {
            this.timerEffect.active = true;
            DTSP_GameMgr.Instance.playSFX("嘀");
            let ani = this.timerEffect.getComponent(AnimationComponent);
            ani.play();
        }

        if (this.timer >= 10) {
            if (this.rightBtn.enabled && this.wrongBtn.enabled) {
                director.getScene().emit("答题赛跑_自动选择");
            }
        }
    }

    StartTimer() {
        this.schedule(this.updateTimer, 1);
    }

    StopTimer() {
        this.unschedule(this.updateTimer);
        this.isStartTimer = false;
    }

    initData() {
        let timerLabelNode = this.node.getChildByName("Timer").getChildByName("TimerLabel");
        this.timerLabel = timerLabelNode.getComponent(Label);
        this.timerEffect = this.node.getChildByName("Timer").getChildByName("Effect");

        this.rightBtn = this.node.getChildByName("RightBtn").getComponent(Button);
        this.wrongBtn = this.node.getChildByName("WrongBtn").getComponent(Button);

        this.rightEffect = this.rightBtn.node.getChildByName("Effect");
        this.wrongEffect = this.wrongBtn.node.getChildByName("Effect");

        this.rightSp = this.rightBtn.node.getComponent(Sprite);
        this.wrongSp = this.wrongBtn.node.getComponent(Sprite);

        this.questionLabel = this.node.getChildByName("Question").getChildByName("Label").getComponent(Label);

        switch (this.PlayerID) {
            case 1:
                let arr = Array.from(DTSP_GameMgr.Instance.QuestionData).splice(0, 5);
                this.questionArray = arr;
                break;
            case 2:
                let arr2 = Array.from(DTSP_GameMgr.Instance.QuestionData).splice(5, 5);
                this.questionArray = arr2;
                break;
        }

    }
}


