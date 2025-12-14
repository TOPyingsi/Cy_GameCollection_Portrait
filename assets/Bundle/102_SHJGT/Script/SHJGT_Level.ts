import { _decorator, AnimationComponent, Component, Label, Node, Sprite, SpriteFrame, tween, v3 } from 'cc';
import { SHJGT_TouchControl } from './SHJGT_TouchControl';
import { SHJGT_GameMgr } from './SHJGT_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('SHJGT_Level')
export class SHJGT_Level extends Component {

    @property({ type: [SpriteFrame] })
    fakeSpriteFrames: SpriteFrame[] = [];

    @property({ type: [Sprite] })
    fakeSprites: Sprite[] = [];

    @property()
    public levelID: number = 0;

    @property()
    public maxStepNum: number = 4;

    public talkLabel: Label = null;

    public talkWindow: Node = null;

    public targetArr: Node[] = [];
    public stepTsArr: SHJGT_TouchControl[] = [];

    private humanNode: Node = null;
    private stepNum: number = 0;

    private fakeSpriteIndexs: number[][] = [
        [0, 1, 1],
        [0, 0, 0],
        [0, 0, 0],
        [0, 1, 1]
    ];

    private startStrArr: string[] = [
        "太突然了!我刚卸了妆!",
        "糟了!我得快点伪装起来!",
        "成天查查查,快烦死了!",
        "行行行,你稍等一下"
    ]

    private talkStrArr: string[][] = [
        ["芭蕾服很适合我", "这是现做的卡布奇诺", "给咖啡杯画个五官"],
        ["换了个酷炫的身体", "热得我都变成耐旱生物了", "好多山海经生物都有一双大脚"],
        ["时间倒退几万年,大家都是猩猩", "这个身体一点曲线都没有", "还得卸妆,好烦啊"],
        ["这身材哪有我的好", "暂时委屈一下我帅气的脸", "青蛙不需要裤子"]
    ]

    public fakeNum: number = 0;
    private talkNum: number = 0;

    protected start(): void {

        this.BgNode = this.node.getChildByName("Bg");

        this.humanNode = this.BgNode.getChildByName("Fake");

        this.humanMove();
    }

    nextStep(propID: number, needTalk: boolean) {

        if (this.levelID === 1) {
            this.fakeSprites[1].node.active = false;
        }

        //更换当前步骤的图片

        //展示对话框和对话

        this.stepNum++;

        if (needTalk) {

            this.talkLabel.string = this.talkStrArr[this.levelID][this.fakeNum];

            let index = this.fakeSpriteIndexs[this.levelID][this.fakeNum];

            let spriteFrame = this.fakeSpriteFrames[this.fakeNum];

            this.fakeSprites[index].spriteFrame = spriteFrame;

            if (this.levelID === 0 && this.fakeNum === 1) {
                this.humanNode.getChildByName("一楼人头").active = false;
            }

            this.talkNum++;
            this.fakeNum++;

            this.showTalkWindow();
        }
        else {
            SHJGT_GameMgr.instance.playMgrSFX("物品正确");
        }

        if (this.stepNum >= this.maxStepNum) {
            return;
        }

        this.stepTsArr[this.stepNum].isLock = false;

        this.stepTsArr[this.stepNum].node.active = true;
    }

    lostAni() {
        let ani = this.humanNode.getComponent(AnimationComponent);

        ani.play();
    }

    public openDoor(): boolean {
        let doors: Node[] = [];

        doors[0] = this.BgNode.getChildByName("完整墙壁");
        doors[1] = this.BgNode.getChildByName("开门");

        doors[0].active = false;
        doors[1].active = true;

        return this.fakeNum === 3 ? true : false;
    }

    public showTalkWindow() {

        let index: number = this.levelID * 4 + this.talkNum;

        this.scheduleOnce(() => {
            SHJGT_GameMgr.instance.playCommon(index);
        }, 0.3);

        tween(this.talkWindow)
            .to(0.3, { scale: v3(1, 1, 1) }, { easing: "backOut" })
            .start();
    }

    isFirst: boolean = true;
    public closeTalkWindow() {
        tween(this.talkWindow)
            .to(0.3, { scale: v3(0, 0, 0) })
            .call(() => {
                if (this.isFirst) {
                    this.isFirst = false;

                    for (let i = 0; i < this.stepTsArr.length; i++) {
                        this.stepTsArr[i].initData();
                    }
                }
            })
            .start();
    }

    sign: number = 1;
    humanMove() {
        tween(this.humanNode)
            .by(1, { scale: v3(0, 0.02 * this.sign, 0) })
            .call(() => {
                this.sign = -this.sign;
                this.humanMove();
            })
            .start();
    }

    public BgNode: Node = null;
    initData() {

        this.targetArr = this.BgNode.getChildByName("human").children;

        let props = this.BgNode.getChildByName("props");

        for (let i = 0; i < props.children.length; i++) {
            let stepTs = props.children[i].getComponent(SHJGT_TouchControl);
            this.stepTsArr.push(stepTs);
        }

        this.talkWindow = this.node.getChildByName("对话框");
        this.talkLabel = this.talkWindow.getComponentInChildren(Label);

        this.talkLabel.string = this.startStrArr[this.levelID];

    }

}


