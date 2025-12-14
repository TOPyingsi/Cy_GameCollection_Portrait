import { _decorator, Component, EventTouch, find, instantiate, Node, Prefab, UITransform, v3, Vec3 } from 'cc';
import { GKDR_GameManager } from './GKDR_GameManager';
const { ccclass, property } = _decorator;

@ccclass('GKDR_3DStickersD3')
export class GKDR_3DStickersD3 extends Component {
    @property(Prefab) //3D贴纸预制体
    StickersD3: Prefab = null;
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
        const StickersD3Node = instantiate(this.StickersD3);
        if (find("Canvas/工作台/透明底").children[0] != null) {
            find("Canvas/工作台/3D贴纸").addChild(StickersD3Node);
            StickersD3Node.worldPosition = this.node.worldPosition;
            StickersD3Node.setScale(1.7, 1.7, 1);
        }
        GKDR_GameManager.Instance.WinorLose();


        this.node.worldPosition = this.StartPosition;
    }
}


