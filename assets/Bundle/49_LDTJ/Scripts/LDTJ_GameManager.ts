import { _decorator, AudioClip, AudioSource, Component, director, Label, Node, Prefab, Tween, tween, UIOpacity, v3, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { LDTJ_RoleController } from './LDTJ_RoleController';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('LDTJ_GameManager')
export class LDTJ_GameManager extends Component {

    public static Instance: LDTJ_GameManager;

    @property([AudioClip])
    audios: AudioClip[] = [];

    @property(Node)
    labelBG: Node = null;

    @property(Node)
    blackMask: Node = null;

    @property(Node)
    gameStartPanel: Node = null;

    @property(Node)
    gameMainPanel: Node = null;

    @property(Node)
    gameWinPanel: Node = null;

    @property(Node)
    gameFailPanel: Node = null;

    @property(GamePanel)
    gamePanel: GamePanel = null;

    @property(Prefab)
    answer: Prefab = null;

    protected onLoad(): void {

        this.gamePanel.time = 420;

        LDTJ_GameManager.Instance = this;

    }

    start() {
        this.gamePanel.answerPrefab = this.answer;


        ProjectEventManager.emit(ProjectEvent.游戏开始, "李代桃僵");
        if (ProjectEventManager.GameStartIsShowTreasureBox) {
            director.getScene().once(MyEvent.TreasureBoxDestroy, this.gameStart, this);
        } else {
            this.gameStart();
        }
    }

    gameStart() {
        this.playAudio("在我失去意识之前我依稀记得是一个有小熊图案的女孩救了我").then(() => {
            this.playAudio("是你吗，美丽的女孩").then(() => {
                this.playAudio("你伤的太重了，我费了很大的力气才把你从水中救出来，你留下来好好养伤吧").then(() => {
                    this.playAudio("可恶，明明是我救了他，我要变美告诉他真相").then(() => {
                        const blackMaskOpacity = this.blackMask.getComponent(UIOpacity);
                        blackMaskOpacity.opacity = 0;
                        tween(blackMaskOpacity).to(2, { opacity: 255 }).call(() => {
                            this.node.active = false;
                            this.gameMainPanel.active = true;
                            tween(blackMaskOpacity).to(2, { opacity: 0 }).start();
                        }).start();
                    })
                })
            })
        });
    }

    gameOver(isRight: boolean) {
        const blackMaskOpacity = this.blackMask.getComponent(UIOpacity);
        tween(blackMaskOpacity)
            .to(2, { opacity: 255 })
            .call(() => {
                this.gameMainPanel.active = false;
                if (isRight) {
                    this.gameWinPanel.active = true;
                } else {
                    this.gameFailPanel.active = true;
                }
                this.node.active = true;
                tween(blackMaskOpacity)
                    .to(2, { opacity: 0 })
                    .call(() => {
                        if (isRight) {
                            this.playAudio("对不起美女，原谅我一时的眼拙");
                            this.scheduleOnce(() => {
                                this.gamePanel.Win();
                                ProjectEventManager.emit(ProjectEvent.游戏结束, "李代桃僵");

                            }, 2);
                        } else {
                            this.playAudio("不是她，是我救了你");
                            this.scheduleOnce(() => {
                                this.gamePanel.Lost();
                                ProjectEventManager.emit(ProjectEvent.游戏结束, "李代桃僵");

                            }, 2);
                        }

                    })
                    .start();
            })
            .start();
    }

    playAudio(str: string): Promise<void> {
        // 定义换行的最大字符数
        const maxLineLength = 20;

        // 如果字符串过长，则插入换行符
        const formattedStr = str.length > maxLineLength ? this.insertNewLines(str, maxLineLength) : str;

        const audio = this.audios.find(audio => audio.name == str);

        return new Promise((resolve) => {
            if (audio) {
                NodeUtil.GetNode("Label", this.labelBG).getComponent(Label).string = formattedStr;
                this.labelBG.active = true;
                AudioManager.Instance.PlaySFX(audio);
                this.scheduleOnce(() => {
                    this.labelBG.active = false;
                    resolve();
                }, audio.getDuration());
            } else {
                resolve(); // 如果没有找到对应的音频，直接 resolve
            }
        });
    }

    // 插入换行符的方法
    private insertNewLines(str: string, maxLineLength: number): string {
        let result = '';
        while (str.length > maxLineLength) {
            // 找到指定长度前的最后一个空格位置，避免单词被拆分
            let spaceIndex = str.substring(0, maxLineLength).lastIndexOf(' ');
            if (spaceIndex === -1) {
                spaceIndex = maxLineLength; // 如果没有空格，则强制拆分
            }
            result += str.substring(0, spaceIndex) + '\n';
            str = str.substring(spaceIndex).trim();
        }
        result += str; // 添加剩余部分
        return result;
    }

    private oriScale: Vec3 = v3();

    @property
    speed: number = 1;

    @property
    scaleGap: number = 0.05;

    bottom(node: Node) {
        // Tween.stopAllByTarget(node);
        this.oriScale.set(node.getScale());

        tween(node)
            .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y + this.scaleGap) })
            .to(1 / this.speed, { scale: this.oriScale })
            .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y - this.scaleGap) })
            .to(1 / this.speed, { scale: this.oriScale })
            .union().repeatForever().start();
    }

}