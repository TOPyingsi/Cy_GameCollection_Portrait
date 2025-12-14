import { _decorator, Component, EventTouch, find, instantiate, Node, pingPong, Prefab, UITransform, v3, Vec3 } from 'cc';
import { GKDR_GameManager } from './GKDR_GameManager';
const { ccclass, property } = _decorator;

@ccclass('GKDR_Piping')
export class GKDR_Piping extends Component {
    @property(Prefab) //裱花预制体
    Piping: Prefab[] = [];
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

            if (find("Canvas/工作台/裱花").children.length > 1) {
                find("Canvas/工作台/裱花").children[0].destroy();
            }
            for (let i = 0; i < this.Piping.length; i++) {
                if (this.Piping[i].name == find("Canvas/工作台/透明底").children[0].name + this.node.name) {
                    const PipingNode = instantiate(this.Piping[i]);
                    find("Canvas/工作台/裱花").addChild(PipingNode);
                    PipingNode.worldPosition = find("Canvas/工作台/裱花").worldPosition;
                }
            }

        }

        GKDR_GameManager.Instance.WinorLose();



        this.node.worldPosition = this.StartPosition;


    }

}


