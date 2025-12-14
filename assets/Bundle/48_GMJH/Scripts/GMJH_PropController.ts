import { _decorator, Component, director, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Tween, tween, UIOpacity, Vec3 } from 'cc';
import { GMJH_RoleController } from './GMJH_RoleController';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { GMJH_AudioManager } from './GMJH_AudioManager';

const { ccclass, property } = _decorator;

@ccclass('GMJH_PropController')
export class GMJH_PropController extends Component {

    public static Instance: GMJH_PropController;

    @property(GamePanel)
    gamePanel: GamePanel = null;

    @property(Prefab)
    answerPrefab: Prefab = null;

    @property(Prefab)
    leftProp: Prefab = null;

    @property(Prefab)
    rightProp: Prefab = null;

    @property({ type: [SpriteFrame] })
    props: SpriteFrame[] = []

    @property(Node)
    labelBG: Node = null;

    private round: number = 1;
    private count: number = 0;

    @property(Node)
    blackMask: Node = null;




    protected onLoad(): void {
        GMJH_PropController.Instance = this;
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answerPrefab;
        ProjectEventManager.emit(ProjectEvent.游戏开始, "闺蜜结婚");

        if (ProjectEventManager.GameStartIsShowTreasureBox) {
            director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
        } else {
            this.Init();
        }
    }

    Init() {
        GMJH_AudioManager.Instance.playAudio("婚礼就要开始了，姐妹我们赶紧打扮一下").then(() => {
            GMJH_RoleController.Instance.isTouch = true;
            this.loadProp();
        });
    }

    loadProp() {
        switch (this.round) {
            case 1:
                this.setPropSprite(0, 1);
                break;
            case 2:
                this.setPropSprite(2, 3);
                break;
            case 3:
                this.setPropSprite(4, 5);
                break;
            case 4:
                this.setPropSprite(6, 7);
                break;
            case 5:
                this.setPropSprite(8, 9);
                break;
            case 6:
                this.setPropSprite(10, 11);
                break;
            case 7:
                this.setPropSprite(12, 13);
                break;
            case 8:
                this.setPropSprite(14, 15);
                break;
            case 9:
                this.setPropSprite(16, 17);
                break;
            case 10:
                this.setPropSprite(18, 19);
                break;
            case 11:
                this.setPropSprite(20, 21);
                break;
        }
    }

    setPropSprite(x: number, y: number) {
        const l = instantiate(this.leftProp);
        const r = instantiate(this.rightProp);
        l.getChildByName("Sprite").getComponent(Sprite).spriteFrame = this.props[x];
        r.getChildByName("Sprite").getComponent(Sprite).spriteFrame = this.props[y];
        l.getChildByName("Label").getComponent(Label).string = this.props[x].name;
        r.getChildByName("Label").getComponent(Label).string = this.props[y].name;
        this.node.addChild(l);
        this.node.addChild(r);
        this.propMove(l, r).then(() => {
            GMJH_AudioManager.Instance.playAudio();
            this.isRight(this.round);
        });
    }

    propMove(left: Node, right: Node): Promise<void> {
        return new Promise((resolve) => {
            tween(left).to(3, { position: new Vec3(left.position.x, -800) })
                .call(() => {
                    left.destroy();
                })
                .start();

            tween(right).to(3, { position: new Vec3(right.position.x, -800) })
                .call(() => {
                    right.destroy();
                    resolve();
                })
                .start();
        });
    }

    isRight(round: number) {
        if (this.round >= 11) {
            if (this.count >= 10) {
                this.gameOver(true);
            } else {
                this.gameOver(false);
            }
            return;
        }

        switch (round) {
            case 2:
            case 5:
            case 6:
            case 8:
            case 11:
                if (GMJH_RoleController.Instance.isLR) {
                    console.log("正确");
                    this.count++
                } else {
                    console.error("错误");
                }
                break;
            case 1:
            case 3:
            case 4:
            case 7:
            case 9:
            case 10:
                if (!GMJH_RoleController.Instance.isLR) {
                    console.log("正确");
                    this.count++
                } else {
                    console.error("错误");
                }
                break;
        }
        GMJH_RoleController.Instance.setRole(this.round);
        this.round++;
        this.loadProp();

        console.log("对：" + this.count + " 次");
        console.log("------------------------------------------------------------")
    }

    gameOver(isWin: boolean) {
        const blackMaskOpacity = this.blackMask.getComponent(UIOpacity);
        blackMaskOpacity.opacity = 0;
        tween(blackMaskOpacity)
            .to(2, { opacity: 255 })
            .call(() => {
                GMJH_RoleController.Instance.L(isWin);
                GMJH_RoleController.Instance.gameOverPanel.active = true;
                console.error(GMJH_RoleController.Instance.gameOverPanel.children)
                tween(blackMaskOpacity)
                    .to(2, { opacity: 0 })
                    .call(() => {
                        this.scheduleOnce(() => {
                            if (isWin) {
                                GMJH_AudioManager.Instance.playAudio("亲爱的你真美").then(() => {
                                    this.gamePanel.Win();
                                });
                            } else {
                                GMJH_AudioManager.Instance.playAudio("你怎么穿成这样就来了").then(() => {
                                    this.gamePanel.Lost();
                                });
                            }
                        }, 0.1)
                        GMJH_AudioManager.Instance.stopBGM();
                        ProjectEventManager.emit(ProjectEvent.游戏结束, "闺蜜结婚");
                    })
                    .start();
            }).start();
    }
}