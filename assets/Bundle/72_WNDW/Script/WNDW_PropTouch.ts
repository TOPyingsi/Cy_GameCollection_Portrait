import { _decorator, Component, EventTouch, find, Node, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { WNDW_GameManager } from './WNDW_GameManager';
const { ccclass, property } = _decorator;


/**
 * 处理物品触摸事件
 */
@ccclass('WNDW_PropTouch')
export class WNDW_PropTouch extends Component {

    @property({ type: Node, displayName: "目标" }) objective: Node = null;

    private originalPos: Vec3 = new Vec3();
    private playArea: Node = null;
    private startPos: Vec3 = new Vec3();

    protected onLoad(): void {
        this.playArea = find('Canvas/PlayArea');

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        const touchStartPos = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        if (this.node.name == "窗帘_OFF") {
            this.startPos = touchStartPos;
        } else {
            this.originalPos = this.node.position.clone();
            this.node.setPosition(touchStartPos.x, touchStartPos.y);
        }

    }

    onTouchMove(event: EventTouch) {
        if (this.node.name == "窗帘_OFF") {

        } else {
            const touchMovePos = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
            this.node.setPosition(touchMovePos.x, touchMovePos.y);
        }

    }

    onTouchEnd(event: EventTouch) {
        const touchEndPos = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        if (this.node.name == "窗帘_OFF") {
            if (touchEndPos.x <= (this.startPos.x -= 50)) {
                this.node.destroy()
            }
        } else {
            const bol = this.objective.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y))
            if (bol) {
                const name = this.node.name
                
                switch (name) {
                    case "手机":
                        this.node.setPosition(-248.29, -243.007)
                        const num =  WNDW_GameManager.instance.activeLabelToRole( WNDW_GameManager.instance.mom, "大哥能过来帮我带一下娃吗")
                        this.scheduleOnce(() => {
                            this.node.destroy()
                            const n = find("Canvas/PlayArea/门")
                            tween(n)
                                .to(0.5, { eulerAngles: v3(0, -90, 0) })
                                .call(() => {
                                    n.destroy()
                                })
                                .start()
                        }, num)
                        break;

                    case "香蕉":
                        this.node.destroy();
                        this.objective.destroy();
                        find("Canvas/PlayArea/香蕉猴").active = true;
                         WNDW_GameManager.instance.activeLabelToRole( WNDW_GameManager.instance.mom, "给你吃香蕉了帮我照顾一下孩子吧")
                        break;

                    case "大锤":
                        this.node.destroy();
                        this.objective.destroy();
                        find("Canvas/PlayArea/墙洞").active = true;
                        find("Canvas/PlayArea/隔壁老王").active = true;
                        //  WNDW_GameManager.instance.activeLabelToRole( WNDW_GameManager.instance.mom, "给你吃香蕉了帮我照顾一下孩子吧")
                        break;

                    case "瓜子":
                        this.node.destroy();
                        const node = find("Canvas/PlayArea/仓鼠")
                        node.active = true;
                        tween(node)
                            .to(0.5, { scale: v3(1, 1, 1) })
                            .start()
                        tween(node)
                            .to(0.5, { position: v3(-112.939, -36.079, 0) })
                            .start()
                        break;
                }
            } else {
                this.node.setPosition(this.originalPos);

            }
        }

    }

}


