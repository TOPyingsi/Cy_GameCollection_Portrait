import { _decorator, AnimationComponent, Component, director, Event, EventTouch, math, Node, ProgressBar, sp, v3 } from 'cc';
import { CS_CoffeeTouch } from './CS_CoffeeTouch';
import { CS_WoodTouch } from './CS_WoodTouch';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('CS_GameMgr')
export class CS_GameMgr extends Component {

    @property(Node)
    woodNode: Node = null;

    @property(Node)
    coffeeNode: Node = null;

    @property(Node)
    warnNode: Node = null;

    @property(Node)
    coffeeTarget: Node = null;

    @property(Node)
    woodTarget: Node = null;

    @property(Node)
    coffeeWinNode: Node = null;
    @property(Node)
    woodWinNode: Node = null;

    public coffeeTs: CS_CoffeeTouch = null;
    public woodTs: CS_WoodTouch = null;

    public GameNode: Node = null;

    public gameType: string = "咖啡女王";

    public isGameOver: boolean = false;
    public isScroll: boolean = false;

    public static instance: CS_GameMgr = null;
    start() {
        CS_GameMgr.instance = this;

        this.initData();

    }

    timer: number = 0;
    protected update(dt: number): void {

        switch (this.gameType) {
            case "木棍人":
                if (this.isQueenLook) {
                    this.timer += dt;
                    //两秒内如果木棍人蓄力就被抓走
                    // this.QueenLook();

                    if (this.woodCharging) {
                        this.isQueenLook = false;
                        //被抓动画
                        this.woodTarget.getComponent(sp.Skeleton).setAnimation(0, "beizhua", false);
                        this.getComponent(AnimationComponent).play("被抓");
                        //显示手
                        this.woodTarget.getChildByName("手持").active = true;

                        this.CoffeeWin();
                        return;
                    }

                    if (this.timer >= 2) {
                        this.timer = 0;
                        this.isQueenLook = false;
                        this.QueenLookInterval = math.randomRangeInt(5, this.QueenLookMax);
                    }
                }
                break;
            case "咖啡女王":
                break;
            default:
                break;
        }
    }

    onBtnClick(event: Event) {
        switch (event.target.name) {
            case "木棍人":
                this.gameType = "木棍人";
                this.woodNode.active = true;
                this.woodTs.start();

                this.schedule(() => {
                    this.QueenLook();
                    // }, this.QueenLookInterval);
                }, 20);

                break;
            case "咖啡女王":
                this.gameType = "咖啡女王";
                this.coffeeNode.active = true;
                this.coffeeTs.start();
                break;
            default:
                break;
        }

        this.isScroll = true;

        this.GameNode.active = true;

        this.node.getChildByName("Btn").active = false;

    }

    isQueenLook: boolean = false;
    //咖啡女王单击
    onCoffeeTouch() {
        this.isScroll = false;
        //女王反应
        this.coffeeTarget.getComponent(AnimationComponent).play("卡布奇诺回头");
        //木棍人反应
        this.woodTarget.getChildByName("手持").active = false;
        this.woodTarget.getComponent(sp.Skeleton).setAnimation(0, "canggunzi", false);

    }

    woodCharging: boolean = false;
    //木棍人蓄力
    onWoodTouch() {
        this.woodCharging = true;
        let hand = this.woodTarget.getChildByName("手持");
        hand.eulerAngles = hand.eulerAngles.add(v3(0, 0, 0.12));
    }
    //木棍人取消蓄力
    onWoodTouchEnd() {
        this.woodCharging = false;
        this.woodTarget.getChildByName("手持").eulerAngles = v3(0, 0, -18);
    }

    QueenLookInterval: number = 8;
    QueenLookMax: number = 0;
    //女王回头
    QueenLook() {
        //显示警告
        if (this.gameType === "木棍人") {
            this.warnNode.active = true;
        }

        console.log("女王回头");

        this.scheduleOnce(() => {
            this.isQueenLook = true;
            this.isScroll = false;

            this.coffeeTarget.getComponent(AnimationComponent).play("卡布奇诺回头");

            switch (this.gameType) {
                case "木棍人":
                    //木棍人被抓
                    if (this.woodCharging) {
                        let spComp = this.woodTarget.getComponent(sp.Skeleton);
                        spComp.setAnimation(0, "beizhua", true);
                        this.getComponent(AnimationComponent).play("被抓");
                        this.CoffeeWin();
                    }
                    else {
                        //木棍人藏木棍
                        let spComp = this.woodTarget.getComponent(sp.Skeleton);
                        spComp.setAnimation(0, "canggunzi", true);
                        this.woodTarget.getChildByName("手持").active = false;
                    }
                    break;
                case "咖啡女王":
                    //木棍人藏木棍
                    let spComp = this.woodTarget.getComponent(sp.Skeleton);
                    spComp.setAnimation(0, "canggunzi", true);

                    break;
            }

            this.scheduleOnce(() => {
                if (this.isGameOver) {
                    return;
                }

                this.coffeeTarget.getComponent(AnimationComponent).play("卡布奇诺走路");
                this.woodTarget.getComponent(sp.Skeleton).setAnimation(0, "zoulu", true);

                switch (this.gameType) {
                    case "木棍人":
                        //woodNode.active = false;
                        this.woodTarget.getChildByName("手持").active = true;
                        this.warnNode.active = false;
                        break;
                    case "咖啡女王":
                    //woodNode.active = false;

                }

                this.isScroll = true;
            }, 2.2);

        }, 1);
    }

    WoodWin() {
        this.isGameOver = true;
        this.woodTs.off();

        this.isScroll = false;

        this.woodTarget.getComponent(sp.Skeleton).clearAnimations();

        this.getComponent(AnimationComponent).play("刺杀成功");

        this.scheduleOnce(() => {
            this.woodWinNode.active = true;

            this.scheduleOnce(() => {
                switch (this.gameType) {
                    case "木棍人":
                        GamePanel.Instance.Win();
                        break;
                    case "咖啡女王":
                        GamePanel.Instance.Lost();
                        break;
                }
            }, 1.5);

        }, 1);
    }

    CoffeeWin() {
        this.isGameOver = true;
        this.coffeeTs.off();
        this.unscheduleAllCallbacks();

        this.isScroll = false;
        this.warnNode.active = false;

        // this.coffeeTarget.getComponent(AnimationComponent).play("卡布奇诺回头");

        this.scheduleOnce(() => {
            this.coffeeWinNode.active = true;

            this.scheduleOnce(() => {
                switch (this.gameType) {
                    case "咖啡女王":
                        GamePanel.Instance.Win();
                        break;
                }
            }, 1.5);

        }, 1);
    }

    initData() {
        this.GameNode = this.node.getChildByName("GameNode");

        this.coffeeTs = this.coffeeNode.getComponent(CS_CoffeeTouch);
        this.woodTs = this.woodNode.getComponent(CS_WoodTouch);

        director.getScene().on("刺杀_木棍人可赢", () => {
            this.QueenLookMax = 15;
        }, this);

    }
}


