import { _decorator, AudioClip, Component, director, Node, tween, v3 } from 'cc';
import { SHJAJS_Panel } from './SHJAJS_Panel';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SHJAJS_GameManager')
export class SHJAJS_GameManager extends Component {
    public static instance: SHJAJS_GameManager = null;

    @property(Node) propArea1: Node = null;
    @property(Node) propArea2: Node = null;
    @property(Node) propArea3: Node = null;
    @property(Node) submitButton: Node = null;
    @property(AudioClip) bgm: AudioClip = null;

    @property(GamePanel) gamePanel: GamePanel = null;

    private panels: Node[] = [];

    private currentPanel: Node = null;

    /** key prefab的实例（initProp） value panel节点 */
    _map: Map<Node, Node> = new Map()
    /** key prefab的实例（initProp） value panel对应的子节点 */
    map: Map<Node, Node> = new Map()


    protected onLoad(): void {
        SHJAJS_GameManager.instance = this;
        this.panels.push(this.propArea1);
        this.panels.push(this.propArea2);
        this.panels.push(this.propArea3);
        console.log(this.panels)
    }

    protected start(): void {
        this.changePropArea(this.propArea1)
        AudioManager.Instance.PlayBGM(this.bgm)
    }

    changePropArea(node: Node) {
        this.currentPanel = node;
        director.getScene().emit("changePropPanel", this.currentPanel)
    }

    private duration: boolean = false;

    previousPage() {
        const index = this.currentPanel.getComponent(SHJAJS_Panel).index;
        if (index > 0) {
            if (this.duration) return;
            this.duration = true;
            const panel = this.panels[index - 1];

            tween(this.currentPanel)
                .to(0.3, { position: v3(1080, 0, 0) })
                .start();
            tween(panel)
                .to(0.3, { position: v3(0, 0, 0) })
                .call(() => {
                    this.duration = false;
                    this.changePropArea(panel);
                })
                .start();
        }
    }

    nextPage() {
        const index = this.currentPanel.getComponent(SHJAJS_Panel).index;
        if (index < this.panels.length - 1) {
            if (this.duration) return;
            this.duration = true;
            const panel = this.panels[index + 1];

            tween(this.currentPanel)
                .to(0.3, { position: v3(-1080, 0, 0) })
                .start();
            tween(panel)
                .to(0.3, { position: v3(0, 0, 0) })
                .call(() => {
                    this.duration = false;
                    this.changePropArea(panel);
                })
                .start();
        }
    }

    submit() {
        this.gamePanel.Win();
    }

}


