import { _decorator, AudioClip, AudioSource, Component, director, Label, Node, Prefab } from 'cc';
import { ProjectEvent, ProjectEventManager } from '../../../Scripts/Framework/Managers/ProjectEventManager';
import { Panel, UIManager } from '../../../Scripts/Framework/Managers/UIManager';
import { GamePanel } from '../../../Scripts/UI/Panel/GamePanel';
import { AudioManager } from '../../../Scripts/Framework/Managers/AudioManager';
import { MyEvent } from '../../../Scripts/Framework/Managers/EventManager';
const { ccclass, property } = _decorator;

@ccclass('BZLGYJJF_GameManager')
export class BZLGYJJF_GameManager extends Component {
    @property(Prefab)
    public answerPrefab: Prefab = null;
    @property(GamePanel)
    public gamePanel: GamePanel = null;
    @property(Node)
    public GameNode: Node = null;
    @property({ type: [AudioClip] })
    public AudioClips: AudioClip[] = [];
    private static _instance: BZLGYJJF_GameManager = null;
    public GamePause: boolean = false;
    public GameScore: number = 0;//分数

    public SayText: string[] = [
        "想当年我也是东海第一帅哥",
        "要时刻做好身材管理",
        "瘦了更开心",
        "瘦了轻盈多了",
        "小虾兵也要每天锻炼",
        "太乙师傅来一起锻炼",
        "终于变回来了",
        "哥哥来陪你一起运动",
        "鲨鱼精每天都要转一千下呼啦圈",
        "吃太多了要动一动",
    ];
    private _audiosource: AudioSource = null;
    public static get Instance() {
        if (this._instance == null) {
            BZLGYJJF_GameManager._instance = new BZLGYJJF_GameManager();
        }
        return this._instance;
    }
    protected onLoad(): void {
        BZLGYJJF_GameManager._instance = this;
        this.gamePanel.time = 240;
        this.gamePanel.answerPrefab = this.answerPrefab;
        this.gamePanel.winStr = "大家一起来运动减肥！";
        this.gamePanel.lostStr = "让我看看是谁还没减肥|ू･ω･` )";

    }

    start() {
        this._audiosource = this.node.getComponent(AudioSource);
        director.getScene().on(MyEvent.IsSoundOn, (IsSoundOn: boolean) => {
            this._audiosource.volume = IsSoundOn == true ? 1 : 0;
        })
        this._audiosource.volume = AudioManager.IsSoundOn == true ? 1 : 0;
    }

    //增加分数
    Add_Score() {
        this.GameScore++;
        if (this.GameScore == 10) {//胜利
            this.scheduleOnce(() => {
                this.gamePanel.Win();
            }, 1)
        }
    }

    //说话
    Say(id: number, CallBak?: Function) {
        this.GamePause = true;
        this.PlayAudio(10);
        let TxtLan = this.GameNode.getChildByPath("UI/文字栏");
        TxtLan.getChildByName("描述").getComponent(Label).string = this.SayText[id];
        TxtLan.active = true;
        this.PlayAudio(id, () => {
            this.GamePause = false;
            TxtLan.active = false;
            this.Add_Score();
            if (CallBak) CallBak();
        });
    }

    //播放音效
    PlayAudio(id: number, CallBak?: Function) {
        if (id == 10) {
            // this._audiosource.playOneShot(this.AudioClips[id]);
            AudioManager.Instance.PlaySFX(this.AudioClips[id]);
            return;
        }
        this._audiosource.clip = this.AudioClips[id];

        this._audiosource.play();
        if (CallBak) {
            this.scheduleOnce(() => {
                if (this.node) CallBak();
            }, this._audiosource.duration)
        }

    }
}


