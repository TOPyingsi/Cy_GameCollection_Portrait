import { _decorator, AnimationComponent, Component, EventTouch, Node, UITransform, v3, Vec3 } from 'cc';
import { QLYC_GameMgr } from './QLYC_GameMgr';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('QLYC_Tongs')
export class QLYC_Tongs extends Component {

    @property(Node)
    FinnalNode: Node = null;

    @property(Node)
    taoNode: Node = null;

    private toothNode: Node = null;
    private toothNum: number = 0;

    private startPos: Vec3 = null;
    private isPickup: boolean = false;
    private isTaoShow: boolean = false;

    start() {

        this.startPos = this.node.worldPosition.clone();

        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);

        // this.conlider.on("onTriggerEnter", this.onTriggerEnter, this);
    }


    touchStart(event: EventTouch) {

        QLYC_GameMgr.instance.playSFX("物品");

        // 获取触摸位置
        const touchPos = event.getUILocation();

        // 设置节点位置
        this.node.worldPosition = v3(touchPos.x, touchPos.y, 0);

    }

    touchMove(event: EventTouch) {

        //正在夹取
        if (this.isPickup) {
            return;
        }

        // 获取触摸位置
        const touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        // 计算偏移量
        const offset = new Vec3(touchPos.x, touchPos.y, 0).subtract(this.startPos);
        // 设置节点位置
        this.node.worldPosition = offset.add(this.startPos);

        //戴牙套步骤
        if (QLYC_GameMgr.instance.taoStart && this.node.name === "牙套工具") {

            if (this.isTaoShow) {
                this.Braces(touchPos);
                return;
            }

            let ani = this.taoNode.getComponent(AnimationComponent);

            ani.on(AnimationComponent.EventType.PLAY, () => {
                QLYC_GameMgr.instance.taoStart = false;
            })

            ani.on(AnimationComponent.EventType.FINISHED, () => {

                this.isTaoShow = true;

                QLYC_GameMgr.instance.taoStart = true;

            }, this);

            ani.play();

        }

        //拔牙步骤没到
        if (!QLYC_GameMgr.instance.toothStart) {
            return;
        }

        this.extractTooth(touchPos);
    }

    //戴牙套
    Braces(touchPos: Vec3) {

        for (let j = 0; j < QLYC_GameMgr.instance.bracesNodes.length; j++) {

            let obj = QLYC_GameMgr.instance.bracesMap.get("牙套" + j.toString());

            //判断当前是否碰到未戴上的牙套
            if (!obj[1]) {
                let uiTrans = obj[0].getComponent(UITransform);
                let pointX = obj[0].worldPosition.x - uiTrans.width / 2;
                let pointY = obj[0].worldPosition.y - uiTrans.height / 2;

                //鼠标位置是否在牙套包围盒内
                if (touchPos.x > pointX
                    && touchPos.y > pointY
                    && touchPos.x < pointX + uiTrans.width
                    && touchPos.y < pointY + uiTrans.height) {
                    obj[0].active = true;

                    obj[1] = true;

                    this.isPickup = true;

                    this.node.worldPosition = this.startPos;

                    QLYC_GameMgr.instance.bracesNum++;

                    QLYC_GameMgr.instance.playEffect("牙套");

                    if (QLYC_GameMgr.instance.bracesNum === 6) {
                        let ani = this.FinnalNode.getComponent(AnimationComponent);

                        ani.on(AnimationComponent.EventType.FINISHED, () => {

                            this.scheduleOnce(() => {
                                GamePanel.Instance.Win();
                            }, 1);

                        }, this);

                        ani.play();

                        return;
                    }

                }

            }

        }
    }

    //拔牙
    extractTooth(touchPos) {

        if (QLYC_GameMgr.instance.taoStart) {
            return;
        }

        for (let i = 0; i < QLYC_GameMgr.instance.toothNodes.length; i++) {

            let obj = QLYC_GameMgr.instance.toothMap.get("牙齿" + i.toString());

            //未被摘除
            if (!obj[1]) {
                let uiTrans = obj[0].getComponent(UITransform);
                let pointX = obj[0].worldPosition.x - uiTrans.width / 2;
                let pointY = obj[0].worldPosition.y - uiTrans.height / 2;

                if (touchPos.x > pointX
                    && touchPos.y > pointY
                    && touchPos.x < pointX + uiTrans.width
                    && touchPos.y < pointY + uiTrans.height) {

                    obj[1] = true;

                    obj[2].on(AnimationComponent.EventType.FINISHED, () => {

                        this.toothNum++;
                        if (this.toothNum === 4) {
                            console.log("拔完牙齿了");

                            QLYC_GameMgr.instance.taoStart = true;
                        }

                    }, this);

                    obj[2].play();

                    QLYC_GameMgr.instance.playEffect("牙钳");

                    this.isPickup = true;

                    this.node.worldPosition = this.startPos;

                    return;
                }
            }

        }

    }

    touchEnd(event: EventTouch) {
        QLYC_GameMgr.instance.stopSFX();

        if (this.toothNode) {
            this.toothNode.active = false;
            this.toothNode = null;
        }

        this.node.worldPosition = this.startPos;

        this.isPickup = false;
    }
}


