import { _decorator, Animation, AudioSource, Component, EventTouch, Node, UITransform, Vec3 } from 'cc';
import { SHJXF_GlobalDt } from './SHJXF_GlobalDt';
const { ccclass, property } = _decorator;

@ccclass('SHJXF_t')
export class SHJXF_mg extends Component {

    @property(Node)
    mgrN: Node;

    private originalPos: Vec3 = new Vec3(); //初始位置（本地坐标）

    protected onLoad(): void {

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

    }


    onTouchStart(event: EventTouch) {
        this.node.getComponent(AudioSource).play();
        this.originalPos.set(this.node.position.x, this.node.position.y, 0);

    }

    onTouchMove(event: EventTouch) {

        if (SHJXF_GlobalDt.Instance.curPropIndex <= 2) {
            return;
        }
        this.node.parent.getChildByName("zhiyin3").active = false;
        this.node.parent.getChildByName("zhiyin4").active = true;
        let touPos: Vec3 = new Vec3(event.getUILocation().x, event.getUILocation().y, 0);
        //转化成本地坐标
        let UItouPos: Vec3 = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(touPos);
        this.node.setPosition(UItouPos);
    }

    onTouchEnd(event: EventTouch) {
        let transform = this.mgrN.getComponent(UITransform);
        if (transform.getBoundingBoxToWorld().contains(event.getUILocation())) {
            this.node.parent.getChildByName("zhiyin4").active = false;
            this.node.active = false;
            //播放动画
            this.node.parent.getChildByName("mugunren_cry").active = false;
            this.node.parent.getChildByName("cry").active = false;
            this.node.parent.getChildByName("mugunren_smile").active = true;
            this.scheduleOnce(() => {
                this.node.parent.getChildByName("mugunren_smile").getComponent(Animation).play();
            }, 0.8);
            return;
        } else {
            this.node.position = this.originalPos;
            return;
        }



    }
}


