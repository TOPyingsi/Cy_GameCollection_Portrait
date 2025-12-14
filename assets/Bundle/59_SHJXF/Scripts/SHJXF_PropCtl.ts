import { _decorator, Animation, AudioSource, Component, EventTouch, find, Node, UITransform, Vec3 } from 'cc';
import { SHJXF_GlobalDt } from './SHJXF_GlobalDt';
const { ccclass, property } = _decorator;

@ccclass('SHJXF_Porp')
export class SHJXF_Porp extends Component {

    private originalPos: Vec3 = new Vec3(); //初始位置（本地坐标）

    protected onLoad(): void {

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }


    onTouchStart(event: EventTouch) {
        find("Canvas").getComponent(AudioSource).play();
        this.originalPos.set(this.node.position.x, this.node.position.y, 0);

    }

    onTouchMove(event: EventTouch) {
        if (this.node.name === "1") {
            this.node.parent.parent.getChildByName("zhiyin1").active = false;
            this.node.parent.parent.getChildByName("zhiyin3").active = true;
        }

        if (this.node.name === "2") {
            this.node.parent.parent.getChildByName("zhiyin2").active = false;
            this.node.parent.parent.getChildByName("zhiyin3").active = true;

        }
        let touPos: Vec3 = new Vec3(event.getUILocation().x, event.getUILocation().y, 0);

        //转化成本地坐标
        let UItouPos: Vec3 = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(touPos);
        this.node.setPosition(UItouPos);
    }

    onTouchEnd(event: EventTouch) {
        console.log("抬起");

        let indexS: string = SHJXF_GlobalDt.Instance.curPropIndex.toString();
        let indexN: number = SHJXF_GlobalDt.Instance.curPropIndex;
        if (this.node.name === indexS) {//是当前需要的道具


            //拿到当前道具的触发节点 
            let curN: Node = SHJXF_GlobalDt.Instance.Trigger[indexN];
            //拿到节点的包围盒
            let transform = curN.getComponent(UITransform);
            if (transform.getBoundingBoxToWorld().contains(event.getUILocation())) {//如果松手时在道具的使用范围内,禁止点击，播放动画
                console.log("在包围盒内");
                //指引消失
                if (indexN <= 2) {
                    this.node.parent.parent.getChildByName("zhiyin3").active = false;
                }
                if (indexN === 3 || indexN === 4 || indexN === 5 || indexN === 6 || indexN === 11) {

                    this.node.parent.parent.parent.getChildByName("notTouch").active = true;
                    this.node.parent.getComponent(Animation).play();
                } else {
                    //禁止点击
                    this.node.parent.parent.getChildByName("notTouch").active = true;
                    //播放动画
                    this.node.getComponent(Animation).play();
                }

                // this.node.parent.parent.getChildByName("notTouch").active = true;

                //在全局数据中将当前需要的道具变成下一个道具
                SHJXF_GlobalDt.Instance.curPropIndex += 1;
                return;

            } else {//返回原位
                this.node.position = this.originalPos;
                return;
            }
        } else {
            if (indexN <= 2) {
                this.node.position = this.originalPos;
                return;
            }
            //拿到当前错误的触发节点 
            let curN: Node = SHJXF_GlobalDt.Instance.Trigger[0];
            //拿到节点的包围盒
            let transform = curN.getComponent(UITransform);
            if (transform.getBoundingBoxToWorld().contains(event.getUILocation())) {//如果松手时在"errorRange"节点的触发范围内，损失一次机会
                SHJXF_GlobalDt.Instance.curErrorNum += 1;
                this.node.position = this.originalPos;
                return;
            } else {
                this.node.position = this.originalPos;
                return;
            }
        }

        // if () {//不是当前需要的道具
        //     if () {//如果松手时在"errorRange"节点的触发范围内，损失一次机会

        //     } else {
        //         this.node.position = this.originalPos;
        //     }
        // }

        // this.node.position = this.originalPos;
    }
}


