import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_RoleUI')
export class XDMKQ_RoleUI extends Component {

    RoleSprite: Sprite = null;
    RoleCountLabel: Label = null;

    protected onLoad(): void {
        this.RoleSprite = this.node.getChildByName("血条").getComponent(Sprite);
        this.RoleCountLabel = this.node.getChildByName("RoleCount").getComponent(Label);
    }

    protected onEnable(): void {
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_ROLE_SHOW, this.ShowRole, this);
    }

    protected onDisable(): void {
        XDMKQ_EventManager.Off(XDMKQ_MyEvent.XDMKQ_ROLE_SHOW, this.ShowRole, this);
    }

    ShowRole() {
        const fill: number = (XDMKQ_GameManager.Instance.CurHP - XDMKQ_GameManager.Instance.Damage) / XDMKQ_GameManager.Instance.CurHP;
        this.RoleSprite.fillRange = fill;
        let lifeRoleCount: number = 0;
        XDMKQ_GameManager.Instance.Roles.forEach(role => { if (role.IsLife) lifeRoleCount++; });
        this.RoleCountLabel.string = `${lifeRoleCount}/${XDMKQ_GameManager.Instance.Roles.length}`;
    }
}


