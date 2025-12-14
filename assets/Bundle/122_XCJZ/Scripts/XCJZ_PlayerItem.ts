import { _decorator, Component, Enum, Node, SkeletalAnimation } from 'cc';
import { XCJZ_ANI, XCJZ_SHOP_ITEM } from './XCJZ_Constant';
import { XCJZ_EventManager, XCJZ_MyEvent } from './XCJZ_EventManager';
const { ccclass, property } = _decorator;

@ccclass('XCJZ_PlayerItem')
export class XCJZ_PlayerItem extends Component {

    @property({ type: Enum(XCJZ_SHOP_ITEM) })
    Type: XCJZ_SHOP_ITEM = XCJZ_SHOP_ITEM.可爱精灵;

    SkeletalAnimation: SkeletalAnimation = null;

    State: string = "";
    protected onLoad(): void {
        this.SkeletalAnimation = this.getComponent(SkeletalAnimation);
    }

    protected onEnable(): void {
        XCJZ_EventManager.On(XCJZ_MyEvent.XCJZ_SHOP_ITEM, this.Show, this);
    }

    protected onDisable(): void {
        XCJZ_EventManager.Off(XCJZ_MyEvent.XCJZ_SHOP_ITEM, this.Show, this);
    }

    Show(item: XCJZ_SHOP_ITEM) {
        if (item == this.Type) {
            this.PlayAni(XCJZ_ANI.Dance);
        } else {
            this.PlayAni(XCJZ_ANI.Idle);
        }
    }

    PlayAni(ani: string) {
        if (ani == this.State) return;
        this.State = ani;
        this.SkeletalAnimation.play(this.State);
    }
}


