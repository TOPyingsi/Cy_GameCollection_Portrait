import { _decorator, CCFloat, CCInteger, Component, director, instantiate, Label, Node, Prefab, Sprite, Tween, tween, UITransform, v3, Vec3 } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { GLDS_ColliderHandler } from './GLDS_ColliderHandler';
import { GLDS_UIManager } from './GLDS_UIManager';
const { ccclass, property } = _decorator;

@ccclass('GLDS_GameManager')
export class GLDS_GameManager extends Component {
    private static _instance: GLDS_GameManager;

    public static get Instance(): GLDS_GameManager {
        if (!GLDS_GameManager._instance) {
            GLDS_GameManager._instance = new GLDS_GameManager();
        }
        return GLDS_GameManager._instance;
    }

    // 预制
    @property([Prefab]) fish: Prefab[] = [];
    @property(Prefab) knife: Prefab = null;

    // 节点
    @property(Node) playArea: Node = null;
    @property(Label) totalScore: Label = null;
    @property(Label) currentScore: Label = null;
    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Node) a: Node = null;
    @property(Node) b: Node = null;
    @property(Node) c: Node = null;

    //
    @property(CCInteger) score: number;
    @property(CCFloat) threshold: number = 0;
    @property(Vec3) startPos: Vec3 = null
    @property(Vec3) endPos: Vec3 = null;

    isCanCut: boolean = false;

    fishInfo: Map<number, Map<string, number>> = new Map([
        [1, new Map([["凤尾鱼", 86], ["沙丁鱼", 148]])],
        [2, new Map([["凤尾鱼", 86], ["沙丁鱼", 148], ["鲭鱼", 268]])],
        [3, new Map([["沙丁鱼", 148], ["鲭鱼", 268], ["鳕鱼", 396]])],
        [4, new Map([["鳕鱼", 396], ["金枪鱼", 1454], ["翻车鱼", 2064]])],
        [5, new Map([["金枪鱼", 1454], ["翻车鱼", 2064], ["利维坦", 3780]])],
        [6, new Map([["金枪鱼", 1454]])],
        [7, new Map([["翻车鱼", 2064]])],
        [8, new Map([["耐氪鲨鱼", 458]])],
        [9, new Map([["仙人掌河马", 288]])],
        [10, new Map([["大脚猿神", 628]])],
        [11, new Map([["金枪鱼", 1454]])],
        [12, new Map([["翻车鱼", 2064]])],
    ]);

    currentFishIndex: number = 0;//当前鱼下标
    fishCountNumberToCurrentLevel: number = 0;//当前关卡鱼总数
    currentFishName: string;//当前鱼名称
    currentFishScale: number;//当前鱼磷数
    sceneNumber: number = null;//当前场景名后缀
    fishNode: Node = null;//鱼节点
    knifeNode: Node = null;
    _score: number = 0;

    protected onLoad(): void {

        console.log("GLDS_GameManager", this.score);

        GLDS_GameManager._instance = this;
        const sceneName = director.getScene()?.name;
        this.sceneNumber = Number(sceneName.match(/_(\d+)$/)?.[1]);//获取场景名后缀的数字

        switch (this.sceneNumber) {
            case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10:
                this.gamePanel.time = 90;
                break;
            case 11: case 12:
                this.gamePanel.time = 180;
                break;
        }

        this.loadKnife(this.sceneNumber);
        this.loadFish(this.sceneNumber);
        this.scheduleOnce(() => {
            GLDS_UIManager._instance.initUI(this.currentFishName, this.fishCountNumberToCurrentLevel, this.currentFishScale);
        }, 0);
    }

    loadFish(num: number) {
        const fish = instantiate(this.fish[this.currentFishIndex])
        this.fishCountNumberToCurrentLevel = this.fish.length;
        this.currentFishName = fish.getComponent(Sprite).spriteFrame.name;
        const scaleMap = this.fishInfo.get(num);
        if (scaleMap) this.currentFishScale = scaleMap.get(this.currentFishName);

        fish.name = "Fish"
        fish.setParent(this.playArea);
        fish.setSiblingIndex(this.playArea.getChildByName("Knife").getSiblingIndex() - 1);
        this.fishNode = fish;

        fish.setPosition(v3(0, -1800, 0))
        tween(fish)
            .to(0.5, { position: new Vec3(0, 0, 0) })
            .call(() => {
                this.currentFishIndex++;
            })
            .start()

        console.log("获胜条件》=", this.currentFishScale * this.threshold)

    }

    loadKnife(num: number) {
        this.knifeNode = instantiate(this.knife)
        this.knifeNode.name = "Knife";
        this.knifeNode.setParent(this.playArea);
        this.knifeNode.setPosition(-400, 0);
    }


    next() {
        const w = GLDS_ColliderHandler.Instance.T >= this.currentFishScale * this.threshold;
        switch (this.sceneNumber) {
            case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10:
                if (w) {
                    if (this.currentFishIndex >= this.fishCountNumberToCurrentLevel) {
                        this.gamePanel.Win();
                    } else {
                        GLDS_ColliderHandler.Instance.clear();
                        this.knifeNode.setPosition(-400, 0);

                        const oldFish = this.fishNode;
                        this.fishNode = null;

                        tween(oldFish)
                            .to(0.5, { position: new Vec3(0, 1800, 0) })
                            .call(() => {
                                oldFish.destroy();
                                this.loadFish(this.sceneNumber);
                                GLDS_UIManager._instance.initUI(this.currentFishName, this.fishCountNumberToCurrentLevel, this.currentFishScale);
                                GLDS_ColliderHandler.Instance.ovo();
                            })
                            .start();
                    }
                } else {
                    this.gamePanel.Lost();
                }
                break;
            case 11: case 12:
                if (w) {

                    GLDS_UIManager._instance.refeshNode("TotalScore")
                    GLDS_UIManager._instance.refeshNode("CurrentScore")
                    GLDS_UIManager._instance.initScore(this.score, this._score)

                    this.fishNode.active = false;
                    this.knifeNode.active = false;
                    this.a.active = true;
                    this.b.active = true;
                    this.c.active = true;

                    this.c.setPosition(this.startPos);
                    tween(this.c).to(35, { position: this.endPos }).call(() => { if (this._score < this.score) this.gamePanel.Lost(); }).start();

                    this.isCanCut = true;
                } else {
                    this.gamePanel.Lost();
                }
                break;
        }
    }

    getGrandChildrenCount(): number {
        let count = 0;

        for (let i = 0; i < this.fishNode.children.length; i++) {
            const child = this.fishNode.children[i];
            count += child.children.length;
        }

        if (count == 0) {
            return this.fishNode.children.length;
        }

        return count;
    }

    cutFish() {
        this._score++;
        if (this._score >= this.score) {
            this.gamePanel.Win();
        }
        this.currentScore.string = `当前分数：${this._score}`;
    }
}


