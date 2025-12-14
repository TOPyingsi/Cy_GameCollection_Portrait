import { _decorator, Collider2D, Component, director, EventTouch, ITriggerEvent, Node, UITransform, v2, v3, Vec3 } from 'cc';
import { NYSJ_GameManager } from './NYSJ_GameManager';
import { NYSJ_AudioMgr } from './NYSJ_AudioMgr';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('NYSJ_Niezi')
export class NYSJ_Niezi extends Component {
    @property(Node)
    public SJK: Node = null;

    private isGet: boolean[] = [false, false, false, false];
    private jiaodaiNode: Node = null;
    private jiaodaiWidth: number = 100;

    private startPos: Vec3 = null;
    start() {

        this.scheduleOnce(() => {
            this.startPos = this.node.worldPosition.clone();

            this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
            this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
            this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
            this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        }, 1);



        // this.conlider.on("onTriggerEnter", this.onTriggerEnter, this);
    }


    touchStart(event: EventTouch) {
        // 获取触摸位置
        const touchPos = event.getUILocation();

        // 设置节点位置
        this.node.worldPosition = v3(touchPos.x, touchPos.y, 0);

    }

    touchMove(event: EventTouch) {
        // 获取触摸位置
        const touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        // 计算偏移量
        const offset = new Vec3(touchPos.x, touchPos.y, 0).subtract(this.startPos);
        // 设置节点位置
        this.node.worldPosition = offset.add(this.startPos);

        if (this.jiaodaiNode) {
            this.jiaodaiNode.worldPosition = this.node.worldPosition.clone();
            return;
        }

        let uiTrans = this.SJK.getComponent(UITransform);
        let pointX = this.SJK.worldPosition.x - uiTrans.width / 2 - this.jiaodaiWidth;
        let pointY = this.SJK.worldPosition.y - uiTrans.height / 2 - this.jiaodaiWidth;

        if (touchPos.x >= pointX
            && touchPos.y >= uiTrans.height + pointY + this.jiaodaiWidth
            && touchPos.x <= uiTrans.width + pointX + 2 * this.jiaodaiWidth
            && touchPos.y <= uiTrans.height + pointY + 2 * this.jiaodaiWidth
            && this.isGet[0] == false) {
            console.log("碰到1了");

            this.jiaodaiNode = NYSJ_GameManager.instance.jiaodai.children[0];

            NYSJ_AudioMgr.instance.playEffect("镊子撕开");
            this.isGet[0] = true;

            return;

        }

        if (touchPos.x >= pointX
            && touchPos.y >= pointY
            && touchPos.x <= uiTrans.width + pointX + 2 * this.jiaodaiWidth
            && touchPos.y <= pointY + 2 * this.jiaodaiWidth
            && this.isGet[1] == false) {
            console.log("碰到2了");

            this.jiaodaiNode = NYSJ_GameManager.instance.jiaodai.children[1];

            NYSJ_AudioMgr.instance.playEffect("镊子撕开");
            this.isGet[1] = true;

            return;
        }

        if (touchPos.x >= pointX
            && touchPos.y >= pointY
            && touchPos.x <= pointX + this.jiaodaiWidth
            && touchPos.y <= uiTrans.height + pointY + 2 * this.jiaodaiWidth
            && this.isGet[2] == false) {
            console.log("碰到3了");

            this.jiaodaiNode = NYSJ_GameManager.instance.jiaodai.children[2];

            NYSJ_AudioMgr.instance.playEffect("镊子撕开");
            this.isGet[2] = true;

            return;
        }

        if (touchPos.x >= uiTrans.width + pointX + this.jiaodaiWidth
            && touchPos.y >= pointY
            && touchPos.x <= uiTrans.width + pointX + 2 * this.jiaodaiWidth
            && touchPos.y <= uiTrans.height + pointY + 200
            && this.isGet[3] == false) {
            console.log("碰到4了");

            this.jiaodaiNode = NYSJ_GameManager.instance.jiaodai.children[3];

            NYSJ_AudioMgr.instance.playEffect("镊子撕开");
            this.isGet[3] = true;

            return;
        }

    }

    touchEnd(event: EventTouch) {

        // this.jiaodaiNode.destroy();
        if (this.jiaodaiNode) {
            this.jiaodaiNode.active = false;
            this.jiaodaiNode = null;
        }

        this.node.worldPosition = this.startPos;

        let getNum = 0;

        for (let i = 0; i < this.isGet.length; i++) {
            if (this.isGet[i]) {
                getNum++;
            }
            if (getNum === 4) {
                NYSJ_GameManager.instance.nextStep();

                NYSJ_AudioMgr.instance.right();
            }
        }
    }

}


