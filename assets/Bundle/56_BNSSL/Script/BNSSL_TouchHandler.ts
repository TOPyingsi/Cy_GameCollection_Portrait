import { _decorator, Component, EventTouch, instantiate, Node, Prefab, Sprite, SpriteFrame, tween, UIOpacity, UITransform, v2, v3, Vec3 } from 'cc';
import { BNSSL_GameManager } from './BNSSL_GameManager';
import { BNSSL_AudioManager } from './BNSSL_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('BNSSL_TouchHandler')
export class BNSSL_TouchHandler extends Component {
    public static instance: BNSSL_TouchHandler;

    @property([Node]) props: Node[] = [];
    @property(Node) girl: Node = null;
    @property([SpriteFrame]) ropes: SpriteFrame[] = [];
    @property([Node]) ropeNode: Node[] = [];

    @property(Node) mouse: Node = null;
    @property(Node) long: Node = null;
    @property(Node) xiaochuanghu: Node = null;
    @property(Node) yijia: Node = null;

    private roleIndex: Vec3[] = [v3(-88, -358), v3(-64, -302), v3(-48, -256), v3(-39, -193), v3(-21, -138), v3(-14, -76), v3(11, -6), v3(24, 50), v3(56, 94), v3(67, 146), v3(80, 213), v3(103, 255), v3(116, 320), v3(132, 372), v3(160, 446)]

    isTouching: boolean = false;
    private currentProp: Node = null;
    private currentPropPos: Vec3 = null;
    private ovo: number = 0;

    protected onLoad(): void {
        BNSSL_TouchHandler.instance = this;
        this.node.on(Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this);
        this.node.on(Node.EventType.TOUCH_END, this.TOUCH_END, this);
    }

    TOUCH_START(event: EventTouch) {
        console.log("TOUCH_START：", this.isTouching);
        if (this.isTouching) return;
        const tsp = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        this.props.forEach((prop) => {
            if (prop != null && prop.active) {
                const isContains = prop.getComponent(UITransform).getBoundingBox().contains(v2(tsp.x, tsp.y));
                if (isContains) {
                    this.currentPropPos = prop.position.clone()

                    if (prop.name === "MouseHole_Off") {
                        prop.active = false;
                        this.mouse.active = true;
                        tween(this.mouse)
                            .to(0.5, { scale: v3(1, 1, 1) })
                            .to(0.5, { position: v3(-250, -250, 0) })
                            .union()
                            .start();
                    } else if (prop.name === "Men_On") {
                        prop.getComponent(UIOpacity).opacity = 255;
                        this.long.active = true;
                    } else if (prop.name === "背带") {
                        prop.getComponent(UIOpacity).opacity = 255;
                        this.currentProp = prop;
                    } else {
                        this.currentProp = prop;
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
        console.log("TOUCH_END：", this.currentProp.name);
        const tep = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        const isRole = this.girl.getComponent(UITransform).getBoundingBox().contains(v2(tep.x, tep.y));
        const isch = this.xiaochuanghu.getComponent(UITransform).getBoundingBox().contains(v2(tep.x, tep.y));
        if (this.currentProp.name === "拐杖" && isch) {
            this.xiaochuanghu.getComponent(UIOpacity).opacity = 255;
            this.yijia.getComponent(UIOpacity).opacity = 255;
            this.currentProp.setPosition(this.currentPropPos);
        } else if (this.currentProp.name === "背带" && !isRole) {
            this.currentProp.getComponent(UIOpacity).opacity = 0;
            this.currentProp.setPosition(this.currentPropPos);
        } else if (isRole) {
            console.log("isRole", isRole);
            this.currentProp.active = false;
            this.success();
        } else {
            this.currentProp.setPosition(this.currentPropPos);

        }
        this.currentProp = null;
        this.currentPropPos = null;
    }

    success() {
        const propName = this.currentProp.name;
        this.loadRope(propName);
        BNSSL_GameManager._instance.refreshROP();
    }

    loadRope(name: string) {
        const node = this.ropeNode[BNSSL_GameManager._instance.count]
        this.ropes.find((spriteFrame) => {
            if (spriteFrame.name == `${name}`) {
                node.getComponent(Sprite).spriteFrame = spriteFrame;
                tween(this.girl)
                    .to(0.5, { position: this.roleIndex[BNSSL_GameManager._instance.count] })
                    .start();
            }
        });
        if (BNSSL_GameManager._instance.count < 15) {
            const num = BNSSL_AudioManager.Instance.playAudio("还是够不到");
            BNSSL_GameManager._instance.setRoleLabel("还是够不到", num);
        }
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this);
        this.node.off(Node.EventType.TOUCH_END, this.TOUCH_END, this);
    }
}


