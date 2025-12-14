import { _decorator, Component, EventTouch, find, Graphics, Mask, Node, sp, Sprite, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { ZZ_YZH } from './ZZ_YZH';
import { ZZ_GameManager } from './ZZ_GameManager';
const { ccclass, property } = _decorator;
const v3_0 = v3();
@ccclass('ZZ_YZH_Touch')
export class ZZ_YZH_Touch extends Component {
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
            this.graphics = find("Canvas/GameArea/椰子猴Panel/BodyMask/Mask").getComponent(Graphics);
            this.mask = find("Canvas/GameArea/椰子猴Panel/BodyMask/Mask").getComponent(Mask);
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

        if (this.node.name == "角磨机") {
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
                find("Canvas/GameArea/椰子猴Panel/Role/身体").active = true;
                find("Canvas/GameArea/椰子猴Panel/BodyMask").active = true;
                this.objective.destroy();
                this.node.destroy();
                ZZ_YZH.instance.round++
                ZZ_YZH.instance.loadTitle()
                ZZ_YZH.instance.loadPropsToRound();
            }

            if (this.node.name == "角磨机") {
                this.node.getChildByName("角磨机-启动").active = false;

                if (this._pos.length > 200) {
                    find("Canvas/GameArea/椰子猴Panel/Role/盖子").active = true;
                    find("Canvas/GameArea/椰子猴Panel/Role/下半身体").active = true;
                    this.objective.destroy();
                    this.node.destroy();
                    ZZ_YZH.instance.round++
                    ZZ_YZH.instance.loadTitle()
                    ZZ_YZH.instance.loadPropsToRound();

                } else {
                    tween(this.node)
                        .to(0.1, { position: this.pos })
                        .start();
                }
            }

            if (this.node.name == "锯子") {
                this.node.setPosition(2000, 2000)
                const node = find("Canvas/GameArea/椰子猴Panel/Role/锯子");
                const st = find("Canvas/GameArea/椰子猴Panel/Role/身体");
                const sp = st.getComponent(Sprite)

                tween(sp)
                    .to(0.9, { fillRange: 0 })
                    .call(() => {
                        st.destroy();
                    })
                    .start();
                node.active = true;
                tween(node)
                    .to(0.2, { position: new Vec3(320, -110) })
                    .call(() => {
                        node.eulerAngles = new Vec3(0, 0, -12);

                        tween(node)
                            .to(0.2, { position: new Vec3(190, -190) })
                            .call(() => {
                                node.eulerAngles = new Vec3(0, 0, -21);

                                tween(node)
                                    .to(0.2, { position: new Vec3(-50, -220) })
                                    .call(() => {
                                        node.eulerAngles = new Vec3(0, 0, -80);

                                        tween(node)
                                            .to(0.2, { position: new Vec3(-228, -16) })
                                            .call(() => {
                                                node.eulerAngles = new Vec3(0, 0, -100);

                                                tween(node)
                                                    .to(0.2, { position: new Vec3(-326, -82.719) })
                                                    .call(() => {
                                                        node.destroy();

                                                        const gz = find("Canvas/GameArea/椰子猴Panel/Role/盖子")
                                                        tween(gz).to(0.2, { eulerAngles: new Vec3(0, 0, -90) })
                                                            .call(() => {
                                                                gz.destroy();
                                                                this.node.destroy();
                                                                ZZ_YZH.instance.round++
                                                                ZZ_YZH.instance.loadTitle()
                                                                ZZ_YZH.instance.loadPropsToRound()
                                                            })
                                                            .start();
                                                    })
                                                    .start();
                                            })
                                            .start();
                                    })
                                    .start();
                            })
                            .start();
                    })
                    .start();
            }

            if (this.node.name == "头") {
                find("Canvas/GameArea/椰子猴Panel/Role/下半身体/头").active = true;
                this.node.destroy();
                ZZ_YZH.instance.round++
                ZZ_YZH.instance.loadTitle()
                ZZ_YZH.instance.loadPropsToRound()
            }

            if (this.node.name == "椰汁") {
                this.objective.getChildByName("椰汁").active = true;
                this.node.setPosition(2000, 2000)
                this.scheduleOnce(() => {
                    this.objective.getChildByName("椰汁").active = false;
                    this.objective.getChildByName("不开心表情").active = false;
                    this.objective.getChildByName("开心表情").active = true;
                    this.node.destroy();
                    ZZ_YZH.instance.round++
                    ZZ_YZH.instance.loadTitle()
                    ZZ_YZH.instance.loadPropsToRound()
                }, 1)
            }

            if (this.node.name == "遮阳帽") {
                find("Canvas/GameArea/椰子猴Panel/Role/下半身体/头/遮阳帽").active = true;
                this.node.destroy();
                ZZ_YZH.instance.round++
                ZZ_YZH.instance.loadTitle()
                ZZ_YZH.instance.loadPropsToRound()
            }

            if (this.node.name == "四肢") {
                find("Canvas/GameArea/椰子猴Panel/Role/四肢").active = true;
                find("Canvas/GameArea/椰子猴Panel/Role/手1").active = true;
                find("Canvas/GameArea/椰子猴Panel/Role/手2").active = true;
                find("Canvas/GameArea/椰子猴Panel/Role/脚1").active = true;
                find("Canvas/GameArea/椰子猴Panel/Role/脚2").active = true;
                this.node.destroy();
                ZZ_YZH.instance.round++
                ZZ_YZH.instance.loadTitle()
                ZZ_YZH.instance.loadPropsToRound()
            }

            if (this.node.name == "剪刀") {
                this.node.setPosition(2000, 2000)
                const jd = find("Canvas/GameArea/椰子猴Panel/剪刀");
                let sz = find("Canvas/GameArea/椰子猴Panel/Role/四肢").getComponent(Sprite)
                jd.active = true;
                jd.eulerAngles = new Vec3(0, 0, 136);
                jd.setPosition(410, -300)

                this.scheduleOnce(() => {
                    sz.fillRange = 0.7;
                    jd.eulerAngles = new Vec3(0, 0, 94);
                    jd.setPosition(70, -475)

                    this.scheduleOnce(() => {
                        sz.fillRange = 0.49;
                        jd.setPosition(-95, -490)

                        this.scheduleOnce(() => {
                            sz.fillRange = 0.3;
                            jd.eulerAngles = new Vec3(0, 0, 47);
                            jd.setPosition(-400, -240)

                            this.scheduleOnce(() => {
                                sz.fillRange = 0;
                                jd.destroy();
                                // this.node.destroy();
                                ZZ_YZH.instance.round++
                                ZZ_YZH.instance.loadTitle()
                                this.scheduleOnce(() => {
                                    find("Canvas/GameArea/椰子猴Panel/Role").destroy();
                                    const ani = find("Canvas/GameArea/椰子猴Panel/Ani")
                                    ani.active = true;
                                    const ske = ani.getComponent(sp.Skeleton)
                                    ske.setAnimation(0, "animation", false);
                                    const time = ZZ_GameManager.instance.playRoleAudio();
                                    this.scheduleOnce(() => {
                                        ZZ_GameManager.instance.gamePanel.Win();
                                    }, time)
                                }, 1)

                            }, 0.5)
                        }, 0.5)
                    }, 0.5)
                }, 0.5)
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


