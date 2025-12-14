import { _decorator, Component, Enum, Label, math, Node, Sprite } from 'cc';
import { XDMKQ_AUDIO, XDMKQ_BULLET, XDMKQ_BULLET_CONFIG, XDMKQ_WEAPON } from './XDMKQ_Constant';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
import Banner from 'db://assets/Scripts/Banner';
import { XDMKQ_PlayerController } from './XDMKQ_PlayerController';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_WeaponItemFKP')
export class XDMKQ_WeaponItemFKP extends Component {

    @property({ type: Enum(XDMKQ_WEAPON) })
    Weapon: XDMKQ_WEAPON = XDMKQ_WEAPON.炮台;

    JDSprite: Sprite = null;
    JDLabel: Label = null;
    JDCount: number = 0;
    Video: Node = null;
    Bullet: XDMKQ_BULLET = null;

    protected onLoad(): void {
        this.JDSprite = this.node.getChildByName("防空炮进度条").getComponent(Sprite);
        this.JDLabel = this.node.getChildByName("FKPCount").getComponent(Label);
        this.Video = this.node.getChildByName("Video");

        this.node.on(Node.EventType.TOUCH_END, this.Click, this)
    }

    protected start(): void {
        const bullet = XDMKQ_BULLET_CONFIG.get(this.Weapon);
        this.Bullet = new XDMKQ_BULLET(bullet.CurBullet, bullet.ReduceBullet, bullet.MagazineCapacity);
        XDMKQ_GameManager.Instance.MapBullet.set(this.Weapon, this.Bullet);
    }

    protected onEnable(): void {
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_FKP_ADD_JD, this.AddJD, this)
    }

    protected onDisable(): void {
        XDMKQ_EventManager.Off(XDMKQ_MyEvent.XDMKQ_FKP_ADD_JD, this.AddJD, this)
    }

    ShowJD() {
        this.JDLabel.string = `${this.JDCount}%`;
        this.JDSprite.fillRange = this.JDCount / 100;
        this.Video.active = this.JDCount < 100;
    }

    AddJD(count: number = 1) {
        this.JDCount += count;
        this.JDCount = math.clamp(this.JDCount, 0, 100);
        this.ShowJD();
    }

    Click() {
        XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.点击);
        this.JDCount < 100 ? Banner.Instance.ShowVideoAd(() => { XDMKQ_PlayerController.Instance.SwitchWeapon(this.Weapon); this.JDCount = 100; this.ShowJD(); }) : XDMKQ_PlayerController.Instance.SwitchWeapon(this.Weapon);
    }
}


