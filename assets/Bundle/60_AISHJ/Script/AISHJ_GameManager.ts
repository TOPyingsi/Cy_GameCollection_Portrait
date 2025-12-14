import { _decorator, Animation, AudioClip, Component, director, instantiate, Node, postProcess, Prefab, sp, Tween, tween, UIOpacity, v3, Vec3 } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('AISHJ_GameManager')
export class AISHJ_GameManager extends Component {
    public static Instance: AISHJ_GameManager = null;

    @property([Node]) props_unActive: Node[] = [];
    @property([Node]) roles: Node[] = [];
    @property([Node]) props: Node[] = [];
    @property([AudioClip]) clips: AudioClip[] = [];
    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Node) blackMask: Node = null;

    @property([Prefab]) pfs: Prefab[] = [];
    @property(Node) tip: Node = null;

    private index: Vec3 = null;

    protected onLoad(): void {
        AISHJ_GameManager.Instance = this;

        this.gamePanel.time = 300;

        director.getScene().on("ani", this.ovo, this)
        director.getScene().on("firstTouch", this.stopTween, this);

        this.index = this.tip.position

    }

    protected onDisable(): void {
        director.getScene().off("ani", this.ovo, this)
        director.getScene().off("firstTouch", this.stopTween, this);
    }

    protected start(): void {

        tween(this.tip)
            .to(1, { position: v3(this.index.x, 150) })
            .to(0, { position: v3(this.index.x, this.index.y) })
            .union().repeatForever().tag(1)
            .start();
    }

    stopTween() {
        Tween.stopAllByTag(1);
        this.tip.active = false
    }

    refeshClick() {
        director.getScene().emit("clear");
        this.loadBlackMask();
    }

    loadBlackMask() {
        this.blackMask.active = true;
        const blackMaskOpacity = this.blackMask.getComponent(UIOpacity);
        tween(blackMaskOpacity)
            .to(1, { opacity: 255 })
            .call(() => {
                this.props_unActive.forEach(node => { node.active = false; });
                this.roles.forEach(node => { node.active = true; });
                this.props.forEach(node => { node.active = true; });
                tween(blackMaskOpacity)
                    .to(1, { opacity: 0 })
                    .call(() => {
                        this.blackMask.active = false;
                    })
                    .start();
            })
            .start();
    }

    ovo(propName: string, role: Node) {
        this.pfs.forEach(pf => {
            if (pf.name == propName) {
                const node = instantiate(pf)
                node.setParent(role.parent)
                node.setPosition(role.position)
                node.name = `${node.name}_Animation`
            }
        });
    }
}