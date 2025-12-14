import { _decorator, Animation, animation, AnimationState, AudioClip, Component, Label, Node, ProgressBar, tween, v3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { JZHZLX_GameManager } from '../../26_JZHZ_LX/Scripts/JZHZLX_GameManager';
import { JZHZNYY_GameManager } from './JZHZNYY_GameManager';
const { ccclass, property } = _decorator;

@ccclass('JZHZNYY_NYY')
export class JZHZNYY_NYY extends Component {
    @property(Node)
    ProGressBar: Node = null;
    @property(Node)
    动画: Node = null;
    public static Instance: JZHZNYY_NYY = null;
    @property(Node)
    MoveNode: Node = null;
    @property(Node)
    头: Node = null;
    @property(Node)
    对话框: Node = null;
    @property(AudioClip)
    Music: AudioClip[] = [];
    public Chlick: boolean = true;
    public MusicEnable: boolean = true;
    public WinNumber: number = 0;
    protected onLoad(): void {
        JZHZNYY_NYY.Instance = this;
        // AudioManager.Instance.PlaySFX();
    }
    start() {
        this.对话框.active = true;
        AudioManager.Instance.StopBGM();
        this.scheduleOnce(() => {
        }, 1)
        AudioManager.Instance.PlayBGM(this.Music[1]);

        this.scheduleOnce(() => {
            this.MusicEnable = true;
            this.对话框.active = false;
        }, 2)
    }
    ProgressBar() {
        if (this.MoveNode.children[0] != null) {


            this.ProGressBar.getComponent(ProgressBar).progress += 0.04;
            if (this.ProGressBar.getComponent(ProgressBar).progress >= 0.2) {
                this.头.children[0].active = false;
                this.头.children[1].active = true;
                if (this.MusicEnable == true && this.WinNumber == 0) {
                    this.WinNumber = 1;

                    this.对话框.children[0].getComponent(Label).string = "就你,能拿我怎么样呢";
                    this.对话框.active = true;

                    this.scheduleOnce(() => {
                        this.MusicEnable = true;
                        this.对话框.active = false;
                    }, 2)
                }
            } if (this.ProGressBar.getComponent(ProgressBar).progress >= 0.4) {
                this.头.children[1].active = false;
                this.头.children[2].active = true;
                if (this.MusicEnable == true && this.WinNumber == 1) {
                    this.WinNumber = 2;

                    this.对话框.children[0].getComponent(Label).string = "就这吗?没感觉啊";
                    this.对话框.active = true;

                    this.scheduleOnce(() => {
                        this.MusicEnable = true;
                        this.对话框.active = false;
                    }, 2)
                }

            } if (this.ProGressBar.getComponent(ProgressBar).progress >= 0.6) {
                this.头.children[2].active = false;
                this.头.children[3].active = true;
                if (this.MusicEnable == true && this.WinNumber == 2) {
                    this.WinNumber = 3;

                    this.对话框.children[0].getComponent(Label).string = "就这也想让我破防?";
                    this.对话框.active = true;
                    AudioManager.Instance.PlaySFX(this.Music[4]);
                    this.scheduleOnce(() => {
                        this.MusicEnable = true;
                        this.对话框.active = false;
                    })
                }

            }
            if (this.ProGressBar.getComponent(ProgressBar).progress >= 0.8) {
                if (this.MusicEnable == true && this.WinNumber == 3) {
                    this.WinNumber = 4;

                    this.对话框.children[0].getComponent(Label).string = "别挠了我错了";
                    JZHZNYY_GameManager.Instance.停止递减();
                    this.对话框.active = true;

                    this.scheduleOnce(() => {
                        this.MusicEnable = true;
                        this.对话框.active = false;

                    }, 2)
                }

                tween(this.node)
                    .delay(1)
                    .call(() => {
                        JZHZNYY_GameManager.Instance.Win();
                    })
                    .start();
            }
            for (let i = 0; i < this.动画.children.length; i++) {
                // this.动画.children[i].getComponent(Animation)
                if (i != 0 && i != 1) {
                    const animationComponent = this.动画.children[i].getComponent(Animation);

                    const [idleClip, runClip] = animationComponent.clips;
                    const idleState = animationComponent.getState(idleClip.name);
                    animationComponent.getState(idleClip.name).speed = 3.0;
                }
            }
            this.不吃香菜2号();
        }
    }
    不吃香菜() {

        for (let i = 0; i < this.动画.children.length; i++) {
            // this.动画.children[i].getComponent(Animation)
            if (i != 0 && i != 1) {
                const animationComponent = this.动画.children[i].getComponent(Animation);

                const [idleClip, runClip] = animationComponent.clips;
                const idleState = animationComponent.getState(idleClip.name);
                animationComponent.getState(idleClip.name).speed = 1.0;
            }
        }
    }
    不吃香菜2号() {
        if (this.Chlick == true) {
            this.MoveNode.children[0].active = true;
            tween(this.MoveNode.children[0])
                .call(() => {
                    this.Chlick = false;
                    if (this.MusicEnable == true) {
                        AudioManager.Instance.PlaySFX(this.Music[0]);
                    }
                })
                .to(0, { worldPosition: v3(this.MoveNode.worldPosition.x, this.MoveNode.worldPosition.y, 0) })
                .to(1, { worldPosition: v3(this.MoveNode.worldPosition.x + 400, this.MoveNode.worldPosition.y, 0) })
                .call(() => {
                    if (this.MoveNode.children[0] != null) {
                        this.MoveNode.children[0].active = false;
                        this.MoveNode.children[0].setWorldPosition(this.MoveNode.worldPosition);
                    }
                    this.不吃香菜();
                    this.Chlick = true;
                })
                .start()
        }
    }

}


