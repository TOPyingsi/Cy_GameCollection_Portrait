import { _decorator, Component, EventTouch, find, instantiate, Node, pingPong, Prefab, UITransform, v3, Vec3 } from 'cc';
import { TZHZ_GameManager } from './TZHZ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('TZHZ_TouFa')
export class TZHZ_TouFa extends Component {
    @property(Prefab) //裱花预制体
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

        find("Canvas/工作台/头发").addChild(PipingNode);
        if (PipingNode.name == "黄头发") {
            PipingNode.setWorldPosition(find("Canvas/工作台/头发").worldPosition.x, find("Canvas/工作台/头发").worldPosition.y - 24.705, find("Canvas/工作台/头发").worldPosition.z);
        }
        if (PipingNode.name == "红头发") {
            PipingNode.setWorldPosition(find("Canvas/工作台/头发").worldPosition.x, find("Canvas/工作台/头发").worldPosition.y + 60.219, find("Canvas/工作台/头发").worldPosition.z);
        }
        if (PipingNode.name == "绿头发") {
            PipingNode.worldPosition = find("Canvas/工作台/头发").worldPosition;
        }
        if (find("Canvas/工作台/头发").children.length > 1) {
            find("Canvas/工作台/头发").children[0].destroy();
        }
        TZHZ_GameManager.Instance.WinorLose();
    }

}


