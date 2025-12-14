import { _decorator, Component, director, EventTouch, find, Node, Tween, tween, UIOpacity, UITransform, v2, v3, Vec3 } from 'cc';
import { QXSHJ_RoleCtrl } from './QXSHJ_RoleCtrl';
import { QXSHJ_GameManager } from './QXSHJ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('QXSHJ_TouchCtrl')
export class QXSHJ_TouchCtrl extends Component {

    @property(Node) gameArea: Node = null;
    @property(Node) mgr: Node = null;
    @property(Node) rz: Node = null;

    private originalPos: Vec3 = new Vec3();
    private touchOriginalPos: Vec3 = new Vec3();
    private initalPos: Vec3 = new Vec3();

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        this.originalPos = this.node.getPosition(); // 初始化 originalPos

        const touchStartPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.touchOriginalPos = touchStartPos;
        this.initalPos = this.node.getPosition();
    }

    onTouchMove(event: EventTouch) {
        const touchMovePos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        const touchOffsetX = touchMovePos.x - this.touchOriginalPos.x;
        const touchOffsetY = touchMovePos.y - this.touchOriginalPos.y;

        this.node.setPosition(
            this.originalPos.x + touchOffsetX,
            this.originalPos.y + touchOffsetY
        );
    }

    onTouchEnd(event: EventTouch) {
        const touchEndPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        const ismgr = this.mgr.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y));
        const isrz = this.rz.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y));

        console.log("木棍人=》", ismgr, "忍者=》", isrz);

        if (ismgr) this.mgrHandler(event.target.name);
        else if (isrz) this.rzHandler(event.target.name);
        else this.node.setPosition(this.initalPos);
    }

    mgrHandler(str: string) {
        console.log("木头人", str)
        switch (str) {
            case "水枪":
                if (QXSHJ_GameManager.instance.mtrCount == 0) {
                    this.mgrPropTween();
                    this.scheduleOnce(() => {
                        QXSHJ_RoleCtrl.instance.activeMgr(QXSHJ_RoleCtrl.instance.mgr2)
                        QXSHJ_GameManager.instance.mtrCount++;
                    }, 0.75)
                } else {
                    this.node.setPosition(this.initalPos);
                    QXSHJ_GameManager.instance.updateHP();
                }
                break;

            case "肥皂":
                if (QXSHJ_GameManager.instance.mtrCount == 1) {
                    this.mgrPropTween();
                    this.scheduleOnce(() => {
                        QXSHJ_RoleCtrl.instance.activeMgr(QXSHJ_RoleCtrl.instance.mgr3)
                        QXSHJ_GameManager.instance.mtrCount++;
                    }, 0.75)
                } else {
                    this.node.setPosition(this.initalPos);
                    QXSHJ_GameManager.instance.updateHP();
                }
                break;

            case "海绵擦":
                if (QXSHJ_GameManager.instance.mtrCount == 2) {
                    this.mgrPropTween();
                    this.scheduleOnce(() => {
                        QXSHJ_RoleCtrl.instance.activeMgr(QXSHJ_RoleCtrl.instance.mgr4)
                        QXSHJ_RoleCtrl.instance.updateSlot(QXSHJ_RoleCtrl.instance.mgr4Ske, "钳子", 0)
                        QXSHJ_RoleCtrl.instance.updateSlot(QXSHJ_RoleCtrl.instance.mgr4Ske, "钳子1", 0)
                        QXSHJ_RoleCtrl.instance.updateSlot(QXSHJ_RoleCtrl.instance.mgr4Ske, "钳子2", 0)
                        QXSHJ_GameManager.instance.mtrCount++;
                    }, 0.75)
                } else {
                    this.node.setPosition(this.initalPos);
                    QXSHJ_GameManager.instance.updateHP();
                }
                break;

            case "钳子":
                if (QXSHJ_GameManager.instance.mtrCount == 3) {
                    this.node.active = false;
                    QXSHJ_RoleCtrl.instance.updateSlot(QXSHJ_RoleCtrl.instance.mgr4Ske, "钳子", 1)
                    QXSHJ_RoleCtrl.instance.updateSlot(QXSHJ_RoleCtrl.instance.mgr4Ske, "钳子1", 1)
                    QXSHJ_RoleCtrl.instance.updateSlot(QXSHJ_RoleCtrl.instance.mgr4Ske, "钳子2", 1)
                    QXSHJ_RoleCtrl.instance.mgr4Ske.setAnimation(0, "animation", false)

                    this.scheduleOnce(() => {
                        QXSHJ_RoleCtrl.instance.updateSlot(QXSHJ_RoleCtrl.instance.mgr4Ske, "钳子", 0)
                        QXSHJ_RoleCtrl.instance.updateSlot(QXSHJ_RoleCtrl.instance.mgr4Ske, "钳子1", 0)
                        QXSHJ_RoleCtrl.instance.updateSlot(QXSHJ_RoleCtrl.instance.mgr4Ske, "钳子2", 0)
                        this.node.destroy();
                        QXSHJ_GameManager.instance.mtrCount++;
                    }, 3)
                } else {
                    this.node.setPosition(this.initalPos);
                    QXSHJ_GameManager.instance.updateHP();
                }
                break;

            case "小刷子":
                if (QXSHJ_GameManager.instance.mtrCount == 4) {
                    this.mgrPropTween();
                    this.scheduleOnce(() => {
                        QXSHJ_RoleCtrl.instance.activeMgr(QXSHJ_RoleCtrl.instance.mgr6)
                        QXSHJ_GameManager.instance.mtrCount++;
                        find("Canvas/GameArea/Props_RZ").active = true;
                        this.mgr.active = false;
                        this.mgr.setPosition(1000, 1000)
                        QXSHJ_RoleCtrl.instance.loadRZ()
                    }, 0.75)
                } else {
                    this.node.setPosition(this.initalPos);
                    QXSHJ_GameManager.instance.updateHP();
                }
                break;

            default:
                console.error("没有这个角色", this.node.name);
                break;
        }
    }

    rzHandler(str: string) {
        console.log("忍者", str)
        switch (str) {
            case "水枪":
                if (QXSHJ_GameManager.instance.rzCount == 0) {
                    this.rzPropTween()
                    this.scheduleOnce(() => {
                        QXSHJ_RoleCtrl.instance.activeRz(QXSHJ_RoleCtrl.instance.rz2)
                        QXSHJ_GameManager.instance.rzCount++;
                    }, 0.75)
                } else {
                    this.node.setPosition(this.initalPos);
                    QXSHJ_GameManager.instance.updateHP();
                }
                break;

            case "卡通清洁剂":
                if (QXSHJ_GameManager.instance.rzCount == 1) {
                    this.rzPropTween()
                    this.scheduleOnce(() => {
                        QXSHJ_RoleCtrl.instance.activeRz(QXSHJ_RoleCtrl.instance.rz3)
                        QXSHJ_GameManager.instance.rzCount++;
                    }, 0.75)
                } else {
                    this.node.setPosition(this.initalPos);
                    QXSHJ_GameManager.instance.updateHP();
                }
                break;

            case "毛巾":
                if (QXSHJ_GameManager.instance.rzCount == 2) {
                    this.rzPropTween()
                    this.scheduleOnce(() => {
                        QXSHJ_RoleCtrl.instance.activeRz(QXSHJ_RoleCtrl.instance.rz4)
                        QXSHJ_GameManager.instance.rzCount++;
                    }, 0.75)
                } else {
                    this.node.setPosition(this.initalPos);
                    QXSHJ_GameManager.instance.updateHP();
                }
                break;

            case "铲子":
                if (QXSHJ_GameManager.instance.rzCount == 3) {

                    this.rzPropTween()
                    this.scheduleOnce(() => {
                        QXSHJ_RoleCtrl.instance.activeRz(QXSHJ_RoleCtrl.instance.rz5)
                        QXSHJ_GameManager.instance.rzCount++;
                    }, 0.75)
                } else {
                    this.node.setPosition(this.initalPos);
                    QXSHJ_GameManager.instance.updateHP();
                }
                break;

            case "喷漆":
                if (QXSHJ_GameManager.instance.rzCount == 4) {
                    this.rzPropTween()
                    this.scheduleOnce(() => {
                        QXSHJ_RoleCtrl.instance.activeRz(QXSHJ_RoleCtrl.instance.rz7)
                        QXSHJ_GameManager.instance.rzCount++;
                    }, 0.75)
                } else {
                    this.node.setPosition(this.initalPos);
                    QXSHJ_GameManager.instance.updateHP();
                }
                break;

            case "润滑油":
                if (QXSHJ_GameManager.instance.rzCount == 5) {
                    this.rzPropTween()
                    this.scheduleOnce(() => {
                        QXSHJ_RoleCtrl.instance.rz7.getChildByName("涂料").active = true;
                        QXSHJ_GameManager.instance.rzCount++;
                    }, 0.75)
                } else {
                    this.node.setPosition(this.initalPos);
                    QXSHJ_GameManager.instance.updateHP();
                }
                break;

            case "刷子":
                if (QXSHJ_GameManager.instance.rzCount == 6) {
                    this.rzPropTween()
                    this.scheduleOnce(() => {
                        QXSHJ_RoleCtrl.instance.rz7.getChildByName("涂料").active = false;
                        Tween.stopAll()
                        QXSHJ_GameManager.instance.gamePanel.Win();

                        // director.getScene().emit("WIN");
                    }, 0.75)
                } else {
                    this.node.setPosition(this.initalPos);
                    QXSHJ_GameManager.instance.updateHP();
                }
                break;

            default:
                console.log("没有这个角色", this.node.name);
                break;
        }

    }

    mgrPropTween() {
        this.node.setPosition(100, -300)
        tween(this.node)
            .to(0.25, { position: v3(-120, -600) })
            .to(0.25, { position: v3(70, -840) })
            .to(0.25, { position: v3(-140, -1100) })
            .call(() => {
                this.node.active = false
            }).start()
    }

    rzPropTween() {
        this.node.setPosition(215, -660)
        tween(this.node)
            .to(0.25, { position: v3(-130, -770) })
            .to(0.25, { position: v3(140, -940) })
            .to(0.25, { position: v3(-50, -1175) })
            .call(() => {
                this.node.active = false
            }).start()
    }
}