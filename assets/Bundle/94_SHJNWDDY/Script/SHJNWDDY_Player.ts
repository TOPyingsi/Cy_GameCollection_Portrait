import { _decorator, AnimationComponent, Component, Label, math, Node, Sprite, SpriteFrame, tween, v3 } from 'cc';
import { SHJNWDDY_GameMgr } from './SHJNWDDY_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('SHJNWDDY_Player')
export class SHJNWDDY_Player extends Component {

    @property({ type: [SpriteFrame] })
    sprites: SpriteFrame[] = [];

    public poisonIndex: number = 0;

    private ani: AnimationComponent = null;

    //对话内容
    private talkLabel: Label = null;

    //对话框
    private talkWindow: Node = null;

    private talkStr: string[] = [
        "看来我的运气挺好",
        "真好吃",
        "你完了",
        "到你了",
        "运气爆棚,挡都挡不住"
    ]

    start() {

        this.ani = this.getComponent(AnimationComponent);
        this.initData();
    }

    initData() {

        this.talkWindow = this.node.getChildByName("对话框");
        this.talkWindow.active = false;

        this.talkLabel = this.talkWindow.getComponentInChildren(Label);
        this.talkLabel.node.active = false;

    }

    /**
     * 吃食物方法，将指定的食物节点移动到当前玩家位置，并触发食物吃完后的回调处理。
     * 
     * @param foodNode 食物节点对象，表示要被吃掉的食物。
     * @param foodIndex 食物索引，用于标识食物在食物列表中的位置。
     * @param poisonIndex 毒药索引，用于判断该食物是否具有毒属性。
     */
    public EatFood(foodNode: Node, foodIndex: number, poisonIndex: number) {

        SHJNWDDY_GameMgr.instance.playSFX("选择");

        // 获取当前玩家的世界坐标，并创建一个副本以避免修改原始数据
        let curPlayerPos = SHJNWDDY_GameMgr.instance.curPlayer.worldPosition.clone();

        let length = foodNode.parent.children.length;
        foodNode.setSiblingIndex(length - 1);

        // 使用tween动画将食物节点在1秒内移动到玩家位置
        tween(foodNode)
            .to(0.5, { scale: v3(1.3, 1.3, 1.3) })
            .to(0.5, { scale: v3(1.3, 1.3, 1.3), worldPosition: curPlayerPos },)
            // 动画完成后调用食物吃完结束回调函数
            .call(() => {

                SHJNWDDY_GameMgr.instance.playSFX("吃");

                foodNode.destroy();
                this.foodEatEnd(foodIndex, poisonIndex);
            })
            .start();
    }

    foodEatEnd(foodIndex: number, poisonIndex: number) {
        this.ani.once(AnimationComponent.EventType.FINISHED, () => {
            if (foodIndex == poisonIndex) {
                SHJNWDDY_GameMgr.instance.gameOver();
                return;
            }

            this.Talk(foodIndex);
        });

        this.ani.play();
    }

    public Talk(foodIndex: number) {

        if (this.node.name === "玩家") {
            SHJNWDDY_GameMgr.instance.playSFX("玩家说话");
        }
        else {
            SHJNWDDY_GameMgr.instance.playSFX("电脑说话");
        }

        this.talkWindow.active = true;

        let random = math.randomRangeInt(0, this.talkStr.length);

        this.talkLabel.string = this.talkStr[random];

        this.talkLabel.node.active = true;

        this.talkWindow.scale = v3(0, 0, 0);
        tween(this.talkWindow)
            .to(0.8, { scale: v3(1, 1, 1) }, { easing: "backOut" })
            .to(1.5, { scale: v3(1, 1, 1) })
            .call(this.nextRound(foodIndex))
            .start();
    }

    nextRound(foodIndex: number) {
        return () => {
            SHJNWDDY_GameMgr.instance.playSFX("打铃");

            tween(this.talkWindow)
                .to(0.8, { scale: v3(0, 0, 0) })
                .call(() => {

                    if (this.node.name === "玩家") {
                        SHJNWDDY_GameMgr.instance.isPlayerRound = false;

                        let index = SHJNWDDY_GameMgr.instance.foodIndexArr.indexOf(foodIndex);
                        SHJNWDDY_GameMgr.instance.foodIndexArr.splice(index, 1);
                    }
                    else {
                        SHJNWDDY_GameMgr.instance.isPlayerRound = true;
                    }

                    SHJNWDDY_GameMgr.instance.changeRound();
                    console.log("下一关");
                })
                .start();
        }

    }
}


