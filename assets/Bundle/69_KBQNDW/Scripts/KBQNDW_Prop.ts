import { _decorator, Animation, AudioSource, Component, EventTouch, Node, UITransform, Vec3 } from 'cc';
import { KBQNDW_GlobalDt } from './KBQNDW_GlobalDt';
const { ccclass, property } = _decorator;

@ccclass('KBQNDW_Prop')
export class KBQNDW_Prop extends Component {
    @property(Node)
    canTouch: Node;

    private originalPos: Vec3 = new Vec3(); // 初始位置

    private offset: Vec3 = new Vec3(); // 触摸点与节点中心的偏移

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {

        this.originalPos.set(this.node.position.x, this.node.position.y, 0);

        //触摸点
        let touchPos = event.getUILocation();//世界
        let nodePos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));//本地(节点)

        this.offset.set(this.node.position.x - nodePos.x, this.node.position.y - nodePos.y, 0);
    }

    onTouchMove(event: EventTouch) {

        let touchPos = event.getUILocation();
        let nodePos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));

        this.node.setPosition(nodePos.x + this.offset.x, nodePos.y + this.offset.y);

    }

    onTouchEnd(event: EventTouch) {

        this.node.position = this.originalPos.clone();
        let transform = this.canTouch.getComponent(UITransform)
        if (transform.getBoundingBoxToWorld().contains(event.getUILocation()) && this.canTouch.active === true) {
            if (this.node.name === "yezi") {
                this.node.parent.getChildByName("songshu").active = false;
                let n = this.node.parent.getChildByName("卡皮巴拉");
                n.active = true;
                KBQNDW_GlobalDt.Instance.addTriggerN(n);
                this.node.removeFromParent();
            }
            if (this.node.name === "juzi") {

                this.node.parent.getChildByName("gangling").active = false;
                let n = this.node.parent.getChildByName("肌肉");
                n.active = true;
                KBQNDW_GlobalDt.Instance.addTriggerN(n);
                this.node.removeFromParent();

            }
            if (this.node.name === "气锤") {
                this.node.parent.getChildByName("notTouch").active = true;
                this.node.getComponent(Animation).play();
                this.node.parent.getComponent(AudioSource).clip = KBQNDW_GlobalDt.Instance.audioGroup[11];
                this.node.parent.getComponent(AudioSource).play();
                this.scheduleOnce(() => {
                    this.node.parent.getChildByName("notTouch").active = false;
                    this.node.parent.getChildByName("breakWall").active = true;
                    let n = this.node.parent.getChildByName("木棍人");
                    n.active = true;
                    this.node.removeFromParent();
                    KBQNDW_GlobalDt.Instance.addTriggerN(n);
                }, 0.5)
            }
        }
    }

}


