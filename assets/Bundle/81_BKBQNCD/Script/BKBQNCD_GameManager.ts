import { _decorator, AudioClip, Component, find, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Tween, tween, UIOpacity, v3, Vec3 } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { BKBQNCD_TouchCtrl } from './BKBQNCD_TouchCtrl';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('BKBQNCD_GameManager')
export class BKBQNCD_GameManager extends Component {

    public static Instance: BKBQNCD_GameManager = null;

    @property(GamePanel) gamePanel: GamePanel = null;

    @property(Prefab) leftProp: Prefab = null;
    @property(Prefab) rightProp: Prefab = null;

    @property(Node) propParent: Node = null;
    @property(Node) role: Node = null;
    @property(Node) gameOverPanel: Node = null;
    @property(Node) blackMask: Node = null;

    @property([SpriteFrame]) round1: SpriteFrame[] = [];
    @property([SpriteFrame]) round2: SpriteFrame[] = [];
    @property([SpriteFrame]) round3: SpriteFrame[] = [];
    @property([SpriteFrame]) round4: SpriteFrame[] = [];
    @property([SpriteFrame]) round5: SpriteFrame[] = [];
    @property([SpriteFrame]) round6: SpriteFrame[] = [];
    @property([SpriteFrame]) round7: SpriteFrame[] = [];

    @property(SpriteFrame) mr: SpriteFrame = null;
    @property(SpriteFrame) happy: SpriteFrame = null;
    @property(SpriteFrame) noHappy: SpriteFrame = null;
    @property(SpriteFrame) hz: SpriteFrame = null;
    @property(SpriteFrame) qz: SpriteFrame = null;
    @property(SpriteFrame) mgr1: SpriteFrame = null;
    @property(SpriteFrame) mgr2: SpriteFrame = null;

    @property(AudioClip) bgm: AudioClip = null;
    @property(Prefab) answer: Prefab = null;

    private round: number = 1;
    private propParentInitialPos: Vec3 = null;

    protected onLoad(): void {
        BKBQNCD_GameManager.Instance = this;
        this.propParentInitialPos = v3(0, 1000)
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer;
        AudioManager.Instance.PlayBGM(this.bgm);
        this.bottomTween(this.role)
        const label = this.role.getChildByName("Label")
        label.active = true;
        label.getChildByName("String").getComponent(Label).string = "今天要去和木棍人约会，据说他是一个成功男士，快帮我打扮一下，一定要得体端庄噢"
        this.scheduleOnce(() => {
            label.active = false;
            this.loadProp()
        }, 3)
    }

    loadProp() {

        try {
            let sfs = [];
            switch (this.round) {
                case 1:
                    sfs = this.round1
                    break;
                case 2:
                    sfs = this.round2
                    break;
                case 3:
                    sfs = this.round3
                    break;
                case 4:
                    sfs = this.round4
                    break;
                case 5:
                    sfs = this.round5
                    break;
                case 6:
                    sfs = this.round6
                    break;
                case 7:
                    sfs = this.round7
                    break;
            }

            this.propParent.setPosition(this.propParentInitialPos)
            const sf1 = sfs[0];
            const sf2 = sfs[1];
            const left = instantiate(this.leftProp);
            const right = instantiate(this.rightProp);
            left.getChildByName("PropIcon").getComponent(Sprite).spriteFrame = sf1;
            right.getChildByName("PropIcon").getComponent(Sprite).spriteFrame = sf2;
            left.setParent(this.propParent);
            right.setParent(this.propParent);
            left.setPosition(-250, 0)
            right.setPosition(250, 0)

            tween(this.propParent)
                .to(3, { position: Vec3.ZERO })
                .call(() => {
                    left.destroy();
                    right.destroy();
                    this.ovo()
                })
                .start();
        } catch (error) {
            console.warn(error);
        }
    }
    private count: number = 0;
    ovo() {
        const pos = this.role.getPosition();
        const sp = this.role.getComponent(Sprite)
        switch (this.round) {
            case 1:
                if (pos.x > 0) {
                    this.count++;
                    sp.spriteFrame = this.happy
                    this.setLabel("洗个澡真舒坦啊")
                } else {
                    sp.spriteFrame = this.noHappy
                    this.setLabel("治标不治本，臭味变怪味了")
                }
                break;
            case 2:
                if (pos.x > 0) {
                    this.count++;
                    sp.spriteFrame = this.hz
                    this.setLabel("这个妆适合我")
                } else {
                    sp.spriteFrame = this.noHappy
                    this.setLabel("没尝试过的妆容，大胆尝试吧")
                }
                break;
            case 3:
                if (pos.x < 0) {
                    this.role.getChildByName("蓝美瞳").active = true
                    this.setLabel("蓝色美瞳也好看，但是不适合我")
                } else {
                    this.count++;
                    this.role.getChildByName("粉美瞳").active = true
                    this.setLabel("粉色美瞳还是一如竟往的得我心啊")
                }
                break;
            case 4:
                if (pos.x > 0) {
                    sp.spriteFrame = this.qz
                    this.role.getChildByName("蓝裙子").active = true
                    this.setLabel("挺好看的裙子")
                } else {
                    this.count++;
                    sp.spriteFrame = this.qz
                    this.role.getChildByName("粉裙子").active = true
                    this.setLabel("这个是我平时最喜欢穿的")
                }
                break;
            case 5:
                if (pos.x < 0) {
                    this.role.getChildByName("蓝鞋子").active = true
                    this.setLabel("这个好像也还不错")
                } else {
                    this.count++;
                    this.role.getChildByName("粉鞋子").active = true
                    this.setLabel("我喜欢这个")
                }
                break;
            case 6:
                if (pos.x < 0) {
                    this.role.getChildByName("蓝包包").active = true
                    this.setLabel("这个好像也还不错")
                } else {
                    this.count++;
                    this.role.getChildByName("粉包包").active = true
                    this.setLabel("姐姐留给我的包，她是个魅力四射的人")
                }
                break;
            case 7:
                if (pos.x < 0) {
                    this.role.getChildByName("绿茶").active = true
                    this.setLabel("茶叶好像不太对劲啊")
                } else {
                    this.count++;
                    this.role.getChildByName("卡布奇诺").active = true
                    this.setLabel("这才符合我")
                }
                break;
        }
    }

    setLabel(str: string) {
        const label = this.role.getChildByName("Label")
        label.active = true;
        label.getChildByName("String").getComponent(Label).string = str
        this.scheduleOnce(() => {
            label.active = false;
            // this.role.getComponent(Sprite).spriteFrame = this.mr
            this.round++
            console.log("round", this.round)
            console.log("count", this.count)


            if (this.round > 7) {
                this.gameOver()
            }

            else {
                this.loadProp()
            }
        }, 2)
    }

    gameOver() {
        this.blackMask.active = true;
        tween(this.blackMask.getComponent(UIOpacity))
            .to(0.5, { opacity: 255 })
            .call(() => {

                this.role.setParent(this.gameOverPanel)
                this.role.setPosition(-250, -800, 0)
                find("Canvas/GameArea").getComponent(BKBQNCD_TouchCtrl).enabled = false

                this.gameOverPanel.active = true;

                tween(this.blackMask.getComponent(UIOpacity))
                    .to(0.5, { opacity: 0 })
                    .call(() => {
                        this.blackMask.active = false;
                        if (this.count >= 7) {
                            this.win()
                        }

                        else {
                            this.fail()
                        }
                    })
                    .start();
            })
            .start();

    }

    win() {
        const mgr = this.gameOverPanel.getChildByName("MGR")
        this.bottomTween(mgr)
        mgr.getComponent(Sprite).spriteFrame = this.mgr1
        const la = mgr.getChildByName("Label")
        la.active = true;
        la.getChildByName("String").getComponent(Label).string = "你真漂亮，我喜欢你这种漂亮又自信的女孩子"
        this.scheduleOnce(() => {
            Tween.stopAll()
            this.gamePanel.Win()
        }, 2)
    }

    fail() {
        const mgr = this.gameOverPanel.getChildByName("MGR")
        this.bottomTween(mgr)
        mgr.getComponent(Sprite).spriteFrame = this.mgr2
        const la = mgr.getChildByName("Label")
        la.active = true;
        la.getChildByName("String").getComponent(Label).string = "你怎么打扮成这样就来了，看来你不是我喜欢的类型"
        this.scheduleOnce(() => {
            Tween.stopAll()
            this.gamePanel.Lost()
        }, 2)
    }

    private speed: number = 3;
    private scaleGap: number = 0.01;
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


