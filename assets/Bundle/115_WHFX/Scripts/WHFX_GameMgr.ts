import { _decorator, AnimationComponent, AudioClip, Component, Node, Prefab } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('WHFX_GameMgr')
export class WHFX_GameMgr extends Component {
    @property({ type: [AudioClip] })
    cilps: AudioClip[] = [];

    @property({ type: [Node] })
    targets: Node[] = [];

    @property(Node)
    carNode: Node = null;

    @property(Node)
    bgNode: Node = null;

    @property(Prefab)
    answerPrefab: Prefab = null;

    public trueIndex: number = 0;

    public static instance: WHFX_GameMgr = null;
    start() {
        WHFX_GameMgr.instance = this;

        GamePanel.Instance._answerPrefab = this.answerPrefab;
    }

    initCar() {
        this.targets.push(this.carNode);
    }

    initBg() {
        this.targets.push(this.bgNode);
    }

    getTarget() {
        this.trueIndex++;
        WHFX_GameMgr.instance.playSFX("物品正确");

        if (this.trueIndex === 15) {
            this.getComponent(AnimationComponent).play("胜利");

            this.scheduleOnce(() => {
                GamePanel.Instance.Win();
            }, 2);
            console.log("游戏结束");
        }
    }

    playSFX(cilpName: string) {

        for (let clip of this.cilps) {
            if (clip.name === cilpName) {
                AudioManager.Instance.PlaySFX(clip);
            }
        }
    }
}


