import { _decorator, AudioClip, Component, director, Label, Node, PhysicsSystem2D, Prefab, tween, UIOpacity, v3 } from 'cc';
import { DTSP_Player } from './DTSP_Player';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('DTSP_GameMgr')
export class DTSP_GameMgr extends Component {
    @property(Prefab)
    answer: Prefab = null;

    @property({ type: [AudioClip] })
    clips: AudioClip[] = [];

    @property(DTSP_Player)
    Player1: DTSP_Player = null;

    @property(DTSP_Player)
    Player2: DTSP_Player = null;

    public map: Node = null;
    public mapMask: UIOpacity = null;
    public titleNode: Node = null;

    public level: number = -1;
    public speed: number = 250;
    public height: number = 2340;
    public length: number = 0;

    public isGameStart: boolean = false;

    public isGameOver: boolean = false;

    public QuestionData: { Question: string, Answer: boolean }[] = [
        { Question: "荆轲刺秦王刺的是白起", Answer: false },
        { Question: "李白是唐朝诗人", Answer: true },
        { Question: "秦始皇是中国历史上第一位皇帝", Answer: true },
        { Question: "所有的金属都能被磁铁吸引", Answer: false },
        { Question: "鲸鱼是一种鱼类", Answer: false },
        { Question: "所有细菌都得人体有害", Answer: false },
        { Question: "地球上海洋的面积大约占地球总表面积的70%", Answer: true },
        { Question: "指南针、火药、造纸术和活字印刷术是中国的“四大发明”", Answer: true },
        { Question: "热气球之所以能升空，是因为它里面的空气比外面的空气温度高", Answer: true },
        { Question: "《水浒传》是中国四大名著之一，描写了三国时期的历史故事", Answer: false },
    ]

    private airWall: Node = null;

    public static Instance: DTSP_GameMgr = null;

    start() {
        DTSP_GameMgr.Instance = this;

        // PhysicsSystem2D.instance.debugDrawFlags = 1;
        PhysicsSystem2D.instance.enable = true;

        GamePanel.Instance._answerPrefab = this.answer;
        GamePanel.Instance.time

        this.playBGM("赛跑");
        this.playSFX("倒计时");

        this.airWall = this.node.getChildByName("AirWall");
        this.mapMask = this.node.getChildByName("地图遮罩").getComponent(UIOpacity);

        this.map = this.node.getChildByName("bg");
        this.length = this.map.children[0].children.length * this.height - 1970;

        this.titleNode = this.node.getChildByName("题目");

        this.scheduleOnce(() => {
            this.isGameStart = true;
            this.showTitle();
            director.getScene().emit("答题赛跑_开始");
            this.node.getChildByName("选择1").active = true;
            this.node.getChildByName("选择2").active = true;
        }, 4);
    }

    update(deltaTime: number) {
        if (!this.isGameStart) {
            return;
        }

        if (this.isGameOver) {
            return;
        }

        if (this.map.children[0].position.y < this.length) {
            let offset = v3(0, this.speed * deltaTime, 0);
            let pos = this.map.children[0].position.add(offset);
            this.map.children[0].setPosition(pos);
        }
        else {
            let offset = v3(0, -this.speed * deltaTime, 0);

            let pos1 = this.Player1.node.position.add(offset);
            this.Player1.node.setPosition(pos1);

            let pos2 = this.Player2.node.position.add(offset);
            this.Player2.node.setPosition(pos2);
        }
    }

    showTitle() {
        this.titleNode.active = true;
        let label = this.titleNode.getChildByName("Label").getComponent(Label);
        label.string = "第 " + (this.level + 2).toString() + " 题";

        let prosceesLabel = this.node.getChildByName("暂停").getChildByName("label").getComponent(Label);
        prosceesLabel.string = (this.level + 2).toString() + " / 5";

        tween(this.titleNode)
            .to(0.5, { scale: v3(0.7, 0.7, 0.7) }, { easing: "backOut" })
            .start();

        this.scheduleOnce(() => {
            tween(this.titleNode)
                .to(0.5, { scale: v3(0, 0, 0) }, { easing: "backOut" })
                .call(() => {
                    this.airWall.active = false;
                    this.titleNode.active = false;
                    this.nextLevel();
                })
                .start();
        }, 1.5);
    }

    Sprint() {

    }

    over: boolean = false;
    TimeOver() {
        if (this.over) {
            return;
        }
        this.over = true;

        this.Player1.talk.node.active = false;
        this.Player2.talk.node.active = false;

        let answer1 = this.QuestionData[this.level].Answer;
        let answer2 = this.QuestionData[this.level + 5].Answer;

        let flag1 = this.Player1.choose === answer1 ? true : false;
        let flag2 = this.Player2.choose === answer2 ? true : false;

        if (flag1 && !flag2) {
            this.Player1.rightEffect.active = true;
            this.Player2.wrongEffect.active = true;
        }
        else if (!flag1 && flag2) {
            this.Player1.wrongEffect.active = true;
            this.Player2.rightEffect.active = true;
        }
        else if (!flag1 && !flag2) {
            this.Player1.wrongEffect.active = true;
            this.Player2.wrongEffect.active = true;
        }
        else {
            this.Player1.rightEffect.active = true;
            this.Player2.rightEffect.active = true;
        }

        this.scheduleOnce(() => {
            this.Judgement(flag1, flag2);
            tween(this.mapMask)
                .to(0.5, { opacity: 255 }, { easing: "backOut" })
                .start();
        }, 2);

        this.scheduleOnce(() => {
            tween(this.mapMask)
                .to(0.5, { opacity: 0 }, { easing: "backOut" })
                .start();

            if (this.level >= 4) {
                director.getScene().emit("答题赛跑_下一题");
                return;
            }

            this.showTitle();
        }, 6.5);
    }

    showFinnal() {

        let finnal = this.node.getChildByName("Finnal");
        finnal.active = true;

        let label1 = finnal.getChildByName("狮子胜利").getChildByName("结果").getComponent(Label);
        let label2 = finnal.getChildByName("猴子胜利").getChildByName("结果").getComponent(Label);

        label1.string = "答对题目：" + this.Player1.RightNum.toString()
            + "道\n答错题目：" + (5 - this.Player1.RightNum).toString() + "道";

        label2.string = "答对题目：" + this.Player2.RightNum.toString()
            + "道\n答错题目：" + (5 - this.Player2.RightNum).toString() + "道";

        if (this.Player1.RightNum > this.Player2.RightNum) {
            finnal.getChildByName("狮子胜利").getChildByName("胜利").active = true;
        }
        else if (this.Player1.RightNum < this.Player2.RightNum) {
            finnal.getChildByName("猴子胜利").getChildByName("胜利").active = true;
        }
        else {
            finnal.getChildByName("狮子胜利").getChildByName("胜利").active = true;
            finnal.getChildByName("猴子胜利").getChildByName("胜利").active = true;
        }

        this.scheduleOnce(() => {

            this.isGameOver = true;
            GamePanel.Instance.Win();

        }, 4.5);
    }

    isWinner: boolean = false;
    winnerState: number = 0;
    Winner() {
        if (this.isWinner) {
            return;
        }

        this.isWinner = true;

        if (this.Player1.RightNum > this.Player2.RightNum) {
            this.Player1.win();
            this.Player2.lost();
            this.winnerState = 1;
            return 1;
        }
        else if (this.Player1.RightNum < this.Player2.RightNum) {
            this.Player1.lost();
            this.Player2.win();
            this.winnerState = 2;
            return 2;
        }
        else {
            this.Player1.win();
            this.Player2.win();
            this.winnerState = 3;
            return 3;
        }
    }

    Judgement(flag1: boolean, flag2: boolean) {
        if (flag1 && !flag2) {
            this.Player1.Right();
            this.Player2.Wrong();
            console.log("玩家1正确");
        }
        else if (!flag1 && flag2) {
            this.Player1.Wrong();
            this.Player2.Right();
            console.log("玩家2正确");
        }
        else if (!flag1 && !flag2) {
            this.Player1.Wrong();
            this.Player2.Wrong();
            console.log("玩家1和玩家2都错误");
        }
        else {
            this.Player1.Right();
            this.Player2.Right();
            console.log("玩家1和玩家2都正确");
        }
    }

    nextLevel() {
        this.level++;
        this.over = false;
        director.getScene().emit("答题赛跑_下一题");
    }

    playSFX(clipName: string) {
        for (let clip of this.clips) {
            if (clip.name === clipName) {
                AudioManager.Instance.PlaySFX(clip);
                break;
            }
        }
    }

    playBGM(clipName: string) {
        for (let clip of this.clips) {
            if (clip.name === clipName) {
                AudioManager.Instance.PlayBGM(clip);
                break;
            }
        }
    }
}