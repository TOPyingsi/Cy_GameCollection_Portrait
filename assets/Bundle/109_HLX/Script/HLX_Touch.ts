import { _decorator, Color, Component, EventTouch, instantiate, Node, Prefab, UITransform, Vec3 } from 'cc';
import { HLX_GameManager } from './HLX_GameManager';
const { ccclass, property } = _decorator;

@ccclass('HLX_Touch')
export class HLX_Touch extends Component {
    public static instance: HLX_Touch = null;

    @property(Prefab) touchItem: Prefab = null;

    private collider: Node = null;
    color: Color = null;

    protected onLoad(): void {
        HLX_Touch.instance = this;
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        if (this.collider && this.collider.isValid) {
            this.collider.destroy();
        }

        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        this.collider = instantiate(this.touchItem);
        this.collider.setPosition(pos);
        this.collider.setParent(this.node);

        this.color = HLX_GameManager.instance.GetRandomColor();
    }

    onTouchMove(event: EventTouch) {
        if (!this.collider || !this.collider.isValid) return;

        const uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) return;

        const pos = uiTransform.convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.collider.setPosition(pos);
    }

    onTouchEnd(event: EventTouch) {
        if (!this.collider || !this.collider.isValid) return;

        console.log("onTouchEnd", HLX_GameManager.instance.str);
        HLX_GameManager.instance.check();
        this.collider.destroy();
        this.collider = null;
    }
}