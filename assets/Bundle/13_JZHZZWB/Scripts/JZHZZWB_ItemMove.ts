import { _decorator, Component, Enum, EventTouch, Node, Sprite, SpriteFrame, v3, Vec3 } from 'cc';
import { JZHZZWB_TYPE } from './JZHZZWB_Constant';
import { GameManager } from '../../../Scripts/GameManager';
import { JZHZZWB_GameManager } from './JZHZZWB_GameManager';
import { JZHZZWB_LVController } from './JZHZZWB_LVController';
const { ccclass, property } = _decorator;

@ccclass('JZHZZWB_ItemMove')
export class JZHZZWB_ItemMove extends Component {
    @property({ type: Enum(JZHZZWB_TYPE) })
    Type: JZHZZWB_TYPE = JZHZZWB_TYPE.TYPE1;

    @property(SpriteFrame)
    Forbid: SpriteFrame = null;

    Sprite: Sprite = null;
    startPos: Vec3 = new Vec3();
    IsClick: boolean = true;

    protected onLoad(): void {
        this.Sprite = this.node.getComponent(Sprite);
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected start(): void {
        JZHZZWB_LVController.Instance.CurItems++;
    }

    onTouchStart(event: EventTouch) {
        if (!this.IsClick) return;
        JZHZZWB_LVController.Instance.closeHand();
        this.startPos = this.node.getWorldPosition().clone();
    }

    onTouchMove(event: EventTouch) {
        if (!this.IsClick) return;
        const pos = event.getUILocation();
        const target = v3(pos.x, pos.y, this.startPos.z);
        this.node.setWorldPosition(target);
    }

    onTouchEnd(event: EventTouch) {
        if (!this.IsClick) return;
        const pos = event.getUILocation();
        const target = v3(pos.x, pos.y, this.startPos.z);
        const isChecked = JZHZZWB_LVController.Instance.check(this.Type, target)
        if (isChecked) {
            this.IsClick = false;
            this.Sprite.spriteFrame = this.Forbid;
        }
        this.node.setWorldPosition(this.startPos);
    }

}


