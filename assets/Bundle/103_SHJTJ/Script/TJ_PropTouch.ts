import { _decorator, Component, EventTouch, Label, Node, UITransform, v2, Vec3 } from 'cc';
import { TJ_GameManager } from './TJ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('TJ_PropTouch')
export class TJ_PropTouch extends Component {

    private touchStartPos: Vec3 = new Vec3(); // 记录触摸起始位置
    private pos: Vec3 = new Vec3(); // 记录节点起始位置
    private parent: Node = null;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        console.log("touch start", this.node.name);
        const touchLocation = new Vec3(event.getUILocation().x, event.getUILocation().y);
        this.touchStartPos = TJ_GameManager.instance.gameArea.getComponent(UITransform).convertToNodeSpaceAR(touchLocation);

        this.parent = this.node.parent;
        this.pos.set(this.node.position);

        this.node.setParent(TJ_GameManager.instance.gameArea)
        this.node.setPosition(this.touchStartPos);
    }

    onTouchMove(event: EventTouch) {
        const touchMovePos = TJ_GameManager.instance.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        const offset = new Vec3();
        Vec3.subtract(offset, touchMovePos, this.touchStartPos);

        const newPosition = new Vec3();
        Vec3.add(newPosition, this.touchStartPos, offset);

        this.node.setPosition(newPosition);
    }

    onTouchEnd(event: EventTouch) {
        const touchEndPos = TJ_GameManager.instance.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        const bol = TJ_GameManager.instance.scrollView.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y))
        if (bol) {
            const node = TJ_GameManager.instance.propMap.get(this.node)
            if (node) {
                const la = node.getChildByName("Number").getComponent(Label)
                let x = Number(la.string)
                x += 1

                if (x > 1) {
                    la.enabled = true;
                } else {
                    la.enabled = false;
                }

                // 如果存在且未激活，则激活
                if (!node.active) {
                    node.active = true;
                }
                // 如果已存在且激活，则数量加1
                if (node.active) {
                    la.string = x.toString();
                }
                // TJ_GameManager.instance.cardMap.delete(card);
                TJ_GameManager.instance.propMap.delete(node);
                TJ_GameManager.instance.props.splice(TJ_GameManager.instance.props.indexOf(this.node), 1);
                this.node.destroy();
            } else {
                console.error("node is null")
            }

        }

        else {
            this.node.setPosition(Vec3.ZERO);
            this.node.setParent(this.parent);
        }
    }
}


