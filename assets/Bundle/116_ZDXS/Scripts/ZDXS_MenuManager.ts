import { _decorator, Component, director, error, EventTouch, Game, Label, math, Node } from 'cc';
import { ZDXS_GameData } from './ZDXS_GameData';
import { ZDXS_GameManager } from './ZDXS_GameManager';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { ZDXS_AudioManager } from './ZDXS_AudioManager';
import { ZDXS_AUDIO } from './ZDXS_Constant';
import { GameManager } from 'db://assets/Scripts/GameManager';
import { Panel, UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { ProjectEvent, ProjectEventManager } from '../../../Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_MenuManager')
export class ZDXS_MenuManager extends Component {

    public static Instance: ZDXS_MenuManager = null;

    @property(Node)
    Main: Node = null;

    @property(Node)
    Shop: Node = null;

    @property(Node)
    Mode: Node = null;

    @property(Node)
    Level: Node = null;

    @property(Node)
    Music: Node = null;

    @property(Label)
    Star: Label = null;

    @property(Label)
    CurLevel: Label = null;

    CurTargetPanel: Node = null;
    protected onLoad(): void {
        ZDXS_MenuManager.Instance = this;
        // ZDXS_GameData.Instance.Stars = 80;
        // ZDXS_GameData.Instance.LevelStar[ZDXS_GameData.Instance.Mode] = [2, 2, 2, 2];
        ProjectEventManager.emit(ProjectEvent.游戏开始, "子弹先生");
    }

    protected start(): void {
        this.Music.active = ZDXS_GameData.Instance.Mute;
        ZDXS_AudioManager.Instance.PlayMusic();
    }

    OnButtonClick(event: EventTouch) {
        ZDXS_AudioManager.Instance.Play(ZDXS_AUDIO.按钮点击);
        switch (event.getCurrentTarget().name) {
            case "返回主页":
                UIManager.ShowPanel(Panel.ReturnPanel);
                break;
            case "开始游戏":
                this.ShowPanel(this.Mode);
                break;
            case "商店":
                this.ShowPanel(this.Shop);
                break;
            case "返回":
                this.ShowPanel(this.Mode);
                ProjectEventManager.emit(ProjectEvent.页面转换, "子弹先生");
                break;
            case "返回模式":
                this.ShowPanel(this.Mode);
                break;
            case "声音":
                ZDXS_GameData.Instance.Mute = !ZDXS_GameData.Instance.Mute;
                this.Music.active = ZDXS_GameData.Instance.Mute;
                ZDXS_GameData.Instance.Mute ? ZDXS_AudioManager.Instance.StopMusic() : ZDXS_AudioManager.Instance.PlayMusic();
                break;
            case "Start":
                ZDXS_GameData.Instance.CurLevel = math.clamp(ZDXS_GameData.Instance.LevelStar[ZDXS_GameData.Instance.Mode].length + 1, 1, 20) - 1;
                director.loadScene("ZDXS_Game", () => {
                    ZDXS_GameManager.Instance.LoadLevel();
                });
                break;
        }
    }

    ShowPanel(target: Node) {
        if (this.CurTargetPanel == target) return;
        if (this.CurTargetPanel) this.CurTargetPanel.active = false;
        this.CurTargetPanel = target;
        this.CurTargetPanel.active = true;
    }

    ShowLevel() {
        this.ShowPanel(this.Level);
        let star: number = 0;
        ZDXS_GameData.Instance.LevelStar[ZDXS_GameData.Instance.Mode].filter(e => star += e);
        this.Star.string = star.toString();
        this.CurLevel.string = math.clamp(ZDXS_GameData.Instance.LevelStar[ZDXS_GameData.Instance.Mode].length + 1, 1, 20).toString();
    }


}


