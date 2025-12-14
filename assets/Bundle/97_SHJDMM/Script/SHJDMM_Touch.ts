import { _decorator, Component, EventTouch, Node, UITransform, v2, Vec3 } from 'cc';
import { SHJDMM_GameManager } from './SHJDMM_GameManager';
const { ccclass, property } = _decorator;

@ccclass('SHJDMM_Touch')
export class SHJDMM_Touch extends Component {

    public static instance: SHJDMM_Touch = null;

    private pos: Vec3 = new Vec3();
    private currentRole: Node = null;

    @property([Node]) roles: Node[] = [];
    @property([Node]) masks: Node[] = [];

    protected onLoad(): void {
        SHJDMM_Touch.instance = this;
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

    }

    onTouchStart(event: EventTouch) {
        const uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) {
            console.warn('UITransform component not found on node');
            return;
        }

        const touchLoc = event.getUILocation();
        if (!touchLoc) {
            console.warn('Touch location is null');
            return;
        }

        const pos = uiTransform.convertToNodeSpaceAR(new Vec3(touchLoc.x, touchLoc.y));
        this.roles.forEach(role => {
            if (role && role.isValid) {
                const roleUITransform = role.getComponent(UITransform);
                if (roleUITransform) {
                    const bol = roleUITransform.getBoundingBox().contains(v2(pos.x, pos.y));
                    if (bol) this.currentRole = role;
                }
            }
        });
    }

    onTouchMove(event: EventTouch) {
        if (!this.currentRole || !this.currentRole.isValid) {
            this.currentRole = null;
            return;
        }

        // 添加空值检查
        const uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) {
            console.warn('UITransform component not found on node');
            this.currentRole = null;
            return;
        }

        const touchLoc = event.getUILocation();
        if (!touchLoc) {
            console.warn('Touch location is null');
            this.currentRole = null;
            return;
        }

        const pos = uiTransform.convertToNodeSpaceAR(new Vec3(touchLoc.x, touchLoc.y));
        this.currentRole.setPosition(pos);
    }

    onTouchEnd(event: EventTouch) {
        if (!this.currentRole || !this.currentRole.isValid) {
            this.currentRole = null;
            return;
        }

        // 添加空值检查
        const uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) {
            console.warn('UITransform component not found on node');
            this.currentRole = null;
            return;
        }

        const touchLoc = event.getUILocation();
        if (!touchLoc) {
            console.warn('Touch location is null');
            this.currentRole = null;
            return;
        }

        const pos = uiTransform.convertToNodeSpaceAR(new Vec3(touchLoc.x, touchLoc.y));
        this.masks.forEach(mask => {
            // 添加节点有效性检查
            if (mask && mask.isValid) {
                const maskUITransform = mask.getComponent(UITransform);
                if (maskUITransform) {
                    const bol = maskUITransform.getBoundingBox().contains(v2(pos.x, pos.y));
                    if (bol) {
                        if (SHJDMM_GameManager.instance) {
                            SHJDMM_GameManager.instance._map.set(this.currentRole, mask);
                        }
                        this.currentRole = null;
                    } else {
                        const ishas = SHJDMM_GameManager.instance._map.has(this.currentRole)
                        if (ishas) {
                            SHJDMM_GameManager.instance._map.delete(this.currentRole)
                        }
                    }
                    console.log(SHJDMM_GameManager.instance._map)

                }
            }
        });
        this.currentRole = null;
    }
}