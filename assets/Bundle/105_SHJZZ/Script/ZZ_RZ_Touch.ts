import { _decorator, Component, EventTouch, find, Graphics, Mask, Node, sp, tween, UIOpacity, UITransform, v2, v3, Vec3 } from 'cc';
import { ZZ_RZ } from './ZZ_RZ';
import { ZZ_GameManager } from './ZZ_GameManager';
const { ccclass, property } = _decorator;
const v3_0 = v3();

@ccclass('ZZ_RZ_Touch')
export class ZZ_RZ_Touch extends Component {

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

        if (this.node.name == "抹布" || this.node.name == "磨刀石") {
            this.graphics = this.objective.getChildByName("Mask").getComponent(Graphics);
            this.mask = this.objective.getChildByName("Mask").getComponent(Mask);
            this.graphics.lineWidth = 100;
            this.objective.getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y), v3_0);
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

        if (this.node.name == "抹布" || this.node.name == "磨刀石") {
            const bol = this.objective.getComponent(UITransform).getBoundingBox().contains(v2(touchMovePos.x, touchMovePos.y))
            if (bol) {
                this.objective.getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y), v3_0);
                this.graphics.lineTo(v3_0.x, v3_0.y);
                this.graphics.stroke();
                this._pos.push(v3_0);
                if (this._pos.length > 200) {
                    this.onTouchEnd(event);
                }
                console.log(this._pos.length)
            }
        }
    }

    onTouchEnd(event: EventTouch) {
        const touchEndPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        const bol = this.objective.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y))
        if (bol) {

            if (this.node.name == "身体") {
                find("Canvas/GameArea/忍者Panel/描边").destroy();
                this.objective.getChildByName("脏").active = true;
            }

            if (this.node.name == "Top套子" || this.node.name == "身体" || this.node.name == "不开心") {
                this.objective.getChildByName(this.node.name).active = true;
                this.node.destroy()
                ZZ_RZ.instance.round++;
                ZZ_RZ.instance.loadPropsToRound()
                ZZ_RZ.instance.loadTitle()
            }

            if (this.node.name == "Bottom套子") {
                this.objective.getChildByName(this.node.name).active = true;
                this.objective.getChildByName("脏").active = false;
                find("Canvas/GameArea/忍者Panel/BodyMask").active = true;;
                this.node.destroy()
                ZZ_RZ.instance.round++;
                ZZ_RZ.instance.loadPropsToRound()
                ZZ_RZ.instance.loadTitle()
            }

            if (this.node.name == "手") {
                this.objective.getChildByName("左手").active = true;
                this.objective.getChildByName("右手").active = true;
                this.node.destroy()
                ZZ_RZ.instance.round++;
                ZZ_RZ.instance.loadPropsToRound()
                ZZ_RZ.instance.loadTitle()
            }

            if (this.node.name == "脚") {
                this.objective.getChildByName("左脚").active = true;
                this.objective.getChildByName("右脚").active = true;
                this.node.destroy()
                ZZ_RZ.instance.round++;
                ZZ_RZ.instance.loadPropsToRound()
                ZZ_RZ.instance.loadTitle()
            }

            if (this.node.name == "刀") {
                this.objective.getChildByName("左刀").active = true;
                this.objective.getChildByName("右刀").active = true;
                find("Canvas/GameArea/忍者Panel/KinfeMask").active = true;
                this.node.destroy()
                ZZ_RZ.instance.round++;
                ZZ_RZ.instance.loadPropsToRound()
                ZZ_RZ.instance.loadTitle()
            }

            if (this.node.name == "清洁剂") {
                this.node.setPosition(350, 60)
                const ps = this.node.getChildByName("喷水");
                const yd = this.node.getChildByName("喷雾云朵");

                this.scheduleOnce(() => {
                    ps.active = true
                    yd.active = true
                    this.scheduleOnce(() => {
                        ps.active = false
                        yd.active = false
                        this.scheduleOnce(() => {
                            ps.active = true
                            yd.active = true
                            this.scheduleOnce(() => {
                                ps.active = false
                                yd.active = false
                                this.scheduleOnce(() => {
                                    ps.active = true
                                    yd.active = true
                                    this.scheduleOnce(() => {
                                        ps.active = false
                                        yd.active = false
                                        this.node.setPosition(-400, 166)
                                        this.node.setScale(-1, 1, 1);

                                        this.scheduleOnce(() => {
                                            ps.active = true
                                            yd.active = true
                                            this.scheduleOnce(() => {
                                                ps.active = false
                                                yd.active = false
                                                this.scheduleOnce(() => {
                                                    ps.active = true
                                                    yd.active = true
                                                    this.scheduleOnce(() => {
                                                        ps.active = false
                                                        yd.active = false
                                                        this.scheduleOnce(() => {
                                                            ps.active = true
                                                            yd.active = true
                                                            this.scheduleOnce(() => {
                                                                ps.active = false
                                                                yd.active = false
                                                                this.node.setPosition(-276, -276)
                                                                this.node.eulerAngles = new Vec3(0, 0, 30);

                                                                this.scheduleOnce(() => {
                                                                    ps.active = true
                                                                    yd.active = true
                                                                    this.scheduleOnce(() => {
                                                                        ps.active = false
                                                                        yd.active = false
                                                                        this.scheduleOnce(() => {
                                                                            ps.active = true
                                                                            yd.active = true
                                                                            this.scheduleOnce(() => {
                                                                                ps.active = false
                                                                                yd.active = false
                                                                                this.scheduleOnce(() => {
                                                                                    ps.active = true
                                                                                    yd.active = true
                                                                                    this.scheduleOnce(() => {
                                                                                        ps.active = false
                                                                                        yd.active = false
                                                                                        find("Canvas/GameArea/忍者Panel/BodyMask").active = true;
                                                                                        this.objective.destroy();
                                                                                        this.node.destroy()
                                                                                        ZZ_RZ.instance.round++;
                                                                                        ZZ_RZ.instance.loadPropsToRound()
                                                                                        ZZ_RZ.instance.loadTitle()

                                                                                    }, 0.1)
                                                                                }, 0.1)
                                                                            }, 0.1)
                                                                        }, 0.1)
                                                                    }, 0.1)
                                                                }, 0.1)

                                                            }, 0.1)
                                                        }, 0.1)
                                                    }, 0.1)
                                                }, 0.1)
                                            }, 0.1)
                                        }, 0.1)

                                    }, 0.1)
                                }, 0.1)
                            }, 0.1)
                        }, 0.1)
                    }, 0.1)
                }, 0.1)
            }

            if (this.node.name == "抹布" || this.node.name == "磨刀石") {
                if (this._pos.length > 200) {
                    this.objective.destroy();
                    this.node.destroy();
                    ZZ_RZ.instance.round++;
                    ZZ_RZ.instance.loadPropsToRound()
                    ZZ_RZ.instance.loadTitle()

                } else {
                    tween(this.node)
                        .to(0.1, { position: this.pos })
                        .start();
                }
            }

            if (this.node.name == "棒棒糖") {
                this.objective.getChildByName("开心表情").active = true;
                this.objective.getChildByName("不开心").active = false;
                this.node.destroy();
                ZZ_RZ.instance.round++;
                ZZ_RZ.instance.loadPropsToRound()
                ZZ_RZ.instance.loadTitle()
            }

            if (this.node.name == "金漆") {
                this.node.setPosition(350, 60)
                const ps = this.node.getChildByName("喷水");
                const yd = this.node.getChildByName("喷雾云朵");

                const uio1 = this.objective.getChildByName("黄金套1").getComponent(UIOpacity)
                const uio2 = this.objective.getChildByName("黄金套2").getComponent(UIOpacity)

                tween(uio1)
                    .to(1.5, { opacity: 255 })
                    .start();

                tween(uio2)
                    .to(1.5, { opacity: 255 })
                    .call(() => {
                        const ani = find("Canvas/GameArea/忍者Panel/Ani")
                        ani.active = true;
                        find("Canvas/GameArea/忍者Panel/Role").active = false;
                        this.scheduleOnce(() => {
                            const ske = ani.getComponent(sp.Skeleton);
                            ske.setAnimation(0, "animation", true);
                            ZZ_RZ.instance.round++;
                            ZZ_RZ.instance.loadTitle()
                            const time = ZZ_GameManager.instance.playRoleAudio();
                            this.scheduleOnce(() => {
                                ZZ_GameManager.instance.gamePanel.Win();
                            }, time)
                        }, 1)
                    })
                    .start();

                this.scheduleOnce(() => {
                    ps.active = true
                    yd.active = true
                    this.scheduleOnce(() => {
                        ps.active = false
                        yd.active = false
                        this.scheduleOnce(() => {
                            ps.active = true
                            yd.active = true
                            this.scheduleOnce(() => {
                                ps.active = false
                                yd.active = false
                                this.scheduleOnce(() => {
                                    ps.active = true
                                    yd.active = true
                                    this.scheduleOnce(() => {
                                        ps.active = false
                                        yd.active = false
                                        this.node.setPosition(-400, 166)
                                        this.node.setScale(-1, 1, 1);

                                        this.scheduleOnce(() => {
                                            ps.active = true
                                            yd.active = true
                                            this.scheduleOnce(() => {
                                                ps.active = false
                                                yd.active = false
                                                this.scheduleOnce(() => {
                                                    ps.active = true
                                                    yd.active = true
                                                    this.scheduleOnce(() => {
                                                        ps.active = false
                                                        yd.active = false
                                                        this.scheduleOnce(() => {
                                                            ps.active = true
                                                            yd.active = true
                                                            this.scheduleOnce(() => {
                                                                ps.active = false
                                                                yd.active = false
                                                                this.node.setPosition(-276, -276)
                                                                this.node.eulerAngles = new Vec3(0, 0, 30);

                                                                this.scheduleOnce(() => {
                                                                    ps.active = true
                                                                    yd.active = true
                                                                    this.scheduleOnce(() => {
                                                                        ps.active = false
                                                                        yd.active = false
                                                                        this.scheduleOnce(() => {
                                                                            ps.active = true
                                                                            yd.active = true
                                                                            this.scheduleOnce(() => {
                                                                                ps.active = false
                                                                                yd.active = false
                                                                                this.scheduleOnce(() => {
                                                                                    ps.active = true
                                                                                    yd.active = true
                                                                                    this.scheduleOnce(() => {
                                                                                        ps.active = false
                                                                                        yd.active = false
                                                                                        this.objective.destroy();
                                                                                        this.node.setPosition(2000, 2000)

                                                                                    }, 0.1)
                                                                                }, 0.1)
                                                                            }, 0.1)
                                                                        }, 0.1)
                                                                    }, 0.1)
                                                                }, 0.1)

                                                            }, 0.1)
                                                        }, 0.1)
                                                    }, 0.1)
                                                }, 0.1)
                                            }, 0.1)
                                        }, 0.1)

                                    }, 0.1)
                                }, 0.1)
                            }, 0.1)
                        }, 0.1)
                    }, 0.1)
                }, 0.1)
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


