import { _decorator, Component, EventTouch, find, instantiate, macro, Node, NodeEventType, Prefab, UITransform, v3, Vec3 } from 'cc';
import { GKDR_GameManager } from './GKDR_GameManager';
const { ccclass, property } = _decorator;

@ccclass('GKDR_Necklace')
export class GKDR_Necklace extends Component {
    @property(Prefab)
    Necklace: Prefab = null;
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
        if (find("Canvas/工作台/透明底").children[0] != null) {
            {
                if (find("Canvas/工作台/透明底").children[0].name == "爱心") {
                    const Node = instantiate(this.Necklace);
                    find("Canvas/工作台/项链").addChild(Node);
                    Node.setWorldPosition(find("Canvas/工作台/项链").worldPosition.x - 68.429, find("Canvas/工作台/项链").worldPosition.y + 261.731, find("Canvas/工作台/项链").worldPosition.z);
                    Node.setScale(1.5, 1.5, 1);
                } else if (find("Canvas/工作台/透明底").children[0].name == "星星") {
                    const Node = instantiate(this.Necklace);
                    find("Canvas/工作台/项链").addChild(Node);
                    Node.setWorldPosition(find("Canvas/工作台/项链").worldPosition.x - 58.305, find("Canvas/工作台/项链").worldPosition.y + 358.604, find("Canvas/工作台/项链").worldPosition.z);
                    Node.setScale(1.5, 1.5, 1);
                } else if (find("Canvas/工作台/透明底").children[0].name == "小熊") {
                    const Node = instantiate(this.Necklace);
                    find("Canvas/工作台/项链").addChild(Node);
                    Node.setWorldPosition(find("Canvas/工作台/项链").worldPosition.x - 58.305, find("Canvas/工作台/项链").worldPosition.y + 358.604, find("Canvas/工作台/项链").worldPosition.z);
                    Node.setScale(1.5, 1.5, 1);
                } else if (find("Canvas/工作台/透明底").children[0].name == "云朵") {
                    const Node = instantiate(this.Necklace);
                    find("Canvas/工作台/项链").addChild(Node);
                    Node.setWorldPosition(find("Canvas/工作台/项链").worldPosition.x - 52.62, find("Canvas/工作台/项链").worldPosition.y + 356.145, find("Canvas/工作台/项链").worldPosition.z);
                    Node.setScale(1.5, 1.5, 1);
                }

                if (find("Canvas/工作台/项链").children.length > 1) {
                    find("Canvas/工作台/项链").children[0].destroy();

                }
            }
            GKDR_GameManager.Instance.WinorLose();


            this.node.worldPosition = this.StartPosition;


        }


    }

}
