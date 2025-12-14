import { _decorator, Component, EventTouch, find, Graphics, Mask, Node, quat, sp, Sprite, tween, UIOpacity, UITransform, v2, v3, Vec3 } from 'cc';
import { Quality } from 'db://assets/Scripts/Framework/Const/Constant';
import { ZZ_MGR } from './ZZ_MGR';
import { ZZ_GameManager } from './ZZ_GameManager';
const { ccclass, property } = _decorator;
const v3_0 = v3();

@ccclass('ZZ_MGR_Touch')
export class ZZ_MGR_Touch extends Component {

    @property(Node) objective: Node = null;


    private touchStartPos: Vec3 = new Vec3(); // 记录触摸起始位置
    private pos: Vec3 = new Vec3(); // 记录节点起始位置
    private gameArea: Node = null;

    private originalPositions: Map<Node, Vec3> = new Map();
    graphics: Graphics | null = null;
    mask: Mask | null = null;

    _pos: Vec3[] = []

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.gameArea = find("Canvas/GameArea");
    }

    onTouchStart(event: EventTouch) {
        ZZ_GameManager.instance.playButton();
        const touchLocation = new Vec3(event.getUILocation().x, event.getUILocation().y);
        this.touchStartPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(touchLocation);
        this.pos.set(this.node.position);

        if (this.node.name == "角磨机") {
            this.node.getChildByName("角磨机-启动").active = true;
            this.graphics = find("Canvas/GameArea/木棍人Panel/Wipe/Mask").getComponent(Graphics);
            this.mask = find("Canvas/GameArea/木棍人Panel/Wipe/Mask").getComponent(Mask);
            this.graphics.lineWidth = 100;
            find("Canvas/GameArea/木棍人Panel/Wipe").getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y), v3_0);
            this.graphics.moveTo(v3_0.x, v3_0.y);
        }
    }

    onTouchMove(event: EventTouch) {
        const touchMovePos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        const offset = new Vec3();
        Vec3.subtract(offset, touchMovePos, this.touchStartPos);

        const newPosition = new Vec3();
        Vec3.add(newPosition, this.touchStartPos, offset);

        this.node.setPosition(newPosition);

        if (this.node.name == "角磨机") {
            const bol = find("Canvas/GameArea/木棍人Panel/Wipe").getComponent(UITransform).getBoundingBox().contains(v2(touchMovePos.x, touchMovePos.y))
            if (bol) {
                find("Canvas/GameArea/木棍人Panel/Wipe").getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y), v3_0);
                this.graphics.lineTo(v3_0.x, v3_0.y);
                this.graphics.stroke();
                this._pos.push(v3_0);
                if (this._pos.length > 200) {
                    this.onTouchEnd(event);
                }
                console.log(this._pos);
            }
        }
    }

    onTouchEnd(event: EventTouch) {
        const touchEndPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        const bol = this.objective.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y))
        if (bol) {

            if (this.node.name == "身体" || this.node.name == "头") {
                ZZ_MGR.instance.hh++;
                if (ZZ_MGR.instance.hh == 2) {
                    ZZ_MGR.instance.round++;
                    ZZ_MGR.instance.loadPropsToRound();
                    ZZ_MGR.instance.loadTitle();
                }
                this.objective.getChildByName("Node").active = true;
                this.node.destroy()
            }

            if (this.node.name == "锯子") {
                this.node.setPosition(300, 150);
                const ywAni = find("Canvas/GameArea/木棍人Panel/烟雾Ani");
                ywAni.active = true;
                tween(this.node)
                    .to(0.5, { position: v3(-110, 250) })
                    .call(() => {
                        this.node.scale = v3(-1, 1, 1);
                        this.node.eulerAngles = v3(0, 0, -45);

                        tween(this.node)
                            .to(0.5, { position: v3(130, 0) })
                            .call(() => {
                                this.node.scale = v3(1, 1, 1);
                                this.node.eulerAngles = v3(0, 0, 20);

                                tween(this.node)
                                    .to(0.5, { position: v3(-130, -45) })
                                    .call(() => {
                                        this.node.scale = v3(-1, 1, 1);
                                        this.node.eulerAngles = v3(0, 0, -50);
                                        tween(this.node)
                                            .to(0.5, { position: v3(35, -240) })
                                            .call(() => {
                                                ywAni.active = false;
                                                find("Canvas/GameArea/木棍人Panel/身体-虚线").active = false;
                                                find("Canvas/GameArea/木棍人Panel/头-虚线").active = false;
                                                find("Canvas/GameArea/木棍人Panel/_锯子").active = true;
                                                ZZ_MGR.instance.round++;
                                                ZZ_MGR.instance.loadPropsToRound();
                                                ZZ_MGR.instance.loadTitle();
                                                this.node.destroy()
                                            }).start()
                                    })
                                    .start();
                            })
                            .start();
                    })
                    .start();

            }

            if (this.node.name == "吹风机") {
                this.node.setPosition(400, 25);
                let a = this.node.children[0];
                a.active = true;
                tween(a)
                    .to(0.5, { position: new Vec3(-750, 100, 0) })
                    .start();
                tween(a)
                    .to(0.5, { scale: new Vec3(3, 3, 3) })
                    .call(() => {
                        a.active = false;

                        const b = this.node.children[1];
                        b.active = true;
                        tween(b)
                            .to(0.5, { position: new Vec3(-750, 100, 0) })
                            .start();
                        tween(b)
                            .to(0.5, { scale: new Vec3(3, 3, 3) })
                            .call(() => {
                                b.active = false;

                                const c = this.node.children[2];
                                c.active = true;
                                tween(c)
                                    .to(0.5, { position: new Vec3(-750, 100, 0) })
                                    .start();
                                tween(c)
                                    .to(0.5, { scale: new Vec3(3, 3, 3) })
                                    .call(() => {
                                        c.active = false;
                                        ZZ_MGR.instance.round++;
                                        ZZ_MGR.instance.loadPropsToRound();
                                        ZZ_MGR.instance.loadTitle();
                                        this.node.destroy();
                                    })
                                    .start();
                            })
                            .start();
                    })
                    .start();
                const uio = this.objective.getChildByName("木屑").getComponent(UIOpacity);
                tween(uio)
                    .to(1.5, { opacity: 0 })
                    .call(() => {
                        uio.node.destroy();
                    })
                    .start()
            }

            if (this.node.name == "刻刀") {
                this.node.setPosition(195, 0)
                this.scheduleOnce(() => {
                    this.node.eulerAngles = v3(0, 0, 120);
                    this.node.setPosition(130, 335)
                    this.scheduleOnce(() => {
                        this.node.eulerAngles = v3(0, 0, -84);
                        this.node.setPosition(-67, 12)
                        this.scheduleOnce(() => {
                            this.node.eulerAngles = v3(0, 0, 0);
                            this.node.setPosition(20, 12)
                            this.scheduleOnce(() => {
                                this.node.eulerAngles = v3(0, 0, 180);
                                this.node.setPosition(-235, 297)
                                this.scheduleOnce(() => {
                                    this.node.setPosition(-152, 120)
                                    this.scheduleOnce(() => {
                                        this.node.eulerAngles = v3(0, 0, 137)
                                        this.node.setPosition(-3, 168)
                                        this.scheduleOnce(() => {
                                            this.node.eulerAngles = v3(0, 0, 0)
                                            this.node.setPosition(100, -120)
                                            this.scheduleOnce(() => {
                                                ZZ_MGR.instance.round++;
                                                ZZ_MGR.instance.loadPropsToRound();
                                                ZZ_MGR.instance.loadTitle();
                                                this.node.destroy()
                                            }, 0.2)
                                        }, 0.2)
                                    }, 0.2)
                                }, 0.2)
                            }, 0.2)
                        }, 0.2)
                    }, 0.2)
                }, 0.2)

                const uio = this.objective.getChildByName("face").getComponent(UIOpacity)
                tween(uio)
                    .to(1.5, { opacity: 255 })
                    .call(() => {
                        find("Canvas/GameArea/木棍人Panel/Wipe").active = true;
                        find("Canvas/GameArea/木棍人Panel/_角磨机").active = true;
                        find("Canvas/GameArea/木棍人Panel/_锯子").destroy();

                    })
                    .start()

            }

            // if (this.node.name == "角磨机") {
            //     // find("Canvas/GameArea/木棍人Panel/烟雾Ani").active = true;
            //     this.node.setPosition(v3(220, -210))
            //     tween(this.node)
            //         .to(0.5, { position: v3(220, 210) })
            //         .call(() => {
            //             this.objective.getComponent(Sprite).fillRange = 0.66

            //             tween(this.node)
            //                 .to(0.5, { position: v3(80, 210) })
            //                 .to(0.5, { position: v3(80, -210) })
            //                 .call(() => {
            //                     this.objective.getComponent(Sprite).fillRange = 0.33

            //                     tween(this.node)
            //                         .to(0.5, { position: v3(-35, -210) })
            //                         .to(0.5, { position: v3(-35, 210) })
            //                         .call(() => {
            //                             ZZ_MGR.instance.round++;
            //                             ZZ_MGR.instance.loadPropsToRound();
            //                             ZZ_MGR.instance.loadTitle();
            //                             this.objective.getComponent(Sprite).fillRange = 0;
            //                             find("Canvas/GameArea/木棍人Panel/烟雾Ani").active = false;
            //                             this.objective.destroy();
            //                             this.node.destroy();
            //                         })
            //                         .start()
            //                 })
            //                 .start()
            //         })
            //         .start()
            // }

            try {
                if (this.node.name == "角磨机") {
                    if (this._pos.length > 200) {
                        ZZ_MGR.instance.round++;
                        ZZ_MGR.instance.loadPropsToRound();
                        ZZ_MGR.instance.loadTitle();
                        find("Canvas/GameArea/木棍人Panel/Wipe").destroy()
                        this.node.destroy();
                    } else {
                        tween(this.node)
                            .to(0.1, { position: this.pos })
                            .start();
                    }
                }
            } catch (error) {
                console.log("touchEnd", error);
            }




            if (this.node.name == "眼睛") {
                this.objective.getChildByName("眼睛").active = true;
                ZZ_MGR.instance.round++;
                ZZ_MGR.instance.loadPropsToRound();
                ZZ_MGR.instance.loadTitle();
                this.node.destroy();
            }

            if (this.node.name == "鼻子") {
                this.objective.getChildByName("鼻子").active = true;
                ZZ_MGR.instance.round++;
                ZZ_MGR.instance.loadPropsToRound();
                ZZ_MGR.instance.loadTitle();
                this.node.destroy();
            }

            if (this.node.name == "脚") {
                find("Canvas/GameArea/木棍人Panel/脚").active = true;
                ZZ_MGR.instance.round++;
                ZZ_MGR.instance.loadPropsToRound();
                ZZ_MGR.instance.loadTitle();
                this.node.destroy();
            }

            if (this.node.name == "右手") {
                this.objective.getChildByName("右手").active = true;
                ZZ_MGR.instance.round++;
                ZZ_MGR.instance.loadPropsToRound();
                ZZ_MGR.instance.loadTitle();
                this.node.destroy();
            }

            if (this.node.name == "木棍") {
                this.node.setPosition(2000, 2000)
                find("Canvas/GameArea/木棍人Panel/手拿木棍").active = true;
                this.scheduleOnce(() => {
                    find("Canvas/GameArea/木棍人Panel/脚").destroy();
                    find("Canvas/GameArea/木棍人Panel/_角磨机").destroy();
                    find("Canvas/GameArea/木棍人Panel/手拿木棍").active = false;
                    const ani = find("Canvas/GameArea/木棍人Panel/Ani")
                    ani.active = true;
                    const ske = ani.getComponent(sp.Skeleton)
                    ske.setAnimation(0, "animation", true)
                    ZZ_MGR.instance.round++;
                    ZZ_MGR.instance.loadTitle();
                    const time = ZZ_GameManager.instance.playRoleAudio();
                    this.scheduleOnce(() => {
                        this.node.destroy();
                        ZZ_GameManager.instance.gamePanel.Win();
                    }, time)
                }, 1)
            }
        }
        else {
            tween(this.node)
                .to(0.1, { position: this.pos })
                .start();
        }
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}




