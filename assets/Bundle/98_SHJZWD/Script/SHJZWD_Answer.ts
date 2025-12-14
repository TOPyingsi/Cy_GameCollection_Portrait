import { _decorator, Button, Component, Label, Node, Sprite, SpriteFrame, tween, v3 } from 'cc';
import { SHJZWD_GameMgr } from './SHJZWD_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('SHJZWD_Answer')
export class SHJZWD_Answer extends Component {

    @property({ type: [SpriteFrame] })
    public AnswerSpriteArr: SpriteFrame[] = [];

    private answerStrArr: string[] = [
        "香蕉猴不吃香蕉改吃西瓜了",
        "原来他们俩的健身方式是砍树",
        "橘子肌肉人和冰箱骆驼都口渴了",
        "咖啡忍者又在工作了",
        "咖啡小姐不喜欢木棍人是有原因的",
        "这是个邪恶橘子肌肉人",
        "原来木棍人这么强壮",
        "武士鸟和茶壶人原来密谋上了",
        "木棍人袭击了卡布奇诺小姐",
        "仙人掌企鹅原来是笑面虎"
    ];

    private answerSprite: Sprite = null;
    private answerLabel: Label = null;
    private nextBtn: Button = null;

    start() {
        this.answerSprite = this.node.getChildByName("答案图片").getComponent(Sprite);
        this.answerLabel = this.node.getComponentInChildren(Label);
        this.nextBtn = this.node.getChildByName("下一题").getComponent(Button);

        this.nextBtn.enabled = false;

    }

    public showAnswer() {

        let index = SHJZWD_GameMgr.instance.levelIndex;

        this.answerSprite.spriteFrame = this.AnswerSpriteArr[index];
        this.answerLabel.string = this.answerStrArr[index];

        if (SHJZWD_GameMgr.instance.rightNum === 10) {
            this.nextBtn.node.active = false;
        }

        tween(this.node)
            .to(0.8, { scale: v3(1, 1, 1) }, { easing: "backOut" })
            .call(() => {
                this.nextBtn.enabled = true;
            })
            .start();
    }

    public closeAnswer() {
        this.nextBtn.enabled = false;
        SHJZWD_GameMgr.instance.playSFX("点击");

        SHJZWD_GameMgr.instance.nextLevel();

        tween(this.node)
            .to(0.3, { scale: v3(0, 0, 0) })
            .start();

    }

}


