import { _decorator, AudioClip, Component, Label, Node, ProgressBar, tween, v3 } from 'cc';
import { XMT_TouchCtrl } from './XMT_TouchCtrl';
import { XMT_ClearMask } from './XMT_ClearMask';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XMT_GameMgr')
export class XMT_GameMgr extends Component {

    @property({ type: AudioClip })
    public clips: AudioClip[] = [];

    @property({ type: [Node] })
    public targetNodes: Node[] = [];

    public progressBar: ProgressBar = null;

    public level: number = 0;



    public stepNodes: Node[] = [];

    public stepLabel: Label = null;

    private stepStrArr: string[] = [
        "步骤1：用水冲洗",
        "步骤2：打磨",
        "步骤3：清扫伤口",
        "步骤4：拔钉",
        "步骤5：消炎",
        "步骤6：清洗",
        "步骤7：包扎伤口"
    ];

    public static instance: XMT_GameMgr = null;
    start() {
        XMT_GameMgr.instance = this;

        this.initData();
    }


    nextLevel() {
        XMT_GameMgr.instance.playSFX("物品正确");

        this.level++;

        if (this.level === 7) {
            this.scheduleOnce(() => {
                GamePanel.Instance.Win();
            }, 1);

            return;
        }

        this.stepLabel.string = this.stepStrArr[this.level];
        this.progressBar.progress = 0;

        let nextTs = this.targetNodes[this.level].getComponent(XMT_ClearMask);
        if (nextTs) {
            nextTs.isLock = false;
        }

        this.nextStep();

    }

    nextStep() {

        let preNode = this.stepNodes[this.level - 1];
        let nextNode = this.stepNodes[this.level];

        tween(preNode)
            .by(0.8, { position: v3(1080, 0, 0) })
            .start();

        tween(nextNode)
            .by(0.8, { position: v3(1080, 0, 0) })
            .call(() => {

                let nextTs = nextNode.getComponent(XMT_TouchCtrl);

                nextTs.initData();
                nextTs.isLock = false;
                nextTs.couldMove = true;

            })
            .start();
    }

    playSFX(clipName: string) {
        for (let clip of this.clips) {
            if (clip.name === clipName) {
                AudioManager.Instance.PlaySFX(clip);
            }
        }
    }

    initData() {
        this.stepNodes = this.node.getChildByName("props").children;

        console.log(this.targetNodes);

        tween(this.stepNodes[0])
            .by(0.8, { position: v3(1080, 0, 0) })
            .call(() => {
                let startTs = this.stepNodes[0].getComponent(XMT_TouchCtrl);
                startTs.initData();
                startTs.isLock = false;
                startTs.couldMove = true;
            })
            .start();

        this.stepLabel = this.node.getChildByName("StepLabel").getComponent(Label);
        this.stepLabel.string = this.stepStrArr[0];

        this.progressBar = this.node.getChildByName("ProgressBar").getComponent(ProgressBar);
    }
}


