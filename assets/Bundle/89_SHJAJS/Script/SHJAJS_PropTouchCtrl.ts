import { _decorator, Component, director, EventTouch, find, Node, UITransform, v2, Vec3 } from 'cc';
import { SHJAJS_GameManager } from './SHJAJS_GameManager';
const { ccclass, property } = _decorator;

@ccclass('SHJAJS_PropTouchCtrl')
export class SHJAJS_PropTouchCtrl extends Component {

    private gameArea: Node = null;
    private propArea: Node = null;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.gameArea = find("Canvas/GameArea")
        this.propArea = find("Canvas/GameArea/PropArea")
    }

    onTouchStart(event: EventTouch) {
        const pos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        // this.node.setSiblingIndex(find("Canvas/GameArea/6").children.length + 1)
        // this.node.setSiblingIndex(find("Canvas/GameArea/NodeArea").getSiblingIndex()+1)
        this.node.setPosition(pos);
    }

    onTouchMove(event: EventTouch) {
        const pos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.node.setPosition(pos);
    }

    onTouchEnd(event: EventTouch) {
        const pos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.node.setPosition(pos);
        const bol = this.propArea.getComponent(UITransform).getBoundingBox().contains(v2(pos.x, pos.y))
        if (bol) {
            const panel = SHJAJS_GameManager.instance._map.get(this.node)
            const node = SHJAJS_GameManager.instance.map.get(this.node)
            panel.children.find(node => node.name == this.node.name).active = true;
            SHJAJS_GameManager.instance._map.delete(this.node)
            director.getScene().emit("recoveryNode", node)
            this.node.destroy()
        }
    }

}


