import { _decorator, Component, director, Enum, EventTouch, find, Label, Node } from 'cc';
import { ZDXS_AUDIO, ZDXS_SHOP_SKIN } from './ZDXS_Constant';
import { ZDXS_GameData } from './ZDXS_GameData';
import { ZDXS_EventManager, ZDXS_MyEvent } from './ZDXS_EventManager';
import { ZDXS_AudioManager } from './ZDXS_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_ShopItem')
export class ZDXS_ShopItem extends Component {

    @property({ type: Enum(ZDXS_SHOP_SKIN) })
    Skin: ZDXS_SHOP_SKIN = ZDXS_SHOP_SKIN.SKIN1;

    @property
    Price: number = 1000;

    Lock: Node = null;
    UnLock: Node = null;
    Checked: Node = null;

    protected onLoad(): void {
        this.Lock = find("未解锁", this.node);
        this.UnLock = find("已解锁", this.node);
        this.Checked = find("选中", this.node);

        find("Number", this.Lock).getComponent(Label).string = this.Price.toString();

        ZDXS_EventManager.On(ZDXS_MyEvent.ZDXS_SHOW_SKIN, this.Show, this);
    }

    protected start(): void {
        this.Show();
    }

    Show() {
        if (ZDXS_GameData.Instance.CurSkin == this.Skin) {
            this.Checked.active = true;
            this.Lock.active = false;
            this.UnLock.active = false;
        } else if (ZDXS_GameData.Instance.HaveSkin.findIndex(e => e == this.Skin) != -1) {
            this.UnLock.active = true;
            this.Checked.active = false;
            this.Lock.active = false;
        } else {
            this.Lock.active = true;
            this.UnLock.active = false;
            this.Checked.active = false;
        }
    }

    OnButtonClick(event: EventTouch) {
        ZDXS_AudioManager.Instance.Play(ZDXS_AUDIO.按钮点击);
        switch (event.getCurrentTarget().name) {
            case "已解锁":
                ZDXS_GameData.Instance.CurSkin = this.Skin;
                ZDXS_GameData.DateSave();
                ZDXS_EventManager.Emit(ZDXS_MyEvent.ZDXS_SHOW_SKIN);
                ZDXS_EventManager.Emit(ZDXS_MyEvent.ZDXS_PLAYER_SHOP_SHOW);
                break;
            case "未解锁":
                if (ZDXS_GameData.Instance.Gold < this.Price) {
                    console.error("金币不足");
                    return;
                }
                ZDXS_GameData.Instance.Gold -= this.Price;
                ZDXS_GameData.Instance.HaveSkin.push(this.Skin);
                ZDXS_GameData.Instance.CurSkin = this.Skin;
                ZDXS_GameData.DateSave();
                ZDXS_EventManager.Emit(ZDXS_MyEvent.ZDXS_LABEL_CHANGE)
                ZDXS_EventManager.Emit(ZDXS_MyEvent.ZDXS_SHOW_SKIN)
                ZDXS_EventManager.Emit(ZDXS_MyEvent.ZDXS_PLAYER_SHOP_SHOW);
                break;
        }
    }

}


