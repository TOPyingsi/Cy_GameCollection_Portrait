import { _decorator, Component, EventTouch, find, Graphics, Mask, Node, sp, tween, UIOpacity, UITransform, v2, v3, Vec3 } from 'cc';
import { ZZ_KF } from './ZZ_KF';
import { ZZ_Wipe } from './ZZ_Wipe';
import { ZZ_GameManager } from './ZZ_GameManager';
const { ccclass, property } = _decorator;
const v3_0 = v3();

@ccclass('ZZ_KF_Tcouh')
export class ZZ_KF_Tcouh extends Component {
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

        if (this.node.name == "擦布") {
            this.graphics = find("Canvas/GameArea/咖啡Panel/Wipe/Mask").getComponent(Graphics);
            this.mask = find("Canvas/GameArea/咖啡Panel/Wipe/Mask").getComponent(Mask);
            this.graphics.lineWidth = 100;
            find("Canvas/GameArea/咖啡Panel/Wipe").getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y), v3_0);
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

        if (this.node.name == "擦布") {
            const bol = find("Canvas/GameArea/咖啡Panel/Wipe").getComponent(UITransform).getBoundingBox().contains(v2(touchMovePos.x, touchMovePos.y))
            if (bol) {
                find("Canvas/GameArea/咖啡Panel/Wipe").getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y), v3_0);
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

            if (this.node.name == "t1") {
                find("Canvas/GameArea/咖啡Panel/Wipe").active = true;
                find("Canvas/GameArea/咖啡Panel/t2").active = true;
                ZZ_KF.instance.round++;
                ZZ_KF.instance.loadPropsToRound();
                ZZ_KF.instance.loadTitle();
                this.node.destroy();
            }

            if (this.node.name == "擦布") {
                if (this._pos.length > 200) {
                    ZZ_KF.instance.round++;
                    ZZ_KF.instance.loadPropsToRound();
                    ZZ_KF.instance.loadTitle();
                    find("Canvas/GameArea/咖啡Panel/Wipe").active = false;
                    this.node.destroy();
                } else {
                    tween(this.node)
                        .to(0.1, { position: this.pos })
                        .start();
                }
            }

            if (this.node.name == "修复") {
                const uio = this.objective.getChildByName("胶水").getComponent(UIOpacity)
                this.node.destroy();
                tween(uio)
                    .to(0.5, { opacity: 255 })
                    .call(() => {
                        ZZ_KF.instance.round++;
                        ZZ_KF.instance.loadPropsToRound();
                        ZZ_KF.instance.loadTitle();
                    })
                    .start();
            }

            if (this.node.name == "吹风机") {
                this.node.setPosition(440, 220);
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
                                        ZZ_KF.instance.round++;
                                        ZZ_KF.instance.loadPropsToRound();
                                        ZZ_KF.instance.loadTitle();
                                        this.node.destroy();
                                    })
                                    .start();
                            })
                            .start();
                    })
                    .start();
                const uio = this.objective.getChildByName("t3").getComponent(UIOpacity);
                tween(uio)
                    .to(1.5, { opacity: 255 })
                    .start()
            }

            if (this.node.name == "咖啡豆") {
                this.objective.getChildByName("t4").active = true;
                ZZ_KF.instance.round++;
                ZZ_KF.instance.loadPropsToRound();
                ZZ_KF.instance.loadTitle();
                this.node.destroy();
            }

            if (this.node.name == "牛奶") {
                this.objective.getChildByName("t5").active = true;
                ZZ_KF.instance.round++;
                ZZ_KF.instance.loadPropsToRound();
                ZZ_KF.instance.loadTitle();
                this.node.destroy();
            }

            if (this.node.name == "face") {
                this.objective.getChildByName("face").active = true;
                ZZ_KF.instance.round++;
                ZZ_KF.instance.loadPropsToRound();
                ZZ_KF.instance.loadTitle();
                this.node.destroy();
            }

            if (this.node.name == "身体") {
                find("Canvas/GameArea/咖啡Panel/身体").active = true;
                ZZ_KF.instance.round++;
                ZZ_KF.instance.loadPropsToRound();
                ZZ_KF.instance.loadTitle();
                this.node.destroy();
            }

            if (this.node.name == "剪刀") {
                this.objective.destroy();
                find("Canvas/GameArea/咖啡Panel/身体").active = false;
                find("Canvas/GameArea/咖啡Panel/虚线").destroy();
                find("Canvas/GameArea/咖啡Panel/完整").active = true;
                ZZ_KF.instance.round++;
                ZZ_KF.instance.loadPropsToRound();
                ZZ_KF.instance.loadTitle();
                this.node.destroy();
            }

            if (this.node.name == "鞋子") {
                this.objective.destroy();
                find("Canvas/GameArea/咖啡Panel/t2").destroy();
                const ani = find("Canvas/GameArea/咖啡Panel/Ani");
                ani.active = true;
                this.node.setPosition(2025, 2025);
                this.scheduleOnce(() => {
                    ZZ_KF.instance.round++;
                    ZZ_KF.instance.loadTitle();
                    const ske = ani.getComponent(sp.Skeleton)
                    ske.setAnimation(0, "animation", true);
                    const time = ZZ_GameManager.instance.playRoleAudio();
                    this.scheduleOnce(() => {
                        ZZ_GameManager.instance.gamePanel.Win();
                    }, time);
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