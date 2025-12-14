import { _decorator, Animation, AudioClip, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Tween, tween, UIOpacity, v3, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('KFCD_GameManager')
export class KFCD_GameManager extends Component {
    public static instance: KFCD_GameManager = null;

    @property(GamePanel) GP: GamePanel = null;
    @property(Node) GA: Node = null;
    @property(Prefab) leftPropPrefab: Prefab = null;
    @property(Prefab) rightPropPrefab: Prefab = null;
    @property(Node) leftPropParent: Node = null;
    @property(Node) rightPropParent: Node = null;
    @property([SpriteFrame]) leftPropSpriteFrames: SpriteFrame[] = [];
    @property([SpriteFrame]) rightPropSpriteFrames: SpriteFrame[] = [];
    @property(Node) kb: Node = null;
    @property(Node) gm: Node = null;
    @property(Node) leftBtnNode: Node = null;
    @property(Node) rightBtnNode: Node = null;
    @property(SpriteFrame) lp: SpriteFrame = null;

    @property(AudioClip) z: AudioClip = null;
    @property(AudioClip) y: AudioClip = null;
    @property(AudioClip) zy: AudioClip = null;
    @property(AudioClip) p: AudioClip = null;
    @property(AudioClip) successAudio: AudioClip = null;
    @property(AudioClip) failAudio: AudioClip = null;
    @property(AudioClip) bgm: AudioClip = null;
    @property(AudioClip) yh: AudioClip = null;

    @property(Prefab) answer: Prefab = null;
    @property(Node) failPanel: Node = null;
    @property(Node) successPanel: Node = null;

    private level = 0;

    protected onLoad(): void {
        KFCD_GameManager.instance = this;
        this.bottomTween(this.kb)
        this.bottomTween(this.gm)
    }

    protected start(): void {
        this.GP.answerPrefab = this.answer;
        this.initProp();
        AudioManager.Instance.PlayBGM(this.bgm)
    }

    count: number = 0;

    initProp() {
        const leftProp = instantiate(this.leftPropPrefab)
        const rightProp = instantiate(this.rightPropPrefab)
        leftProp.getComponent(Sprite).spriteFrame = this.leftPropSpriteFrames[this.level]
        rightProp.getComponent(Sprite).spriteFrame = this.rightPropSpriteFrames[this.level]
        leftProp.parent = this.leftPropParent
        rightProp.parent = this.rightPropParent
        leftProp.name = `left_${this.level + 1}`
        rightProp.name = `right_${this.level + 1}`
        leftProp.setScale(0, 0, 0)
        rightProp.setScale(0, 0, 0)
        tween(leftProp)
            .to(0.5, { scale: new Vec3(1, 1, 1) })
            .start();
        tween(rightProp)
            .to(0.5, { scale: new Vec3(1, 1, 1) })
            .start();

        const label = this.gm.getChildByName("Label")
        label.active = true;
        label.getChildByName("String").getComponent(Label).string = "选左还是选右"
        AudioManager.Instance.PlaySFX(this.zy)
        this.scheduleOnce(() => {
            label.active = false
            this.leftBtnNode.active = true;
            this.rightBtnNode.active = true;
        }, this.zy.getDuration())
    }

    leftBtn() {

        this.setLabel("我选左")
        AudioManager.Instance.PlaySFX(this.z);

        this.kb.getChildByName("LeftHand-001").active = true;
        this.kb.getChildByName("LeftHand").active = false;
        this.scheduleOnce(() => {
            this.kb.getChildByName("LeftHand-001").active = false;
            this.kb.getChildByName("LeftHand").active = true;
        }, 1)
        this.leftBtnNode.active = false;
        this.rightBtnNode.active = false;
        this.leftPropParent.removeAllChildren();
        this.rightPropParent.removeAllChildren();
        if (this.level == 0 || this.level == 2) {
            this.count++
            this.changeSF()
        } else {
            const ani = this.gm.getComponent(Animation)
            ani.play()
        }
        this.ovo(`left_${this.level + 1}`)

    }

    rightBtn() {

        this.setLabel("我选右")
        AudioManager.Instance.PlaySFX(this.y);
        this.kb.getChildByName("RightHand-001").active = true;
        this.kb.getChildByName("RightHand").active = false;
        this.scheduleOnce(() => {
            this.kb.getChildByName("RightHand-001").active = false;
            this.kb.getChildByName("RightHand").active = true;
        }, 1)
        this.leftBtnNode.active = false;
        this.rightBtnNode.active = false;
        this.leftPropParent.removeAllChildren();
        this.rightPropParent.removeAllChildren();
        if (this.level == 1 || this.level == 3 || this.level == 4 || this.level == 5) {
            this.count++
            this.changeSF()
        } else {
            const ani = this.gm.getComponent(Animation)
            ani.play()
        }
        this.ovo(`right_${this.level + 1}`)
    }

    changeSF() {
        const sf = this.gm.getComponent(Sprite).spriteFrame
        this.gm.getComponent(Sprite).spriteFrame = this.lp
        AudioManager.Instance.PlaySFX(this.p);
        this.scheduleOnce(() => {
            this.gm.getComponent(Sprite).spriteFrame = sf
        }, 1)
    }

    ovo(str: string) {
        this.scheduleOnce(() => {
            this.kb.children.find(item => item.name == str).active = true
            this.scheduleOnce(() => {
                this.level++
                if (this.level > 5) {
                    if (this.count >= 5) {
                        Tween.stopAll()
                        this.successPanel.active = true;
                        this.kb.setParent(this.successPanel)
                        this.kb.setPosition(315, -815);
                        const uio = this.successPanel.getComponent(UIOpacity)
                        tween(uio).to(0.5, { opacity: 255 })
                            .call(() => {
                                this.setLabel("木棍人哥哥，我们去约会吧")
                                AudioManager.Instance.PlaySFX(this.yh)
                                this.scheduleOnce(() => {
                                    const mgr = this.successPanel.getChildByName("木棍人")
                                    const label = mgr.getChildByName("Label")
                                    label.active = true;
                                    label.getChildByName("String").getComponent(Label).string = "走吧，咖啡妹妹，你今天真漂亮"
                                    AudioManager.Instance.PlaySFX(this.successAudio)
                                    this.scheduleOnce(() => {
                                        label.active = false
                                        this.GP.Win()
                                    }, this.successAudio.getDuration())
                                }, this.yh.getDuration())
                            })
                            .start()
                    }
                    else {
                        Tween.stopAll()
                        this.failPanel.active = true;
                        this.kb.setParent(this.failPanel)
                        this.kb.setPosition(315, -815);
                        const uio = this.failPanel.getComponent(UIOpacity)
                        tween(uio).to(0.5, { opacity: 255 })
                            .call(() => {
                                const mgr = this.successPanel.getChildByName("木棍人")
                                const label = mgr.getChildByName("Label")
                                label.active = true;
                                label.getChildByName("String").getComponent(Label).string = "咖啡妹妹不可能那么胖，你是抹茶小姐假扮的吧"
                                AudioManager.Instance.PlaySFX(this.failAudio)
                                this.scheduleOnce(() => {
                                    label.active = false;
                                    this.GP.Lost()
                                }, this.failAudio.getDuration())
                            })
                            .start()

                    }
                } else {
                    this.initProp()
                }
            }, 1)
        }, 1)
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

    setLabel(str: string) {
        const label = this.kb.getChildByName("Label")
        label.active = true;
        label.getChildByName("String").getComponent(Label).string = str
        this.scheduleOnce(() => {
            label.active = false
        }, 1)
    }
}


