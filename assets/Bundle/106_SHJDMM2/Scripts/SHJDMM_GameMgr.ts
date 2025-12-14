import { _decorator, AudioClip, Component, Label, Node, Prefab, Skeleton, sp, tween, v3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SHJDMM_GameMgr')
export class SHJDMM_GameMgr extends Component {
    @property(Node)
    finnalPos: Node = null;

    @property(Prefab)
    answerPrefab: Prefab = null;

    @property({ type: [AudioClip] })
    audioClips: AudioClip[] = [];

    public targetNodes: Node[] = [];

    public levelNodes: Node[] = [];

    public check: boolean[] = [false, false, false];

    public level: number = 0;

    public regulator: Node = null;

    public timerLabel: Label = null;

    public couldHide: boolean = true;

    private timer: number = 15;

    public static instance: SHJDMM_GameMgr = null;
    start() {
        SHJDMM_GameMgr.instance = this;

        this.initData();
    }


    initData() {

        GamePanel.Instance._answerPrefab = this.answerPrefab;

        this.levelNodes = this.node.getChildByName("level").children;
        //倒计时UI
        this.timerLabel = this.node.getChildByName("timerLabel").getComponent(Label);
        //木棍人节点
        this.regulator = this.node.getChildByName("木棍人");
        //开始倒计时
        this.schedule(this.conutDown, 1);
    }

    conutDown() {
        if (GamePanel.Instance.gamePause) {
            return;
        }

        this.timerLabel.string = "躲猫猫倒计时：" + this.timer.toString() + "秒";

        this.timer--;

        if (this.timer < 0) {
            this.timerLabel.string = "躲猫猫倒计时：0秒";

            this.unschedule(this.conutDown);

            this.couldHide = false;

            this.plsySFX("木棍人出现");
            //木棍人出现
            tween(this.regulator)
                .by(2, { position: v3(1080, 0, 0) })
                .to(1, { scale: v3(1, 1, 1) })
                .call(this.checkLevel.bind(this))
                .start();
        }
    }


    checkLevel() {
        for (let i = 0; i < this.check.length; i++) {
            if (!this.check[i]) {
                this.gameOver(i);
                return;
            }
        }

        if (this.level === 0) {
            this.nextLevel();
        }
        else {
            tween(this.regulator)
                .by(2, { position: v3(1080, 0, 0) })
                .call(() => {
                    GamePanel.Instance.Win();
                })
                .start();

        }

    }

    nextLevel() {

        this.check = [false, false, false];

        this.scheduleOnce(() => {

            tween(this.regulator)
                .by(2, { position: v3(1080, 0, 0) })
                .call(() => {
                    this.regulator.position = v3(-1080, -800, 0);

                    this.couldHide = true;

                    this.level++;
                    this.levelNodes[this.level - 1].active = false;
                    this.levelNodes[this.level].active = true;

                    this.timer = 15;
                    this.schedule(this.conutDown, 1);
                })
                .start();

        }, 0.5);
    }

    gameOver(index: number) {
        let levelMgr = this.levelNodes[this.level];

        this.targetNodes = levelMgr.getChildByName("target").children;

        let wrongPos = this.targetNodes[index].worldPosition.clone();

        tween(this.regulator)
            .to(1.5, { worldPosition: wrongPos.add(v3(-150, -250, 0)) })
            .call(() => {
                let ani = this.regulator.getComponent(sp.Skeleton);

                //动画播放结束监听
                let finnalPos = this.finnalPos.worldPosition.clone();
                ani.setEndListener(() => {

                    this.scheduleOnce(() => {



                        tween(this.targetNodes[index])
                            .to(1, { worldPosition: finnalPos, scale: v3(0, 0, 0), eulerAngles: v3(0, 0, 720) })
                            .call(this.shine.bind(this))
                            .start();

                    }, 0.3);

                })

                ani.setAnimation(0, "gongji", false);
                this.plsySFX("失败");
            })
            .start();
    }

    shine() {
        this.finnalPos.active = true;

        tween(this.finnalPos)
            .to(0.5, { scale: v3(1, 1, 1) })
            .to(0.5, { scale: v3(1.2, 1.2, 1.2) })
            .to(0.5, { scale: v3(0, 0, 0) })
            .call(() => {
                this.scheduleOnce(() => {
                    //游戏结束
                    GamePanel.Instance.Lost();
                }, 0.8)
            })
            .start();
    }

    plsySFX(clipName: string) {

        for (let clip of this.audioClips) {
            if (clip.name === clipName) {
                AudioManager.Instance.PlaySFX(clip);
            }
        }
    }

}


