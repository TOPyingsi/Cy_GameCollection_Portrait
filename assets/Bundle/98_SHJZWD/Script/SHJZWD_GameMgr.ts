import { _decorator, AudioClip, Button, Component, Label, math, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { SHJZWD_Answer } from './SHJZWD_Answer';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { SHJZWD_Level } from './SHJZWD_Level';
const { ccclass, property } = _decorator;

@ccclass('SHJZWD_GameMgr')
export class SHJZWD_GameMgr extends Component {

    @property(Prefab)
    answerPrefab: Prefab = null;

    @property({ type: [AudioClip] })
    public Clips: AudioClip[] = [];

    //关卡类型(有几个选项)
    @property()
    public levelType: number = 1;

    public levelNodes: Node[] = [];

    // public levelMap: Map<string, any> = new Map();
    public levelNameArr: string[] = [
        "0香蕉猴",
        "1长颈鹿猩猩",
        "2骆驼橘子",
        "3咖啡忍者",
        "4木棍人",
        "5邪恶橘子",
        "6强壮木棍人",
        "7武士鸟茶壶",
        "8木棍人袭击",
        "9仙人掌企鹅",
    ]

    //关卡答案数据
    public levelAnswerArr: number[][] = [
        [1],
        [0, 2],
        [0, 1],
        [1],
        [0],
        [1],
        [1],
        [0, 1],
        [1],
        [0]
    ]

    //血量
    maxHP: number = 5;
    curHp: number = 5;
    //血量UI
    HPSprites: Sprite[] = [];
    @property(SpriteFrame)
    HPFrame: SpriteFrame = null;

    //剩余次数UI
    tryTimeLabel: Label = null;

    //关卡索引
    public levelIndex: number = 0;
    public level: number = 0;

    public okBtn: Button = null;
    public selectNode: Node[] = [];

    public rightNum: number = 0;

    private answerTs: SHJZWD_Answer = null;

    public static instance: SHJZWD_GameMgr = null;

    start() {
        SHJZWD_GameMgr.instance = this;

        this.initData();
    }

    Right() {
        //正确,弹出答案揭示页面
        this.rightNum++;

        this.showAnswer();

        this.playSFX("正确");

        let levelTs = this.levelNodes[this.level].getComponent(SHJZWD_Level);
        levelTs.offBtn();

        //隐藏选中框和确定
        this.okBtn.node.active = false;
        for (let x = 0; x < this.selectNode.length; x++) {
            this.selectNode[x].active = false;
        }

        console.log(this.rightNum);

        if (this.rightNum === 10) {
            //延迟两秒胜利
            this.scheduleOnce(() => {
                this.playSFX("通关成功");
                GamePanel.Instance.Win();
            }, 2);
        }
    }

    curAnswer: number[] = [];
    onOKBtnClick() {

        this.playSFX("点击");

        if (this.levelType === 1) {
            //判断是否选中的节点个数
            for (let k = 0; k < this.selectNode.length; k++) {
                if (this.selectNode[k].active) {
                    this.curAnswer.push(k);
                }
            }

            let playAnswer = this.curAnswer[0];

            let answerIndex = this.levelAnswerArr[this.levelIndex];

            if (playAnswer === answerIndex[0]) {
                this.Right();
            }
            else {
                //错误扣血
                this.changeHP();

                this.playSFX("错误");

                return;
            }

        } else {

            //判断是否选中的节点个数
            let selectNum = 0;
            for (let k = 0; k < this.selectNode.length; k++) {
                if (this.selectNode[k].active) {
                    selectNum++;
                    this.curAnswer.push(k);
                }
            }

            let answerIndex = this.levelAnswerArr[this.levelIndex];

            let answerNum = answerIndex.length;

            //选择的选项个数与答案个数不符
            if (selectNum !== answerNum) {
                //扣血
                this.changeHP();

                this.playSFX("错误");

                return;
            }

            for (let i = 0; i < answerNum; i++) {

                let index = this.curAnswer.length - (i + 1);

                let playAnswer = this.curAnswer[index];

                let indexOf = answerIndex.indexOf(playAnswer);
                if (indexOf === -1) {
                    //错误,扣血
                    this.changeHP();

                    this.playSFX("错误");

                    return;
                }
            }

            this.Right();

        }

    }

    nextLevel() {
        // this.levelNodes.splice(0, 1);

        this.levelNodes[this.level++].active = false;
        this.levelNodes[this.level].active = true;

        this.okBtn.node.active = true;

        this.curAnswer.splice(0);
    }

    showAnswer() {
        this.answerTs.showAnswer();
    }

    changeHP() {
        this.curHp--;

        this.curAnswer.splice(0);
        //隐藏选中框
        for (let x = 0; x < this.selectNode.length; x++) {
            this.selectNode[x].active = false;
        }

        this.HPSprites[this.curHp].spriteFrame = this.HPFrame;
        this.tryTimeLabel.string = "剩余尝试次数：" + this.curHp.toString();

        if (this.curHp <= 0) {
            //血量见底失败
            this.playSFX("通关失败");

            GamePanel.Instance.Lost();
        }

        console.error("选错了");
    }

    playSFX(clipName: string) {
        for (let clip of this.Clips) {
            if (clip.name === clipName) {
                AudioManager.Instance.PlaySFX(clip);
                return;
            }
        }
    }

    changeTitle() {
        let title = this.node.getChildByName("Title").getComponent(Label);
        let str = "";
        if (this.levelType === 1) {
            str = "单选";
        }
        else {
            str = "多选";
        }
        title.string = "这张图片中哪只合成兽是卧底? (" + str + ")";
    }

    Disturb() {
        for (let times = 0; times < 5; times++) {
            let random = math.randomRangeInt(0, 10);
            this.levelNodes[this.levelIndex].setSiblingIndex(random);
        }
    }

    initData() {

        this.selectNode = this.node.getChildByName("选中圈").children;

        this.okBtn = this.node.getChildByName("确定").getComponent(Button);

        this.tryTimeLabel = this.node.getChildByName("剩余次数").getComponent(Label);

        this.answerTs = this.node.getChildByName("答案揭示").getComponent(SHJZWD_Answer);

        let levelMgr = this.node.getChildByName("bg");

        let hpParent = this.node.getChildByName("生命条");

        //获取生命条Sprite组件
        for (let j = 0; j < hpParent.children.length; j++) {

            let sprite = hpParent.children[j].getComponent(Sprite);
            this.HPSprites.push(sprite);

        }

        //存储关卡节点
        this.levelNodes = levelMgr.children;

        for (let i = 0; i < this.levelNodes.length; i++) {
            let levelTs = this.levelNodes[i].getComponent(SHJZWD_Level);
            levelTs.initData(i);
        }

        this.Disturb();

        this.levelNodes = levelMgr.children;

        this.levelNodes[0].active = true;

        this.okBtn.node.on(Button.EventType.CLICK, this.onOKBtnClick, this);

        GamePanel.Instance._answerPrefab = this.answerPrefab;

        this.changeTitle();
    }

}


