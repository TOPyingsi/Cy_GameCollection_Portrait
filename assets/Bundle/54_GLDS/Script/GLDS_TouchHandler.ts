import { _decorator, Component, director, EventTouch, Node, tween, UITransform, v2, Vec3 } from 'cc';
import { GLDS_ColliderHandler } from './GLDS_ColliderHandler';
import { GLDS_GameManager } from './GLDS_GameManager';
const { ccclass } = _decorator;

@ccclass('GLDS_TouchHandler')
export class GLDS_TouchHandler extends Component {

    private knife;
    private isknife;
    private fish;
    private isfish;
    private knifeOffset: Vec3 | null = null;
    private fishOffset: Vec3 | null = null;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);

        console.error(GLDS_GameManager.Instance.isCanCut);
    }

    touchStart(event: EventTouch) {
        if (GLDS_GameManager.Instance.isCanCut) {
            director.getScene().emit('TOUCH_START');
            return;
        }
        const touchLocation = event.getUILocation();
        const uiTransform = this.node.getComponent(UITransform);
        const localPos = uiTransform.convertToNodeSpaceAR(new Vec3(touchLocation.x, touchLocation.y, 0));

        // 检查点击是否在当前节点区域内
        if (uiTransform.getBoundingBox().contains(v2(localPos.x, localPos.y))) {
            this.knife = this.node.getChildByName("Knife");
            this.fish = this.node.getChildByName("Fish");

            // 先检查 knife 是否被点击
            if (this.knife) {
                const knifeTransform = this.knife.getComponent(UITransform);
                if (knifeTransform && knifeTransform.getBoundingBox().contains(v2(localPos.x, localPos.y))) {
                    GLDS_ColliderHandler.Instance.isTouchingWeapon = true;
                    this.isknife = true;
                    this.knifeOffset = new Vec3(localPos.x - this.knife.position.x, localPos.y - this.knife.position.y, 0); // 初始偏移
                    return;
                }
            }

            if (this.fish) {
                const fishTransform = this.fish.getComponent(UITransform);
                if (fishTransform && fishTransform.getBoundingBox().contains(v2(localPos.x, localPos.y))) {
                    this.isfish = true;
                    this.fishOffset = new Vec3(localPos.x - this.fish.position.x, localPos.y - this.fish.position.y, 0); // 初始偏移
                }
            }
        }
    }
    touchMove(event: EventTouch) {
        const touchPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));

        if (this.isknife) {
            if (!this.knifeOffset) {
                this.knifeOffset = new Vec3(touchPos.x - this.knife.position.x, touchPos.y - this.knife.position.y, 0);
            }
            this.knife.setPosition(touchPos.x - this.knifeOffset.x, touchPos.y - this.knifeOffset.y);
        }

        if (this.isfish) {
            if (!this.fishOffset) {
                this.fishOffset = new Vec3(touchPos.x - this.fish.position.x, touchPos.y - this.fish.position.y, 0);
            }
            this.fish.setPosition(touchPos.x - this.fishOffset.x, touchPos.y - this.fishOffset.y);
        }
    }

    touchEnd(event: EventTouch) {
        if (this.isknife) {
            tween(this.knife).to(0.2, { position: new Vec3(-400, 0) }).start();
        }

        this.isknife = false;
        this.isfish = false;
        this.knifeOffset = null;
        this.fishOffset = null;
        GLDS_ColliderHandler.Instance.isTouchingWeapon = false;
    }
}


