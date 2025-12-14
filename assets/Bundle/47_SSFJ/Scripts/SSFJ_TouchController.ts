import { _decorator, Component, EventTouch, Node, sp, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { SSFJ_GameManager } from './SSFJ_GameManager';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
const { ccclass, property } = _decorator;

@ccclass('SSFJ_TouchController')
export class SSFJ_TouchController extends Component {
    public static Instance: SSFJ_TouchController;

    // private sgm = SSFJ_GameManager.Instance;

    private currentProp: Node = null;
    private propInitialPos: Vec3 = null;
    isTouchEnabled: boolean = true;

    private count: number = 0;

    isTouch: boolean = true;

    @property([Node])
    props: Node[] = []


    @property(Node)
    mom: Node = null;

    @property(Node)
    dad: Node = null;

    @property(Node)
    nezha: Node = null;

    nezhaske: sp.Skeleton = null
    momske: sp.Skeleton = null;
    dadske: sp.Skeleton = null;

    @property(Node)
    RightBG: Node = null;

    @property(Node)
    Door: Node = null;

    @property(Node)
    Table: Node = null;

    @property(Node)
    Shelf: Node = null;

    @property(Node)
    Cabinet: Node = null;

    @property(Node)
    Cabinet_T: Node = null;

    @property(Node)
    Windom: Node = null;

    @property(Node)
    Bad: Node = null;

    @property(Node)
    Sheet_T: Node = null;

    winCount = 0;

    x: boolean = true;
    y: boolean = true;

    protected onLoad(): void {
        this.nezhaske = this.nezha.getComponent(sp.Skeleton);
        this.momske = this.mom.getComponent(sp.Skeleton);
        this.dadske = this.dad.getComponent(sp.Skeleton);

        SSFJ_TouchController.Instance = this;
        {
            this.setmomske("散发", 1);
            this.setmomske("盘发", 0);
            this.setmomske("正装", 0);
            this.setmomske("睡衣", 1);
        }
        {
            this.setdadske("裸体", 1);
            this.setdadske("正装", 0);
        }
    }

    setmomske(name: string, a: number) {
        this.momske.findSlot(name).color.a = a;
    }
    setdadske(name: string, a: number) {
        this.dadske.findSlot(name).color.a = a;
    }

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
    }

    touchStart(event: EventTouch) {

        if (!this.isTouchEnabled || this.isTouch) return;
        const touchPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));

        const isWindom = this.Windom.getComponent(UITransform).getBoundingBox().contains(v2(touchPos.x, touchPos.y));
        const isCabinet = this.Cabinet.getComponent(UITransform).getBoundingBox().contains(v2(touchPos.x, touchPos.y));
        if (isWindom) {
            this.Windom.active = false;
            NodeUtil.GetNode("Windom_T", this.node).active = true;
            NodeUtil.GetNode("Sheet_T", this.node).active = true;
        } else if (isCabinet) {
            this.Cabinet.active = false;
            NodeUtil.GetNode("Cabinet_T", this.node).active = true;
            NodeUtil.GetNode("Clothes_T", this.node).active = true;
        }

        this.props.forEach((prop) => {
            if (prop != null && prop.active) {
                const isContains = prop.getComponent(UITransform).getBoundingBox().contains(v2(touchPos.x, touchPos.y));
                if (isContains) {
                    this.currentProp = prop;
                    this.propInitialPos = prop.position.clone();
                }
            }
        });
    }

    touchMove(event: EventTouch) {
        if (!this.isTouchEnabled || !this.currentProp) return;
        const touchPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        this.currentProp.setPosition(touchPos);
    }

    touchEnd(event: EventTouch) {
        if (!this.isTouchEnabled || !this.currentProp) return;
        const touchPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));

        // const isWindom = this.Windom.getComponent(UITransform).getBoundingBox().contains(v2(touchPos.x, touchPos.y));
        const isRightBG = this.RightBG.getComponent(UITransform).getBoundingBox().contains(v2(touchPos.x, touchPos.y));
        const isDoor = this.Door.getComponent(UITransform).getBoundingBox().contains(v2(touchPos.x, touchPos.y));
        const iTable = this.Table.getComponent(UITransform).getBoundingBox().contains(v2(touchPos.x, touchPos.y));
        const isShelf = this.Shelf.getComponent(UITransform).getBoundingBox().contains(v2(touchPos.x, touchPos.y));
        const isCabinet_T = this.Cabinet_T.getComponent(UITransform).getBoundingBox().contains(v2(touchPos.x, touchPos.y));
        const isBad = this.Bad.getComponent(UITransform).getBoundingBox().contains(v2(touchPos.x, touchPos.y));
        const isDad = this.dad.getComponent(UITransform).getBoundingBox().contains(v2(touchPos.x, touchPos.y));
        const isMom = this.mom.getComponent(UITransform).getBoundingBox().contains(v2(touchPos.x, touchPos.y));
        const isSheet_T = this.Sheet_T.getComponent(UITransform).getBoundingBox().contains(v2(touchPos.x, touchPos.y));


        if (this.currentProp.name == "变") {
            if (isDoor && this.Door.active) {
                this.Door.active = false;
                this.currentProp.active = false;

                this.nezhaske.setAnimation(0, "走路", true);
                this.nezha
                tween(this.nezha)
                    .to(2, { position: new Vec3(100, -500) })
                    .call(() => {
                        if (this.winCount >= 9) {
                            this.nezhaske.setAnimation(0, "kaixing", true);
                            SSFJ_GameManager.Instance.gameOver(true);
                        } else {
                            this.nezhaske.setAnimation(0, "shenqi", true);
                            SSFJ_GameManager.Instance.gameOver(false);
                        }
                    })
                    .start();


            } else if (iTable && this.Table.active) {
                this.Table.active = false;
                NodeUtil.GetNode("Table_T", this.node).active = true;
                SSFJ_GameManager.Instance.playAudio("食物要换正常的食物");
                this.currentProp.active = false;

                this.winCount++;

            } else if (isShelf && this.Shelf.active) {
                this.Shelf.active = false;
                NodeUtil.GetNode("Shelf_T", this.node).active = true;
                SSFJ_GameManager.Instance.playAudio("一些小情趣罢了，可不能让吒儿发现");
                this.currentProp.active = false;

                this.winCount++;

            } else if (isCabinet_T && this.Cabinet_T.active) {
                this.Cabinet_T.active = false;
                NodeUtil.GetNode("Cabinet_On_T", this.node).active = true;
                // NodeUtil.GetNode("Clothes_T", this.node).active = true;
                SSFJ_GameManager.Instance.playAudio("换个正常的柜子");
                this.currentProp.active = false;

                this.winCount++;

            } else if (isMom && this.x) {
                this.x = false;
                this.setmomske("散发", 0);
                this.setmomske("盘发", 1);
                SSFJ_GameManager.Instance.playAudio("清理下自己");
                this.currentProp.active = false;

                this.winCount++;

            } else if (isBad && this.Bad.active) {
                this.Bad.active = false;
                NodeUtil.GetNode("Bad_T", this.node).active = true;
                SSFJ_GameManager.Instance.playAudio("换回原来的床");
                this.currentProp.active = false;

                this.winCount++;

            } else if (isDad && this.y) {
                this.y = false;
                this.setdadske("裸体", 0);
                this.setdadske("正装", 1);
                SSFJ_GameManager.Instance.playAudio("亲爱的，换身得体的衣服");
                this.currentProp.active = false;

                this.winCount++;

            } else if (isSheet_T && this.Sheet_T.active) {
                this.Sheet_T.active = false;
                SSFJ_GameManager.Instance.playAudio("来不及晒干了，赶紧丢掉");
                this.currentProp.active = false;

                this.winCount++;

            } else if (isRightBG && this.RightBG.active) {
                this.RightBG.active = false;
                NodeUtil.GetNode("RightBG_T", this.node).active = true;
                SSFJ_GameManager.Instance.playAudio("清理下地板");
                this.currentProp.active = false;

                this.winCount++;

            } else {
                tween(this.currentProp)
                    .to(0.1, { position: this.propInitialPos })
                    .start();
            }

        } else if (this.currentProp.name == "Clothes_T") {
            const isMom = this.mom.getComponent(UITransform).getBoundingBox().contains(v2(touchPos.x, touchPos.y));
            if (isMom) {
                this.currentProp.active = false;
                this.setmomske("正装", 1);
                this.setmomske("睡衣", 0);
                SSFJ_GameManager.Instance.playAudio("换身得体的衣服");
                this.winCount++;

            } else {
                tween(this.currentProp)
                    .to(0.1, { position: this.propInitialPos })
                    .start();
            }
        }
        this.currentProp = null;
        this.propInitialPos = null;
    }


    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.node.off(Node.EventType.TOUCH_END, this.touchEnd, this);
    }
}


