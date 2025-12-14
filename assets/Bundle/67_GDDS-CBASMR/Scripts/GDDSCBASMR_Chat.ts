import { _decorator, CCBoolean, Component, Label, Node, randomRangeInt, Sprite, tween, UIOpacity, v3, Vec3 } from 'cc';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import { eventCenter } from './GDDSCBASMR_EventCenter';
import { GDDSCBASMR_AudioManager } from './GDDSCBASMR_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_Chat')
export class GDDSCBASMR_Chat extends Component {

    @property(CCBoolean)
    isPrefab = false;

    sprite: Sprite;
    label: Label;
    uiOpacity: UIOpacity;

    chats: string[] = [
        "这是甜味与咸味的完美平衡。", "我对你的吃饭速度印象深刻。", "我打算自己试着做这个！", "背景音乐太放松了！", "这就是盘中的天堂！",
        "我从来没吃过这样的东西。", "你让我饿了！", "新的观看量！😎😎😎", "我喜欢看你吃饭！😙😙😙", "这是雨天的完美食物！",
        "你真是个大胃王！😅😅😅", "你是我一天中最棒的部分！", "希望你能很快做更多的吃播！", "我永远吃不下这么多！", "我好饿！😍😍",
        "我们来创建一个吃播挑战吧！", "你怎么吃得完所有这些？", "你怎么吃得这么快？", "香料搭配的真好！", "我停不下来看！", "我会为你加油！",
        "我是你的粉丝已经很久了！", "这是最棒的吃播社区！", "继续努力，你做的很好！", "我也想吃！😎", "你真是个激励人心的榜样！",
        "这是我新的最爱安慰食物！", "你的吃播真的很放松！", "我感觉我在和你一起吃饭！", "你能做更多菜吗？", "这是我度过午休的最佳方式！",
        "你可以做更多的ASMR视频吗？", "这道菜看起来很有吸引力！", "好吃好吃！😍😍😍", "我觉得我陷入食物昏迷了！", "拍摄角度真美！"
    ]

    protected onLoad(): void {
        this.sprite = this.node.children[0].children[0].getComponent(Sprite);
        this.label = this.node.children[1].children[0].getComponent(Label);
        this.uiOpacity = this.getComponent(UIOpacity);
    }

    protected onEnable(): void {
        GDDSCBASMR_AudioManager.Instance._PlaySound(45);
        this.node.setPosition(Vec3.ZERO);
        this.node.children[1].setScale(Vec3.ZERO);
        this.uiOpacity.opacity = 255;
        if (this.sprite) {
            if (GDDSCBASMR_DataManager.chatSfs) this.sprite.spriteFrame = GDDSCBASMR_DataManager.chatSfs[randomRangeInt(0, GDDSCBASMR_DataManager.chatSfs.length)];
            else eventCenter.once("chatSfs", () => { this.sprite.spriteFrame = GDDSCBASMR_DataManager.chatSfs[randomRangeInt(0, GDDSCBASMR_DataManager.chatSfs.length)]; }, this);
            this.label.string = this.chats[randomRangeInt(0, this.chats.length)];
        }
        tween(this.node.children[1])
            .to(1, { scale: Vec3.ONE }, { easing: EasingType.elasticOut })
            .call(() => {
                tween(this.node)
                    .by(0.5, { position: v3(0, 100) }, { easing: EasingType.circOut })
                    .delay(0.5)
                    .union()
                    .repeat(2)
                    .call(() => {
                        tween(this.uiOpacity)
                            .to(0.5, { opacity: 0 }, { easing: EasingType.circOut })
                            .start();
                    })
                    .by(0.5, { position: v3(0, 100) }, { easing: EasingType.circOut })
                    .call(() => {
                        if (this.isPrefab) PoolManager.PutNode(this.node);
                        else this.node.active = false;
                    })
                    .start();
            })
            .start();

    }

}