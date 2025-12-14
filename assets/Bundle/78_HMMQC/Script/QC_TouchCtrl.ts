import { _decorator, Component, Event, EventTouch, find, Node, quat, tween, Tween, UIOpacity, UITransform, v2, v3, Vec3 } from 'cc';
import { QC_GameManager } from './QC_GameManager';
import { QC_AudioManager } from './QC_AudioManager';
import { QC_Ani } from './QC_Ani';
const { ccclass, property } = _decorator;

@ccclass('QC_TouchCtrl')
export class QC_TouchCtrl extends Component {

    @property(Node) gameArea: Node = null;
    @property(Node) objective_befor: Node = null;
    @property(Node) objective_after: Node = null;

    private originalPos: Vec3 = new Vec3();
    private siblingIndex: number = 0;
    private touchOriginalPos: Vec3 = new Vec3();

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        console.log("touch start", this.node.name)
        const touchStartPos = this.gameArea.getComponent(UITransform)
            .convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        if (this.node.name == "被子") {
            this.touchOriginalPos = touchStartPos;
        }

        // else if (this.node.name == "开关") {
        // if (QC_GameManager.instance.iskg) {
        //     return;
        // }
        // QC_GameManager.instance.mask.active = true;
        // QC_GameManager.instance.iskg = true;
        // QC_GameManager.instance.hh();
        // this.originalPos = this.node.position.clone();
        // const x = find("Canvas/GameArea/BG/台灯/灯光")
        // const uio = x.getComponent(UIOpacity)
        // tween(uio)
        //     .to(0.1, { opacity: 255 })
        //     .to(0.1, { opacity: 0 })
        //     .union().repeat(5)
        //     .call(() => {
        //         const time = QC_AudioManager.instance.playAudio("我数到三快点给我关灯")
        //         QC_GameManager.instance.setLabel(false, "我数到三快点给我关灯", time)
        //         this.objective_after.active = true;
        //         this.objective_befor.active = false;
        //         this.scheduleOnce(() => {
        //             this.objective_after.active = false;
        //             this.objective_befor.active = true;
        //             QC_GameManager.instance.mask.active = false;
        //         }, time)
        //     })
        //     .start();

        // }

        else {
            this.originalPos = this.node.position.clone();
            this.siblingIndex = this.node.getSiblingIndex()
            this.node.setSiblingIndex(99);
            Tween.stopAllByTarget(this.node);
        }
    }

    onTouchMove(event: EventTouch) {
        if (this.node.name == "被子" || this.node.name == "开关") {

        } else {
            const touchMovePos = this.gameArea.getComponent(UITransform)
                .convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
            this.node.setPosition(touchMovePos.x, touchMovePos.y);
        }

    }

    onTouchEnd(event: EventTouch) {
        QC_GameManager.instance.mask.active = true;
        const touchEndPos = this.gameArea.getComponent(UITransform)
            .convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        if (this.node.name == "开关") {
            QC_Ani.instance.kg(this.objective_after, this.objective_befor);
            console.log("开关", QC_GameManager.instance.iskg)
            // if (QC_GameManager.instance.iskg) {
            //     QC_GameManager.instance.mask.active = false;
            //     return;
            // }
            // console.error("开关")
            // QC_GameManager.instance.iskg = true;
            // QC_GameManager.instance.hh();
            // this.originalPos = this.node.position.clone();
            // const x = find("Canvas/GameArea/BG/台灯/灯光")
            // const uio = x.getComponent(UIOpacity)
            // tween(uio)
            //     .to(0.1, { opacity: 255 })
            //     .to(0.1, { opacity: 0 })
            //     .union().repeat(5)
            //     .call(() => {
            //         const time = QC_AudioManager.instance.playAudio("我数到三快点给我关灯")
            //         QC_GameManager.instance.setLabel(false, "我数到三快点给我关灯", time)
            //         this.objective_after.active = true;
            //         this.objective_befor.active = false;

            //     })
            //     .start();
            // this.scheduleOnce(() => {
            //     this.objective_after.active = false;
            //     this.objective_befor.active = true;
            //     QC_GameManager.instance.mask.active = false;
            // }, 2)
        }

        if (this.node.name == "遥控器") {
            const ds = find("Canvas/GameArea/BG/电视")
            const isDs = ds.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y))
            if (isDs) {
                this.node.active = false;
                ds.children[0].active = true
                let time = QC_AudioManager.instance.playAudio("电视")

                this.scheduleOnce(() => {
                    time = QC_AudioManager.instance.playAudio("你真是三天不打上房揭瓦")
                    QC_GameManager.instance.setLabel(false, "你真是三天不打上房揭瓦", time)
                    this.objective_after.active = true;
                    this.objective_befor.active = false;
                    this.scheduleOnce(() => {
                        console.log("结束")
                        QC_GameManager.instance.mask.active = false;
                        Tween.stopAll();
                        QC_GameManager.instance.gamePanel.Lost();
                    }, time)
                })
            } else {
                console.log("结束")
                QC_GameManager.instance.mask.active = false;
                this.node.setPosition(this.originalPos)
            }

        } else {
            const bol = this.objective_befor.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y))

            if (bol) {
                if (QC_GameManager.instance.isbz) {
                    this.objective_befor.children[0].active = false;
                    this.objective_after.children[0].active = false;
                }
                if (QC_Ani.instance.isjd) {
                    this.objective_after.getChildByName("脚红肿").active = true;
                    this.objective_befor.getChildByName("脚红肿").active = true;
                }
                let time: number = 0;
                switch (this.node.name) {
                    case "响拨":
                        this.node.setPosition(250, 30)
                        this.node.children.forEach(child => {
                            child.active = true;
                        });
                        time = QC_AudioManager.instance.playAudio("敲锣")
                        QC_GameManager.instance.lcTween(this.k.bind(this))

                        break;

                    case "闹钟":
                        this.node.setPosition(250, 30)
                        this.node.children[0].active = true;
                        time = QC_AudioManager.instance.playAudio("闹钟")

                        this.scheduleOnce(() => {
                            QC_Ani.instance.nz(this.objective_after, this.objective_befor)
                            this.node.active = false;
                        }, time)
                        break;

                    case "羽毛":
                        this.node.setPosition(160, -140)
                        this.node.rotation = quat(0, 0, -35);
                        tween(this.node)
                            .to(0.2, { eulerAngles: v3(0, 0, -55) })
                            .to(0.2, { eulerAngles: v3(0, 0, -35) })
                            .union()
                            .repeat(3)
                            .call(() => {
                                this.node.active = false;
                                time = QC_AudioManager.instance.playAudio("乖女儿，让我再睡几分钟")
                                QC_GameManager.instance.setLabel(false, "乖女儿，让我再睡几分钟", time)

                                this.objective_after.active = true;
                                this.objective_befor.active = false;
                                QC_GameManager.instance.hh()

                                this.scheduleOnce(() => {
                                    console.log("结束")
                                    QC_GameManager.instance.mask.active = false;
                                    this.objective_after.active = false;
                                    this.objective_befor.active = true;
                                }, time)
                            })
                            .start();
                        break;

                    case "木棍":
                        this.node.setPosition(-230, -205)
                        this.node.children[0].active = true;
                        tween(this.node)
                            .to(0.2, { eulerAngles: v3(0, 0, -80) })
                            .to(0.2, { eulerAngles: v3(0, 0, -40) })
                            .union()
                            .repeat(3)
                            .call(() => {
                                this.node.children[0].active = false;
                                this.node.active = false;
                                time = QC_AudioManager.instance.playAudio("等我睡醒了再教训你")
                                QC_GameManager.instance.setLabel(false, "等我睡醒了再教训你", time)

                                this.objective_after.active = true;
                                this.objective_befor.active = false;
                                QC_GameManager.instance.hh()

                                this.scheduleOnce(() => {
                                    console.log("结束")
                                    QC_GameManager.instance.mask.active = false;
                                    this.objective_after.active = false;
                                    this.objective_befor.active = true;
                                }, time)
                            })
                            .start();
                        break;

                    case "手机":
                        this.node.setPosition(260, -320)
                        this.node.children[0].active = true;
                        time = QC_AudioManager.instance.playAudio("吵死了，什么破手机")
                        QC_GameManager.instance.setLabel(false, "吵死了，什么破手机", time)
                        this.scheduleOnce(() => {
                            this.node.active = false;
                            QC_Ani.instance.sj(this.objective_after, this.objective_befor, time)
                        }, 1)
                        break;

                    // case "开关":

                    //     break;

                    case "被子":
                        if (this.touchOriginalPos.y >= touchEndPos.y + 50) {
                            tween(this.node)
                                .to(0.2, { position: v3(this.originalPos.x, this.originalPos.y - 50, this.originalPos.z) })
                                .call(() => {
                                    this.node.active = false;
                                    QC_GameManager.instance.isbz = true;
                                    if (QC_GameManager.instance.isbz) {
                                        this.objective_befor.children[0].active = false;
                                        this.objective_after.children[0].active = false;
                                    }
                                    time = QC_AudioManager.instance.playAudio("还是有点困，你在等我一会儿")
                                    QC_GameManager.instance.setLabel(false, "还是有点困，你在等我一会儿", time)

                                    this.objective_after.active = true;
                                    this.objective_befor.active = false;
                                    QC_GameManager.instance.hh()

                                    this.scheduleOnce(() => {
                                        QC_GameManager.instance.mask.active = false;
                                        this.objective_after.active = false;
                                        this.objective_befor.active = true;
                                    }, time)
                                }).start()
                        } else {
                            QC_GameManager.instance.mask.active = false;
                        }
                        break;
                    case "蚊子":
                        this.node.setPosition(335, -60);
                        this.node.setScale(v3(-1, 1, 1))
                        time = QC_AudioManager.instance.playAudio("哪来的臭蚊子，别耽误我睡觉")
                        QC_GameManager.instance.setLabel(false, "哪来的臭蚊子，别耽误我睡觉", time)

                        this.objective_after.active = true;
                        this.objective_befor.active = false;
                        QC_GameManager.instance.hh()

                        this.scheduleOnce(() => {
                            this.node.active = false;
                            QC_GameManager.instance.mask.active = false;
                            this.objective_after.active = false;
                            this.objective_befor.active = true;
                        }, time)
                        break;

                    case "鸡":
                        this.node.setPosition(260, -320)
                        this.node.children[0].active = true;
                        time = QC_AudioManager.instance.playAudio("好困，再让我眯一会")
                        QC_GameManager.instance.setLabel(false, "好困，再让我眯一会", time)
                        this.scheduleOnce(() => {
                            this.node.active = false;
                            QC_Ani.instance.j(this.objective_after, this.objective_befor, time)
                        }, 1)
                        break;

                    case "高跟鞋":
                        time = QC_AudioManager.instance.playAudio("好臭的鞋等我醒来洗洗它")
                        QC_GameManager.instance.setLabel(false, "好臭的鞋等我醒来洗洗它", time)
                        this.node.active = false;

                        this.objective_after.active = true;
                        this.objective_befor.active = false;
                        QC_GameManager.instance.hh()

                        this.scheduleOnce(() => {
                            QC_GameManager.instance.mask.active = false;
                            this.objective_after.active = false;
                            this.objective_befor.active = true;
                        }, time)
                        break;

                    case "胶带":
                        this.node.active = false;
                        find("Canvas/GameArea/BG/胶带-001").active = true;
                        this.scheduleOnce(() => {
                            find("Canvas/GameArea/BG/胶带-001").active = false;
                            QC_Ani.instance.jd(this.objective_after, this.objective_befor)
                        }, 1)
                        break;
                }
            }
            else {
                if (this.node.name == "开关") {

                } else {
                    this.node.setPosition(this.originalPos)
                    this.node.setSiblingIndex(this.siblingIndex)
                    console.log("else")
                    QC_GameManager.instance.mask.active = false;
                    if (this.node.name == "蚊子") {
                        QC_GameManager.instance.wzTween();
                    }
                }
            }
        }
    }

    k() {
        this.node.active = false;
        let time = QC_AudioManager.instance.playAudio("你真是三天不打上房揭瓦")
        QC_GameManager.instance.setLabel(false, "你真是三天不打上房揭瓦", time)
        this.objective_after.active = true;
        this.objective_befor.active = false;
        this.scheduleOnce(() => {
            QC_GameManager.instance.mask.active = false;
            Tween.stopAll();
            QC_GameManager.instance.gamePanel.Lost();
        }, time)
    }

}


