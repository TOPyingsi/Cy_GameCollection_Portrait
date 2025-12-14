import { _decorator, AnimationComponent, AudioClip, Component, instantiate, math, Node, Prefab, Sprite, SpriteFrame, tween, v3, Vec3 } from 'cc';
import { SHJNWDDY_Food } from './SHJNWDDY_Food';
import { SHJNWDDY_Player } from './SHJNWDDY_Player';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SHJNWDDY_GameMgr')
export class SHJNWDDY_GameMgr extends Component {

    @property({ type: [AudioClip] })
    audioClips: AudioClip[] = [];

    @property(Node)
    ArrowNode: Node = null;

    /**
     * 存储食物图片的数组
     * @type {SpriteFrame[]}
     */
    @property({ type: [SpriteFrame] })
    foodImgArr: SpriteFrame[] = [];

    /**
     * 食物预设，用于创建新的食物实例
     * @type {Prefab}
     */
    @property(Prefab)
    foodPrefab: Prefab = null;

    /**
     * 存储所有食物节点的数组
     * @type {Node[]}
     */
    public foodArr: Node[] = [];

    /**
     * 存储所有食物组件的数组
     * @type {SHJNWDDY_Food[]}
     */
    public foodTsArr: SHJNWDDY_Food[] = [];

    /**
     * 存储所有食物索引的数组
     * @type {number[]}
     */
    public foodIndexArr: number[] = [];

    /**
     * 玩家的节点实例
     * @type {SHJNWDDY_Player}
     */
    public PlayerTs: SHJNWDDY_Player = null;

    /**
     * AI玩家的节点实例
     * @type {SHJNWDDY_Player}
     */
    public PlayerAITs: SHJNWDDY_Player = null;

    /**
     * 是否可以点击的状态标志
     * @type {boolean}
     */
    public couldClick: boolean = false;

    /**
     * 是否是玩家回合的状态标志
     * @type {boolean}
     */
    public isPlayerRound: boolean = true;

    /**
     * 是否是首次点击的状态标志
     * @type {boolean}
     */
    public isFirstClick: boolean = true;

    /**
     * 宽度间距
     * @type {number}
     */
    private interval: number = 250;

    /**
     * 高度间距
     * @type {number}
     */
    private height: number = 220;

    /**
     * 当前玩家的节点
     * @type {Node}
     */
    public curPlayer: Node = null;

    public static instance: SHJNWDDY_GameMgr = null;

    start() {
        SHJNWDDY_GameMgr.instance = this;

        this.initData();
    }

    /**
     * 初始化玩家和电脑的毒药索引
     * @param index 玩家选择的毒药索引
     */
    initFoodIndex(index: number) {
        // 创建一个数组，用于存储所有食物的索引
        let arr = new Array();
        for (let i = 0; i < this.foodImgArr.length; i++) {
            arr.push(i + 1);
        }

        // 设置玩家的毒药索引
        this.PlayerTs.poisonIndex = index;

        // 从数组中移除玩家选择的毒药索引，以避免重复选择
        let arrIndex = arr.indexOf(index);
        arr.splice(arrIndex, 1);

        //箭头显示
        this.ArrowNode.active = true;
        this.ArrowNode.setSiblingIndex(this.foodArr.length);
        this.ArrowNode.worldPosition = this.foodArr[index - 1].worldPosition.clone().add(v3(0, 100, 0));
        this.ArrowMove();
        //关闭遮罩
        this.node.getChildByName("Mask").active = false;

        // 随机选择一个索引作为电脑的毒药
        let random = math.randomRangeInt(1, arr.length + 1);
        this.PlayerAITs.poisonIndex = random;

        // 输出玩家和电脑的毒药索引
        console.log("玩家的毒药: " + index);
        console.log("电脑的毒药: " + random);

        // 设置 isFirstClick 为 false，表示已经完成初次点击
        this.isFirstClick = false;

        // 隐藏提示玩家选择毒药的UI元素
        this.node.getChildByName("请挑选你的毒药").active = false;
        this.node.getChildByName("Tips").active = true;

        // 获取并播放动画组件
        let ani = this.getComponent(AnimationComponent);

        this.playSFX("选择提示");
        ani.play("AISelect");

        // 延迟2秒后执行回调函数
        this.scheduleOnce(this.AIEatFood, 2);
    }

    AIEatFood() {

        let arr = Array.from(this.foodIndexArr);
        let index = arr.indexOf(this.PlayerAITs.poisonIndex);
        arr.splice(index, 1);

        // 隐藏提示对手正在挑选食物的UI元素
        this.node.getChildByName("对手正在挑选食物").active = false;

        // 设置当前玩家为电脑
        this.curPlayer = this.PlayerAITs.node;

        // 电脑随机选择一个食物索引
        let randomFood = math.randomRangeInt(0, arr.length);

        // 获取玩家的毒药索引
        let poisonIndex = this.PlayerTs.poisonIndex;

        // 获取电脑选择的食物索引
        let foodIndex = arr[randomFood];

        // 从食物索引数组中移除电脑选择的食物索引
        let arrIndex = this.foodIndexArr.indexOf(foodIndex);
        this.foodIndexArr.splice(arrIndex, 1);

        let foodNode = this.foodArr[foodIndex - 1];

        // 电脑食用选择的食物并使用玩家的毒药
        this.PlayerAITs.EatFood(foodNode, foodIndex, poisonIndex);

    }

    PlayerEatFood(node: Node, foodIndex: number) {
        this.node.getChildByName("请挑选你的食物").active = false;

        this.curPlayer = this.PlayerTs.node;
        let poisonIndex = this.PlayerAITs.poisonIndex;
        this.PlayerTs.EatFood(node, foodIndex, poisonIndex);
    }

    gameOver() {

        let name = this.curPlayer.name;

        if (name === "玩家") {
            this.playSFX("失败");
            //玩家失败图片
            let sprite1 = this.PlayerTs.node.getComponent(Sprite);
            sprite1.spriteFrame = this.PlayerTs.sprites[0];

            //电脑胜利图片
            let sprite2 = this.PlayerAITs.node.getComponent(Sprite);
            sprite2.spriteFrame = this.PlayerAITs.sprites[1];

            this.scheduleOnce(() => {
                GamePanel.Instance.Lost();
            }, 2);

            return;
        }
        else {
            this.playSFX("成功");

            //玩家胜利图片
            let sprite1 = this.PlayerTs.node.getComponent(Sprite);
            sprite1.spriteFrame = this.PlayerTs.sprites[1];

            //电脑失败图片
            let sprite2 = this.PlayerAITs.node.getComponent(Sprite);
            sprite2.spriteFrame = this.PlayerAITs.sprites[0];

            this.scheduleOnce(() => {
                GamePanel.Instance.Win();
            }, 2);
        }


    }

    changeRound() {

        if (this.isPlayerRound) {

            let ani = this.getComponent(AnimationComponent);

            ani.once(AnimationComponent.EventType.FINISHED, () => {
                this.couldClick = true;
            })

            this.node.getChildByName("对手正在挑选食物").active = false;

            this.playSFX("选择提示");
            ani.play("playerSelect");

        }
        else {

            let ani = this.getComponent(AnimationComponent);

            this.node.getChildByName("请挑选你的食物").active = false;

            this.playSFX("选择提示");
            ani.play("AISelect");

            this.scheduleOnce(this.AIEatFood, 2);

        }

    }

    sign: number = 1;

    ArrowMove() {
        tween(this.ArrowNode)
            .by(1, { position: v3(0, 30 * this.sign, 0) })
            .call(() => {
                this.sign = -this.sign;

                this.ArrowMove();
            })
            .start();
    }

    playSFX(clipName: string) {
        for (let clip of this.audioClips) {
            if (clip.name === clipName) {
                AudioManager.Instance.PlaySFX(clip);
                return;
            }
        }
    }

    /**
     * 初始化数据和游戏场景
     * 该方法主要用于设置游戏开始前的场景，包括食物节点的创建、位置摆放、以及相关属性的设置
     */
    initData() {
        // 创建一个初始位置向量
        let pos = v3(0, 0, 0);

        // 复制食物图片数组，用于后续随机选择食物图片
        let arr = Array.from(this.foodImgArr);

        // 初始化x轴计数器，用于给食物节点编号
        let x = 1;

        // 使用双层循环创建16个食物节点
        for (let i = 0; i < 4; i++) {
            for (let j = 1; j <= 4; j++) {

                // 实例化食物节点
                let foodNode = instantiate(this.foodPrefab);

                // 将食物节点设置为"Foods"节点的子节点
                foodNode.setParent(this.node.getChildByName("Foods"));

                // 获取食物节点的Sprite组件
                let foodSprite = foodNode.getComponent(Sprite);

                // 随机选择一个食物图片
                let random = math.randomRangeInt(0, arr.length);

                // 设置食物节点的图片
                foodSprite.spriteFrame = arr[random];

                // 从数组中移除已使用的食物图片
                arr.splice(random, 1);

                // 获取食物节点的自定义组件
                let foodTs = foodNode.getComponent(SHJNWDDY_Food);

                // 设置食物节点的编号
                foodTs.foodIndex = x++;

                // 将食物节点添加到食物数组中
                this.foodArr.push(foodNode);

                // 将食物节点的编号添加到食物编号数组中
                this.foodIndexArr.push(foodTs.foodIndex);

                // 设置食物节点的位置
                foodNode.position = pos;

                // 更新位置向量，为下一个食物节点准备
                pos.add(v3(this.interval, 0, 0));
            }

            // 完成一行食物节点的创建后，重置x轴位置，向下移动y轴位置
            pos.add(v3(-this.interval * 4, -this.height, 0));
        }

        // 获取玩家节点的自定义组件
        this.PlayerTs = this.node.getChildByName("玩家").getComponent(SHJNWDDY_Player);

        // 获取电脑节点的自定义组件
        this.PlayerAITs = this.node.getChildByName("电脑").getComponent(SHJNWDDY_Player);
    }
}


