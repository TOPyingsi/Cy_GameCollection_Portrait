import { _decorator, Component, Label, Node } from 'cc';
import { GLDS_GameManager } from './GLDS_GameManager';
const { ccclass, property } = _decorator;

@ccclass('GLDS_UIManager')
export class GLDS_UIManager extends Component {

    public static _instance: GLDS_UIManager = null;

    private fishNameNode: Node = null;
    private fishCountNode: Node = null;
    private scaleNumberNode: Node = null;
    private nextButtonNode: Node = null;
    private tipNode: Node = null;
    private totalScoreNode: Node = null;
    private currentScoreNode: Node = null;

    protected onLoad(): void {
        GLDS_UIManager._instance = this;

        this.fishNameNode = this.node.getChildByName("FishName");
        this.fishCountNode = this.node.getChildByName("FishNumber");
        this.scaleNumberNode = this.node.getChildByName("ScalesCount");
        this.nextButtonNode = this.node.getChildByName("Next");
        this.tipNode = this.node.getChildByName("Tip");
        this.totalScoreNode = this.node.getChildByName("TotalScore");
        this.currentScoreNode = this.node.getChildByName("CurrentScore");

        this.node.setSiblingIndex(999)
    }


    public initUI(fishName: string, fishCount: number, fishScale: number) {

        this.fishNameNode.getChildByName("Label").getComponent(Label).string = fishName;
        this.scaleNumberNode.getChildByName("Label").getComponent(Label).string = `0/${fishScale}`;
        this.fishCountNode.getChildByName("Label").getComponent(Label).string = `${GLDS_GameManager.Instance.currentFishIndex + 1}/${fishCount}`;
        this.tipNode.getChildByName("Label").getComponent(Label).string = `在鱼上从左到右移动你的刀来清理他\n移动过快可能会损坏鱼鳞\n损坏高于${100 - (GLDS_GameManager.Instance.threshold * 100)} % 则失败`;
    }

    public initScore(totalScore: number, currentScore: number) {
        this.fishNameNode.active = false
        this.fishCountNode.active = false
        this.scaleNumberNode.active = false
        this.nextButtonNode.active = false
        this.totalScoreNode.active = true
        this.currentScoreNode.active = true

        this.totalScoreNode.getComponent(Label).string = `目标分数：${totalScore}`;
        this.currentScoreNode.getComponent(Label).string = `当前分数：${currentScore}`;
        this.tipNode.getChildByName("Label").getComponent(Label).string = "快速点击屏幕切割鱼来获取分数！";
    }

    refeshNode(string: string) {
        this.fishNameNode.active = this.fishNameNode.name == string;
        this.fishCountNode.active = this.fishCountNode.name == string;
        this.scaleNumberNode.active = this.scaleNumberNode.name == string;
        this.nextButtonNode.active = this.nextButtonNode.name == string;
        this.totalScoreNode.active = this.totalScoreNode.name == string;
        this.currentScoreNode.active = this.currentScoreNode.name == string;
    }

    updateScale(scale: number) {
        this.scaleNumberNode.getChildByName("Label").getComponent(Label).string = `${Math.min(Math.ceil(scale), GLDS_GameManager.Instance.currentFishScale)}/${GLDS_GameManager.Instance.currentFishScale}`;
    }
}


