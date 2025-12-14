import { _decorator, Component, EventTouch, find, instantiate, Node, Prefab, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { GKDR_GameManager } from './GKDR_GameManager';
const { ccclass, property } = _decorator;

@ccclass('GKDR_Sequins')
export class GKDR_Sequins extends Component {

    @property(Prefab)
    Sequinss: Prefab = null;


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
            if (find("Canvas/工作台/亮片").children.length > 1) {
                find("Canvas/工作台/亮片").children[0].destroy();
            }

            const SequinsNode = instantiate(this.Sequinss);

            tween(this.node)
                .to(0.2, { eulerAngles: v3(0, 0, 150) })
                .to(0.3, { worldPosition: v3(305.1, 1499.938, 0) })
                .to(0.3, { worldPosition: v3(375.056, 1369.497, 0) })
                .to(0.3, { worldPosition: v3(483.377, 1488.428, 0) })
                .to(0.3, { worldPosition: v3(553.333, 1334.968, 0) })
                .to(0.3, { worldPosition: v3(661.654, 1461.572, 0) })
                .call(() => {
                    find("Canvas/工作台/亮片").addChild(SequinsNode);
                    SequinsNode.worldPosition = find("Canvas/工作台/亮片").worldPosition;
                    this.node.worldPosition = this.StartPosition;
                })
                .to(0, { eulerAngles: v3(0, 0, 0) })
                .start();



        }

        GKDR_GameManager.Instance.WinorLose();
    }


}




