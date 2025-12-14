import { _decorator, AudioClip, AudioSource, Component, director, Label, math, Node, PageView, Prefab, ScrollView, SpriteFrame, tween, v3 } from 'cc';
import { SHJWZ_Target } from './SHJWZ_Target';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { SHJWZ_TouchCtrl } from './SHJWZ_TouchCtrl';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SHJWZ_GameMgr')
export class SHJWZ_GameMgr extends Component {
    @property(Prefab)
    answerPrefab: Prefab = null;

    @property({ type: [AudioClip] })
    clips: AudioClip[] = [];

    @property({ type: [SpriteFrame] })
    rightSprite: SpriteFrame[] = [];

    public targetView: PageView = null;
    public propView: ScrollView = null;

    public targetTsArr: SHJWZ_Target[] = [];
    public touchTsArr: SHJWZ_TouchCtrl[] = [];

    //正确错误
    @property(Label)
    public wrongLabel: Label = null;

    public rightNum: number = 0;
    public wrongNum: number = 3;

    public rightNode: Node = null;
    public wrongNode: Node = null;

    public passFlag: boolean[] = [false, false, false, false, false, false, false, false, false, false];
    //是否在播放对话
    public isTalk: boolean = false;

    public talkWords: string[] = [
        "手臂上的鱼翅好明显啊,这可怎么办",
        "什么轮胎？我只是身体胖了一点,遮一遮就好了",
        "哎，我 胳膊上毛太多，但害怕脱毛太疼",
        "你看错了，我的腿是晒黑了，不是树",
        "牙口不好让我都不敢张嘴笑了",
        "没有一双美手，我划船都没劲了",
        "腿上只是彩绘，你不喜欢，我就遮一遮",
        "什么鹿角，这是WIFI信号！",
        "我不认识什么咖啡忍者，我只是一个普通的人类",
        "我变成人的时候忘了藏好大象耳朵,你可要为我保密呀",
        "脑袋不是咖啡杯了，但还有个把手，太难看了",
        "怎么感觉头顶红红的，耳朵痒痒的？"
    ]

    private audio: AudioSource = null;

    public static instance: SHJWZ_GameMgr = null;
    start() {
        SHJWZ_GameMgr.instance = this;

        this.initData();
    }

    curIndex = 0;
    nextLevel() {
        console.log("下一关");

        for (let i = 0; i < this.targetView.content.children.length; i++) {
            let target = this.targetView.content.children[i].getComponent(SHJWZ_Target);
            if (!target.isPass) {
                this.curIndex = i;
                this.curID = target.targetID;
                this.changeView(i);
                break;
            }
        }

    }

    isAutoChange: boolean = false;
    changeView(index: number) {

        this.scheduleOnce(() => {

            this.targetView.scrollToPage(index);

            let target = this.targetView.content.children[index].getComponent(SHJWZ_Target);

            this.isAutoChange = false;

            director.getScene().emit("山海经伪装_触发对话", target.targetID);

        }, 1);
    }

    showResult(node: Node) {
        tween(node)
            .to(0.5, { scale: v3(1, 1, 1) })
            .to(1, { scale: v3(1, 1, 1) })
            .call(() => {
                tween(node)
                    .to(0.3, { scale: v3(0, 0, 0) })
                    .start();
            })
            .start();
    }

    public curID: number = -1;
    check(isRight: boolean) {

        if (isRight) {

            this.showResult(this.rightNode);

            this.isOnProp(false);
            this.isTalk = true;

            this.rightNum++;

            this.playMgrSFX("正确");

            this.targetTsArr[this.curID].changeRightSprite();

            this.isAutoChange = true;

            this.scheduleOnce(() => {

                console.log(this.rightNum);

                if (this.rightNum === 12) {
                    console.log("胜利");

                    GamePanel.Instance.Win();
                    return;
                }

                this.nextLevel();
            }, 1.2);

        }
        else {
            this.wrongNum--;


            this.showResult(this.wrongNode);

            this.playMgrSFX("错误");

            this.wrongUI();

            if (this.wrongNum === 0) {
                GamePanel.Instance.Lost();
            }
        }
    }

    wrongUI() {
        this.wrongLabel.string = "剩余错误次数：" + this.wrongNum.toString();
    }

    Talk(index: number) {

        // this.audio.node.once(AudioSource.EventType.ENDED, () => {

        //     this.isOnProp(true);
        //     this.isTalk = false;

        // }, this);

        let interval = 4.2;
        if (this.curID === 4 || this.curID === 7) {
            interval = 3.2;
        }
        else {
            interval = 4.2;
        }

        this.scheduleOnce(() => {
            this.isOnProp(true);
            this.isTalk = false;
        }, interval);

        this.playSFX(index);
    }

    isOnProp(flag: boolean) {
        for (let touchTs of this.touchTsArr) {
            touchTs.couldMove = flag;
        }
    }

    changePage() {
        if (this.isAutoChange) {
            return;
        }

        let curPageID = this.targetView.getCurrentPageIndex();

        let targetNode = this.targetView.content.children[curPageID];

        let targetTs = targetNode.getComponent(SHJWZ_Target);
        this.curID = targetTs.targetID;

        if (targetTs.isPass) {
            return;
        }

        this.isAutoChange = false;

        director.getScene().emit("山海经伪装_触发对话", this.curID);
    }

    getCurTarget(): Node {

        let index = this.targetView.getCurrentPageIndex();

        let targetNode = this.targetView.content.children[index];

        let targetTs = targetNode.getComponent(SHJWZ_Target);

        return targetTs.TouchNode;
    }

    playMgrSFX(clipName: string) {
        for (let cilp of this.clips) {
            if (clipName === cilp.name) {
                this.audio.clip = cilp;
                AudioManager.Instance.PlaySFX(cilp);
            }
        }
    }

    playSFX(index: number) {
        if (!AudioManager.IsSoundOn) {
            this.audio.volume = 0;
        }
        else {
            this.audio.volume = 1;
        }

        this.audio.stop();

        let clip = this.clips[index];
        this.audio.clip = clip;
        this.audio.play();
    }

    initData() {
        this.rightNode = this.node.getChildByName("right");
        this.wrongNode = this.node.getChildByName("wrong");

        this.targetView = this.node.getChildByName("TargetView").getComponent(PageView);
        this.propView = this.node.getChildByName("PropView").getComponent(ScrollView);

        this.audio = this.getComponent(AudioSource);

        //初始化脚本数组
        for (let j = 0; j < this.targetView.content.children.length; j++) {

            let targetNode = this.targetView.content.children[j];
            let targetTs = targetNode.getComponent(SHJWZ_Target);
            this.targetTsArr.push(targetTs);

            let touchNode = this.propView.content.children[j].children[0];
            let touchTs = touchNode.getComponent(SHJWZ_TouchCtrl);
            this.touchTsArr.push(touchTs);
        }

        for (let i = 0; i < 4; i++) {
            //打乱人物顺序
            let random1 = math.randomRangeInt(0, this.targetView.content.children.length);
            this.targetView.content.children[i].setSiblingIndex(random1);

            //打乱道具顺序
            let random2 = math.randomRangeInt(0, this.targetView.content.children.length);
            this.propView.content.children[i].setSiblingIndex(random2);

        }

        GamePanel.Instance._answerPrefab = this.answerPrefab;

        let startTs = this.targetView.content.children[0].getComponent(SHJWZ_Target);

        this.curID = startTs.targetID;

        this.wrongUI();

        this.scheduleOnce(() => {
            this.curIndex = startTs.targetID;
            director.getScene().emit("山海经伪装_触发对话", startTs.targetID);
        }, 0.5);
    }
}