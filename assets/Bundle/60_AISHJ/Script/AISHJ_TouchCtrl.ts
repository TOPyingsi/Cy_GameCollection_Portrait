import { _decorator, AudioSource, Component, director, EventTouch, find, Node, Tween, tween, UITransform, v2, Vec3 } from 'cc';
import { AISHJ_GameManager } from './AISHJ_GameManager';
const { ccclass } = _decorator;

@ccclass('AISHJ_TouchCtrl')
export class AISHJ_TouchCtrl extends Component {

    private isTouch: boolean = false;
    private currentProp: Node = null;
    private currentPropPos: Vec3 = null;
    private _GM: AISHJ_GameManager = null;
    private rolePropMap: Map<Node, Node> = new Map();

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this);
        this.node.on(Node.EventType.TOUCH_END, this.TOUCH_END, this);
        director.getScene().on("clear", this.clear, this);
    }

    protected start(): void {
        this._GM = AISHJ_GameManager.Instance;
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this);
        this.node.off(Node.EventType.TOUCH_END, this.TOUCH_END, this);
        director.getScene().off("clear", this.clear, this);
    }

    TOUCH_START(event: EventTouch) {
        if (this.isTouch) return;
        director.getScene().emit("firstTouch");
        this.isTouch = true;
        const tsp = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        this._GM.props.forEach(prop => {
            const isProp = prop.getComponent(UITransform).getBoundingBox().contains(v2(tsp.x, tsp.y));
            if (isProp && prop.active) {
                this.currentProp = prop;
                this.currentPropPos = prop.getPosition().clone();
            }
        });

        this._GM.roles.forEach(role => {
            const isRole = role.getComponent(UITransform).getBoundingBox().contains(v2(tsp.x, tsp.y));
            if (isRole && !role.active) {
                role.active = true;
                const prop = this.rolePropMap.get(role);
                prop.active = true;
                const prop_ani = role.parent.getChildByName(`${prop.name}_Animation`)
                if (prop_ani) {
                    prop_ani.destroy();
                }
                const as = prop.getComponent(AudioSource);
                as.stop();
                this._GM.props_unActive.forEach(item => { if (item.name == `${prop.name}_unActive`) item.active = false; });
            }
        })
    }

    TOUCH_MOVE(event: EventTouch) {
        if (!this.currentProp) return;
        const tmp = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.currentProp.setPosition(tmp);
    }

    TOUCH_END(event: EventTouch) {
        this.isTouch = false;
        if (!this.currentProp) return;
        const tep = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));

        this._GM.roles.forEach(role => {
            const isRole = role.getComponent(UITransform).getBoundingBox().contains(v2(tep.x, tep.y));

            if (isRole && role.active) {
                this.currentProp.active = false;
                role.active = false;
                this._GM.props_unActive.forEach(item => {
                    if (item.name == `${this.currentProp.name}_unActive`) item.active = true;
                });

                director.getScene().emit("ani", this.currentProp.name, role);
                this.currentProp.getComponent(AudioSource).play();
                this.rolePropMap.set(role, this.currentProp);
            } else {
                tween(this.currentProp)
                    .to(0.1, { position: this.currentPropPos })
                    .start();
            }
        })
        this.currentProp = null;
    }

    clear() {
        this.rolePropMap.forEach((prop) => {
            if (prop) {
                prop.getComponent(AudioSource).stop();
                find(`Canvas/PlayArea/Roles/${prop.name}_Animation`).destroy();
            }
        })
        this.rolePropMap.clear();
    }
}


