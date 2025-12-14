import { _decorator, Animation, AudioClip, AudioSource, BoxCollider2D, Collider2D, ColliderComponent, Component, Contact2DType, director, Game, instantiate, IPhysics2DContact, ITriggerEvent, Label, Node, Prefab, UITransform, Vec3 } from 'cc';
import { LWMJ_ToolBlock } from './LWMJ_ToolBlock';
import { LWMJ_Tool } from './LWMJ_Tool';
import { Panel } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('LWMJ_AnimaControl')
export class LWMJ_AnimaControl extends Component {
    @property(Node)
    private mainAnimation: Node = null!;
    @property(Prefab)
    private toolPrefab: Prefab = null!;
    @property(Node)
    private detectArea: Node = null!;
    private uiTrans: UITransform = null!;
    @property(Node)
    private loseNode: Node = null!;
    @property(Node)
    private winNode: Node = null!;
    @property([AudioClip])
    private audioClips: AudioClip[] = [];

    @property(GamePanel)
    private PanelPrefab: GamePanel = null!;

    @property(Prefab)
    private answerPrefab: Prefab = null!;

    private isWin: boolean = false;

    @property(AudioSource)
    private audio: AudioSource = null;

    @property(Node)
    private dialogLabel: Node = null!;
    private isZjdOnce: number = 2;
    private isJjmOnce: number = 2;
    private num1: number = 3;
    private num2: number = 3;
    private num3: number = 3;
    private num4: number = 3;
    private num5: number = 3;
    private num6: number = 3;
    private num7: number = 3;
    private num8: number = 3;
    private num9: number = 3;
    private num10: number = 3;
    private num11: number = 3;
    private num12: number = 3;
    private num13: number = 3;
    private num14: number = 3;
    private num15: number = 3;
    private num16: number = 3;
    private isStop: number = 3;
    protected onLoad() {
        const handPrefab = instantiate(this.toolPrefab);
        this.node.parent.addChild(handPrefab);
        handPrefab.setSiblingIndex(3);
        this.detectArea = handPrefab;
        this.PanelPrefab.answerPrefab = this.answerPrefab;
        this.uiTrans = this.detectArea.getComponent(UITransform);
        // director.getScene().on(MyEvent.TreasureBoxDestroy,this.init,this);
        this.PanelPrefab.winStr = "新做的美甲很漂亮，干得不错！";
        this.PanelPrefab.lostStr = "连这点小事都做不好，真没用。";
        if (ProjectEventManager.GameStartIsShowTreasureBox) director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
        else this.Init();
    }
    Init() {
        // this.audio.playOneShot(this.audioClips[10]);
        AudioManager.Instance.PlaySFX(this.audioClips[10]);

        this.scheduleOnce(() => {
            this.dialogLabel.active = false;

        }, 3);
    }
    public checkPosition(worldPos: Vec3, id: number, Xnode: Node) {
        const uiTrans = this.detectArea.getComponent(UITransform);
        if (!uiTrans) return;
        const localPos = uiTrans.convertToNodeSpaceAR(worldPos);
        const width = uiTrans.width;
        const height = uiTrans.height;
        const anchor = uiTrans.anchorPoint;

        const left = -width * anchor.x;
        const right = width * (1 - anchor.x);
        const bottom = -height * anchor.y;
        const top = height * (1 - anchor.y);
        if (localPos.x > left && localPos.x < right &&
            localPos.y > bottom && localPos.y < top) {
            this.playAnimationByID(id);
            if (Xnode && Xnode.parent) {
                if (Xnode.parent.getChildByName("CloseBg") != null)
                    Xnode.parent.getChildByName("CloseBg").active = true;
            }
            if (this.node.parent.getChildByName("CloseEvent") != null)
                this.node.parent.getChildByName("CloseEvent").active = true;
            this.scheduleOnce(() => {
                this.node.parent.getChildByName("CloseEvent").active = false;
            }, 1.8);



            console.log("id号为:" + id);


        }
    }


    private playAnimationByID(id: number) {
        switch (id) {
            case 0:
                this.mainAnimation.getComponent(Animation).play("0");
                // this.audio.playOneShot(this.audioClips[8]);
                AudioManager.Instance.PlaySFX(this.audioClips[8]);
                this.num1 = 2;
                break;
            case 1:
                if (this.num2 != 2) {
                    this.lose();
                }

                this.mainAnimation.getComponent(Animation).play("2");
                // this.audio.playOneShot(this.audioClips[13]);
                AudioManager.Instance.PlaySFX(this.audioClips[13]);
                this.num3 = 2;
                break;
            case 2:
                if (this.num3 != 2) {
                    this.lose();
                }
                this.mainAnimation.getComponent(Animation).play('3');
                // this.audio.playOneShot(this.audioClips[0]);
                AudioManager.Instance.PlaySFX(this.audioClips[0]);
                this.num4 = 2;
                this.isJjmOnce = 3;
                break;
            case 3:
                if (this.num5 != 2) {
                    this.lose();
                }
                this.mainAnimation.getComponent(Animation).play('4');
                // this.audio.playOneShot(this.audioClips[6]);
                AudioManager.Instance.PlaySFX(this.audioClips[6]);
                this.num6 = 2;
                break;
            case 4:
                if (this.num6 != 2) {
                    this.lose();
                }
                this.mainAnimation.getComponent(Animation).play('5');
                // this.audio.playOneShot(this.audioClips[5]);
                AudioManager.Instance.PlaySFX(this.audioClips[5]);
                this.num7 = 2;
                break;
            case 5:
                if (this.num7 != 2) {
                    this.lose();
                }
                this.mainAnimation.getComponent(Animation).play('6');
                // this.audio.playOneShot(this.audioClips[13]);
                AudioManager.Instance.PlaySFX(this.audioClips[13]);
                this.num8 = 2;
                break;
            case 6:
                if (this.num8 != 2) {
                    this.lose();
                }
                this.mainAnimation.getComponent(Animation).play('7');
                // this.audio.playOneShot(this.audioClips[3]);
                AudioManager.Instance.PlaySFX(this.audioClips[3]);
                this.num9 = 2;
                break;
            case 7:
                if (this.num9 != 2) {
                    this.lose();
                }
                this.mainAnimation.getComponent(Animation).play('8');
                // this.audio.playOneShot(this.audioClips[13]);
                AudioManager.Instance.PlaySFX(this.audioClips[13]);
                this.num10 = 2;
                break;
            case 8:
                if (this.num10 != 2) {
                    this.lose();
                }
                this.mainAnimation.getComponent(Animation).play('9');
                // this.audio.playOneShot(this.audioClips[4]);
                AudioManager.Instance.PlaySFX(this.audioClips[4]);
                this.num11 = 2;
                break;
            case 9:
                if (this.num11 != 2) {
                    this.lose();
                }
                this.mainAnimation.getComponent(Animation).play('10');
                // this.audio.playOneShot(this.audioClips[3]);
                AudioManager.Instance.PlaySFX(this.audioClips[3]);
                this.num12 = 2;
                this.isZjdOnce = 4;
                break;
            case 10:
                if (this.num13 != 2) {
                    this.lose();
                }
                this.mainAnimation.getComponent(Animation).play('12');
                // this.audio.playOneShot(this.audioClips[9]);
                AudioManager.Instance.PlaySFX(this.audioClips[9]);
                this.num14 = 2;
                this.isJjmOnce = 4;
                break;
            case 11:
                if (this.num14 != 2) {
                    this.lose();
                }
                this.mainAnimation.getComponent(Animation).play('13');
                // this.audio.playOneShot(this.audioClips[13]);
                AudioManager.Instance.PlaySFX(this.audioClips[13]);
                this.num15 = 2;
                break;
            case 13:
                if (this.num15 != 2) {
                    this.lose();
                }
                this.mainAnimation.getComponent(Animation).play('14');
                // this.audio.playOneShot(this.audioClips[14]);
                AudioManager.Instance.PlaySFX(this.audioClips[14]);
                this.num16 = 2;
                this.isWin = true;
                break;

            case 14:
                if (this.num16 != 2) {
                    this.lose();
                }
                this.mainAnimation.getComponent(Animation).play('15');
                // this.audio.playOneShot(this.audioClips[11]);
                AudioManager.Instance.PlaySFX(this.audioClips[11]);
                this.scheduleOnce(() => {
                    if (this.isWin == false) return;
                    this.gameWin();
                }, 3);

                break;
            case 15:
                if (this.isZjdOnce == 4) {
                    if (this.num12 != 2) {
                        this.lose();
                    }
                    console.log("有触发");
                    this.mainAnimation.getComponent(Animation).play('18');
                    // this.audio.playOneShot(this.audioClips[7]);
                    AudioManager.Instance.PlaySFX(this.audioClips[7]);
                    this.num13 = 2;
                } else {
                    if (this.num1 != 2) {
                        this.lose();
                    } else {
                        this.mainAnimation.getComponent(Animation).play('1');
                        // this.audio.playOneShot(this.audioClips[7]);
                        AudioManager.Instance.PlaySFX(this.audioClips[7]);
                        this.num2 = 2;

                    }
                }


                break;
            case 21:
                if (this.isJjmOnce == 4) {
                    if (this.num12 != 2) {
                        this.lose();
                    }
                    this.mainAnimation.getComponent(Animation).play('19');
                    // this.audio.playOneShot(this.audioClips[1]);
                    AudioManager.Instance.PlaySFX(this.audioClips[1]);
                    this.num13 = 2;
                }
                if (this.num4 != 2) {
                    this.lose();
                }
                this.mainAnimation.getComponent(Animation).play('19');
                // this.audio.playOneShot(this.audioClips[1]);
                AudioManager.Instance.PlaySFX(this.audioClips[1]);
                this.num5 = 2;
                break;
            default:
                console.warn('未知的ID:', id);
                break;
        }
    }
    start() {
    }

    update(deltaTime: number) {

    }
    gameWin() {
        this.winNode.active = true;
        this.scheduleOnce(() => {
            this.PanelPrefab.Win();
        }, 3);

    }
    lose() {

        this.scheduleOnce(() => {
            this.loseNode.active = true;

        }, 2);
        this.scheduleOnce(() => {
            this.PanelPrefab.Lost();
        }, 5);


    }
}


