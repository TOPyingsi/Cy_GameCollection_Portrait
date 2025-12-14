import { _decorator, Component, director, Enum, find, Node } from 'cc';
import { XDMKQ_AUDIO, XDMKQ_MAP, XDMKQ_PANEL } from './XDMKQ_Constant';
import { XDMKQ_GameData } from './XDMKQ_GameData';
import Banner from 'db://assets/Scripts/Banner';
import { XDMKQ_PanelManager } from './XDMKQ_PanelManager';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_EventManager } from './XDMKQ_EventManager';
import { XDMKQ_EnemyManager } from './XDMKQ_EnemyManager';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_LevelItem')
export class XDMKQ_LevelItem extends Component {

    @property({ type: Enum(XDMKQ_MAP) })
    Map: XDMKQ_MAP = XDMKQ_MAP.县城;

    Lock: Node = null;

    private _isLock: boolean = false;
    protected onLoad(): void {
        this.Lock = find("Lock", this.node);

        this.Check();
        this.node.on(Node.EventType.TOUCH_END, this.Click, this);
    }

    Check() {
        this._isLock = XDMKQ_GameData.Instance.UnlockMap.findIndex(e => e == this.Map) == -1;
        this.Lock.active = this._isLock;
    }

    Click() {
        XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.点击);
        if (this._isLock) {
            Banner.Instance.ShowVideoAd(() => {
                XDMKQ_GameData.Instance.UnlockMap.push(this.Map);
                XDMKQ_GameData.DateSave();
                this.Check();
            })
            return;
        }
        XDMKQ_GameData.Instance.CurMap = this.Map;
        XDMKQ_GameData.DateSave();
        director.loadScene("XDMKQ_Game");

        XDMKQ_PanelManager.Instance.ShowLoadingPanel(() => {
            const func: Function = () => {
                if (director.getScene()?.name == "XDMKQ_Game") {
                    XDMKQ_GameManager.Instance.InitRoles(3);
                    XDMKQ_PanelManager.Instance.ShowPanel(XDMKQ_PANEL.RolePanel);
                    this.unschedule(func);
                }
            }

            this.schedule(func, 0.1);
        });
    }

}


