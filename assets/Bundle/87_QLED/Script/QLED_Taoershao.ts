import { _decorator, Component, EventTouch, Node, UITransform, v3, Vec3 } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { QLED_GameMgr } from './QLED_GameMgr';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('QLED_Taoershao')
export class QLED_Taoershao extends Component {

    @property({ type: [Node] })
    ershiNodes: Node[] = [];

    @property(Node)
    erwoNodes: Node[] = [];

    private curErshi: Node = null;
    private startPos: Vec3 = null;
    private box: Node = null;

    private wrongNum: number = 0;
    private isWrong: boolean = false;

    start() {

        this.startPos = this.node.worldPosition.clone();

        this.box = this.node.getChildByName("box");

        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);

        // this.conlider.on("onTriggerEnter", this.onTriggerEnter, this);
    }


    touchStart(event: EventTouch) {
        // 获取触摸位置
        const touchPos = event.getUILocation();

        // 设置节点位置
        this.node.worldPosition = v3(touchPos.x, touchPos.y, 0);

    }

    touchMove(event: EventTouch) {
        if (this.isWrong) {
            return;
        }

        // 获取触摸位置
        const touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        // 计算偏移量
        const offset = v3(touchPos.x, touchPos.y, 0).subtract(this.startPos);
        // 设置节点位置
        this.node.worldPosition = offset.add(this.startPos);

        let boxPointX = this.box.worldPosition.clone().x;
        let boxPointY = this.box.worldPosition.clone().y + 10;

        this.isHitEar(boxPointX, boxPointY);

        //挖耳勺上有耳屎时return
        if (this.curErshi) {
            this.curErshi.worldPosition = this.box.worldPosition.clone().add(v3(0, 20, 0));
            return;
        }

        //是否掏到耳屎
        for (let i = 0; i < this.ershiNodes.length; i++) {
            let uiTrans = this.ershiNodes[i].getComponent(UITransform);
            let pointX = this.ershiNodes[i].worldPosition.x - uiTrans.width / 2;
            let pointY = this.ershiNodes[i].worldPosition.y - uiTrans.height / 2;

            if (boxPointX > pointX
                && boxPointY > pointY
                && boxPointX < pointX + uiTrans.width
                && boxPointY < pointY + uiTrans.height) {

                this.curErshi = this.ershiNodes[i];

                this.curErshi.worldPosition = this.box.worldPosition.clone().add(v3(0, 20, 0));

                QLED_GameMgr.instance.getErshi();
                return;
            }
        }
    }

    touchEnd(event: EventTouch) {

        if (this.curErshi) {

            let index = this.ershiNodes.indexOf(this.curErshi);
            if (index != -1) {
                this.ershiNodes.splice(index, 1);
            }

            this.curErshi.destroy();
            this.curErshi = null;

            if (this.ershiNodes.length <= 0) {
                console.log("成功!");
                QLED_GameMgr.instance.Ding();
            }
        }

        this.node.worldPosition = this.startPos;

        this.isWrong = false;

    }

    isHitEar(boxPointX, boxPointY) {
        for (let x = 0; x < this.erwoNodes.length; x++) {
            //是否碰到耳蜗
            let earUITrans = this.erwoNodes[x].getComponent(UITransform);
            let earPointX = this.erwoNodes[x].worldPosition.x - earUITrans.width / 2;
            let earPointY = this.erwoNodes[x].worldPosition.y - earUITrans.height / 2;

            if (boxPointX > earPointX
                && boxPointY > earPointY
                && boxPointX < earPointX + earUITrans.width
                && boxPointY < earPointY + earUITrans.height) {

                console.error("碰到耳蜗!");

                let clip = QLED_GameMgr.instance.lostClip;
                AudioManager.Instance.PlaySFX(clip);

                this.node.worldPosition = this.startPos;

                this.isWrong = true;

                this.wrongNum++;

                if (this.wrongNum == 2) {
                    console.log("失败!");
                    GamePanel.Instance.Lost();
                }
                return;
            }
        }

    }

}

