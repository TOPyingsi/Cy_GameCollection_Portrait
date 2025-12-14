import { _decorator, Component, EventTouch, instantiate, Node, Prefab, Sprite, SpriteFrame, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { BNSXL_GameManager } from './BNSXL_GameManager';
import { ROLE } from './BNSXL_Enum';
import { BNSXL_AudioManager } from './BNSXL_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('BNSXL_TouchHandler')
export class BNSXL_TouchHandler extends Component {
    public static instance: BNSXL_TouchHandler;

    @property([Node]) props: Node[] = [];
    @property(Node) girl: Node = null;
    @property(Node) Door_off: Node = null;
    @property([SpriteFrame]) ropes: SpriteFrame[] = [];
    @property(Prefab) rope: Prefab = null;
    @property(Node) ropePraentNode: Node = null;
    @property(Node) gloves: Node = null;
    @property(Node) scarf: Node = null;
    @property(Node) CD: Node = null;

    isTouching: boolean = true;
    private currentProp: Node = null;
    private currentPropPos: Vec3 = null;
    private ovo: number = 0;
    private ropePos: Vec3[] = [new Vec3(7, 0), new Vec3(7, -60), new Vec3(7, -120), new Vec3(7, -180), new Vec3(7, -240), new Vec3(7, -300), new Vec3(7, -360), new Vec3(7, -420), new Vec3(7, -480), new Vec3(7, -540), new Vec3(7, -600), new Vec3(7, -660)]

    protected onLoad(): void {
        BNSXL_TouchHandler.instance = this;
        this.node.on(Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this);
        this.node.on(Node.EventType.TOUCH_END, this.TOUCH_END, this);
    }

    TOUCH_START(event: EventTouch) {
        if (this.isTouching) return;
        const tsp = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        const isDoor = this.Door_off.getComponent(UITransform).getBoundingBox().contains(v2(tsp.x, tsp.y));
        if (isDoor) {
            this.Door_off.active = false;
        }
        this.props.forEach((prop) => {
            if (prop != null && prop.active) {
                const isContains = prop.getComponent(UITransform).getBoundingBox().contains(v2(tsp.x, tsp.y));
                if (isContains) {
                    this.currentPropPos = prop.position.clone();
                    this.currentProp = prop;

                    if (prop.name === "Pointer" || prop.name === "StaffOfPower" || prop.name === "Beard") {
                        prop.setSiblingIndex(999);
                    }
                }
            }
        });
    }

    TOUCH_MOVE(event: EventTouch) {
        if (!this.currentProp) return;
        const tmp = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        this.currentProp.setPosition(tmp);
    }

    TOUCH_END(event: EventTouch) {
        if (!this.currentProp) return;

        const tep = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        const isRole = this.girl.getComponent(UITransform).getBoundingBox().contains(v2(tep.x, tep.y));
        if (isRole) {
            console.log("isRole", isRole);
            this.currentProp.active = false;
            this.success();
        } else {
            this.currentProp.setPosition(this.currentPropPos);
            if (this.currentProp.name === "Pointer") {
                this.currentProp.setSiblingIndex(0);
            }
        }
        this.currentProp = null;
        this.currentPropPos = null;
    }

    success() {
        const propName = this.currentProp.name;
        this.loadRope(propName);
        this.X(propName);
        if (propName == "Clothes" || propName == "Hat") this.ovo += 1
        if (this.ovo >= 2) this.CD.active = true;
        BNSXL_GameManager._instance.refreshROP();
    }

    loadRope(name: string) {
        let rope = instantiate(this.rope);
        this.ropes.find((spriteFrame) => {
            if (spriteFrame.name == `${name}_Rope`) {
                rope.getComponent(Sprite).spriteFrame = spriteFrame;
                rope.parent = this.ropePraentNode;
                rope.setPosition(this.ropePos[BNSXL_GameManager._instance.count]);

                const girlPos = this.girl.position.clone();
                tween(this.girl).to(0.5, { position: v3(girlPos.x, girlPos.y - 57) }).start();

                if (this.gloves && this.gloves.active) {
                    const glovesPos = this.gloves.position.clone();
                    tween(this.gloves).to(0.5, { position: v3(glovesPos.x, glovesPos.y - 57) }).start();
                }

                if (this.scarf && this.scarf.active) {
                    const scarfPos = this.scarf.position.clone();
                    tween(this.scarf).to(0.5, { position: v3(scarfPos.x, scarfPos.y - 57) }).start();
                }
            }
        });
    }

    X(str: string) {
        // BNSXL_AudioManager.Instance.playAudio(str);
        switch (str) {
            case "Gloves":
                BNSXL_GameManager._instance.setRoleLabel("我新买的棉手套", ROLE.GIRL);
                break;
            case "Scarf":
                BNSXL_GameManager._instance.setRoleLabel("自己救自己", ROLE.GIRL);
                break;
            case "Pillar":
                BNSXL_GameManager._instance.setRoleLabel("借用一根柱子应该不会塌吧", ROLE.GIRL);
                break;
            case "Bird":
                BNSXL_GameManager._instance.setRoleLabel("这不是从辽宁那边借的吗？", ROLE.GIRL);
                break;
            case "StreetLamp":
                BNSXL_GameManager._instance.setRoleLabel("电线杆长度刚刚好", ROLE.GIRL);
                break;
            case "Pointer":
                BNSXL_GameManager._instance.setRoleLabel("这大晚上应该没人看时间了", ROLE.GIRL);
                break;
            case "Clothes":
                BNSXL_GameManager._instance.setRoleLabel("大叔，军大衣先借我用用", ROLE.GIRL);
                this.scheduleOnce(() => { BNSXL_GameManager._instance.setRoleLabel("我真的一点都不冷", ROLE.MALE); }, 2);
                break;
            case "Hat":
                BNSXL_GameManager._instance.setRoleLabel("好大的帽子", ROLE.GIRL);
                this.scheduleOnce(() => { BNSXL_GameManager._instance.setRoleLabel("你先用着", ROLE.MALE); }, 2);
                break;
            case "Moon":
                BNSXL_GameManager._instance.setRoleLabel("人造月亮要绑好了", ROLE.GIRL);
                break;
            case "Needle":
                BNSXL_GameManager._instance.setRoleLabel("还好现在没打雷", ROLE.GIRL);
                break;
            case "Beard":
                BNSXL_GameManager._instance.setRoleLabel("谢谢教皇大人", ROLE.GIRL);
                break;
            case "StaffOfPower":
                BNSXL_GameManager._instance.setRoleLabel("手杖先借我一下", ROLE.GIRL);
                this.scheduleOnce(() => { BNSXL_GameManager._instance.setRoleLabel("啊？", ROLE.POPE); }, 2);
                break;
        }
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this);
        this.node.off(Node.EventType.TOUCH_END, this.TOUCH_END, this);
    }
}


