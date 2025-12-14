import { _decorator, Component, EventTouch, find, Graphics, Mask, Node, sp, tween, UIOpacity, UITransform, v2, v3, Vec3 } from 'cc';
import { ZZ_JZ } from './ZZ_JZ';
import { ZZ_GameManager } from './ZZ_GameManager';
const { ccclass, property } = _decorator;
const v3_0 = v3();

@ccclass('ZZ_JZ_Touch')
export class ZZ_JZ_Touch extends Component {
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

        if (this.node.name == "刷子") {
            this.graphics = find("Canvas/GameArea/橘子Panel/Role/腿Mask/Mask").getComponent(Graphics);
            this.mask = find("Canvas/GameArea/橘子Panel/Role/腿Mask/Mask").getComponent(Mask);
            this.graphics.lineWidth = 100;
            find("Canvas/GameArea/橘子Panel/Role/腿Mask").getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y), v3_0);
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

        if (this.node.name == "刷子") {
            const bol = find("Canvas/GameArea/橘子Panel/Role/腿Mask").getComponent(UITransform).getBoundingBox().contains(v2(touchMovePos.x, touchMovePos.y))
            if (bol) {
                find("Canvas/GameArea/橘子Panel/Role/腿Mask").getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y), v3_0);
                this.graphics.lineTo(v3_0.x, v3_0.y);
                this.graphics.stroke();
                this._pos.push(v3_0);
                if (this._pos.length > 100) {
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

            try {
                if (this.node.name == "橘子头") {
                    find("Canvas/GameArea/橘子Panel/Role/橘子头").active = true;
                    this.node.destroy()
                    ZZ_JZ.instance.round++;
                    ZZ_JZ.instance.loadPropsToRound()
                    ZZ_JZ.instance.loadTitle()
                }

                if (this.node.name == "催化") {
                    this.node.setPosition(350, 60)
                    const pw = this.node.getChildByName("喷雾");
                    const w = this.node.getChildByName("雾");
                    const n = find("Canvas/GameArea/橘子Panel/Role/正常橘子头")

                    this.scheduleOnce(() => {
                        pw.active = true
                        w.active = true
                        this.scheduleOnce(() => {
                            pw.active = false
                            w.active = false
                            this.scheduleOnce(() => {
                                pw.active = true
                                w.active = true
                                this.scheduleOnce(() => {
                                    pw.active = false
                                    w.active = false
                                    this.scheduleOnce(() => {
                                        pw.active = true
                                        w.active = true
                                        this.scheduleOnce(() => {
                                            pw.active = false
                                            w.active = false
                                            this.node.setPosition(-400, 166)
                                            this.node.setScale(-1, 1, 1);
                                            n.getComponent(UIOpacity).opacity = 88;

                                            this.scheduleOnce(() => {
                                                pw.active = true
                                                w.active = true
                                                this.scheduleOnce(() => {
                                                    pw.active = false
                                                    w.active = false
                                                    this.scheduleOnce(() => {
                                                        pw.active = true
                                                        w.active = true
                                                        this.scheduleOnce(() => {
                                                            pw.active = false
                                                            w.active = false
                                                            this.scheduleOnce(() => {
                                                                pw.active = true
                                                                w.active = true
                                                                this.scheduleOnce(() => {
                                                                    n.getComponent(UIOpacity).opacity = 166;
                                                                    pw.active = false
                                                                    w.active = false
                                                                    this.node.setPosition(-276, -276)
                                                                    this.node.eulerAngles = new Vec3(0, 0, 30);

                                                                    this.scheduleOnce(() => {
                                                                        pw.active = true
                                                                        w.active = true
                                                                        this.scheduleOnce(() => {
                                                                            pw.active = false
                                                                            w.active = false
                                                                            this.scheduleOnce(() => {
                                                                                pw.active = true
                                                                                w.active = true
                                                                                this.scheduleOnce(() => {
                                                                                    pw.active = false
                                                                                    w.active = false
                                                                                    this.scheduleOnce(() => {
                                                                                        pw.active = true
                                                                                        w.active = true
                                                                                        this.scheduleOnce(() => {
                                                                                            n.getComponent(UIOpacity).opacity = 255;
                                                                                            find("Canvas/GameArea/橘子Panel/Role/正常橘子头1").active = true;
                                                                                            pw.active = false
                                                                                            w.active = false
                                                                                            this.objective.destroy();
                                                                                            this.node.destroy()
                                                                                            ZZ_JZ.instance.round++;
                                                                                            ZZ_JZ.instance.loadPropsToRound()
                                                                                            ZZ_JZ.instance.loadTitle()

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

                if (this.node.name == "叶子") {
                    find("Canvas/GameArea/橘子Panel/Role/虚线").destroy();
                    this.objective.active = true;
                    this.node.destroy()
                    ZZ_JZ.instance.round++;
                    ZZ_JZ.instance.loadPropsToRound()
                    ZZ_JZ.instance.loadTitle()
                }

                if (this.node.name == "哭哭表情") {
                    this.objective.active = true;
                    this.node.destroy()
                    ZZ_JZ.instance.round++;
                    ZZ_JZ.instance.loadPropsToRound()
                    ZZ_JZ.instance.loadTitle()
                }

                if (this.node.name == "橙汁") {
                    this.node.setPosition(2000, 2000);
                    const cz = find("Canvas/GameArea/橘子Panel/Role/橙汁")
                    cz.active = true;
                    this.scheduleOnce(() => {
                        cz.active = false;
                        find("Canvas/GameArea/橘子Panel/Role/哭哭表情").destroy();
                        find("Canvas/GameArea/橘子Panel/Role/开心表情").active = true;
                        this.node.destroy()
                        ZZ_JZ.instance.round++;
                        ZZ_JZ.instance.loadPropsToRound()
                        ZZ_JZ.instance.loadTitle()
                    }, 1)
                }

                if (this.node.name == "未穿鞋子双腿") {
                    this.objective.active = true;
                    this.node.destroy();
                    ZZ_JZ.instance.round++;
                    ZZ_JZ.instance.loadPropsToRound();
                    ZZ_JZ.instance.loadTitle();
                }

                if (this.node.name == "双手") {
                    find("Canvas/GameArea/橘子Panel/Role/双手").active = true;
                    this.node.destroy();
                    ZZ_JZ.instance.round++;
                    ZZ_JZ.instance.loadPropsToRound();
                    ZZ_JZ.instance.loadTitle();
                }

                if (this.node.name == "鞋子") {
                    console.log("鞋子")
                    this.node.destroy();
                    find("Canvas/GameArea/橘子Panel/Role/腿").active = true;
                    find("Canvas/GameArea/橘子Panel/Role/腿Mask").active = true;
                    ZZ_JZ.instance.round++;
                    ZZ_JZ.instance.loadPropsToRound();
                    ZZ_JZ.instance.loadTitle();
                }

                if (this.node.name == "刷子") {
                    if (this._pos.length > 100) {
                        ZZ_JZ.instance.round++;
                        ZZ_JZ.instance.loadPropsToRound();
                        ZZ_JZ.instance.loadTitle();
                        find("Canvas/GameArea/橘子Panel/Role/腿Mask").active = false;
                        this.node.destroy();
                    } else {
                        tween(this.node)
                            .to(0.1, { position: this.pos })
                            .start();
                    }
                }

                if (this.node.name == "哑铃") {
                    this.node.setPosition(2000, 2000);
                    find("Canvas/GameArea/橘子Panel/Role/双手").active = false;
                    find("Canvas/GameArea/橘子Panel/Role/双手1").active = true;
                    const s1 = find("Canvas/GameArea/橘子Panel/Role/双手1/手1");
                    const s2 = find("Canvas/GameArea/橘子Panel/Role/双手1/手2");

                    tween(s1)
                        .to(0.1, { eulerAngles: new Vec3(0, 0, -10) })
                        .to(0.1, { eulerAngles: new Vec3(0, 0, 10) })
                        .union()
                        .repeat(3)
                        .start();

                    tween(s2)
                        .to(0.1, { eulerAngles: new Vec3(0, 0, 10) })
                        .to(0.1, { eulerAngles: new Vec3(0, 0, -10) })
                        .union()
                        .repeat(3)
                        .call(() => {
                            find("Canvas/GameArea/橘子Panel/Role/双手1").destroy();
                            find("Canvas/GameArea/橘子Panel/Role/双手2").active = true;
                            // this.node.setPosition
                            find("Canvas/GameArea/橘子Panel/Role").destroy();
                            const ani = find("Canvas/GameArea/橘子Panel/Ani");
                            ani.active = true;
                            this.scheduleOnce(() => {
                                const ske = ani.getComponent(sp.Skeleton);
                                ske.setAnimation(0, "animation", false);
                                ZZ_JZ.instance.round++;
                                ZZ_JZ.instance.loadTitle();
                                const time = ZZ_GameManager.instance.playRoleAudio();
                                this.scheduleOnce(() => {
                                    ZZ_GameManager.instance.gamePanel.Win();
                                }, time)
                            }, 1)
                        })
                        .start()
                }
            } catch (error) {
                console.log(error)
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


