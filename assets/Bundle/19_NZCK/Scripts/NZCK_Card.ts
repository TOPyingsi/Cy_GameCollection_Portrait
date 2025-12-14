import { _decorator, Component, Enum, EventTouch, Node, Sprite } from 'cc';
import { NZCK_CARDTYPE } from './NZCK_Constant';
import { NZCK_LVController } from './NZCK_LVController';
import { NZCK_SoundController, NZCK_Sounds } from './NZCK_SoundController';
const { ccclass, property } = _decorator;

@ccclass('NZCK_Card')
export class NZCK_Card extends Component {
    @property({ type: Enum(NZCK_CARDTYPE) })
    Type: NZCK_CARDTYPE = NZCK_CARDTYPE.普通卡;

    private _isClick: boolean = true;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchEnd(event: EventTouch) {
        if (!NZCK_LVController.Instance.IsClick || !this._isClick) return;
        this._isClick = false;
        NZCK_SoundController.Instance.PlaySound(NZCK_Sounds.Click);
        NZCK_LVController.Instance.IsClick = false;
        NZCK_LVController.Instance.HandCardNum--;
        NZCK_LVController.Instance.addCard(this.Type, this.node);
    }
}


