import { _decorator, assetManager, Component, director, Event, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Tween, tween, Vec3 } from 'cc';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Node)
    number1: Node = null;

    @property(Node)
    number2: Node = null;

    @property(Node)
    number3: Node = null;

    @property(Node)
    number4: Node = null;

    @property(Label)
    title: Label = null;

    @property(Node)
    really: Node = null;

    @property(Node)
    fake: Node = null;

    @property(Node)
    gameStartTipPanel: Node = null;

    @property(Node)
    topic: Node = null;

    @property(Node)
    ready: Node = null;

    @property(Node)
    go: Node = null;

    @property(Prefab)
    item: Prefab = null;

    @property(Node)
    user: Node = null;

    @property(Node)
    bot: Node = null;

    @property(Node)
    panel: Node = null;

    @property(Node)
    botItem: Node = null;

    @property(Node)
    userItem: Node = null;

    @property(Node)
    winPanel: Node = null;

    @property(Node)
    failPanel: Node = null;

    @property(GamePanel)
    gamePanel: GamePanel = null;

    @property(Prefab)
    answer: Prefab = null;


    private num1: number = 0;
    private num2: number = 0;
    private num3: number = 0;
    private num4: number = 0;

    private roundCount: number = 1; // 回合计数器
    private botCount: number = 0;


    protected onLoad(): void {

        // 初始化第一题数据
        this.title.string = "第 " + this.roundCount + " / 20 题";
        this.num1 = Tools.GetRandomIntWithMax(10, 99);
        this.num2 = Tools.GetRandomIntWithMax(10, 99);
        this.number1.getComponent(Label).string = this.num1.toString();
        this.number2.getComponent(Label).string = this.num2.toString();
    }

    protected start(): void {
        if (ProjectEventManager.GameStartIsShowTreasureBox) {
            director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
        } else {
            this.Init();
        }
    }

    protected update(dt: number): void {

    }

    loadNumber() {
        this.num3 = Tools.GetRandomIntWithMax(10, 99);
        this.num4 = Tools.GetRandomIntWithMax(10, 99);
        this.number3.getComponent(Label).string = this.num3.toString();
        this.number4.getComponent(Label).string = this.num4.toString();
    }

    onButtonClick(event: Event) {
        let isCorrect = false;
        switch (event.target.name) {
            case "Big":
                isCorrect = this.num1 > this.num2;
                break;
            case "Equal":
                isCorrect = this.num1 === this.num2;
                break;
            case "Small":
                isCorrect = this.num1 < this.num2;
                break;
        }

        if (isCorrect) {
            console.log("正确");
            this.really.active = true;
            this.roundCount++;
            console.error(this.roundCount);
            this.scheduleOnce(() => {
                this.really.active = false;
            }, 0.5);
            this.title.string = "第 " + this.roundCount + " / 20 题";

            if (this.roundCount >= 20) {
                this.unscheduleAllCallbacks();

                console.log("游戏胜利");
                console.error(this.gamePanel)

                this.gamePanel.Win();
                return;
            }


            const newItem = instantiate(this.item);
            this.userItem.addChild(newItem);
            this.nextRound();
        } else {
            console.log("错误");
            this.fake.active = true;
            this.scheduleOnce(() => {
                this.fake.active = false;
            }, 0.5);
        }
    }

    nextRound() {
        this.num1 = this.num4;
        this.num2 = this.num3;

        this.number1.getComponent(Label).string = this.num1.toString();
        this.number2.getComponent(Label).string = this.num2.toString();

        this.num3 = Tools.GetRandomIntWithMax(1, 100);
        this.num4 = Tools.GetRandomIntWithMax(1, 100);

        this.number3.getComponent(Label).string = this.num3.toString();
        this.number4.getComponent(Label).string = this.num4.toString();
    }


    addBotItem() {
        const newItem = instantiate(this.item);
        this.botItem.addChild(newItem);
        this.botCount++;
        if (this.botCount >= 20) {
            console.log("游戏失败");
            this.unscheduleAllCallbacks();
            this.gamePanel.Lost();
        }
    }

    Init() {
        this.gameStartTween();
    }
    gameStartTween() {
        this.gameStartTipPanel.active = true;
        this.topic.active = true;
        this.topic.scale = new Vec3(0.1, 0.1, 0.1);

        tween(this.topic)
            .to(1.0, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .call(() => {
                tween(this.topic)
                    .to(1.0, { scale: new Vec3(0.1, 0.1, 0.1) }, { easing: 'backIn' })
                    .call(() => {
                        this.topic.active = false;
                        this.ready.active = true;
                        this.ready.scale = new Vec3(0.1, 0.1, 0.1);

                        tween(this.ready)
                            .to(1.0, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
                            .call(() => {
                                tween(this.ready)
                                    .to(1.0, { scale: new Vec3(0.1, 0.1, 0.1) }, { easing: 'backIn' })
                                    .call(() => {
                                        this.ready.active = false;
                                        this.go.active = true;
                                        this.go.scale = new Vec3(0.1, 0.1, 0.1);

                                        tween(this.go)
                                            .to(1.0, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
                                            .call(() => {
                                                tween(this.go)
                                                    .to(1.0, { scale: new Vec3(0.1, 0.1, 0.1) }, { easing: 'backIn' })
                                                    .call(() => {
                                                        this.go.active = false;
                                                        this.gameStartTipPanel.active = false;
                                                        this.panel.active = true;

                                                        this.loadNumber();
                                                        this.schedule(this.addBotItem, 3);
                                                    })
                                                    .start();
                                            })
                                            .start();
                                    })
                                    .start();
                            })
                            .start();
                    })
                    .start();
            })
            .start();
    }

}