import { _decorator, AudioClip, Button, CCFloat, Component, Event, find, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Tween, tween, UIOpacity, UITransform, v3, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('YBB_GameManager')
export class YBB_GameManager extends Component {
    public static instance: YBB_GameManager = null;

    @property(GamePanel) gamePanel: GamePanel = null;

    @property(AudioClip) BGMusic: AudioClip = null;
    @property(AudioClip) clickSound: AudioClip = null;
    @property(AudioClip) bsSound: AudioClip = null;
    @property(AudioClip) startSound: AudioClip = null;
    @property(AudioClip) niceSound: AudioClip = null;
    @property(AudioClip) lqbzSound: AudioClip = null;
    @property([AudioClip]) roleSound: AudioClip[] = [];

    @property(Node) A: Node = null;
    @property(Node) B: Node = null;
    @property(Node) playArea: Node = null;
    @property(Node) girl: Node = null;
    @property(Node) baby: Node = null;
    @property(Node) jd: Node = null;
    @property(Node) jdt: Node = null;

    @property(Label) hpStr: Label = null;

    @property(Prefab) mtPrefab: Prefab = null;
    @property(Prefab) syPrefab: Prefab = null;
    @property(Prefab) ncPrefab: Prefab = null;
    @property(Prefab) qxPrefab: Prefab = null;
    @property(Prefab) bqgPrefab: Prefab = null;
    @property(Prefab) sdPrefab: Prefab = null;
    @property(Prefab) titlePrefab: Prefab = null;
    @property(Prefab) answer: Prefab = null;

    @property([SpriteFrame]) sfs_fail: SpriteFrame[] = [];
    @property([SpriteFrame]) sfs_m: SpriteFrame[] = [];
    @property([SpriteFrame]) sfs: SpriteFrame[] = [];
    @property(SpriteFrame) baby_sf: SpriteFrame = null;

    private nums_A: number[] = [0, 0, 0];
    private nums_B: number[] = [0, 0, 0];
    private count: number = 0;
    private isButtonClick: boolean = false;
    private a: number = 0;
    private winCount: number = 0;
    private str: string = null;

    protected onLoad(): void {
        YBB_GameManager.instance = this;

        this.gamePanel.answerPrefab = this.answer;

        this.jd.getChildByName("Label").getComponent(Label).string = `${this.winCount} / 3`;

        this.A.active = false;
        this.B.active = false;
        this.A.setPosition(0, -1000, 0);
        this.B.setPosition(0, -1000, 0);
    }

    protected start(): void {
        this.bottomTween(this.girl)
        this.bottomTween(this.baby)

        AudioManager.Instance.PlayBGM(this.BGMusic);
        this.girl.getChildByName("LabelBG").active = true;
        AudioManager.Instance.PlaySFX(this.startSound);
        this.scheduleOnce(() => {
            this.A.active = true;
            this.girl.getChildByName("LabelBG").active = false;
            this.loadAorB(true);

        }, this.startSound.getDuration());
    }

    onButtonClick_A(event: Event) {
        if (!this.isButtonClick) return;

        this.jdt.getComponent(Sprite).fillRange += 0.2
        this.hpStr.string = String(Number(this.hpStr.string) - 5)
        AudioManager.Instance.PlaySFX(this.clickSound);
        this.count++;
        this.str = null;
        this.str = event.target.name;

        switch (event.target.name) {
            case "木头":
                this.hhh(this.mtPrefab)
                this.nums_A[0]++;
                break;
            case "鲨鱼":
                this.hhh(this.syPrefab)
                this.nums_A[1]++;
                break;
            case "奶茶":
                this.hhh(this.ncPrefab)
                this.nums_A[2]++;
                break;
        }
        this.ovo_A();
    }

    onButtonClick_B(event: Event) {
        if (!this.isButtonClick) return;

        this.jdt.getComponent(Sprite).fillRange += 0.2
        this.hpStr.string = String(Number(this.hpStr.string) - 5)
        AudioManager.Instance.PlaySFX(this.clickSound);
        this.count++;
        this.str = null;
        this.str = event.target.name;

        switch (event.target.name) {
            case "球鞋":
                this.hhh(this.qxPrefab)
                this.nums_B[0]++;
                break;
            case "棒球棍":
                this.hhh(this.bqgPrefab)
                this.nums_B[1]++;
                break;
            case "双刀":
                this.hhh(this.sdPrefab)
                this.nums_B[2]++;
                break;
        }
        this.ovo_B();
    }

    continueBtn(event: Event) {
        this.count = 0;
        this.baby.getComponent(Sprite).spriteFrame = this.baby_sf;
        this.hpStr.string = "50";
        this.jdt.getComponent(Sprite).fillRange = 0
        event.target.active = false;
        this.loadAorB(true)
        this.nums_A = [0, 0, 0];
        this.nums_B = [0, 0, 0];
        this.a = 0;
    }

    hhh(Prefab: Prefab) {
        const node = instantiate(Prefab)
        node.setParent(this.playArea)
        tween(node)
            .to(0.5, { position: v3(230, -90, 0) })
            .call(() => {
                node.destroy();
                this.nb666();
                this.tvt();
                AudioManager.Instance.PlaySFX(this.bsSound)
            })
            .start()
    }

    nb666() {
        const node = instantiate(this.titlePrefab)
        node.getComponent(Label).string = this.str;
        node.setParent(this.playArea)
        tween(node)
            .to(0.5, { position: v3(node.position.x, node.position.y + 50, 0) })
            .call(() => {
                node.destroy();
            }).start()
    }

    ovo_A() {
        if (this.count == 5) {
            this.count = 0;
            const originalNums = [...this.nums_A];
            const newNums = this.nums_A.sort((a, b) => b - a);
            const maxValue = newNums[0];
            const originalIndex = originalNums.indexOf(maxValue);

            const lb = this.girl.getChildByName("LabelBG")
            const _lb = lb.getChildByName("Label").getComponent(Label)
            const face = this.girl.getChildByName("Face")

            if (maxValue == 5) {
                this.isButtonClick = false;
                this.jdt.getComponent(Sprite).fillRange = 0
                this.loadAorB(false);

                this.baby.getComponent(Sprite).spriteFrame = this.sfs_m[originalIndex];
                this.qaq();
                this.baby.getChildByName("Label").getComponent(Label).string = "少年"
                this.a = originalIndex;
            } else {
                this.baby.getComponent(Sprite).spriteFrame = this.sfs_fail[originalIndex];
                this.qaq();
                face.active = true;
                lb.active = true;
                _lb.string = "你这乱七八糟的加一些东西，都培养出什么样子了"
                AudioManager.Instance.PlaySFX(this.lqbzSound)
                this.scheduleOnce(() => {
                    this.gamePanel.Lost();
                }, this.lqbzSound.getDuration())
            }
        }
    }

    ovo_B() {
        if (this.count == 5) {
            this.count = 0;
            const originalNums = [...this.nums_B];
            const newNums = this.nums_B.sort((a, b) => b - a);
            const maxValue = newNums[0];
            const originalIndex = originalNums.indexOf(maxValue);

            const lb = this.girl.getChildByName("LabelBG")
            const _lb = lb.getChildByName("Label").getComponent(Label)
            const face = this.girl.getChildByName("Face")

            if (maxValue == 5) {
                this.isButtonClick = false;

                this.A.active = false;
                this.B.active = false;
                this.A.setPosition(0, -1000, 0);
                this.B.setPosition(0, -1000, 0);

                AudioManager.Instance.PlaySFX(this.niceSound)
                lb.active = true;
                _lb.string = "太棒了，成功培养出一个山海经宝宝"

                this.baby.getComponent(Sprite).spriteFrame = this.sfs.find(item => item.name == `${this.a}_${originalIndex}`)
                this.qaq();
                this.baby.getChildByName("Label").getComponent(Label).string = "成年"

                this.winCount++
                this.jd.getChildByName("Label").getComponent(Label).string = `${this.winCount} / 3`;

                this.scheduleOnce(() => {
                    lb.active = false;
                    AudioManager.Instance.PlaySFX(this.roleSound[this.a])
                    this.scheduleOnce(() => {
                        if (this.winCount >= 3) {
                            this.gamePanel.Win()
                        } else {
                            const b = find("Canvas/PlayArea/ContinueBtn")
                            b.active = true;
                            tween(b)
                                .to(0.5, { scale: v3(1.3, 1.3, 1.3) })
                                .to(0.5, { scale: v3(1, 1, 1) })
                                .union().repeatForever().start()
                        }
                    }, this.roleSound[this.a].getDuration())
                }, this.niceSound.getDuration())

            } else {
                this.baby.getComponent(Sprite).spriteFrame = this.sfs_fail[originalIndex];
                this.qaq();
                face.active = true;
                lb.active = true;
                AudioManager.Instance.PlaySFX(this.lqbzSound)
                _lb.string = "你这乱七八糟的加一些东西，都培养出什么样子了"
                this.scheduleOnce(() => {
                    this.gamePanel.Lost();
                }, this.lqbzSound.getDuration())
            }

        }
    }

    qaq() {
        const uio = this.baby.getChildByName("烟雾").getComponent(UIOpacity)
        tween(uio)
            .to(0.5, { opacity: 255 })
            .to(0.5, { opacity: 0 })
            .start()
    }

    tvt() {
        const uio = this.baby.getChildByName("光").getComponent(UIOpacity)
        tween(uio)
            .to(0.5, { opacity: 255 })
            .to(0.5, { opacity: 0 })
            .start()
    }

    /** true 为A，false为B */
    loadAorB(bol?: boolean) {
        if (bol) {
            tween(this.B)
                .to(0.2, { position: v3(0, -1000, 0) })
                .call(() => {
                    this.B.active = false;
                    this.A.active = true;
                    tween(this.A)
                        .to(0.2, { position: v3(0, -600, 0) })
                        .call(() => {
                            this.isButtonClick = true;
                        })
                        .start()
                })
                .start()
        } else if (!bol) {
            tween(this.A)
                .to(0.2, { position: v3(0, -1000, 0) })
                .call(() => {
                    this.A.active = false;
                    this.B.active = true;
                    tween(this.B)
                        .to(0.2, { position: v3(0, -600, 0) })
                        .call(() => {
                            this.isButtonClick = true;
                        })
                        .start()
                })
                .start()
        }
    }

    private speed: number = 3;
    private scaleGap: number = 0.03;
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