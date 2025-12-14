import { _decorator, AudioClip, Camera, Component, Label, Node, PageView, Prefab, ScrollView, Sprite, SpriteFrame, UITransform } from 'cc';
import { ZHSHJ_Change } from './ZHSHJ_Change';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';

const { ccclass, property } = _decorator;

@ccclass('ZHSHJ_GameManager')
export class ZHSHJ_GameManager extends Component {
    public static Instance: ZHSHJ_GameManager = null;

    @property(Prefab)
    Answer: Prefab = null;
    //对象视图组件
    @property(PageView)
    targetView: PageView = null;
    //道具滚动视图组件
    @property(ScrollView)
    propsView: ScrollView = null;
    //变形前的对象
    @property({ type: [UITransform] })
    Targets: UITransform[] = [];
    //错误次数UI节点
    @property(Node)
    wrongNode: Node;
    //正确UI节点
    @property(Node)
    rightNode: Node;
    //判断正误UI节点
    @property(Node)
    Judgment: Node;
    //判断正误图片
    @property({ type: [SpriteFrame] })
    JudgmentSprites: SpriteFrame[] = [];

    @property({ type: [SpriteFrame] })
    winSprites: SpriteFrame[] = [];

    //音效
    @property({ type: [AudioClip] })
    judgmentClips: AudioClip[] = [];
    @property({ type: [AudioClip] })
    winClips: AudioClip[] = [];

    public GamePause: boolean = false;

    public changeTsArr: ZHSHJ_Change[] = [];
    //未通过的界面索引
    private failedIndexs: number[] = [];
    //允许错误的次数
    private _wrong: number = 3;
    private _maxRight: number = 0;
    private _right: number = 0;

    private _targetNames: string[] = [
        "人",
        "鲨鱼",
        "鳄鱼",
        "妖精",
        "大象",
        "熊",
        "猿猴",
        "奶牛",
        "青蛙",
        "鹅"
    ]

    private _winStr: string[] = [
        "tung tung tung tung sahur",
        "tralalero tralala",
        "bombardino crocodilo",
        "brr brr patapim",
        "lirili larlla",
        "troppi troppa trippa",
        "chimpanzinni bananini wow wow wow",
        "la vacca saturno saturnita",
        "Boneca Ambalam",
        "Bombombini guzini",
    ]

    onLoad() {
        ZHSHJ_GameManager.Instance = this;
        for (let i = 0; i < this.Targets.length; i++) {
            //对目标添加脚本组件并初始化状态,0为未通过1为通过
            let changeTs = this.Targets[i].node.addComponent(ZHSHJ_Change);
            this.changeTsArr.push(changeTs);
            this.failedIndexs[i] = 0;
        }
    }

    start() {
        for (let i = 0; i < this.Targets.length; i++) {
            //初始化目标对象的文本内容
            let labelNode = this.Targets[i].node.parent.getChildByName("name");
            let label = labelNode.getComponent(Label);
            label.string = this._targetNames[i];
        }
        this.rightNode.active = false;
        this.Judgment.active = false;
        //通关需要通过多少次数交互
        this._maxRight = this._targetNames.length;
        GamePanel.Instance.answerPrefab = this.Answer;
    }

    update(deltaTime: number) {

    }

    public win(index: number) {
        //设置目标交互状态为通过
        this.failedIndexs[index] = 1;
        this.GamePause = true;

        //从前往后寻找未通过的交互目标
        for (let i = 0; i < this.failedIndexs.length; i++) {
            if (this.failedIndexs[i] === 0) {
                //延迟后快速返回未通过的界面
                this.scheduleOnce(() => {
                    this.targetView.scrollToPage(i, 0.5);
                    this.GamePause = false;
                    this.winUI(index, false);
                    this.Judgment.active = false;
                    //this.propsView.vertical = true;
                });
                break;
            }
        }

        this._right++;
        if (this._right === this._maxRight) {
            GamePanel.Instance.Win();
        }
    }

    public lost() {
        this._wrong--;
        if (this._wrong === 0) {
            //失败逻辑
            GamePanel.Instance.Lost();
        }
        let wrongStr = this.wrongNode.getComponent(Label);
        wrongStr.string = "错误次数: " + this._wrong;
        this.scheduleOnce(() => {
            this.Judgment.active = false;
        }, 2);
    }

    //显示正确的文本UI
    public winUI(index: number, flag: boolean) {
        this.rightNode.active = flag;
        let label = this.rightNode.getChildByName("winText").getComponent(Label);
        label.string = this._winStr[index];
        // this.playWinAudio(index);
    }

    public playWinAudio(index: number) {
        let clip = this.winClips[index];
        AudioManager.Instance.PlaySFX(clip);
    }


    public JudgmentAnsewr(flag: boolean) {
        let sprite = this.Judgment.getComponent(Sprite);
        let winSprite = this.JudgmentSprites[0];
        let lostSprite = this.JudgmentSprites[1];

        if (flag) {
            sprite.spriteFrame = winSprite;
            //AudioManager.Instance.PlaySFX(this.judgmentClips[0]);
        }
        else {
            sprite.spriteFrame = lostSprite;
            AudioManager.Instance.PlaySFX(this.judgmentClips[1]);
        }
        sprite.node.active = true;
    }
}