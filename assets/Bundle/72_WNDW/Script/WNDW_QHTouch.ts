import { _decorator, Component, EventTouch, find, Node, UITransform, v2, Vec3 } from 'cc';
import { WNDW_GameManager } from './WNDW_GameManager';
const { ccclass, property } = _decorator;

@ccclass('WNDW_QHTouch')
export class WNDW_QHTouch extends Component {
    @property({ type: Node, displayName: "目标1" }) objective1: Node = null;
    @property({ type: Node, displayName: "目标2" }) objective2: Node = null;

    private originalPos: Vec3 = new Vec3();
    private playArea: Node = null;

    protected onLoad(): void {
        this.playArea = find('Canvas/PlayArea');

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        const touchStartPos = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.originalPos = this.node.position.clone();
        this.node.setPosition(touchStartPos.x, touchStartPos.y);
    }

    onTouchMove(event: EventTouch) {
        const touchMovePos = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.node.setPosition(touchMovePos.x, touchMovePos.y);
    }

    onTouchEnd(event: EventTouch) {
        const touchEndPos = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        const bol1 = this.objective1.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y))
        const bol2 = this.objective2.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y))

        if (bol1) {
            this.node.destroy()
             WNDW_GameManager.instance.sy[ WNDW_GameManager.instance.sy.length - 1].destroy();
             WNDW_GameManager.instance.sy.splice( WNDW_GameManager.instance.sy.length - 1, 1);
            const qh = find('Canvas/PlayArea/墙画_地上')
            qh.active = true;
            qh.getChildByName("鲨鱼").active = true;
             WNDW_GameManager.instance.activeLabelToRole( WNDW_GameManager.instance.mom, "我年轻时候还是挺有魅力的")
             WNDW_GameManager.instance.progress()
        } else if (bol2) {
            this.node.destroy()
             WNDW_GameManager.instance.mtr[ WNDW_GameManager.instance.mtr.length - 1].destroy();
             WNDW_GameManager.instance.mtr.splice( WNDW_GameManager.instance.mtr.length - 1, 1);
            const qh = find('Canvas/PlayArea/墙画_地上')
            qh.active = true;
            qh.getChildByName("木头人").active = true;
             WNDW_GameManager.instance.activeLabelToRole( WNDW_GameManager.instance.mom, "我年轻时候还是挺有魅力的")
             WNDW_GameManager.instance.progress()
        }
    }
}