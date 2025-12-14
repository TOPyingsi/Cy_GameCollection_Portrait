import { _decorator, AnimationComponent, AudioClip, Color, Component, Label, math, Node, NodeEventType, Sprite, tween, UIOpacity, v3 } from 'cc';
import { MGFJSHJ_Monster } from './MGFJSHJ_Monster';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('MGFJSHJ_GameMgr')
export class MGFJSHJ_GameMgr extends Component {
    @property(AudioClip)
    startClip: AudioClip = null;

    @property(AudioClip)
    clockClip: AudioClip = null;

    @property(AudioClip)
    killClip: AudioClip = null;

    @property(AudioClip)
    clickClip: AudioClip = null;

    @property(Label)
    public label: Label = null;

    @property(Label)
    public eatNumLabel: Label = null;

    public seatsNodes: Node[] = [];

    public roleNodes: Node[] = [];

    public monsterTs: MGFJSHJ_Monster = null;

    public DieNum: number = 0;

    public seatsIndex: number[] = [];
    public playerSeat: number = 0;

    public isPlayerDie: boolean = false;
    public isGameOver: boolean = false;
    public isPlayerChoose: boolean = false;

    public arrowNode: Node = null;

    private winNode: Node = null;
    private lostNode: Node = null;

    private ani: AnimationComponent = null;

    public static instance: MGFJSHJ_GameMgr = null;
    start() {
        MGFJSHJ_GameMgr.instance = this;

        this.initData();
    }

    timer: number = 10;
    startInterval() {
        this.timer = 10;
        this.isPlayerChoose = true;
        this.schedule(this.countDown, 1);

        if (!this.isFirst) {
            this.addClick();
        }
    }

    countDown() {
        if (GamePanel.Instance.gamePause) {
            return;
        }

        AudioManager.Instance.PlaySFX(this.clockClip);

        if (!this.isPlayerChoose) {
            this.label.string = "你已选择" + (this.playerSeat + 1).toString() + "号座位,魔鬼还有" + this.timer.toString() + "秒猎杀";
        }
        else {
            this.label.string = "请选择你的座位:" + this.timer.toString();
        }

        this.timer--;

        if (this.timer < 0) {
            this.unschedule(this.countDown);

            for (let i = 0; i < this.seatsIndex.length; i++) {
                let index = this.seatsIndex[i];

                let uiOpacity1 = this.roleNodes[index].getComponent(UIOpacity);
                uiOpacity1.opacity = 255;

                let uiOpacity2 = this.seatsNodes[index].getComponent(UIOpacity);
                uiOpacity2.opacity = 255;
            }

            if (!this.isPlayerChoose) {
                this.label.string = "你已选择" + (this.playerSeat + 1).toString() + "号座位";

                if (!this.isFirst) {
                    this.monsterTs.startAttack();
                }

            }
            else {
                let random = math.randomRangeInt(0, this.seatsIndex.length);
                this.playerSeat = this.seatsIndex[random];

                this.label.string = "你已选择" + (this.playerSeat + 1).toString() + "号座位";
            }

            if (this.isFirst) {
                let uiOpacity = this.node.getChildByName("Roles").getComponent(UIOpacity);
                uiOpacity.opacity = 255;

                this.ani.play();

                this.off(this.playerSeat);

                this.isPlayerChoose = false;

                this.isFirst = false;

                return;
            }

            this.off(this.playerSeat);

            this.isPlayerChoose = false;

            AudioManager.Instance.PlaySFX(this.clickClip);

            // this.arrowNode.active = true;
            // this.arrowNode.worldPosition = this.seatsNodes[random].worldPosition.clone().add(v3(0, 100, 0));
            // this.arrowMove();

            //初始化怪物并让其开始移动
            this.monsterTs.startAttack();
        }
    }

    sign = 1;
    arrowMove() {
        if (!this.arrowNode.active) {
            return;
        }
        tween(this.arrowNode)
            .by(1, { worldPosition: v3(0, 5 * this.sign, 0) })
            .call(() => {
                this.sign = -this.sign;

                this.arrowMove();
            })
            .start();
    }

    curNode: Node[] = [];
    curRole: Node[] = [];
    kill(index: number) {
        let node = this.curNode[index];

        let indexOf = this.seatsNodes.indexOf(node);

        if (indexOf === -1) {
            this.roleNodes[this.playerSeat].getComponent(Sprite).color = new Color(120, 120, 120, 255);
            return;
        }

        this.seatsNodes[indexOf].active = true;

        this.roleNodes[indexOf].getComponent(Sprite).color = new Color(120, 120, 120, 255);



        this.curNode.splice(index, 1);

        this.curRole.splice(indexOf, 1);

        this.seatsIndex.splice(index, 1);

        this.scheduleOnce(() => {
            for (let i = 0; i < this.seatsIndex.length; i++) {
                let index = this.seatsIndex[i];

                let uiOpacity1 = this.roleNodes[index].getComponent(UIOpacity);
                uiOpacity1.opacity = 0;

                let uiOpacity2 = this.seatsNodes[index].getComponent(UIOpacity);
                uiOpacity2.opacity = 0;
            }
        }, 1);

        // console.log(this.seatsIndex);
        // console.log(this.curRole);
        // console.log(this.curNode);

        this.DieNum++;

        AudioManager.Instance.PlaySFX(this.killClip);

        this.eatNumLabel.string = (10 - this.DieNum).toString();

        if (this.DieNum === 10 && !this.isPlayerDie) {
            //玩家胜利
            this.isGameOver = true;

            this.win();

            console.error("玩家胜利");
        }


    }

    initData() {
        AudioManager.Instance.PlaySFX(this.startClip);

        this.ani = this.node.getComponent(AnimationComponent);

        this.monsterTs = this.node.getChildByName("Monster").getComponent(MGFJSHJ_Monster);

        this.roleNodes = this.node.getChildByName("Roles").children;

        this.winNode = this.node.getChildByName("win");
        this.lostNode = this.node.getChildByName("lost");

        this.seatsNodes = this.node.getChildByName("抓痕").children;

        for (let i = 0; i < this.seatsNodes.length; i++) {
            this.seatsIndex.push(i);
        }

        this.arrowNode = this.node.getChildByName("箭头");

        this.scheduleOnce(() => {
            this.addClick();

            this.startInterval();
        }, 3);

        this.ani.once(AnimationComponent.EventType.FINISHED, () => {

            // //让怪物开始移动
            this.monsterTs.startAttack();

            console.log("播放完毕");

        }, this);

        this.curNode = Array.from(this.seatsNodes);
        this.curRole = Array.from(this.roleNodes);
    }

    isFirst: boolean = true;

    addClick() {

        for (let j = 0; j < this.seatsIndex.length; j++) {
            let index = this.seatsIndex[j];

            // console.log("已经注册" + (index + 1).toString() + "节点事件");

            this.roleNodes[index].on(NodeEventType.TOUCH_END, () => {
                if (!this.isPlayerChoose) {
                    return;
                }

                this.playerSeat = index;

                // this.label.string = "你已选择" + (index + 1).toString() + "号座位";

                AudioManager.Instance.PlaySFX(this.clickClip);

                this.isPlayerChoose = false;

                for (let x = 0; x < this.seatsIndex.length; x++) {

                    let id = this.seatsIndex[x];

                    let uiOpacity1 = this.roleNodes[id].getComponent(UIOpacity);
                    uiOpacity1.opacity = 255;

                    let uiOpacity2 = this.seatsNodes[id].getComponent(UIOpacity);
                    uiOpacity2.opacity = 255;
                }

                // this.unschedule(this.countDown);

                this.off(index);

            });

        }

        // this.startInterval();

    }

    off(index: number) {

        for (let i = 0; i < this.roleNodes.length; i++) {

            if (this.isFirst) {
                let uiOpacity1 = this.seatsNodes[i].getComponent(UIOpacity);

                uiOpacity1.opacity = 255;

                this.seatsNodes[i].active = false;


                let uiOpacity2 = this.node.getChildByName("Roles").getComponent(UIOpacity);
                uiOpacity2.opacity = 255;
            }

            this.roleNodes[i].off(NodeEventType.TOUCH_END);

            let uiOpacity1 = this.roleNodes[i].getComponent(UIOpacity);
            uiOpacity1.opacity = 255;


        }

        this.arrowNode.active = true;
        this.arrowNode.worldPosition = this.roleNodes[index].worldPosition.clone().add(v3(0, 100, 0));
        this.arrowMove();


        // this.node.getChildByName("传送").active = false;
    }

    isPlayerWin: boolean = false;
    win() {
        if (this.isPlayerDie) {
            return;
        }
        tween(this.winNode)
            .to(0.5, { scale: v3(1, 1, 1) }, { easing: "backOut" })
            .call(() => {
                this.scheduleOnce(() => {
                    GamePanel.Instance.Win();
                }, 2);
            })
            .start();
    }

    lost() {
        if (!this.isPlayerDie) {
            return;
        }
        tween(this.lostNode)
            .to(0.5, { scale: v3(1, 1, 1) }, { easing: "backOut" })
            .call(() => {
                this.scheduleOnce(() => {
                    GamePanel.Instance.Lost();
                }, 2);
            })
            .start();
    }
}


