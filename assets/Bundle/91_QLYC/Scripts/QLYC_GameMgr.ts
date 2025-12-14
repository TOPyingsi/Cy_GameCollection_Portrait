import { _decorator, AnimationComponent, AudioClip, AudioSource, Component, Node, Prefab, UITransform } from 'cc';
import QLYC_ClearMask from './QLYC_ClearMask';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('QLYC_GameMgr')
export class QLYC_GameMgr extends Component {

    @property({ type: [AudioClip] })
    audioclip: AudioClip[] = [];

    @property(Prefab)
    answerPrefab: Prefab = null;

    @property(Node)
    dirtyNode: Node = null;

    @property({ type: [Node] })
    bracesNodes: Node[] = [];

    @property({ type: [Node] })
    clearNodes: Node[] = [];

    @property({ type: [QLYC_ClearMask] })
    clearMasks: QLYC_ClearMask[] = [];

    @property({ type: [Node] })
    toothNodes: Node[] = [];

    public bracesNum: number = 0;

    public toothMap: Map<string, any> = new Map();
    public bracesMap: Map<string, any> = new Map();

    public toothStart: boolean = false;
    public taoStart: boolean = false;

    private audioSource: AudioSource = null;

    public static instance: QLYC_GameMgr = null;
    start() {
        QLYC_GameMgr.instance = this;

        this.initData();

        GamePanel.Instance._answerPrefab = this.answerPrefab;

        this.audioSource = this.getComponent(AudioSource);
    }

    initData() {
        for (let i = 0; i < this.toothNodes.length; i++) {
            let node = this.toothNodes[i];

            let ani = this.toothNodes[i].getComponent(AnimationComponent);

            let obj = [node, false, ani];

            this.toothMap.set("牙齿" + i.toString(), obj);
        }

        for (let j = 0; j < this.clearNodes.length; j++) {

            let clearMask = this.clearNodes[j].getComponent(QLYC_ClearMask);

            this.clearMasks.push(clearMask);
        }

        for (let k = 0; k < this.bracesNodes.length; k++) {
            let node = this.bracesNodes[k];

            let obj = [node, false];

            this.bracesMap.set("牙套" + k.toString(), obj);

        }

    }

    nextClear(ID: number) {
        this.clearNodes[ID].active = false;

        if ((ID + 1) >= this.clearMasks.length) {
            return;
        }

        this.clearNodes[ID + 1].active = true;
        this.clearMasks[ID + 1].isLock = false;
    }

    playEffect(clipName: string) {
        if (!AudioManager.IsSoundOn || this.audioSource.playing) {
            return;
        }

        for (let clip of this.audioclip) {
            if (clipName === clip.name) {
                this.audioSource.clip = clip;
                this.audioSource.play();
            }
        }
    }

    playSFX(clipName: string) {

        for (let clip of this.audioclip) {
            if (clipName === clip.name) {
                AudioManager.Instance.PlaySFX(clip);
            }
        }
    }

    stopSFX() {
        this.audioSource.stop();
        AudioManager.Instance.StopSFX();
    }

}


