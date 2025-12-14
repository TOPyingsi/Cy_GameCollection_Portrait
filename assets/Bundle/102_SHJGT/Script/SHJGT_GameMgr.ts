import { _decorator, AnimationComponent, AudioClip, AudioSource, Component, Label, Node, Prefab, tween, v3 } from 'cc';
import { SHJGT_Level } from './SHJGT_Level';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SHJGT_GameMgr')
export class SHJGT_GameMgr extends Component {

    @property(Prefab)
    answerPrefab: Prefab = null;

    @property({ type: [AudioClip] })
    public Clips: AudioClip[] = [];

    @property(Node)
    public openDoorBtn: Node = null;

    public level: number = 0;

    public levelMgr: Node = null;
    public levelTsArr: SHJGT_Level[] = [];

    @property(Node)
    public regulatorNode: Node = null;

    public ani: AnimationComponent = null;

    public isTalking: boolean = false;

    private audio: AudioSource = null;

    private talkWindow: Node = null;
    private talkLabel: Label = null;

    private regulatorStr: string[] = [
        "听说有人类混进了山海经公寓,让我抓到,一定不会放过！",
        "开门！突击检查！",
        "是山海经生物，没有异常！",
        "果然混进了人类，需要清除！"
    ]

    public static instance: SHJGT_GameMgr = null;

    start() {
        SHJGT_GameMgr.instance = this;

        this.initData();

    }

    openDoor() {
        if (this.isTalking) {
            return;
        }

        let levelTs = this.levelTsArr[this.level];

        //开门
        let isRight = levelTs.openDoor();

        //判断是否正确
        //播放木棍人动画和音效
        this.ani.play("idle");
        this.openDoorBtn.active = false;

        if (isRight) {
            this.talkLabel.string = this.regulatorStr[2];

            tween(this.talkWindow)
                .to(0.3, { scale: v3(1, 1, 1) })
                .start();

            this.audio.node.once(AudioSource.EventType.ENDED, () => {

                tween(this.talkWindow)
                    .to(0.3, { scale: v3(0, 0, 0) })
                    .start();

                this.nextLevel();
            })
            this.playSFX("正确");

        }
        else {
            this.talkLabel.string = this.regulatorStr[3];

            tween(this.talkWindow)
                .to(0.3, { scale: v3(1, 1, 1) })
                .start();


            this.audio.node.once(AudioSource.EventType.ENDED, () => {

                this.scheduleOnce(() => {
                    GamePanel.Instance.Lost();
                }, 0.8);

            });

            this.scheduleOnce(() => {

                //失败动画
                this.ani.play("Defeat");

                //关闭对话框
                tween(this.talkWindow)
                    .to(0.1, { scale: v3(0, 0, 0) })
                    .start();

                //人物逐渐消失
                levelTs.lostAni();

            }, 2.8);

            //失败音效
            this.playSFX("失败");
        }

    }

    initData() {

        GamePanel.Instance._answerPrefab = this.answerPrefab;

        this.levelMgr = this.node.getChildByName("Target").getChildByName("Level");

        for (let i = 0; i < this.levelMgr.children.length; i++) {
            let levelTs = this.levelMgr.children[i].getComponent(SHJGT_Level);
            this.levelTsArr.push(levelTs);
        }

        this.talkWindow = this.node.getChildByName("对话框");

        this.talkLabel = this.talkWindow.getComponentInChildren(Label);

        this.audio = this.node.getComponent(AudioSource);

        this.ani = this.regulatorNode.getComponent(AnimationComponent);

        this.startAni();
    }

    nextLevel() {

        this.level++;
        if (this.level === 4) {
            this.scheduleOnce(() => {
                GamePanel.Instance.Win();
            }, 0.8);
            return;
        }

        this.scheduleOnce(() => {
            this.playSFX("脚步");
        }, 0.1);

        this.ani.play("UpStairs");

        tween(this.talkWindow)
            .to(0.1, { scale: v3(1, 1, 1) })
            .start();

        tween(this.levelMgr)
            .by(2, { position: v3(0, -1600, 0) })
            .call(() => {

                this.scheduleOnce(() => {
                    this.audio.node.once(AudioSource.EventType.ENDED, () => {

                        tween(this.talkWindow)
                            .to(0.1, { scale: v3(0, 0, 0) })
                            .start();

                        this.levelTsArr[this.level].initData();
                        this.levelTsArr[this.level].showTalkWindow();
                    });

                    this.playSFX("level");
                }, 0.1);

                this.talkLabel.string = this.regulatorStr[1];
                tween(this.talkWindow)
                    .to(0.1, { scale: v3(1, 1, 1) })
                    .start();

                this.ani.play("OpenTheDoor");


            })
            .start();
    }

    checkRight() {
        this.playSFX("正确");

        tween(this.talkWindow)
            .by(0.3, { scale: v3(1, 1, 1) })
            .start();
    }

    checkWrong() {

    }

    playCommon(index: number) {
        if (!AudioManager.IsSoundOn) {
            this.audio.volume = 0;
        }
        else {
            this.audio.volume = 1;
        }

        this.scheduleOnce(() => {
            if (!this.openDoorBtn.active) {
                this.openDoorBtn.active = true;
            }

            this.isTalking = false;

            this.levelTsArr[this.level].closeTalkWindow();
        }, 2.3);

        this.audio.clip = this.Clips[index];
        this.audio.play();

        this.isTalking = true;

    }

    playSFX(clipName: string) {
        if (!AudioManager.IsSoundOn) {
            this.audio.volume = 0;
        }
        else {
            this.audio.volume = 1;
        }

        // this.audio.stop();

        for (let clip of this.Clips) {
            if (clip.name === clipName) {
                this.audio.clip = clip;
                this.audio.play();
            }
        }

    }

    playMgrSFX(clipName: string) {

        for (let clip of this.Clips) {
            if (clip.name === clipName) {
                AudioManager.Instance.PlaySFX(clip);
            }
        }
    }

    sign: number = 1;
    regulatorMove() {
        tween(this.regulatorNode)
            .by(0.5, { scale: v3(0, 0.01 * this.sign, 0) })
            .call(() => {
                this.sign = -this.sign;
                this.regulatorMove();
            })
            .start();
    }

    startAni() {
        this.regulatorMove();

        this.ani.once(AnimationComponent.EventType.FINISHED, () => {
            this.playSFX("开局");

            this.talkLabel.string = this.regulatorStr[0];

            tween(this.talkWindow)
                .to(0.3, { scale: v3(1, 1, 1) })
                .start();

            this.scheduleOnce(() => {
                this.talkLabel.string = this.regulatorStr[1];

                this.scheduleOnce(() => {
                    tween(this.talkWindow)
                        .to(0.3, { scale: v3(0, 0, 0) })
                        .start();

                    this.levelTsArr[0].initData();
                    this.levelTsArr[0].showTalkWindow();
                }, 2.2);

                this.playSFX("level");

                tween(this.talkWindow)
                    .to(0.3, { scale: v3(1, 1, 1) })
                    .start();

                this.ani.play("OpenTheDoor");
            }, 4.2);

        });

        this.ani.play("startAni");
    }
}


