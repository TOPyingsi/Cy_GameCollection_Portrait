import { _decorator, AudioClip, AudioSource, Component, director, EventTouch, Label, log, Node, SpriteFrame, tween, v3 } from 'cc';
import { ProjectEvent, ProjectEventManager } from '../../../Scripts/Framework/Managers/ProjectEventManager';
import { Panel, UIManager } from '../../../Scripts/Framework/Managers/UIManager';
import { BZDTZ_Beans } from './BZDTZ_Beans';
const { ccclass, property } = _decorator;

@ccclass('BZDTZ_GmaeManager')
export class BZDTZ_GmaeManager extends Component {
    @property(Node)
    public NodeContent: Node = null;
    @property(Node)
    public Canvas: Node = null;
    @property({ type: [SpriteFrame] })
    public sprites: SpriteFrame[] = [];
    @property({ type: [AudioClip] })
    public Audios: AudioClip[] = [];
    public static instance: BZDTZ_GmaeManager;
    public Score: number = 0;//分数
    public MaxScore: number = 0;//最大分数

    public static IsfirstStart: boolean = true;//第一次
    onLoad() {
        BZDTZ_GmaeManager.instance = this;
    }
    start() {
        ProjectEventManager.emit(ProjectEvent.游戏开始, "爆炸豆挑战");
        this.SetBoom();
        if (BZDTZ_GmaeManager.IsfirstStart) {
            BZDTZ_GmaeManager.IsfirstStart = false;
            this.Canvas.getChildByName("教程界面").active = true;
        }
    }


    PlayAudio(id: number) {
        this.node.getComponent(AudioSource).playOneShot(this.Audios[id]);
    }
    //设置炸弹
    SetBoom() {
        this.MaxScore = (this.NodeContent.children.length - 1) * 100;
        this.NodeContent.children[Math.floor(Math.random() * this.NodeContent.children.length)].getComponent(BZDTZ_Beans).Isbomb = true;
    }

    Onbuttomclick(target: EventTouch) {
        this.PlayAudio(0);
        switch (target.target.name) {
            case "返回":
                UIManager.ShowPanel(Panel.ReturnPanel);
                break;
            case "重新开始":
                director.loadScene(director.getScene().name);
                break;
            case "询问框是钮":
                this.Canvas.getChildByName("询问界面").active = false;
                break;
            case "见好就收":
                this.Canvas.getChildByName("询问界面").active = false;
                this.Canvas.getChildByName("胜利界面").active = true;
                this.Canvas.getChildByPath("胜利界面/框/Label").getComponent(Label).string = `恭喜累计获得${this.Score}金币，是否重新开始游戏？(挑战最高2900金币)`;
                break;
            case "关闭教程":
                this.Canvas.getChildByName("教程界面").active = false;
                break;
            case "教程":
                this.Canvas.getChildByName("教程界面").active = true;
                break;
        }


    }

    //点到豆子
    ClickBeans() {
        this.PlayAudio(1);
        log("点到豆子");
        this.Score += 100;
        this.Canvas.getChildByPath("金币显示/数量").getComponent(Label).string = this.Score.toString();
        if (this.Score >= this.MaxScore) {
            this.Canvas.getChildByName("胜利界面").active = true;
            this.Canvas.getChildByPath("胜利界面/框/Label").getComponent(Label).string = "恭喜获得最高累计2900金币！！！";
            log("游戏结束");
        } else {
            this.Canvas.getChildByName("询问界面").active = true;
        }
    }
    //点到炸弹
    ClickBoom() {
        this.PlayAudio(1);
        log("点到炸弹");
        this.Canvas.getChildByName("失败界面").active = true;
    }


}


