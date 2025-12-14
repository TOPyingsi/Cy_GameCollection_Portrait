import { _decorator, Component, EventTouch, find, Node, Sprite, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { SCS_GameManager } from './SCS_GameManager';
const { ccclass, property } = _decorator;

@ccclass('SCS_TouchCtrl')
export class SCS_TouchCtrl extends Component {

    private originalPos: Vec3 = new Vec3();
    private playArea: Node = null;
    private startPos: Vec3 = new Vec3();
    private lastClickTime: number = 0; // 记录上次点击时间
    private doubleClickThreshold: number = 300; // 双击间隔阈值（毫秒）

    protected onLoad(): void {
        this.playArea = find('Canvas/PlayArea');

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        console.log(this.node.name)

        const touchStartPos = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.startPos = touchStartPos;
        this.node.setSiblingIndex(999)
        if (this.node.name == "垃圾桶") {
            if (SCS_GameManager.instance.isCanTouch) {
                const currentTime = Date.now();
                if (currentTime - this.lastClickTime < this.doubleClickThreshold) {
                    this.handleDoubleClick(event);
                    this.lastClickTime = 0; // 重置防止误触发
                    return;
                }
                this.lastClickTime = currentTime;
            }
            else {
                return;
            }
        }
        else if (this.node.name == "药水") {
            this.originalPos = this.node.position.clone();
            this.node.setPosition(touchStartPos.x, touchStartPos.y);
        }

    }

    private handleDoubleClick(event: EventTouch) {
        console.log("双击触发!", this.node.name);

        const node = find("Canvas/PlayArea/药水")
        node.active = true;

        tween(node)
            .to(0.2, { position: v3(182.192, -660.445, 0) })
            .start()

        tween(node)
            .to(0.2, { scale: v3(1, 1, 1) })
            .start()

    }

    onTouchMove(event: EventTouch) {
        if (this.node.name == "垃圾桶") {
            return
        }
        else if (this.node.name == "药水") {
            const touchMovePos = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
            this.node.setPosition(touchMovePos.x, touchMovePos.y);
        }

    }

    onTouchEnd(event: EventTouch) {
        if (this.node.name == "药水") {
            const touchEndPos = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
            console.log("touchEndPos", SCS_GameManager.instance.currentRole.name);
            if (SCS_GameManager.instance.currentRole.name == "融合怪") {
                const bol = SCS_GameManager.instance.currentRole.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y))
                if (bol) {
                    SCS_GameManager.instance.currentRole.getComponent(Sprite).spriteFrame = SCS_GameManager.instance.sr
                    SCS_GameManager.instance.currentRole.name = "树人"
                    this.node.destroy();
                }
                else {
                    this.node.setPosition(this.startPos)
                }
            }
        }
    }

}



