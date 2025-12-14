import { _decorator, AudioClip, Component, director, Layout, Node, Prefab, ScrollView, tween, UITransform, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('PT_GameManager')
export class PT_GameManager extends Component {

    public static instance: PT_GameManager;

    @property(GamePanel) gamePanel: GamePanel = null;
    @property(ScrollView) scrollView: ScrollView = null;
    @property([Node]) nodes: Node[] = [];
    @property(Node) from: Node = null
    @property(Prefab) answerPrefab: Prefab = null;

    @property(AudioClip) clip: AudioClip = null;

    private content: Node = null;
    private count = 0;

    protected onLoad(): void {
        PT_GameManager.instance = this;
        this.content = this.scrollView.content;
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answerPrefab;
        this.gamePanel.time = 600;
        this.refeshScrollViewContentUITransform();
        this.roandom();
    }

    refeshScrollViewContentUITransform() {
        const uitf = this.content.getComponent(UITransform)
        const lo = this.content.getComponent(Layout)
        let x = 0;

        if (this.content.children.length >= 25) {
            for (let i = 0; i < 25; i++) {
                x += this.content.children[i].getComponent(UITransform).width;
                console.log(x)
            }
            x += (lo.paddingLeft * 2) + (lo.spacingX * 24);
            uitf.setContentSize(x, uitf.height)

        } else {
            this.content.getComponent(UITransform).width -= 100;
            console.log(this.content.getComponent(UITransform).width)
        }

        // this.content.children.forEach(child => { x += child.getComponent(UITransform).width });
        // // x += (lo.paddingLeft * 2) + (lo.spacingX * (this.content.children.length - 1));
        // uitf.setContentSize(x / 1.5, uitf.height)
        lo.updateLayout()
    }

    roandom() {
        const shuffledChildren = Tools.Shuffle([...this.content.children]);

        const layout = this.content.getComponent(Layout);
        if (layout) layout.enabled = false;

        shuffledChildren.forEach((child, index) => {
            child.setSiblingIndex(index);
        });

        if (layout) {
            layout.enabled = true;
            layout.updateLayout();
        }
    }

    ovo() {
        this.count++;
        if (this.count >= 49) {
            this.gamePanel.Win();
        }
    }

    playAudio() {
        AudioManager.Instance.PlaySFX(this.clip);
    }
}


