import { _decorator, Component, EventTouch, find, instantiate, Node, Prefab, UITransform, v3, Vec3 } from 'cc';
import { TZHZ_GameManager } from './TZHZ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('TZHZ_BG')
export class TZHZ_BG extends Component {
    @property(Prefab)
    Piping: Prefab = null;
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
        // const PipingNode = instantiate(this.Piping);
        // const pos = event.getUILocation()
        // PipingNode.worldPosition = v3(pos.x, pos.y);
    }
    onTouchEnd() {
        const PipingNode = instantiate(this.Piping);

        find("Canvas/工作台/背景").addChild(PipingNode);
        PipingNode.setWorldPosition(find("Canvas/工作台/背景").worldPosition.x, find("Canvas/工作台/背景").worldPosition.y - 207.171, find("Canvas/工作台/背景").worldPosition.z)
        if (find("Canvas/工作台/背景").children.length > 1) {
            find("Canvas/工作台/背景").children[0].destroy();
        }

        TZHZ_GameManager.Instance.WinorLose();

    }

}


