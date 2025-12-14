import { _decorator, Component, EventTouch, find, instantiate, macro, Node, NodeEventType, Prefab, UITransform, v3, Vec3 } from 'cc';
import { GKDR_GameManager } from './GKDR_GameManager';
const { ccclass, property } = _decorator;

@ccclass('GKDR_Transparentbottom')
export class GKDR_Transparentbottom extends Component {
    @property(Prefab)
    Transparentbottom: Prefab = null;
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


        const Node = instantiate(this.Transparentbottom);
        find("Canvas/工作台/透明底").addChild(Node);
        Node.worldPosition = find("Canvas/工作台/透明底").worldPosition;
        if (Node.name == "云朵") {
            Node.setScale(8, 7, 1);
        }
        else {
            Node.setScale(7, 7, 1);
        }


        if (find("Canvas/工作台/透明底").children.length > 1) {
            find("Canvas/工作台/透明底").children[0].destroy();
            for (let i = 0; i < 100; i++) {
                if (i < find("Canvas/工作台/亮片").children.length) {
                    find("Canvas/工作台/亮片").children[i].destroy();
                }
                if (i < find("Canvas/工作台/裱花").children.length) {
                    find("Canvas/工作台/裱花").children[i].destroy();
                }
                if (i < find("Canvas/工作台/亮片").children.length) {
                    find("Canvas/工作台/亮片").children[i].destroy();
                }
                if (i < find("Canvas/工作台/贴纸").children.length) {
                    find("Canvas/工作台/贴纸").children[i].destroy();
                }
                if (i < find("Canvas/工作台/项链").children.length) {
                    find("Canvas/工作台/项链").children[i].destroy();
                }
                if (i < find("Canvas/工作台/3D贴纸").children.length) {

                    find("Canvas/工作台/3D贴纸").children[i].destroy();
                }

            }
        }
        GKDR_GameManager.Instance.WinorLose();
        this.node.worldPosition = this.StartPosition;


    }


}


