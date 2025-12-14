import { _decorator, Component, director, EventTouch, Node, PolygonCollider2D, Sprite, SpriteFrame, UITransform, v2, Vec3 } from 'cc';
import { SHJDMM_Touch } from './SHJDMM_Touch';
import { SHJDMM_GameManager } from './SHJDMM_GameManager';
const { ccclass, property } = _decorator;

@ccclass('SHJDMM_Round2')
export class SHJDMM_Round2 extends Component {

    @property(Node) role1: Node = null;
    @property(Node) role2: Node = null;
    @property(Node) role3: Node = null;

    @property(Node) role1_1: Node = null;
    @property(Node) role2_1: Node = null;
    @property(Node) role3_1: Node = null;

    @property(SpriteFrame) sf1: SpriteFrame = null;
    @property(SpriteFrame) sf2: SpriteFrame = null;
    @property(SpriteFrame) sf3: SpriteFrame = null;

    private touchRole: Node = null;
    private lastClickTime: number = 0;
    private lastClickRole: Node = null;
    private doubleClickInterval: number = 300; // 双击间隔时间(毫秒)
    private touchStartTime: number = 0;
    private touchStartPos: Vec3 = new Vec3();
    private touchThreshold: number = 10; // 触摸移动阈值，超过此距离认为是移动而非点击

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        director.on("round2_changeSf", this.changeSf, this);
    }

    changeSf() {
        const _map = SHJDMM_GameManager.instance._map;
        if (_map.size != 3) {
            if (this.role1 && this.role1.isValid && !_map.has(this.role1)) {
                this.role1.getComponent(Sprite).spriteFrame = this.sf1;
            }
            if (this.role2 && this.role2.isValid && !_map.has(this.role2)) {
                this.role2.getComponent(Sprite).spriteFrame = this.sf2;
            }
            if (this.role3 && this.role3.isValid && !_map.has(this.role3)) {
                this.role3.getComponent(Sprite).spriteFrame = this.sf3;
            }
            if (this.role1_1 && this.role1_1.isValid && !_map.has(this.role1_1)) {
                this.role1_1.getComponent(Sprite).spriteFrame = this.sf1;
            }
            if (this.role2_1 && this.role2_1.isValid && !_map.has(this.role2_1)) {
                this.role2_1.getComponent(Sprite).spriteFrame = this.sf2;
            }
            if (this.role3_1 && this.role3_1.isValid && !_map.has(this.role3_1)) {
                this.role3_1.getComponent(Sprite).spriteFrame = this.sf3;
            }
        }

        SHJDMM_GameManager.instance.map.forEach((value, key) => {
            if (key && key.isValid && key == this.role1) {
                this.role1.getComponent(Sprite).spriteFrame = this.sf1;
            }
            if (key && key.isValid && key == this.role2) {
                this.role2.getComponent(Sprite).spriteFrame = this.sf2;
            }
            if (key && key.isValid && key == this.role3) {
                this.role3.getComponent(Sprite).spriteFrame = this.sf3;
            }
            if (key && key.isValid && key == this.role1_1) {
                this.role1_1.getComponent(Sprite).spriteFrame = this.sf1;
            }
            if (key && key.isValid && key == this.role2_1) {
                this.role2_1.getComponent(Sprite).spriteFrame = this.sf2;
            }
            if (key && key.isValid && key == this.role3_1) {
                this.role3_1.getComponent(Sprite).spriteFrame = this.sf3;
            }
        });
    }

    onTouchStart(event: EventTouch) {
        // 记录触摸开始时间和位置
        this.touchStartTime = Date.now();
        const touchLoc = event.getUILocation();
        if (touchLoc) {
            this.touchStartPos.set(touchLoc.x, touchLoc.y, 0);
        }

        // 添加空值检查
        const uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) {
            console.warn('UITransform component not found on node');
            return;
        }

        const pos = uiTransform.convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        if (this.role1 && this.role1.isValid) {
            const roleUITransform = this.role1.getComponent(UITransform);
            if (roleUITransform) {
                const bol1 = roleUITransform.getBoundingBox().contains(v2(pos.x, pos.y));
                if (bol1) this.touchRole = this.role1;
            }
        }

        if (this.role2 && this.role2.isValid) {
            const roleUITransform = this.role2.getComponent(UITransform);
            if (roleUITransform) {
                const bol2 = roleUITransform.getBoundingBox().contains(v2(pos.x, pos.y));
                if (bol2) this.touchRole = this.role2;
            }
        }

        if (this.role3 && this.role3.isValid) {
            const roleUITransform = this.role3.getComponent(UITransform);
            if (roleUITransform) {
                const bol3 = roleUITransform.getBoundingBox().contains(v2(pos.x, pos.y));
                if (bol3) this.touchRole = this.role3;
            }
        }
    }

    onTouchMove(event: EventTouch) {
        // 如果没有触摸角色，直接返回
        if (!this.touchRole || !this.touchRole.isValid) {
            return;
        }

        // 检查是否移动超过阈值，如果超过则不处理双击
        const touchLoc = event.getUILocation();
        if (touchLoc) {
            const moveDistance = Math.sqrt(
                Math.pow(touchLoc.x - this.touchStartPos.x, 2) +
                Math.pow(touchLoc.y - this.touchStartPos.y, 2)
            );

            if (moveDistance > this.touchThreshold) {
                // 重置双击状态，因为用户正在移动
                this.lastClickRole = null;
                this.lastClickTime = 0;
            }
        }

        // 正常处理移动逻辑
        const uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) {
            console.warn('UITransform component not found on node');
            return;
        }

        const pos = uiTransform.convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.touchRole.setPosition(pos);
    }

    onTouchEnd(event: EventTouch) {
        // 如果没有触摸角色，直接返回
        if (!this.touchRole || !this.touchRole.isValid) {
            this.touchRole = null;
            return;
        }

        // 检查是否移动超过阈值
        const touchLoc = event.getUILocation();
        let isMoving = false;
        if (touchLoc) {
            const moveDistance = Math.sqrt(
                Math.pow(touchLoc.x - this.touchStartPos.x, 2) +
                Math.pow(touchLoc.y - this.touchStartPos.y, 2)
            );
            isMoving = moveDistance > this.touchThreshold;
        }

        // 只有在没有明显移动时才处理点击/双击
        if (!isMoving) {
            const currentTime = Date.now();
            const timeSinceStart = currentTime - this.touchStartTime;

            // 检查是否为双击（必须在合理时间内，并且是同一角色）
            if (this.touchRole === this.lastClickRole &&
                (currentTime - this.lastClickTime) < this.doubleClickInterval) {
                // 双击事件处理
                this.onDoubleClick(this.touchRole);
                // 重置状态
                this.lastClickTime = 0;
                this.lastClickRole = null;
            } else {
                // 单击，更新点击信息
                this.lastClickTime = currentTime;
                this.lastClickRole = this.touchRole;
            }
        }

        // 清除当前触摸角色引用
        this.touchRole = null;
    }

    private onDoubleClick(role: Node): void {
        console.log(`Double click on ${role.name}`);

        console.log("before", SHJDMM_Touch.instance?.roles);

        if (role == this.role1 && this.role1 && this.role1.isValid && this.role1_1 && this.role1_1.isValid) {
            // 缓存位置信息，避免在异步回调中访问已销毁节点
            const position = this.role1.position.clone();
            this.scheduleOnce(() => {
                // 再次检查节点有效性
                if (this.role1_1 && this.role1_1.isValid) {
                    this.role1_1.setPosition(position);
                    if (SHJDMM_Touch.instance && SHJDMM_Touch.instance.roles) {
                        SHJDMM_Touch.instance.roles = SHJDMM_Touch.instance.roles.filter(r => r !== this.role1);


                    }
                    // 再次检查role1有效性后才销毁
                    if (this.role1 && this.role1.isValid) {
                        if (SHJDMM_GameManager.instance._map.has(this.role1)) {
                            SHJDMM_GameManager.instance._map.delete(this.role1);
                        }
                        this.role1.destroy();
                    }
                    this.role1_1.active = true;
                }
            }, 0)
        }

        if (role == this.role2 && this.role2 && this.role2.isValid && this.role2_1 && this.role2_1.isValid) {
            // 缓存位置信息
            const position = this.role2.position.clone();
            this.scheduleOnce(() => {
                // 再次检查节点有效性
                if (this.role2_1 && this.role2_1.isValid) {
                    this.role2_1.setPosition(position);
                    if (SHJDMM_Touch.instance && SHJDMM_Touch.instance.roles) {
                        SHJDMM_Touch.instance.roles = SHJDMM_Touch.instance.roles.filter(r => r !== this.role2);
                    }
                    // 再次检查role2有效性后才销毁
                    if (this.role2 && this.role2.isValid) {
                        if (SHJDMM_GameManager.instance._map.has(this.role2)) {
                            SHJDMM_GameManager.instance._map.delete(this.role2);
                        }
                        this.role2.destroy();
                    }
                    this.role2_1.active = true;
                }
            }, 0)
        }

        if (role == this.role3 && this.role3 && this.role3.isValid && this.role3_1 && this.role3_1.isValid) {
            // 缓存位置信息
            const position = this.role3.position.clone();
            this.scheduleOnce(() => {
                // 再次检查节点有效性
                if (this.role3_1 && this.role3_1.isValid) {
                    this.role3_1.setPosition(position);
                    if (SHJDMM_Touch.instance && SHJDMM_Touch.instance.roles) {
                        SHJDMM_Touch.instance.roles = SHJDMM_Touch.instance.roles.filter(r => r !== this.role3);
                    }
                    // 再次检查role3有效性后才销毁
                    if (this.role3 && this.role3.isValid) {
                        if (SHJDMM_GameManager.instance._map.has(this.role3)) {
                            SHJDMM_GameManager.instance._map.delete(this.role3);
                        }
                        this.role3.destroy();
                    }
                    this.role3_1.active = true;
                }
            }, 0)
        }

        console.log("after", SHJDMM_Touch.instance?.roles);
    }
}