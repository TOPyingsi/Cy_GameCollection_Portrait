import { _decorator, AudioClip, CCFloat, Component, director, find, Label, Prefab, tween, Tween, v3, Vec3 } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { Node } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('WNDW_GameManager')
export class WNDW_GameManager extends Component {
    public static instance: WNDW_GameManager = null;

    @property(GamePanel) gamePanel: GamePanel = null;

    @property([Node]) mtr: Node[] = [];
    @property([Node]) sy: Node[] = [];
    @property(AudioClip) cryClip: AudioClip = null;
    @property(AudioClip) clickClip: AudioClip = null;
    @property(AudioClip) loosenClip: AudioClip = null;
    @property(AudioClip) knockClip: AudioClip = null;
    @property(AudioClip) mouseClip: AudioClip = null;
    @property(AudioClip) BGM: AudioClip = null;
    @property([AudioClip]) clips: AudioClip[] = [];

    @property(Prefab) SY: Prefab = null;
    @property(Prefab) MTR: Prefab = null;
    @property(Prefab) answer: Prefab = null;


    @property([Node]) sy_objectives: Node[] = [];
    @property([Node]) mtr_objectives: Node[] = [];
    // _sy_objectives: Node[] = [];

    count: number = 0;
    mom: Node = null;
    香蕉猴: Node = null;
    树人: Node = null;
    Dad: Node = null;

    protected onLoad(): void {
        WNDW_GameManager.instance = this;
        this.mom = find("Canvas/PlayArea/Mom")
        this.香蕉猴 = find("Canvas/PlayArea/香蕉猴")
        this.树人 = find("Canvas/PlayArea/树人")
        this.Dad = find("Canvas/PlayArea/Dad")

        this.bottomTween(this.mom)
        this.bottomTween(this.香蕉猴)
        // this.bottomTween(this.树人)
        this.bottomTween(this.Dad)

    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer

        AudioManager.Instance.PlayBGM(this.BGM);
        AudioManager.Instance.PlaySFX(this.cryClip)
        this.scheduleOnce(() => {
            this.activeLabelToRole(this.mom, "这么多娃娃我该怎么带啊")
        }, 1)
    }

    progress() {
        this.count++;
        console.log(this.count)
        if (this.count >= 10) {
            Tween.stopAll()
            this.scheduleOnce(() => {
                this.gamePanel.Win();
            }, 2)
        }
    }

    playAudio(str: string) {
        const clip = this.clips.find(x => x.name == str);
        AudioManager.Instance.PlaySFX(clip);
        return clip.getDuration();
    }

    activeLabelToRole(node: Node, str: string) {
        const num = this.playAudio(str);
        const labelBG = node.getChildByName("LabelBG")
        labelBG.active = true;
        const label = labelBG.getChildByName("Label")
        label.getComponent(Label).string = str;
        this.scheduleOnce(() => {
            labelBG.active = false;
        }, num)
        return num;
    }

    @property(CCFloat) speed: number = 1;
    @property(CCFloat) scaleGap: number = 0.05;
    private oriScale: Vec3 = v3();

    bottomTween(node: Node) {
        Tween.stopAllByTarget(node);
        this.oriScale.set(node.getScale());

        tween(node)
            .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y + this.scaleGap) })
            .to(1 / this.speed, { scale: this.oriScale })
            .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y - this.scaleGap) })
            .to(1 / this.speed, { scale: this.oriScale })
            .union().repeatForever().start();
    }
}