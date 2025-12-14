import { _decorator, Component, find, Label, Node } from 'cc';
import { XDMKQ_AUDIO, XDMKQ_ROLE } from './XDMKQ_Constant';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_PanelManager } from './XDMKQ_PanelManager';
import { XDMKQ_GameData } from './XDMKQ_GameData';
import { XDMKQ_EnemyManager } from './XDMKQ_EnemyManager';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_RoleItem')
export class XDMKQ_RoleItem extends Component {

    Live: Node = null;
    Die: Node = null;

    Name: Label = null;
    Blood: Label = null;
    Code: Label = null;
    Birthday: Label = null;

    Role: XDMKQ_ROLE = null;

    protected onLoad(): void {
        this.Live = find("Live", this.node);
        this.Die = find("Die", this.node);

        this.Name = find("Name", this.node).getComponent(Label);
        this.Blood = find("Blood", this.node).getComponent(Label);
        this.Code = find("Code", this.node).getComponent(Label);
        this.Birthday = find("Birthday", this.node).getComponent(Label);

        this.node.on(Node.EventType.TOUCH_END, this.Click, this);
    }

    Init(role: XDMKQ_ROLE) {
        this.Role = role;
        this.Live.active = role.IsLife;
        this.Die.active = !role.IsLife;
        this.Name.string = role.Name;
        this.Blood.string = role.Boold;
        this.Code.string = role.Code;
        this.Birthday.string = role.Birthday;
    }

    Click() {
        if (!this.Role.IsLife) return;
        XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.点击);
        XDMKQ_GameManager.Instance.CurRole = this.Role;
        XDMKQ_PanelManager.Instance.ClosePanel();

        XDMKQ_GameManager.Instance.Damage = 0;
        XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_ROLE_SHOW);

        XDMKQ_GameManager.Instance.GamePause = false;
    }

}


