import { _decorator, AnimationComponent, AudioClip, AudioSource, Component, Label, Node, Prefab, Sprite, SpriteFrame, tween, v3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { WNJF_Player } from './WNJF_Player';
const { ccclass, property } = _decorator;


export enum PropType {
    "狗完成" = "感谢小狗,不白把你们养这么胖",
    "太阳" = "太阳亲自为我做桑拿,真是效果显著",
    "梨子" = "梨是减肥的好帮手",
    "仙人掌" = "感觉全身穴位都被贯通了",
    "木棍" = "为了瘦下来,这点痛我忍了",
    "蔬菜" = "只能尝尝味缓解一下相思之情了",
    "减肥茶" = "这减肥茶效果有点好啊",
    "苹果" = "苹果可以让我有饱腹感,少吃点饭",
    "失败" = "呜呜呜,我怎么就管不住自己的嘴呢"
}

@ccclass('WNJF_GameMgr')
export class WNJF_GameMgr extends Component {

    @property(Prefab)
    answerPrefab: Prefab = null;

    @property(Node)
    PlayerNode: Node = null;

    @property({ type: [AudioClip] })
    cilps: AudioClip[] = [];

    @property({ type: [Sprite] })
    bodySprites: Sprite[] = [];

    @property({ type: [Sprite] })
    headSprites: Sprite[] = [];

    @property({ type: [SpriteFrame] })
    headSpriteFrames: SpriteFrame[] = [];

    @property({ type: [SpriteFrame] })
    weightSpriteFrames: SpriteFrame[] = [];

    @property({ type: [SpriteFrame] })
    handUpSpriteFrames: SpriteFrame[] = [];

    @property(Label)
    public weightLabel: Label = null;

    public curWeight: number = 200;

    public talkWindow: Node = null;
    public talkLabel: Label = null;

    //需要合成的道具
    @property({ type: [Node] })
    public complexProps: Node[] = [];

    public isTalk: boolean = false;

    public ani: AnimationComponent = null;

    public playerTs: WNJF_Player = null;

    public isGameOver: boolean = false;

    private audio: AudioSource = null;

    public static instance: WNJF_GameMgr = null;

    start() {
        WNJF_GameMgr.instance = this;

        this.initData();

    }

    @property({ type: [Node] })
    hands: Node[] = [];
    changeSprite(index: number) {
        this.bodySprites[0].spriteFrame = this.weightSpriteFrames[index];
        this.bodySprites[1].spriteFrame = this.handUpSpriteFrames[index];

        if (this.curWeight > 150) {
            this.hands[0].scale = v3(1.2, 1.2, 1);
            this.hands[1].scale = v3(1.2, 1.2, 1);

            this.hands[0].position = v3(221.3, 573.5, 0);
            this.hands[1].position = v3(215, 680.3, 0);
        }
        else {
            this.hands[0].scale = v3(1, 1, 1);
            this.hands[1].scale = v3(1, 1, 1);

            this.hands[0].position = v3(176.5, 573.5, 0);
            this.hands[1].position = v3(164.7, 661.3, 0);
        }


        for (let i = 0; i < this.bodySprites.length; i++) {
            this.headSprites[i].spriteFrame = this.headSpriteFrames[index];
        }
    }

    Right(propName: string, weightNum: number) {

        this.isTalk = true;

        this.curWeight -= weightNum;
        this.weightLabel.string = "体重：" + this.curWeight.toString();

        //减肥:更新重量UI,更新对话框内容,播放动画
        let talkStr = PropType[propName];
        this.talkLabel.string = talkStr;



        // this.Talk(talkStr);
        let aniName = propName + "正确";

        console.log("播放动画：" + aniName);

        this.EffectAni(aniName, talkStr);
    }

    Wrong() {
        this.isTalk = true;

        let lostStr = PropType["失败"];
        this.talkLabel.string = lostStr;

        // this.showTalkWindow(true);

        this.playerTs.playAni("失败");
        this.Talk("失败");
    }

    EffectAni(aniName: string, talkStr: string) {

        switch (aniName) {
            case "太阳正确":
                this.playMgrSFX("太阳沐浴音效");
                break;
            case "木棍正确":
                this.playMgrSFX("锤子锤音效");
                break;
            case "减肥茶正确":
                this.playMgrSFX("减肥茶音效");
                break;
            case "狗完成正确":
                this.playerTs.playAni("举重");

                this.scheduleOnce(() => {
                    this.Talk(talkStr);
                    this.showTalkWindow(true);
                }, 2);

                return;

            case "仙人掌正确":
                this.ani.once(AnimationComponent.EventType.FINISHED, () => {

                    this.Talk(talkStr);
                    this.showTalkWindow(true);

                }, this);

                this.ani.play(aniName);
                return;
            default:
                this.Talk(talkStr);
                this.showTalkWindow(true);
                return;
        }

        console.log("播放合成道具");

        this.ani.once(AnimationComponent.EventType.FINISHED, () => {

            this.Talk(talkStr);
            this.showTalkWindow(true);

        }, this);

        this.ani.play(aniName);
    }

    Talk(cilpName: string) {

        // this.audio.node.once(AudioSource.EventType.ENDED, () => {

        //讲话
        this.scheduleOnce(() => {

            //讲话结束
            this.scheduleOnce(() => {
                if (cilpName === "失败") {
                    this.Lost();
                    return;
                }
                if (this.curWeight === 70) {
                    this.isGameOver = true;
                    this.showTalkWindow(false);

                    this.playSFX("胜利");

                    this.playerTs.playAni("胜利");
                    return;
                }

                //减肥阶段效果
                if (this.curWeight <= 100) {
                    this.headSprites[0].node.scale = v3(1, 1, 1);
                    this.headSprites[1].node.scale = v3(1, 1, 1);
                    this.changeSprite(2);
                }
                else if (this.curWeight <= 150) {
                    this.changeSprite(1);
                }

                this.isTalk = false;
                this.showTalkWindow(false);
            }, 0.2);

        }, 2.8);


        // });

        this.playSFX(cilpName);

    }

    showTalkWindow(flag: boolean) {

        let scale = flag ? v3(1, 1, 1) : v3(0, 0, 0);

        tween(this.talkWindow)
            .to(0.5, { scale: scale })
            .start();
    }

    playMgrSFX(cilpName: string) {
        for (let clip of this.cilps) {
            if (clip.name === cilpName) {
                AudioManager.Instance.PlaySFX(clip);
            }
        }
    }

    playSFX(cilpName: string) {
        if (!AudioManager.IsSoundOn) {
            this.audio.volume = 0;
        }
        else {
            this.audio.volume = 1;
        }

        for (let clip of this.cilps) {
            if (clip.name === cilpName) {
                this.audio.clip = clip;
                this.audio.play();
            }
        }
    }

    playerStart() {

        this.scheduleOnce(() => {
            this.isTalk = false;
            this.playerTs = this.PlayerNode.getComponent(WNJF_Player);
            this.playerTs.startGame();
        }, 0.3);
    }

    Win() {
        console.log(0);
        this.scheduleOnce(() => {
            console.log(1);

            GamePanel.Instance.Win();
        }, 3.5);
    }

    Lost() {
        this.scheduleOnce(() => {
            GamePanel.Instance.Lost();
        }, 0.5);
    }

    startAni() {
        this.isTalk = true;

        this.playSFX("我不喜欢堕落的你");

        this.scheduleOnce(() => {

            this.playSFX("不要走，我这就减肥");

            this.scheduleOnce(this.playerStart, 2.2);
        }, 3.2);

        this.ani.play("开始");
    }

    initData() {

        GamePanel.Instance._answerPrefab = this.answerPrefab;

        this.talkWindow = this.node.getChildByName("对话框");
        this.talkLabel = this.talkWindow.getComponentInChildren(Label);

        this.audio = this.getComponent(AudioSource);
        this.ani = this.getComponent(AnimationComponent);

        this.startAni();
    }
}


