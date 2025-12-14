import { _decorator, Component, EventTouch, find, instantiate, Node, Prefab, UITransform, v3, Vec3 } from 'cc';
import { GKDR_GameManager } from './GKDR_GameManager';
const { ccclass, property } = _decorator;

@ccclass('GKDR_Stickers')
export class GKDR_Stickers extends Component {
    @property(Prefab) //贴纸预制体
    Stickers: Prefab = null;
    private NodeLevel: number = 0;
    private StartPosition: Vec3 = new Vec3();
    onLoad() {
        this.StartPosition = this.node.worldPosition.clone();
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {


    }
    onTouchMove(event: EventTouch) {

        const pos = event.getUILocation()
        this.node.worldPosition = v3(pos.x, pos.y);
    }
    onTouchEnd() {
        const StickersNode = instantiate(this.Stickers);


        if (find("Canvas/工作台/透明底").children[0] != null) {
            find("Canvas/工作台/贴纸").addChild(StickersNode);
            StickersNode.worldPosition = this.node.worldPosition;
            StickersNode.setScale(1.7, 1.7, 1);
        }
        GKDR_GameManager.Instance.WinorLose();

        this.node.worldPosition = this.StartPosition;
    }
}


