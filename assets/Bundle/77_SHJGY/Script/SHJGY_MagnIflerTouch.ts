import { _decorator, Component, EventTouch, find, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SHJGY_MagnIflerTouch')
export class SHJGY_MagnIflerTouch extends Component {

    @property(Node) gameArea: Node = null;
    @property(Node) magnifier: Node = null;
    @property(Node) objective: Node = null;
    @property(Node) objectiveCopy: Node = null;

    private originalPos: Vec3 = new Vec3();
    private touchOriginalPos: Vec3 = new Vec3();

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        // const worldPos =this.mask.getComponent(UITransform).convertToWorldSpaceAR(this.objective.getPosition().clone())
        const pos = this.gameArea.getComponent(UITransform).convertToWorldSpaceAR(this.objective.getPosition().clone())
        this.objectiveCopy.position = this.objectiveCopy.parent.getComponent(UITransform).convertToNodeSpaceAR(pos).clone()
    }

    onTouchStart(event: EventTouch) {
        const touchStartPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.originalPos = this.magnifier.getPosition();
        this.touchOriginalPos = touchStartPos;
        const pos = this.gameArea.getComponent(UITransform).convertToWorldSpaceAR(this.objective.getPosition().clone())
        this.objectiveCopy.position = this.objectiveCopy.parent.getComponent(UITransform).convertToNodeSpaceAR(pos).clone()
    }

    onTouchMove(event: EventTouch) {
        const touchMovePos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(
            new Vec3(event.getUILocation().x, event.getUILocation().y)
        );

        const touchOffsetX = touchMovePos.x - this.touchOriginalPos.x;
        const touchOffsetY = touchMovePos.y - this.touchOriginalPos.y;

        this.magnifier.setPosition(
            this.originalPos.x + touchOffsetX,
            this.originalPos.y + touchOffsetY
        );

        const pos = this.gameArea.getComponent(UITransform).convertToWorldSpaceAR(this.objective.getPosition().clone())
        this.objectiveCopy.position = this.objectiveCopy.parent.getComponent(UITransform).convertToNodeSpaceAR(pos).clone()
    }

    onTouchEnd(event: EventTouch) {
        const touchEndPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        // this.magnifier.setPosition(this.originalPos)
        // const pos = this.gameArea.getComponent(UITransform).convertToWorldSpaceAR(this.objective.getPosition().clone())
        // this.objectiveCopy.position = this.objectiveCopy.parent.getComponent(UITransform).convertToNodeSpaceAR(pos).clone()
    }

}


