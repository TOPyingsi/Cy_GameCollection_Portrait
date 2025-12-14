import { _decorator, Component, director, easing, EventTouch, Node, tween, UITransform, v3, Vec3 } from 'cc';
import NYSJ_ClearMask from './NYSJ_ClearMask';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { NYSJ_AudioMgr } from './NYSJ_AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('NYSJ_GameManager')
export class NYSJ_GameManager extends Component {

    @property(Node)
    public FinnalNode: Node = null;
    @property(Node)
    public wrongNode: Node = null;


    public index: number = 0;
    public stepIndex: number = 0;

    public static instance: NYSJ_GameManager = null;

    public stepsTs: NYSJ_ClearMask[] = [];
    public stepsNode: Node[] = [];
    public decoration: Node[] = [];
    public jiaodai: Node = null;

    private decorateNum: number = 0;
    private phoneNode: Node = null;
    private phonePos: Vec3 = null;

    start() {
        NYSJ_GameManager.instance = this;

        this.initData();

    }

    update(deltaTime: number) {

    }

    initData() {
        this.decoration = this.node.getChildByName("Game").getChildByName("Finnal").children;
        director.getScene().on("奶油手机_贴装饰", (ID: number) => {
            this.decorateNum++;
            this.decoration[ID - 1].active = true;
            if (this.decorateNum === 1 || this.decorateNum === 10 || this.decorateNum === 11) {
                this.nextStep();
            }
        });

        let stepNum = this.node.getChildByName("Game").children.length;
        for (let i = 0; i < stepNum; i++) {
            let ticketNode = this.node.getChildByName("Game").children[i];
            if (ticketNode.name.startsWith("Ticket")) {
                let step = ticketNode.getComponent(NYSJ_ClearMask);
                this.stepsTs.push(step);
            }
            if (ticketNode.name === "胶带卷") {
                this.jiaodai = ticketNode;
            }
        }

        let propNum = this.node.getChildByName("prop").children.length;
        for (let j = 0; j < propNum; j++) {
            let prop = this.node.getChildByName("prop").children[j];
            if (prop.name.startsWith("step")) {
                this.stepsNode.push(prop);
            }

        }

        console.log(this.stepsNode);
        console.log(this.stepsTs);
        console.log(this.jiaodai);

        tween(this.stepsNode[0])
            .by(0.8, { position: v3(1080, 0, 0) }, { easing: 'backOut' })
            .start();
    }

    nextClear(ID: number) {
        this.index++;
        if (ID === 8) {
            this.nextStep();
            return;
        }

        // if (this.index >= 4) {
        //     this.stepsTs[this.index - 1].node.active = true;
        //     return;
        // }

        // this.stepsTs[this.index].node.active = true;

        this.stepsTs[ID].isLock = false;
        this.stepsTs[ID].node.active = true;
    }

    nextStep() {
        let preNode = this.stepsNode[this.stepIndex++];
        tween(preNode)
            .by(0.8, { position: v3(1080, 0, 0) }, { easing: 'backOut' })
            .call(() => {
                preNode.active = false;
            })
            .start();

        let nextNode = this.stepsNode[this.stepIndex];
        nextNode.active = true;
        if (this.stepIndex === 6) {
            tween(nextNode)
                .by(0.8, { position: v3(810, 0, 0) }, { easing: 'backOut' })
                .start();

            this.phoneNode = this.node.getChildByName("Game");
            tween(this.phoneNode)
                .by(0.8, { position: v3(160, -150, 0) }, { easing: 'backOut' })
                .call(() => {
                    this.phonePos = this.phoneNode.worldPosition.clone();
                    this.phoneNode.setSiblingIndex(3);
                })
                .start();

            this.phoneNode.on(Node.EventType.TOUCH_MOVE, this.onPhoneTouchMove, this);
            this.phoneNode.on(Node.EventType.TOUCH_END, this.onPhoneTouchEnd, this);
        }
        tween(nextNode)
            .by(0.8, { position: v3(1080, 0, 0) }, { easing: 'backOut' })
            .start();
    }

    touchPhone: boolean = false;
    onPhoneTouchMove(event: EventTouch) {
        if (this.touchPhone) {
            return;
        }

        // 获取触摸位置
        const touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        // 计算偏移量
        const offset = new Vec3(touchPos.x, touchPos.y, 0).subtract(this.phonePos);
        // 设置节点位置
        this.phoneNode.worldPosition = offset.add(this.phonePos);


        let uiTrans = this.FinnalNode.getComponent(UITransform);
        let pointX = this.FinnalNode.worldPosition.x - uiTrans.width / 2;
        let pointY = this.FinnalNode.worldPosition.y - uiTrans.height / 2;

        if (touchPos.x >= pointX && touchPos.y >= pointY
            && touchPos.x <= uiTrans.width + pointX
            && touchPos.y <= uiTrans.height + pointY) {
            this.touchPhone = true;
        }
    }

    onPhoneTouchEnd() {
        if (this.touchPhone) {
            NYSJ_AudioMgr.instance.right();

            this.phoneNode.worldPosition = this.FinnalNode.worldPosition.clone();

            tween(this.FinnalNode)
                .to(1, { position: v3(0, 0, 0) })
                .start();

            tween(this.phoneNode)
                .to(1, { position: v3(0, 0, 0) })
                .call(() => {
                    this.phoneNode.getChildByName("Shine").active = true;
                    this.node.getChildByName("win").active = true;
                    this.scheduleOnce(() => {
                        GamePanel.Instance.Win();
                    }, 3);
                })
                .start();
        }

        this.phoneNode.worldPosition = this.phonePos;
    }

    wrong() {
        this.wrongNode.active = true;
        this.wrongNode.scale = v3(0, 0, 0);
        tween(this.wrongNode)
            .to(0.8, { scale: v3(1, 1, 1) }, { easing: "backOut" })
            .call(() => {
                tween(this.wrongNode)
                    .to(0.5, { scale: v3(0, 0, 0) }, { easing: "backOut" })
                    .call(() => {
                        this.wrongNode.active = false;
                    })
                    .start();
            })
            .start();
    }
}


