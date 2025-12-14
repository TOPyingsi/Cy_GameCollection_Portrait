import { _decorator, AudioClip, Component, Event, instantiate, Label, Node, Prefab, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SJ_GameManager')
export class SJ_GameManager extends Component {

    public static instance: SJ_GameManager = null;

    @property(Node) dangAnDai_body: Node = null; // 档案袋 主体
    @property(Node) dangAnDai_head: Node = null; // 档案袋 头部
    @property(Node) miFengTiao: Node = null; // 密封条
    @property(Node) shiJuan: Node = null; // 试卷
    @property(Node) scrollView: Node = null;
    @property(GamePanel) gamePanel: GamePanel = null;

    @property(Prefab) right: Prefab = null;
    @property(Prefab) wrong: Prefab = null;
    @property(Prefab) quan: Prefab = null;
    @property(Prefab) answer: Prefab = null;

    @property(Label) number: Label = null;

    @property(AudioClip) r: AudioClip = null;
    @property(AudioClip) w: AudioClip = null;

    @property([Node]) startNodes: Node[] = [];
    @property([Node]) endNodes: Node[] = [];

    a: Node[] = [];
    b: Node[] = [];

    count: number = 0;
    private x: number = 5;

    protected onLoad(): void {
        SJ_GameManager.instance = this;
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer;
        this.startAni();

        this.a = this.startNodes;
        this.b = this.endNodes;
    }

    startAni() {
        const uio = this.miFengTiao.getComponent(UIOpacity)
        tween(uio) // 密封条透明
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.miFengTiao.destroy()

                tween(this.dangAnDai_head) // 档案袋头旋转
                    .to(0.5, { eulerAngles: new Vec3(180, 0, 0) })
                    .call(() => {
                        this.dangAnDai_head.setSiblingIndex(0)

                        tween(this.shiJuan) // 试卷上移
                            .to(0.5, { position: new Vec3(0, 200, 0) })
                            .call(() => {

                                tween(this.dangAnDai_head) //档案袋头下移
                                    .to(0.5, { position: new Vec3(0, this.dangAnDai_head.position.y - 1600, 0) })
                                    .call(() => {
                                        this.dangAnDai_head.destroy()
                                    })
                                    .start()

                                tween(this.dangAnDai_body) //档案袋下移
                                    .to(0.5, { position: new Vec3(0, this.dangAnDai_body.position.y - 1600, 0) })
                                    .call(() => {
                                        this.shiJuan.destroy()
                                        this.dangAnDai_body.destroy()

                                        this.scrollView.active = true;
                                        const ui = this.scrollView.getComponent(UIOpacity)
                                        tween(ui)
                                            .to(0.5, { opacity: 255 })
                                            .start()
                                    })
                                    .start()
                            })
                            .start();
                    })
                    .start();
            })
            .start();
    }

    onButtonClick(event: Event) {
        switch (event.target.name) {

            case "入": case "叫": case "耶":
                this.selectRight(event.target);
                break;

            case "1_错误": case "2_正确": case "3_正确": case "4_错误": case "5_正确": case "1_C": case "2_D": case "Right":
                this.selectRight(event.target, false);
                break;

            default:
                this.selectWrong(event.target);
                break;
        }
    }

    rightNodes: Node[] = [];

    selectRight(node: Node, bol: boolean = true) {
        if (this.rightNodes.indexOf(node) == -1) {
            this.rightNodes.push(node)
            AudioManager.Instance.PlaySFX(this.r);
            if (bol) {
                const quan = instantiate(this.quan)
                quan.setParent(node)
            }
            const right = instantiate(this.right)
            const size = node.getComponent(UITransform).contentSize
            right.setPosition(size.width / 2, -size.height / 2)
            right.setParent(node)
            this.count++;
            console.log(this.count)
            if (this.count >= 18) {
                this.gamePanel.Win()
            }
        } else {
            return;
        }
    }

    selectWrong(node: Node) {
        AudioManager.Instance.PlaySFX(this.w);
        const wrong = instantiate(this.wrong)
        const size = node.getComponent(UITransform).contentSize
        wrong.setPosition(size.width / 2, -size.height / 2)
        wrong.setParent(node)
        this.x--;
        this.number.string = String(this.x)
        if (this.x <= 0) {
            this.gamePanel.Lost()
        }
    }
}


