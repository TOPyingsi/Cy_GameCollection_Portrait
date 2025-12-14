import { _decorator, Component, director, Enum, EventTouch, find, Label, Node } from 'cc';
import { ZDXS_AUDIO, ZDXS_LEVEL } from './ZDXS_Constant';
import { ZDXS_GameData } from './ZDXS_GameData';
import { ZDXS_MenuManager } from './ZDXS_MenuManager';
import { ZDXS_GameManager } from './ZDXS_GameManager';
import { ZDXS_AudioManager } from './ZDXS_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_LevelItem')
export class ZDXS_LevelItem extends Component {

    @property({ type: Enum(ZDXS_LEVEL) })
    Level: ZDXS_LEVEL = ZDXS_LEVEL.LEVEL1;

    Lock: Node = null;
    Unlock: Node = null;
    Star: Node = null;

    private _isClick: boolean = false;

    protected onLoad(): void {
        this.Lock = find("未解锁", this.node);
        this.Unlock = find("已解锁", this.node);
        this.Star = find("Star", this.Unlock);

        find("Number", this.Lock).getComponent(Label).string = (this.Level + 1).toString();
        find("Number", this.Unlock).getComponent(Label).string = (this.Level + 1).toString();
        director.getScene().on("ZDXS_TEST", this.Show, this);
    }

    protected onEnable(): void {
        this.Show();
    }

    Show() {
        if (this.Level > ZDXS_GameData.Instance.LevelStar[ZDXS_GameData.Instance.Mode].length) {
            this.Lock.active = true;
            this.Unlock.active = false;
        } else {
            this.Unlock.active = true;
            this.Lock.active = false;
            this.ShowStar();
        }
    }

    ShowStar() {
        this.Star.children.forEach(e => e.active = false);
        if (this.Level == ZDXS_GameData.Instance.LevelStar[ZDXS_GameData.Instance.Mode].length) return;

        for (let i = 0; i < ZDXS_GameData.Instance.LevelStar[ZDXS_GameData.Instance.Mode][this.Level]; i++) {
            this.Star.children[i].active = true;
        }
    }

    OnButtonClick(event: EventTouch) {
        if (this._isClick) return;
        this._isClick = true;
        ZDXS_AudioManager.Instance.Play(ZDXS_AUDIO.按钮点击);
        ZDXS_GameData.Instance.CurLevel = this.Level;
        director.loadScene("ZDXS_Game", () => {
            ZDXS_GameManager.Instance.LoadLevel();
        });
    }
}


