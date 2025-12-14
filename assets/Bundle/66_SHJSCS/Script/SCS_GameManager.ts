import { _decorator, AudioClip, Component, Event, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Tween, tween, UIOpacity, UITransform, v3, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import UI_BreatheAni, { BREATHEANI_TYPE } from 'db://assets/Scripts/Framework/UI/UI_BreatheAni';
import UI_Shaking from 'db://assets/Scripts/Framework/UI/UI_Shaking';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SCS_GameManager')
export class SCS_GameManager extends Component {

    public static instance: SCS_GameManager = null;

    @property(AudioClip) comeOn: AudioClip = null;
    @property(AudioClip) goWc: AudioClip = null;
    @property(AudioClip) wc: AudioClip = null;
    @property(AudioClip) yj: AudioClip = null;
    @property(AudioClip) startClip: AudioClip = null;
    @property(AudioClip) winClip: AudioClip = null;
    @property(AudioClip) failClip: AudioClip = null;
    @property([AudioClip]) tureClips: AudioClip[] = [];
    @property([AudioClip]) falseClips: AudioClip[] = [];

    @property(GamePanel) gamePanel: GamePanel = null;
    @property([SpriteFrame]) sf: SpriteFrame[] = [];
    @property([SpriteFrame]) sad: SpriteFrame[] = [];
    @property([SpriteFrame]) happy: SpriteFrame[] = [];
    @property(Prefab) role: Prefab = null;
    @property(Node) playArea: Node = null;
    @property(Node) boss: Node = null;

    @property(Prefab) answer: Prefab = null;

    @property(SpriteFrame) rhg: SpriteFrame = null;
    @property(SpriteFrame) sr: SpriteFrame = null;

    @property([Node]) private happys: Node[] = [];
    @property([Node]) private sads: Node[] = [];

    private count: number = 0
    currentRole: Node = null
    private isCanBtn = false

    private ovo: number = 0;

    isCanTouch = false;


    onLoad() {
        SCS_GameManager.instance = this;
    }

    start() {
        this.gamePanel.answerPrefab = this.answer;

        AudioManager.Instance.PlaySFX(this.goWc)
        tween(this.boss)
            .to(0.5, { position: v3(0, -350, 0) })
            .call(() => {
                this.bottomTween(this.boss)
                AudioManager.Instance.PlaySFX(this.startClip)
                const lb = this.boss.getChildByName("LabelBG")
                lb.active = true
                lb.getChildByName("Label").getComponent(Label).string = "今天山海经的大伙们要来这边旅游，你可要好好招待他们"
                this.scheduleOnce(() => {
                    lb.active = false;
                    AudioManager.Instance.PlaySFX(this.goWc)
                    tween(this.boss)
                        .to(0.5, { position: v3(-1000, -350, 0) })
                        .call(() => {
                            this.initRole()
                        })
                        .start()
                }, this.startClip.getDuration())
            })
            .start()
    }

    initRole() {
        if (this.sf.length == 0) {
            this.gameOver()
        }
        console.log("初始化角色", this.count);
        this.currentRole = instantiate(this.role)
        this.currentRole.name = this.sf[this.count].name
        this.currentRole.getComponent(Sprite).spriteFrame = this.sf[this.count]
        this.currentRole.setParent(this.playArea)
        this.currentRole.scale = v3(0.5, 0.5, 1)
        this.currentRole.setPosition(v3(350, 0, 0))
        this.currentRole.active = true;

        if (this.currentRole.name == "融合怪") {
            this.isCanTouch = true;
        }

        AudioManager.Instance.PlaySFX(this.comeOn)

        tween(this.currentRole)
            .to(0.5, { scale: Vec3.ONE })
            .start()
        tween(this.currentRole)
            .to(0.5, { position: v3(0, -500, 0) })
            .call(() => {
                AudioManager.Instance.PlaySFX(this.yj)

                this.bottomTween(this.currentRole)
                this.currentRole.getChildByName("难受").active = true;
                this.scheduleOnce(() => {
                    this.isCanBtn = true
                    this.currentRole.getChildByName("难受").active = false;
                }, this.yj.getDuration())
            })
            .start()

    }

    leftButton(event: Event) {
        if (!this.isCanBtn) return
        AudioManager.Instance.PlaySFX(this.goWc)

        tween(this.currentRole)
            .to(0.5, { position: v3(-1000, this.currentRole.position.y, 0) })
            .call(() => {
                this.isCanBtn = false
                AudioManager.Instance.PlaySFX(this.wc)

                switch (this.currentRole.name) {
                    case "木棍人": case "鲨鱼": case "忍者卡布奇诺": case "青蛙": case "树人":
                        this.updateHappyEmoji(this.currentRole.name)
                        break;
                    default:
                        this.updateSadEmoji(this.currentRole.name)
                        break;
                }

                this.scheduleOnce(() => {

                    tween(this.currentRole)
                        .to(0.5, { position: v3(0, this.currentRole.position.y, 0) })
                        .call(() => {
                            switch (this.currentRole.name) {
                                case "木棍人": case "鲨鱼": case "忍者卡布奇诺": case "青蛙": case "树人":
                                    const x = this.playTureAudio(this.currentRole.name)
                                    this.scheduleOnce(() => {
                                        const node = this.happys.find(n => n.name == this.currentRole.name)
                                        if (node) {
                                            this.currentRole.destroy()
                                            const op = node.getComponent(UIOpacity)
                                            tween(op)
                                                .to(0.5, { opacity: 255 })
                                                .call(() => {
                                                    this.count++
                                                    if (this.count >= 10) {
                                                        this.gameOver()
                                                    } else {
                                                        this.initRole()
                                                    }
                                                })
                                                .start()
                                        }

                                    }, x)
                                    break;
                                default:
                                    const y = this.playFalseAudio(this.currentRole.name)
                                    this.scheduleOnce(() => {
                                        const node = this.sads.find(n => n.name == this.currentRole.name)
                                        console.error(node)
                                        if (node) {
                                            this.currentRole.destroy()
                                            const op = node.getComponent(UIOpacity)
                                            tween(op)
                                                .to(0.5, { opacity: 255 })
                                                .call(() => {
                                                    this.count++
                                                    if (this.count >= 10) {
                                                        this.gameOver()
                                                    } else {
                                                        this.initRole()
                                                    }
                                                })
                                                .start()
                                        }
                                    }, y)
                                    break;
                            }
                        })
                        .start()

                }, this.wc.getDuration())

            })
            .start()
    }

    rightButton(event: Event) {
        if (!this.isCanBtn) return
        AudioManager.Instance.PlaySFX(this.goWc)

        tween(this.currentRole)
            .to(0.5, { position: v3(1000, this.currentRole.position.y, 0) })
            .call(() => {
                this.isCanBtn = false
                AudioManager.Instance.PlaySFX(this.wc)

                switch (this.currentRole.name) {
                    case "木棍人": case "鲨鱼": case "忍者卡布奇诺": case "青蛙": case "树人": case "融合怪":
                        this.updateSadEmoji(this.currentRole.name)
                        break;
                    default:
                        this.updateHappyEmoji(this.currentRole.name)
                        break;
                }

                this.scheduleOnce(() => {

                    tween(this.currentRole)
                        .to(0.5, { position: v3(0, this.currentRole.position.y, 0) })
                        .call(() => {
                            switch (this.currentRole.name) {
                                case "木棍人": case "鲨鱼": case "忍者卡布奇诺": case "青蛙": case "树人": case "融合怪":
                                    const y = this.playFalseAudio(this.currentRole.name)
                                    this.scheduleOnce(() => {
                                        const node = this.sads.find(n => n.name == this.currentRole.name)
                                        console.error(node)
                                        if (node) {
                                            this.currentRole.destroy()
                                            const op = node.getComponent(UIOpacity)
                                            tween(op)
                                                .to(0.5, { opacity: 255 })
                                                .call(() => {
                                                    this.count++
                                                    if (this.count >= 10) {
                                                        this.gameOver()
                                                    } else {
                                                        this.initRole()
                                                    }
                                                })
                                                .start()
                                        }

                                    }, y)
                                    break;
                                default:
                                    const x = this.playTureAudio(this.currentRole.name)
                                    this.scheduleOnce(() => {
                                        const node = this.happys.find(n => n.name == this.currentRole.name)
                                        if (node) {
                                            this.currentRole.destroy()
                                            const op = node.getComponent(UIOpacity)
                                            tween(op)
                                                .to(0.5, { opacity: 255 })
                                                .call(() => {
                                                    this.count++
                                                    if (this.count >= 10) {
                                                        this.gameOver()
                                                    } else {
                                                        this.initRole()
                                                    }
                                                })
                                                .start()
                                        }

                                    }, x)
                                    break;
                            }
                        })
                        .start()

                }, this.wc.getDuration())

            })
            .start()
    }

    gameOver() {
        if (this.ovo >= 10) {
            console.log("游戏胜利")
            // this.gamePanel.Win()
            this.scheduleOnce(() => {
                this.boss.active = true;
                console.log("boss", this.boss)
                tween(this.boss)
                    .to(0.5, { position: v3(0, -350, 0) })
                    .call(() => {
                        const aaa = this.boss.getChildByName("LabelBG")
                        aaa.active = true;
                        aaa.getChildByName("Label").getComponent(Label).string = "这次招待的不错，他们都很满意，今晚给你安排升职加薪"
                        AudioManager.Instance.PlaySFX(this.winClip)
                        this.scheduleOnce(() => {
                            Tween.stopAll()
                            this.gamePanel.Win()
                        }, this.winClip.getDuration())
                    }).start()
            }, 1)
        }
        else {
            console.log("游戏失败")
            // this.gamePanel.Lost()
            this.scheduleOnce(() => {
                this.boss.active = true;
                tween(this.boss)
                    .to(0.5, { position: v3(0, -350, 0) })
                    .call(() => {
                        const aaa = this.boss.getChildByName("LabelBG")
                        aaa.active = true;
                        aaa.getChildByName("Label").getComponent(Label).string = "上厕所都安排不明白，你可以不用干了"
                        AudioManager.Instance.PlaySFX(this.failClip)
                        this.scheduleOnce(() => {
                            Tween.stopAll()
                            this.gamePanel.Lost()
                        }, this.winClip.getDuration())
                    }).start()
            }, 1)
        }
    }


    updateHappyEmoji(str: string) {
        console.log("updateHappyEmoji", str)

        const h = this.happy.find(x => x.name == str)
        if (h) {
            this.currentRole.getComponent(Sprite).spriteFrame = h
            this.currentRole.getChildByName("满意").active = true;
        }


    }

    updateSadEmoji(str: string) {
        console.log('updateSadEmoji', str)

        const s = this.sad.find(x => x.name == str)
        if (s) {
            this.currentRole.getComponent(Sprite).spriteFrame = s
            this.currentRole.getChildByName("不满意").active = true;
        }

    }

    playTureAudio(str: string) {
        this.ovo++
        console.log('=======================', this.ovo)
        if (str == "融合怪") {
            str = "树人"
            const clip = this.tureClips.find(x => x.name == str)
            if (clip) {
                AudioManager.Instance.PlaySFX(clip)
                return clip.getDuration()
            }
        }
        else {
            const clip = this.tureClips.find(x => x.name == str)
            if (clip) {
                AudioManager.Instance.PlaySFX(clip)
                return clip.getDuration()
            }
        }
    }

    playFalseAudio(str: string) {

        if (str == "融合怪") {
            str = "树人"
            const clip = this.falseClips.find(x => x.name == str)
            if (clip) {
                AudioManager.Instance.PlaySFX(clip)
                return clip.getDuration();
            }
        }
        else {
            const clip = this.falseClips.find(x => x.name == str)
            if (clip) {
                AudioManager.Instance.PlaySFX(clip)
                return clip.getDuration();
            }
        }

    }

    speed: number = 3;
    scaleGap: number = 0.03;
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