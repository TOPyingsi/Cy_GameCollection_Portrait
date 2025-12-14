import { _decorator, Component, EventTouch, Node, ScrollView, Sprite, UITransform, v2, Vec3 } from 'cc';
import { SJ_GameManager } from './SJ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('SJ_Touch')
export class SJ_Touch extends Component {

    @property([Node]) props: Node[] = [];
    @property(Node) kbqn: Node = null;
    @property(Node) ch: Node = null;

    private touchProp: Node = null;
    private initialPos: Vec3 = new Vec3();
    private count1: number = 0;
    private count2: number = 0;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.on(Node.EventType.TOUCH_END, this.TOUCH_END, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this);

    }

    TOUCH_START(event: EventTouch) {
        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        this.props.forEach(prop => {
            const bol = prop.getComponent(UITransform).getBoundingBox().contains(v2(pos.x, pos.y))
            if (bol) {
                this.initialPos = prop.getPosition().clone();
                this.touchProp = prop;
                SJ_GameManager.instance.scrollView.getComponent(ScrollView).enabled = false;
            }
        });
    }

    TOUCH_MOVE(event: EventTouch) {
        if (!this.touchProp || !this.touchProp.isValid) return;
        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        this.touchProp.setPosition(pos.x, pos.y, 0);
    }

    TOUCH_END(event: EventTouch) {
        if (!this.touchProp || !this.touchProp.isValid) return;
        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        const bol1 = this.kbqn.getComponent(UITransform).getBoundingBox().contains(v2(pos.x, pos.y));
        const bol2 = this.ch.getComponent(UITransform).getBoundingBox().contains(v2(pos.x, pos.y));
        if (bol1) {
            if (this.touchProp.name == "1") {
                this.count1++;
                const name = this.touchProp.getComponent(Sprite).spriteFrame.name;
                this.kbqn.getChildByName(name).active = true;
                this.props = this.props.filter(item => item != this.touchProp);
                this.touchProp.destroy();
                if (this.count1 >= 3) {
                    SJ_GameManager.instance.selectRight(this.kbqn, false);
                }
            } else {
                this.touchProp.setPosition(this.initialPos)
            }
        }
        if (bol2) {
            if (this.touchProp.name == "2") {
                this.count2++;
                const name = this.touchProp.getComponent(Sprite).spriteFrame.name;
                this.ch.getChildByName(name).active = true;
                this.props = this.props.filter(item => item != this.touchProp);
                this.touchProp.destroy();
                if (this.count2 >= 3) {
                    SJ_GameManager.instance.selectRight(this.ch, false);
                }
            } else {
                this.touchProp.setPosition(this.initialPos)
            }
        }
        if (!bol1 && !bol2) {
            this.touchProp.setPosition(this.initialPos)
        }
        this.touchProp = null;
        SJ_GameManager.instance.scrollView.getComponent(ScrollView).enabled = true;
    }
}


