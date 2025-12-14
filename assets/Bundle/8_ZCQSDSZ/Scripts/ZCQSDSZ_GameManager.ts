import { _decorator, Component, Event, instantiate, Label, Layout, Node, Prefab, Animation, Vec3, tween, Vec2, v2, v3, Size, size, UITransform, RichText } from 'cc';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('ZCQSDSZ_GameManager')
export class ZCQSDSZ_GameManager extends Component {

    numbers1: number[] = [];
    numbers2: number[] = [];
    numbers3: number[] = [];

    Round1: number = 10;
    Round2: number = 26;
    Round3: number = 100;

    num: number = 0;
    currentRound: number = 1;

    strNum: string = '';

    layout: Layout = null;

    transform: UITransform = null;

    @property(Prefab)
    numberPrefab: Prefab = null;

    @property(Node)
    numLabel: Node = null;

    @property(Label)
    answerInput: Label = null;

    @property(Node)
    ReallyTip: Node = null;

    @property(Node)
    FakeTip: Node = null;

    @property(Node)
    tipPanel: Node = null;

    @property(Size)
    Size_1: Size = size();

    @property(Size)
    Size_2: Size = size();

    @property(Size)
    Size_3: Size = size();

    @property(GamePanel)
    gamePanel: GamePanel = null;

    @property(Prefab)
    answer: Prefab = null;

    protected onLoad(): void {
        this.layout = this.numLabel.getComponent(Layout);
        this.transform = this.numLabel.getComponent(UITransform);
        this.loadRound(this.currentRound);


    }

    protected start(): void {
        this.loadPrefab(this.currentRound);

        let newNode = instantiate(this.answer);
        let numStr = this.num.toString();
        newNode.getChildByName("RichText").getComponent(RichText).string = numStr
        const newPrefab = new Prefab();
        newPrefab.data = newNode;
        this.gamePanel.answerPrefab = newPrefab;
    }

    getAnswer(event: Event) {
        this.strNum += event.target.name;
        this.answerInput.string = this.strNum;
        console.log(this.strNum);
    }

    submit() {
        const num = parseInt(this.strNum);
        if (num === this.num) {

            this.ReallyTip.active = true;
            console.log("恭喜你答对了");
            this.scheduleOnce(() => {
                this.ReallyTip.active = false;
            }, 0.5);

            if (this.currentRound < 3) {
                this.tipPanel.active = true;
                this.scheduleOnce(() => {
                    this.tipPanel.active = false;
                }, 1.5);

            }

            this.nextRound();

        } else {

            this.FakeTip.active = true;
            console.log("很遗憾，你答错了");
            this.scheduleOnce(() => {
                this.FakeTip.active = false;
            }, 0.5);

        }
    }

    clear() {
        this.strNum = '';
        this.answerInput.string = this.strNum;
    }

    loadRound(round: number) {
        this.numbers1 = [];
        this.numbers2 = [];
        this.numbers3 = [];

        if (round === 1) {
            for (let i = 0; i < this.Round1; i++) {
                this.numbers1.push(i);
            }
            this.num = Tools.GetRandomIntWithMax(0, this.Round1 - 1);
            this.numbers1 = Tools.Shuffle(this.numbers1.filter(e => e !== this.num));
            console.log("Round1答案：" + this.num);
            this.loadAnswer(this.num)

        } else if (round === 2) {
            for (let i = 0; i < this.Round2; i++) {
                this.numbers2.push(i);
            }
            this.num = Tools.GetRandomIntWithMax(0, this.Round2 - 1);
            this.numbers2 = Tools.Shuffle(this.numbers2.filter(e => e !== this.num));
            console.log("Round2答案：" + this.num);
            this.loadAnswer(this.num)
        } else if (round === 3) {
            for (let i = 0; i < this.Round3; i++) {
                this.numbers3.push(i);
            }
            this.num = Tools.GetRandomIntWithMax(0, this.Round3 - 1);
            this.numbers3 = Tools.Shuffle(this.numbers3.filter(e => e !== this.num));
            console.log("Round3答案：" + this.num);
            this.loadAnswer(this.num)
        }
    }

    loadAnswer(answer: number) {
        let newNode = instantiate(this.answer);
        newNode.getChildByName("RichText").getComponent(RichText).string = answer.toString();
        const newPrefab = new Prefab();
        newPrefab.data = newNode;
        this.gamePanel.answerPrefab = newPrefab;
    }

    loadPrefab(round: number) {
        this.loadPos(round);  // 调用坐标布局方法

        this.layout.constraintNum = round === 1 ? 3 : round === 2 ? 5 : 9;
        this.numLabel.removeAllChildren();
        const numbers = round === 1 ? this.numbers1 : round === 2 ? this.numbers2 : this.numbers3;

        for (let i = 0; i < numbers.length; i++) {
            const newNode = instantiate(this.numberPrefab);
            const label = newNode.getComponent(Label);
            label.string = numbers[i].toString();

            this.numLabel.addChild(newNode);

        }
    }


    nextRound() {
        const currentChildren = this.numLabel.children;

        // 原Round缩小动画
        currentChildren.forEach(child => {
            tween(child)
                .to(0.3, { scale: new Vec3(0, 0, 0) })
                .call(() => child.removeFromParent())
                .start();
        });

        this.scheduleOnce(() => {
            this.currentRound++;
            if (this.currentRound > 3) {

                this.winGame();//通关逻辑

                return;
            }
            this.clear();
            this.loadRound(this.currentRound);

            // 下一个Round放大动画
            this.loadTween(this.currentRound);
        }, 0.35);
    }

    loadTween(round: number) {
        this.loadPos(round);  // 调用坐标布局方法

        this.layout.constraintNum = round === 1 ? 3 : round === 2 ? 5 : 9;
        const numbers = round === 1 ? this.numbers1 : round === 2 ? this.numbers2 : this.numbers3;
        this.numLabel.removeAllChildren();

        for (let i = 0; i < numbers.length; i++) {
            const newNode = instantiate(this.numberPrefab);

            const label = newNode.getComponent(Label);
            label.string = numbers[i].toString();

            this.numLabel.addChild(newNode);

        }
        this.scheduleOnce(() => {

            this.numLabel.children.forEach(child => {
                tween(child)
                    .to(0.3, { scale: Vec3.ONE }, { easing: 'backOut' })
                    .start();
            });
        });
    }


    loadPos(round: number) {
        console.error(round)

        switch (round) {
            case 1:
                this.transform.setContentSize(this.Size_1);
                break;
            case 2:
                this.transform.setContentSize(this.Size_2);
                break;
            case 3:
                this.transform.setContentSize(this.Size_3);
                break;
            default:
                console.error("未知的Round")
                break;
        }
    }

    winGame() {
        this.gamePanel.Win();
        console.log("游戏胜利");
    }
}