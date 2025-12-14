import { _decorator, Component, Enum, EventTouch, find, Node } from 'cc';
import { ZDXS_AUDIO, ZDXS_MODE } from './ZDXS_Constant';
import { ZDXS_GameData } from './ZDXS_GameData';
import { ZDXS_MenuManager } from './ZDXS_MenuManager';
import { ZDXS_AudioManager } from './ZDXS_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_ModeItem')
export class ZDXS_ModeItem extends Component {

    @property({ type: Enum(ZDXS_MODE) })
    Mode: ZDXS_MODE = ZDXS_MODE.重力模式;

    Lock: Node = null;

    private _needStar: number = 0;
    private _lock: boolean = true;

    protected onLoad(): void {
        this.Lock = find("锁", this.node);

        this._needStar = this.Mode * 40;
        if (ZDXS_GameData.Instance.Stars >= this._needStar) {
            this.Lock.active = false;
            this._lock = false;
        }
    }

    OnButtonClick(event: EventTouch) {
        ZDXS_AudioManager.Instance.Play(ZDXS_AUDIO.按钮点击);
        if (this._lock) return;
        ZDXS_GameData.Instance.Mode = this.Mode;
        ZDXS_MenuManager.Instance.ShowLevel();
    }


}


