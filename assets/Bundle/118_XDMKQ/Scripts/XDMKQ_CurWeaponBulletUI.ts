import { _decorator, Component, Label, Node } from 'cc';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_PlayerController } from './XDMKQ_PlayerController';
import { XDMKQ_WEAPON } from './XDMKQ_Constant';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_CurWeaponBulletUI')
export class XDMKQ_CurWeaponBulletUI extends Component {

    CurBulletLabel: Label = null;

    protected onLoad(): void {
        this.CurBulletLabel = this.node.getChildByName("CurBullet").getComponent(Label);
    }

    protected onEnable(): void {
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_CURWEAPON_BULLET_SHOW, this.ShowBullet, this);
    }

    protected onDisable(): void {
        XDMKQ_EventManager.Off(XDMKQ_MyEvent.XDMKQ_CURWEAPON_BULLET_SHOW, this.ShowBullet, this);
    }

    ShowBullet() {
        this.CurBulletLabel.string = XDMKQ_PlayerController.Instance.CurWeapon == XDMKQ_WEAPON.手雷 || XDMKQ_PlayerController.Instance.CurWeapon == XDMKQ_WEAPON.燃烧弹 || XDMKQ_PlayerController.Instance.CurWeapon == XDMKQ_WEAPON.炮台 ?
            `${XDMKQ_GameManager.Instance.CurBullet.CurBullet + XDMKQ_GameManager.Instance.CurBullet.ReduceBullet}` : `${XDMKQ_GameManager.Instance.CurBullet.CurBullet}/${XDMKQ_GameManager.Instance.CurBullet.ReduceBullet}`;
    }

}


