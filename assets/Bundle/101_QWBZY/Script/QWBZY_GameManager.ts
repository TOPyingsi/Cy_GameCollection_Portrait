import { _decorator, AudioClip, Component, instantiate, Label, Node, Prefab, SpriteFrame, tween, UIOpacity, v3, Vec3 } from 'cc';
import { QWBZY_A } from './QWBZY_A';
import { QWBZY_B } from './QWBZY_B';
import { QWBZY_C } from './QWBZY_C';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { QWBZY_D } from './QWBZY_D';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('QWBZY_GameManager')
export class QWBZY_GameManager extends Component {
    public static instance: QWBZY_GameManager = null;

    @property([SpriteFrame]) asf: SpriteFrame[] = [];
    @property([SpriteFrame]) bsf: SpriteFrame[] = [];
    @property([SpriteFrame]) csf: SpriteFrame[] = [];
    @property([SpriteFrame]) dsf: SpriteFrame[] = [];

    @property(Prefab) APrefab: Prefab = null;
    @property(Prefab) BPrefab: Prefab = null;
    @property(Prefab) CPrefab: Prefab = null;
    @property(Prefab) DPrefab: Prefab = null;
    @property(Prefab) right: Prefab = null;
    @property(Prefab) wrong: Prefab = null;
    @property(Prefab) answer: Prefab = null;

    @property(Node) gameArea: Node = null;
    @property(Node) mask: Node = null;
    @property(Node) propParent: Node = null;
    @property(Node) off: Node = null;
    @property(Node) on: Node = null;
    @property(Node) HP: Node = null;
    @property(Node) blackMask: Node = null;
    @property(Label) progress: Label = null;
    @property(GamePanel) gamePanel: GamePanel = null;

    @property(AudioClip) bgm: AudioClip = null;
    @property(AudioClip) click: AudioClip = null;
    @property(AudioClip) rightAudio: AudioClip = null;
    @property(AudioClip) wrongAuido: AudioClip = null;

    private a: Node = null;
    private b: Node = null;
    private c: Node = null;
    private d: Node = null;
    private selectNode: Node = null;
    private round: number = 0;

    protected onLoad(): void {
        QWBZY_GameManager.instance = this;
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer;
        AudioManager.Instance.PlayBGM(this.bgm)
        this.init()
    }

    init() {
        this.refreshProgress();

        if (this.a) { this.a.destroy(); };
        if (this.b) { this.b.destroy(); };
        if (this.c) { this.c.destroy(); };
        if (this.d) { this.d.destroy(); };

        this.a = instantiate(this.APrefab);
        this.b = instantiate(this.BPrefab);
        this.c = instantiate(this.CPrefab);
        this.d = instantiate(this.DPrefab);

        const acom = this.a.getComponent(QWBZY_A);
        const bcom = this.b.getComponent(QWBZY_B);
        const ccom = this.c.getComponent(QWBZY_C);
        const dcom = this.d.getComponent(QWBZY_D);

        acom.init(this.asf[this.round]);
        bcom.init(this.bsf[this.round]);
        ccom.init(this.csf[this.round]);
        dcom.init(this.dsf[this.round]);

        this.a.parent = this.propParent;
        this.b.parent = this.propParent;
        this.c.parent = this.propParent;
        this.d.parent = this.on;

        this.isCanConfirm = true;

        this.countdownTime();
    }

    select(node: Node) {
        AudioManager.Instance.PlaySFX(this.click)
        this.selectNode = node;
        this.a.getChildByName("Select").active = node == this.a;
        this.b.getChildByName("Select").active = node == this.b;
        this.c.getChildByName("Select").active = node == this.c;
        console.log("选择：" + node.name);
    }

    private isCountingDown: boolean = false;
    private countdownStartTime: number = 0;
    private totalDuration: number = 3;

    countdownTime() {
        if (this.isCountingDown) {
            return;
        }

        this.isCountingDown = true;
        this.mask.active = true;
        this.countdownStartTime = Date.now();

        const time = this.mask.getChildByName("Time");
        const label = time.getComponent(Label);

        label.string = "3";

        this.schedule(() => {
            const elapsed = (Date.now() - this.countdownStartTime) / 1000;
            const remaining = Math.max(0, Math.ceil(this.totalDuration - elapsed));

            label.string = remaining.toString();

            if (remaining <= 0) {
                this.unscheduleAllCallbacks(); // 取消所有调度
                this.mask.active = false;
                this.isCountingDown = false;
                this.run();
            }
        }, 0.1); // 每0.1秒更新一次，确保显示流畅
    }

    run() {
        this.off.active = false;
        this.on.active = true;
        this.scheduleOnce(() => {
            this.off.active = true;
            this.on.active = false;
        }, 0.5)
    }

    isCanConfirm: boolean = true;

    confirm() {
        if (!this.isCanConfirm) return;
        if (this.selectNode && this.selectNode.isValid) {
            switch (this.selectNode.name) {
                case "A":
                    switch (this.round) {
                        case 3: case 9:
                            this.r(this.selectNode)
                            break;
                        default:
                            this.w(this.selectNode)
                            break;
                    }
                    break;

                case "B":
                    switch (this.round) {
                        case 0: case 1: case 5: case 7: case 8: case 11: case 12: case 14: case 16:
                            this.r(this.selectNode)
                            break;
                        default:
                            this.w(this.selectNode)
                            break;
                    }
                    break;

                case "C":
                    switch (this.round) {
                        case 2: case 4: case 6: case 10: case 13: case 15: case 17: case 18: case 19:
                            this.r(this.selectNode)
                            break;
                        default:
                            this.w(this.selectNode)
                            break;
                    }
                    break;
            }
        }

        else {
            console.error("错误");
        }
    }

    r(node: Node) {
        this.isCanConfirm = false;
        AudioManager.Instance.PlaySFX(this.rightAudio)
        const right = instantiate(this.right)
        right.parent = node;
        tween(right)
            .to(0.1, { scale: v3(3.5, 3.5, 3.5) })
            .to(0.1, { scale: v3(3, 3, 3) })
            .call(() => {
                this.scheduleOnce(() => {
                    right.destroy();
                    this.round++;
                    if (this.round >= 20) {
                        this.gamePanel.Win()
                    } else {
                        this.loadBlackMask();
                    }
                }, 0.3);
            })
            .start();
    }

    w(node: Node) {
        AudioManager.Instance.PlaySFX(this.wrongAuido)
        const wrong = instantiate(this.wrong)
        wrong.parent = node;
        tween(wrong)
            .to(0.1, { scale: v3(3.5, 3.5, 3.5) })
            .to(0.1, { scale: v3(3, 3, 3) })
            .call(() => {
                this.scheduleOnce(() => {
                    wrong.destroy();
                    this.reduceHP();
                }, 0.3);
            })
            .start();
    }

    reduceHP() {
        console.log("reduceHP", this.HP.children.length);
        // this.isCanConfirm = true;
        if (this.HP.children.length <= 1) {
            this.gamePanel.Lost();
        } else {
            this.HP.children[this.HP.children.length - 1].destroy();
        }
    }

    loadBlackMask() {
        this.blackMask.active = true;
        const uio = this.blackMask.getComponent(UIOpacity)
        tween(uio)
            .to(0.2, { opacity: 255 })
            .call(() => {
                this.init();
                tween(uio)
                    .to(0.2, { opacity: 0 })
                    .call(() => {
                        this.blackMask.active = false;
                    })
                    .start()
            })
            .start();
    }

    refreshProgress() {
        this.progress.string = `进度： ${this.round} / 20`
    }
}


