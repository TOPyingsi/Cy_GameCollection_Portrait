import { _decorator, Component, Label, math, Node, Sprite, tween, Tween } from 'cc';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_PlayerController } from './XDMKQ_PlayerController';
import { XDMKQ_AMPLIFICATION, XDMKQ_MAP } from './XDMKQ_Constant';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_ReloadUI')
export class XDMKQ_ReloadUI extends Component {

    ReloadSprite: Sprite = null;
    ReloadTips: Label = null;
    Reloading: boolean = false;
    protected onLoad(): void {
        this.ReloadSprite = this.node.getChildByName("Reload").getComponent(Sprite);
        this.ReloadTips = this.node.getChildByName("Tips").getComponent(Label);
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_RELOAD_SHOW, this.ShowReload, this);
        this.node.active = false;
    }

    ShowReload(druation) {
        if (this.Reloading) return;
        this.Reloading = true;
        XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_AIM_SHOW, false);
        this.node.active = true;
        Tween.stopAllByTarget(this.ReloadSprite);
        this.ReloadSprite.fillRange = 0;
        tween(this.ReloadSprite)
            .to(druation, { fillRange: -1 })
            .call(() => {
                this.Reloading = false;
                this.node.active = false;
                const bullet: number = math.clamp(XDMKQ_GameManager.Instance.CurBullet.ReduceBullet, 0,
                    Math.floor(XDMKQ_GameManager.Instance.CurBullet.MagazineCapacity * (1 + XDMKQ_GameManager.Instance.GetAmpByWeapon(XDMKQ_PlayerController.Instance.CurWeapon, XDMKQ_AMPLIFICATION.弹药上限))));
                XDMKQ_GameManager.Instance.CurBullet.CurBullet += bullet;
                XDMKQ_GameManager.Instance.CurBullet.ReduceBullet -= bullet;
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CURWEAPON_BULLET_SHOW);
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_AIM_SHOW, true);
            })
            .start();
    }
}


