import { _decorator, AudioClip, Component, director, Node, sp, tween, UIOpacity, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('NZABSJ_GameStart')
export class NZABSJ_GameStart extends Component {

    @property(Node)
    leftLabelBG: Node = null;

    @property(Node)
    rightLabelBG: Node = null;

    @property(Node)
    BlackMask: Node = null;

    @property(Node)
    mainPanel: Node = null;

    @property(Node)
    taiYi: Node = null;

    // @property([AudioClip])
    // audio: AudioClip;

    @property([AudioClip])
    audios: AudioClip[] = []

    taiyiSke: sp.Skeleton = null;

    protected onLoad(): void {
        this.taiyiSke = this.taiYi.getComponent(sp.Skeleton)
    }

    protected start(): void {
        if (ProjectEventManager.GameStartIsShowTreasureBox) {
            director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
        } else {
            this.Init();
        }
    }

    Init() {
        tween(this.taiYi)
            .to(2, { position: new Vec3(0, 375, 0) })
            .call(() => {
                this.taiYi.getChildByName("LabelBG").active = true;
                this.taiyiSke.setAnimation(1, "animation", true);
                this.playAudio("睡觉");

                this.scheduleOnce(() => {
                    this.taiYi.getChildByName("LabelBG").active = false;
                    tween(this.taiYi)
                        .to(2, { position: new Vec3(-1000, 375, 0) })
                        .call(() => {
                            this.taiyiSke.setAnimation(1, "<None>", true);

                            this.scheduleOnce(() => {
                                this.leftLabelBG.active = true;
                                this.playAudio("好热");
                                this.scheduleOnce(() => {
                                    this.leftLabelBG.active = false;
                                    this.scheduleOnce(() => {
                                        this.rightLabelBG.active = true;
                                        this.playAudio("好冷");
                                        this.scheduleOnce(() => {
                                            this.rightLabelBG.active = false;
                                            this.scheduleOnce(() => {
                                                const blackMaskOpacity = this.BlackMask.getComponent(UIOpacity);
                                                blackMaskOpacity.opacity = 0;
                                                tween(blackMaskOpacity)
                                                    .to(2, { opacity: 255 })
                                                    .call(() => {
                                                        this.node.active = false;
                                                        this.mainPanel.active = true;
                                                        tween(blackMaskOpacity)
                                                            .to(2, { opacity: 0 })
                                                            .start();
                                                    })
                                                    .start();
                                            }, 0.5)
                                        }, 3)
                                    }, 0.5)
                                }, 3)
                            }, 1);
                        })
                        .start();
                }, 4)
            })
            .start();
    }

    private playAudio(name: string) {
        const audioClip = this.audios.find(item => item.name === name);
        if (audioClip) {
            AudioManager.Instance.PlaySFX(audioClip);
        }
    }
}


