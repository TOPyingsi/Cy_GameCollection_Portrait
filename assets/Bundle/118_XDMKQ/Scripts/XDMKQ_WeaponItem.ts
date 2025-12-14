import { _decorator, Component, Enum, find, Label, Node } from 'cc';
import { XDMKQ_AUDIO, XDMKQ_BULLET, XDMKQ_BULLET_CONFIG, XDMKQ_WEAPON } from './XDMKQ_Constant';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
import Banner from 'db://assets/Scripts/Banner';
import { XDMKQ_PlayerController } from './XDMKQ_PlayerController';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_BulletManager } from './XDMKQ_BulletManager';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_WeaponItem')
export class XDMKQ_WeaponItem extends Component {

    @property({ type: Enum(XDMKQ_WEAPON) })
    Weapon: XDMKQ_WEAPON = XDMKQ_WEAPON.RPG;

    BulletLabel: Label = null;
    Video: Node = null;
    BulletCount: number = 0;
    Bullet: XDMKQ_BULLET = null;
    Checked: Node = null;

    protected onLoad(): void {
        this.BulletLabel = find("BulletCount", this.node).getComponent(Label);
        this.Video = find("Video", this.node);
        this.Checked = find("Checked", this.node);
    }

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_END, this.Click, this);
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_CHANGE_BULLET, this.ChangeBullet, this)
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_WEAPONITEM_SHOW, this.ShowCheck, this);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_END, this.Click, this);
        XDMKQ_EventManager.Off(XDMKQ_MyEvent.XDMKQ_CHANGE_BULLET, this.ChangeBullet, this);
        XDMKQ_EventManager.Off(XDMKQ_MyEvent.XDMKQ_WEAPONITEM_SHOW, this.ShowCheck, this);
    }

    protected start(): void {
        const bullet = XDMKQ_BULLET_CONFIG.get(this.Weapon);
        this.Bullet = new XDMKQ_BULLET(bullet.CurBullet, bullet.ReduceBullet, bullet.MagazineCapacity);
        XDMKQ_GameManager.Instance.MapBullet.set(this.Weapon, this.Bullet);
    }

    ShowCheck(weapon: XDMKQ_WEAPON) {
        this.Checked.active = weapon == this.Weapon;
    }

    ChangeBullet() {
        this.BulletCount = XDMKQ_GameManager.Instance.MapBullet.get(this.Weapon).CurBullet + XDMKQ_GameManager.Instance.MapBullet.get(this.Weapon).ReduceBullet;
        this.ShowBullet();
    }

    ShowBullet() {
        this.BulletLabel.string = this.BulletCount.toString();
        this.Video.active = this.BulletCount <= 0;
    }

    Click() {
        if (!XDMKQ_GameManager.Instance.IsSwitch) return;
        XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.点击);
        if (this.BulletCount <= 0) {
            Banner.Instance.ShowVideoAd(() => {
                XDMKQ_GameManager.Instance.MapBullet.forEach((value, key) => {
                    if (key == XDMKQ_WEAPON.炮台) return;
                    key == XDMKQ_WEAPON.手雷 || key == XDMKQ_WEAPON.燃烧弹 ? value.CurBullet += value.MagazineCapacity * 2 : value.ReduceBullet += value.MagazineCapacity * 2
                });
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CHANGE_BULLET);
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CURWEAPON_BULLET_SHOW);
                if (this.Weapon != XDMKQ_WEAPON.轰炸) XDMKQ_PlayerController.Instance.SwitchWeapon(this.Weapon);
            })
            return;
        }
        if (this.Weapon == XDMKQ_WEAPON.轰炸) {
            XDMKQ_GameManager.Instance.MapBullet.get(this.Weapon).CurBullet--;
            this.ChangeBullet();
            XDMKQ_BulletManager.Instance.CreateHZ();
            return;
        }
        XDMKQ_PlayerController.Instance.SwitchWeapon(this.Weapon);
    }


}


