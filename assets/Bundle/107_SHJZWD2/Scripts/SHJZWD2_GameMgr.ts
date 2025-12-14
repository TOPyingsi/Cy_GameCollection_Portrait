import { _decorator, AudioClip, AudioSource, Button, Component, Label, Node, Prefab, Sprite, SpriteFrame, tween, v3, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { SHJZWD2_Level } from './SHJZWD2_Level';
import { SHJDWZD2_TouchCtrl } from './SHJDWZD2_TouchCtrl';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SHJZWD2_GameMgr')
export class SHJZWD2_GameMgr extends Component {

    @property(Prefab)
    answerPrefab: Prefab = null;

    @property({ type: [AudioClip] })
    public clips: AudioClip[] = [];

    @property({ type: [SpriteFrame] })
    levelSprites: SpriteFrame[] = [];

    public level = 0;

    public levelNodes: Node[] = [];

    public talkWindow: Node = null;
    public talkLabel: Label = null;
    //答案索引
    private answerIndexs: number[] = [4, 2, 1, 4, 1];
    private levelWords: string[] = [
        "谁喝了酒",
        "谁吃了魔鬼辣椒",
        "谁吃了臭豆腐",
        "谁喝的冰水",
        "谁发生了变异"
    ];

    private answerWords: string[] = [
        "我是谁我在哪",
        "还好我的冰箱是冷的",
        "哎妈呀真香",
        "太冷了,实在憋不住了",
        "看来我的实力藏不住了"
    ];

    rightNode: Node = null;
    wrongNode: Node = null;
    maskNode: Node = null;

    private audio: AudioSource = null;

    public static instance: SHJZWD2_GameMgr = null;

    start() {
        SHJZWD2_GameMgr.instance = this;

        this.initData();
    }


    onBtnClick(index: number) {
        return () => {
            let answer = this.answerIndexs[this.level] - 1;

            let BtnMgr = this.node.getChildByName("Btn");

            this.BtnEnable(false);

            let pos = BtnMgr.children[index].worldPosition.clone();

            if (answer === index) {
                let targets = this.levelNodes[this.level].children;

                let flag = true;
                switch (this.level) {
                    case 1:
                    case 2:
                    case 4:
                        flag = targets[index].children[0].children[0].active;
                        if (!flag) {
                            targets[index].children[0].children[0].active = true;
                        }
                        break;
                }

                this.Right(pos);

            }
            else {
                this.Wrong(pos);
            }
        }

    }

    showTalk(flag: boolean) {
        this.talkLabel.string = this.answerWords[this.level];

        if (flag) {
            tween(this.talkWindow)
                .to(0.5, { scale: v3(1, 1, 1) })
                .start();
        }
        else {
            tween(this.talkWindow)
                .to(0.5, { scale: v3(0, 0, 0) })
                .start();
        }



    }

    Right(pos: Vec3) {
        this.rightNode.active = true;
        this.rightNode.worldPosition = pos.add(v3(0, 100, 0));

        this.talkWindow.worldPosition = pos.add(v3(0, 600, 0));

        this.playMgrSFX("正确");

        tween(this.rightNode)
            .to(0.5, { scale: v3(1, 1, 1) }, { easing: "backOut" })
            .call(() => {

                this.showTalk(true);
                this.playSFX("第" + (this.level + 1).toString() + "关");

                this.audio.node.once(AudioSource.EventType.ENDED, () => {
                    this.scheduleOnce(this.nextLevel, 0.5);
                }, this);
            })
            .start();

    }

    wrongNum: number = 3;
    Wrong(pos: Vec3) {
        this.wrongNode.active = true;
        this.wrongNode.worldPosition = pos.add(v3(0, 100, 0));

        this.wrongNum--;
        let wrongLabel = this.node.getChildByName("错误次数").getComponent(Label);
        //最多允许错三个
        wrongLabel.string = "剩余错误次数：" + this.wrongNum.toString();

        if (this.wrongNum === 0) {
            this.scheduleOnce(() => {
                GamePanel.Instance.Lost();
            }, 0.8);
        }

        this.playMgrSFX("错误");

        tween(this.wrongNode)
            .to(0.3, { scale: v3(1, 1, 1) }, { easing: "backOut" })
            .to(1, { scale: v3(1, 1, 1) })
            .call(() => {

                //关闭错误UI
                tween(this.wrongNode)
                    .to(0.3, { scale: v3(0, 0, 0) }, { easing: "backOut" })
                    .call(() => {
                        this.BtnEnable(true);
                    })
                    .start();

            })
            .start();
    }

    nextLevel() {
        this.showTalk(false);

        if (this.level === 4) {
            this.scheduleOnce(() => {
                GamePanel.Instance.Win();
            }, 0.8);

            return;
        }

        this.level++;

        this.playMgrSFX("幕布");
        tween(this.maskNode)
            .by(1, { position: v3(0, -1200, 0) })
            .call(() => {
                let clipName = this.levelWords[this.level];
                this.playMgrSFX(clipName);

                let prop = this.node.getChildByName("物品框");
                let sprite = prop.children[0].getComponent(Sprite);
                let spriteFrame = this.levelSprites[this.level];
                sprite.spriteFrame = spriteFrame;

                let narratage = this.node.getChildByName("旁白").getComponent(Label);
                narratage.node.active = true;
                narratage.string = this.levelWords[this.level];

                this.nextLevelData();

                this.scheduleOnce(() => {
                    this.playMgrSFX("幕布");

                    tween(this.maskNode)
                        .by(1, { position: v3(0, 1200, 0) })
                        .call(() => {
                            this.BtnEnable(true);

                            if (this.level === 4) {
                                let touchTs = sprite.node.getComponent(SHJDWZD2_TouchCtrl);
                                touchTs.couldMove = true;
                                touchTs.initData();
                            }

                        })
                        .start();

                }, 2);

            })
            .start();


    }

    BtnEnable(flag: boolean) {
        let BtnMgr = this.node.getChildByName("Btn");

        for (let i = 0; i < BtnMgr.children.length; i++) {
            let btn = BtnMgr.children[i].getComponent(Button);
            btn.enabled = flag;
        }
    }

    nextLevelData() {

        this.rightNode.scale = v3(0, 0, 0);
        this.rightNode.active = false;

        this.wrongNode.scale = v3(0, 0, 0);
        this.wrongNode.active = false;

        this.levelNodes[this.level - 1].active = false;
        this.levelNodes[this.level].active = true;

        this.levelNodes[this.level - 1].getComponent(SHJZWD2_Level).isMove = false;

        this.levelNodes[this.level].getComponent(SHJZWD2_Level).moveSelf();

    }

    playMgrSFX(clipName: string) {
        for (let cilp of this.clips) {
            if (clipName === cilp.name) {
                AudioManager.Instance.PlaySFX(cilp);
            }
        }
    }

    playSFX(clipName: string) {

        if (!AudioManager.IsSoundOn) {
            this.audio.volume = 0;
        }
        else {
            this.audio.volume = 1;
        }

        for (let cilp of this.clips) {
            if (clipName === cilp.name) {
                this.audio.clip = cilp;
                this.audio.play();
            }
        }
    }

    initData() {
        GamePanel.Instance._answerPrefab = this.answerPrefab;

        this.levelNodes = this.node.getChildByName("Level").children;

        this.rightNode = this.node.getChildByName("right");
        this.wrongNode = this.node.getChildByName("wrong");

        this.rightNode.active = false;
        this.wrongNode.active = false;

        this.maskNode = this.node.getChildByName("幕布");

        this.talkWindow = this.node.getChildByName("对话框");
        this.talkLabel = this.talkWindow.getComponentInChildren(Label);

        this.audio = this.getComponent(AudioSource);

        let BtnMgr = this.node.getChildByName("Btn");

        for (let i = 0; i < BtnMgr.children.length; i++) {
            let btn = BtnMgr.children[i].getComponent(Button);

            btn.node.on(Button.EventType.CLICK, this.onBtnClick(i), this);
        }

        this.startAni();

        this.levelNodes[0].getComponent(SHJZWD2_Level).moveSelf();
    }

    startAni() {
        this.BtnEnable(false);

        this.audio.node.once(AudioSource.EventType.ENDED, () => {

            tween(this.maskNode)
                .by(1, { position: v3(0, 1200, 0) })
                .call(() => {
                    this.BtnEnable(true);
                })
                .start();

        })

        let clipName = this.levelWords[this.level];
        this.playSFX(clipName);
    }

}


