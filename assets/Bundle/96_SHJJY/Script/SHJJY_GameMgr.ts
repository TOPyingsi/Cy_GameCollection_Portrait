import { _decorator, AudioClip, AudioSource, bezier, Button, Component, JsonAsset, Label, math, Node, Prefab, Sprite, SpriteFrame, tween, UITransform, v3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { SHJJY_Target } from './SHJJY_Target';
import { BundleManager } from 'db://assets/Scripts/Framework/Managers/BundleManager';
import { TRAILMODULE } from '../../../../extensions/plugin-import-2x/creator/components/TrailModule';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SHJJY_GameMgr')
export class SHJJY_GameMgr extends Component {

    @property(JsonAsset)
    jsonData: JsonAsset = null;

    @property(Prefab)
    answerPrefab: Prefab = null;

    @property({ type: [AudioClip] })
    talkClip: AudioClip[] = [];

    @property({ type: [AudioClip] })
    answerClip: AudioClip[] = [];

    @property(SpriteFrame)
    playingSprite: SpriteFrame = null;

    @property(Node)
    monsterNode: Node = null;

    @property(AudioClip)
    MonsterClip: AudioClip = null;

    @property(AudioClip)
    PlayerClip: AudioClip = null;

    @property(AudioClip)
    finnalClip: AudioClip = null;

    @property(AudioClip)
    lostClip: AudioClip = null;

    public playerTs: SHJJY_Target = null;

    //对象节点数组
    public targetNodeArr: Node[] = [];

    //对象脚本数组
    public targetTsArr: SHJJY_Target[] = [];

    //当前关卡索引
    public level: number = -1;

    public playerStrArr: string[] = [];

    public jsonMap: Map<string, any> = new Map();

    public jsonName: string[] = [
        "0鲨鱼",
        "1树",
        "2仙人掌",
        "3香蕉猴",
        "4星球牛",
        "5鳄鱼",
        "6木棍人"
    ];

    public playerNode: Node = null;

    public isRight: boolean = false;
    public isGameOver: boolean = false;


    private audio: AudioSource = null;
    private isCheckingAudio: boolean = true;

    public static instance: SHJJY_GameMgr = null;
    start() {
        SHJJY_GameMgr.instance = this;

        this.audio = this.getComponent(AudioSource);

        GamePanel.Instance._answerPrefab = this.answerPrefab;

        this.playerNode = this.node.getChildByName("Targets").getChildByName("Player");
        this.playerTs = this.playerNode.getComponent(SHJJY_Target);
        this.playerMoveSelf();

        this.initData();

        this.startAni();
    }

    initData() {
        let targetParent = this.node.getChildByName("Targets").getChildByName("Level");
        for (let j = 0; j < targetParent.children.length; j++) {
            this.targetNodeArr.push(targetParent.children[j]);
        }

        for (let i = 1; i < this.targetNodeArr.length; i++) {
            let target = this.targetNodeArr[i].getComponent(SHJJY_Target);
            this.targetTsArr.push(target);
        }

        for (let i = 0; i < this.jsonName.length; i++) {
            this.jsonMap.set(this.jsonName[i], this.jsonData.json[i]);
        }

        // BundleManager.LoadJson("96_SHJJY", "talkJson").then((jsonAsset: JsonAsset) => {
        //     for (let i = 0; i < this.jsonName.length; i++) {
        //         this.jsonMap.set(this.jsonName[i], jsonAsset.json[i]);
        //     }
        // });
    }

    playSFX(index: number, clip?: AudioClip) {
        this.audio.volume = 1;

        if (!AudioManager.IsSoundOn) {
            this.audio.volume = 0;
        }

        if (clip) {
            this.audio.clip = clip;
        }
        else {
            this.audio.clip = this.talkClip[index];
        }

        this.audio.play();

        if (this.level === -1) {
            return;
        }

        // if (this.isRight) {
        //     this.isRight = false;
        // }

        if (!this.isCheckingAudio) {
            return;
        }

        this.audio.node.once(AudioSource.EventType.ENDED, () => {
            if (this.level === 6) {
                this.targetTsArr[this.level].Finnal();
            }
            this.AudioEnd();
        });

    }

    playLost() {

        console.error(111111);
        this.audio.node.once(AudioSource.EventType.ENDED, () => {
            this.audio.clip = this.answerClip[this.answerClip.length - 1];
            this.isCheckingAudio = false;
            this.audio.play();

            this.scheduleOnce(() => {
                GamePanel.Instance.Lost();
            }, 1);
        });

        let curTarget = this.targetTsArr[this.level];
        curTarget.closeTalk();

        tween(this.monsterNode)
            .by(0.5, { position: v3(-600, 0, 0) })
            .call(() => {
                this.isCheckingAudio = false;

                let monsterTs = this.monsterNode.getComponent(SHJJY_Target);

                monsterTs.Talk("我要饱餐一顿", this.lostClip);
            })
            .start();

    }

    playerAnswer(index: number, targetClip: AudioClip) {
        this.isCheckingAudio = false;

        this.targetTsArr[this.level].closeTalk();

        //获取当前关卡对象数据
        let jsonName = this.jsonName[this.level];
        //选择的选项的文本数据
        let answerStr = this.jsonMap.get(jsonName).playerArr[index];
        //当前关卡对象的回答文本数据
        let targetStr = this.jsonMap.get(jsonName).strArr[index + 1];

        let clipIndex = this.level * 3 + index;
        let clip = this.answerClip[clipIndex];

        this.playerTs.Talk(answerStr, clip);

        this.audio.node.once(AudioSource.EventType.ENDED, () => {

            this.playerTs.closeTalk();

            this.scheduleOnce(() => {
                this.chooseEnd(targetStr, targetClip);
            }, 0.2);

        });


    }

    chooseEnd(targetStr: string, targetClip: AudioClip) {
        this.targetTsArr[this.level].Talk(targetStr, targetClip);

        this.audio.node.once(AudioSource.EventType.ENDED, () => {

            //选项正确
            if (this.isRight) {
                this.isRight = false;
                this.targetTsArr[this.level].winMove();
                this.resetBtn();
            }
            //选项错误
            else {
                this.playLost();
            }

        });
    }

    nextLevel() {
        this.level++;

        this.isCheckingAudio = true;

        let levelNode = this.node.getChildByName("Targets").getChildByName("Level");

        tween(levelNode)
            .by(1, { position: v3(0, 1600, 0) })
            .call(() => {

                this.targetTsArr[this.level].Talk();

            })
            .start();

    }

    playWin() {

        this.isGameOver = true;
        let clip = this.finnalClip;

        this.audio.playOneShot(clip);

        this.scheduleOnce(() => {
            clip = this.talkClip[this.talkClip.length - 1];

            this.scheduleOnce(() => {
                GamePanel.Instance.Win();
            }, 3);

            this.targetTsArr[this.level].closeTalk();
            this.playerTs.Talk("反正你跟宇宙木棍人关系好，自求活路吧", clip);
        }, 1);

    }

    sign: number = 1;
    playerMoveSelf() {
        tween(this.playerNode)
            .by(1, { eulerAngles: v3(0, 0, 2 * this.sign) })
            .call(() => {
                this.sign = -this.sign;
                this.playerMoveSelf();
            })
            .start();
    }

    onBtnClick(index: number) {
        return () => {
            console.log("点击了按钮");

            console.log(index);

            let btnMgr = this.node.getChildByName("Btn");

            btnMgr.active = false;

            switch (index) {
                case 1:
                    this.isRight = true;

                    if (this.level === 6) {
                        this.isRight = false;
                    }

                    break;
                case 2:
                case 3:
                    this.isRight = false;

                    break;
            }

            let clipIndex = this.level * 4 + index;

            let clip = this.talkClip[clipIndex];

            this.playerAnswer(index - 1, clip);

        }
    }

    resetBtn() {

        if (this.isGameOver) {
            return;
        }

        let btnMgr = this.node.getChildByName("Btn");

        let A = btnMgr.getChildByName("ABtn");
        let B = btnMgr.getChildByName("BBtn");
        let C = btnMgr.getChildByName("CBtn");

        A.setSiblingIndex(0);
        B.setSiblingIndex(1);
        C.setSiblingIndex(2);

    }

    disturb() {

        let btnMgr = this.node.getChildByName("Btn");

        let jsonName = this.jsonName[this.level];
        let strData = this.jsonMap.get(jsonName).choiceArr;

        for (let i = 0; i < btnMgr.children.length; i++) {
            let label = btnMgr.children[i].getComponentInChildren(Label);
            label.string = strData[i];
        }

    }

    private AudioEnd() {
        if (this.level === -1) {
            return;
        }

        console.log("讲话结束");

        let btnMgr = this.node.getChildByName("Btn");

        btnMgr.active = true;

        this.disturb();

        btnMgr.children[0].once(Button.EventType.CLICK, this.onBtnClick(1), this);
        btnMgr.children[1].once(Button.EventType.CLICK, this.onBtnClick(2), this);
        btnMgr.children[2].once(Button.EventType.CLICK, this.onBtnClick(3), this);

        let random = math.randomRangeInt(0, 3);

        btnMgr.children[0].setSiblingIndex(random);

    }

    setCheckAudioEnd(flag: boolean) {
        this.isCheckingAudio = flag;
    }

    //开始动画
    startAni() {
        this.scheduleOnce(() => {
            let monsterStr = "还是山海经食物好吃";

            let monsterTs = this.monsterNode.getComponent(SHJJY_Target);

            monsterTs.Talk(monsterStr, this.MonsterClip);

            this.scheduleOnce(() => {

                monsterTs.closeTalk();

                tween(this.monsterNode)
                    .by(0.5, { position: v3(600, 0, 0) })
                    .by(0.1, { position: v3(0, 155, 0) })
                    .call(() => {
                        let playerStr = "不好我要去通知山海经们!";
                        this.playerTs.Talk(playerStr, this.PlayerClip);

                        this.scheduleOnce(() => {
                            //关闭对话框
                            this.playerTs.closeTalk();

                            //更换玩家图片
                            let playerSprite = this.playerNode.getComponent(Sprite);
                            playerSprite.spriteFrame = this.playingSprite;
                            let uiTrans = this.playerNode.getComponent(UITransform);
                            uiTrans.height = 1477;
                            this.playerNode.position.add(v3(0, 300, 0));

                            //下移动画
                            this.nextLevel();

                        }, 1.2);
                    })
                    .start();

            }, 1);

        }, 1);
    }
}


