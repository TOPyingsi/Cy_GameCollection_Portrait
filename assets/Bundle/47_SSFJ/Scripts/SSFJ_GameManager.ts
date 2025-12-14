import { _decorator, AudioClip, Component, director, error, EventTouch, Label, Node, Prefab, Sprite } from 'cc';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { SSFJ_TouchController } from './SSFJ_TouchController';

const { ccclass, property } = _decorator;

@ccclass('SSFJ_GameManager')
export class SSFJ_GameManager extends Component {

    public static Instance: SSFJ_GameManager = null;

    @property(GamePanel)
    gamePanel: GamePanel = null;

    @property(Prefab)
    Anwser: Prefab = null;

    @property([AudioClip])
    audioClips: AudioClip[] = [];

    @property(Sprite)
    labelBG: Sprite = null;

    @property(Label)
    label: Label = null;

    @property(Sprite)
    gameWin: Sprite = null;

    @property(Sprite)
    gameLose: Sprite = null;

    @property(Node)
    labelManager: Node = null;

    private nzLabel: Node = null;
    private ljLabel: Node = null;

    labelStr: Map<number, string> = new Map([
        [1, "一些小情趣罢了，可不能让吒儿发现"],
        [2, "亲爱的，换身得体的衣服"],
        [3, "大功告成"],
        [4, "换个正常的柜子"],
        [5, "换回原来的床"],
        [6, "换身得体的衣服"],
        [7, "来不及晒干了，赶紧丢掉"],
        [8, "清理下地板"],
        [9, "清理下自己"],
        [10, "爹娘，你们居然背着我过二人世界"],
        [11, "爹娘，快来一起玩"],
        [12, "爹娘，快来陪我踢毽子"],
        [13, "糟了，不能让吒儿发现我们过二人世界"],
        [14, "食物要换正常的食物"]
    ]);

    protected onLoad(): void {
        this.nzLabel = NodeUtil.GetNode("NZLabelBG", this.labelManager);
        this.ljLabel = NodeUtil.GetNode("LJLabelBG", this.labelManager);
        SSFJ_GameManager.Instance = this;
        this.gamePanel.answerPrefab = this.Anwser;
    }

    start() {
        if (ProjectEventManager.GameStartIsShowTreasureBox) {
            director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
        } else {
            this.Init();
        }
    }

    Init() {
        this.nzLabel.active = true;
        const x = this.audioClips.find(item => item.name === "爹娘，快来陪我踢毽子")
        AudioManager.Instance.PlaySFX(x);
        this.scheduleOnce(() => {
            this.nzLabel.active = false;
            this.ljLabel.active = true;
            const y = this.audioClips.find(item => item.name === "糟了，不能让吒儿发现我们过二人世界");
            AudioManager.Instance.PlaySFX(y);
            this.scheduleOnce(() => {
                this.ljLabel.active = false;
                SSFJ_TouchController.Instance.isTouch = false;//可以触摸
            }, y.getDuration())
        }, x.getDuration())
    }

    playAudio(str: string): Promise<void> {
        if (str === "游戏胜利" || str === "游戏失败") {
            const overAudio = this.audioClips.find(item => item.name === str);
            AudioManager.Instance.PlaySFX(overAudio);
        } else {
            return new Promise((resolve, reject) => {
                const audio = this.audioClips.find(item => item.name === str);
                if (audio) {
                    SSFJ_TouchController.Instance.isTouchEnabled = false; // 禁止触摸
                    this.label.getComponent(Label).string = str;
                    this.labelBG.node.active = true;
                    AudioManager.Instance.PlaySFX(audio);
                    this.scheduleOnce(() => {
                        this.labelBG.node.active = false;
                        SSFJ_TouchController.Instance.isTouchEnabled = true; // 恢复触摸
                        resolve();
                    }, audio.getDuration());
                } else {
                    reject(new Error(`未找到音频资源: ${str}`));
                }
            });
        }
    }

    gameOver(winOrLose: boolean) {
        if (winOrLose) {
            this.playAudio("爹娘，快来一起玩").then(() => {
                this.playAudio("游戏胜利");
                this.gameWin.node.active = true;
                this.scheduleOnce(() => {
                    this.gameWin.node.active = false;
                    this.gamePanel.Win();
                }, 1)
            })
        } else {
            this.playAudio("爹娘，你们居然背着我过二人世界").then(() => {
                this.playAudio("游戏失败");
                this.gameLose.node.active = true;
                this.scheduleOnce(() => {
                    this.gameLose.node.active = false;
                    this.gamePanel.Lost();
                }, 2)
            })
        }
    }
}


