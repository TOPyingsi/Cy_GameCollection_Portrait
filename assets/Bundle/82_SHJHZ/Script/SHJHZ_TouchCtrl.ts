import { _decorator, Component, director, EventTouch, find, instantiate, Node, Prefab, Sprite, SpriteFrame, UITransform, v2, Vec3 } from 'cc';
import { SHJHZ_GameManager } from './SHJHZ_GameManager';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SHJHZ_TouchCtrl')
export class SHJHZ_TouchCtrl extends Component {

    @property(Prefab) prop: Prefab = null;
    @property([SpriteFrame]) sfs: SpriteFrame[] = []

    currentProp: Node = null;
    currentTouchNode: Node = null;
    panel: Node = null;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        director.getScene().on("changePanel", this.changePanel, this);
    }

    changePanel(panel: Node) {
        this.panel = panel;
    }

    onTouchStart(event: EventTouch) {
        AudioManager.Instance.PlaySFX(SHJHZ_GameManager.instance.click)
        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        if (this.panel) {
            const worldPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(pos);
            const _pos = this.panel.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
            const list = this.panel.children.filter(node => node.active)
            list.forEach(node => {
                const isNode = node.getComponent(UITransform).getBoundingBox().contains(v2(_pos.x, _pos.y))

                if (isNode) {
                    if (node.active = true) {

                        this.currentTouchNode = node;
                        const name = node.getChildByName("Icon").getComponent(Sprite).spriteFrame.name

                        const propNode = instantiate(this.prop)
                        propNode.getComponent(Sprite).spriteFrame = this.sfs.find(sf => sf.name == name)
                        propNode.setParent(this.node)
                        propNode.setPosition(pos)
                        propNode.name = node.name
                        const propMap = find("Canvas/GameArea/PropMap")
                        propNode.setSiblingIndex(propMap.getSiblingIndex() + SHJHZ_GameManager.instance.xyy.length + 1)
                        this.currentProp = propNode;

                        node.active = false;
                    }

                }
            });

        }
    }

    onTouchMove(event: EventTouch) {
        if (!this.currentProp) {
            return;
        }
        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.currentProp.setPosition(pos)
    }

    count: number = 0;
    onTouchEnd(event: EventTouch) {
        if (!this.currentProp) {
            return;
        }
        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        const propArea = find("Canvas/GameArea/PropArea")
        const bol = propArea.getComponent(UITransform).getBoundingBox().contains(v2(pos.x, pos.y))
        if (bol) {
            SHJHZ_GameManager.instance.xyy.push(this.currentProp)
            SHJHZ_GameManager.instance._map.set(this.currentProp, this.panel)
            this.currentProp.setPosition(pos)
            this.currentProp = null;
            this.currentTouchNode = null;
        } else {
            this.resetProp();
        }
        console.log("------------------------------------------------->")
        console.log("SHJHZ_GameManager.instance.xyy ", SHJHZ_GameManager.instance.xyy)
        console.log("SHJHZ_GameManager.instance._map ", SHJHZ_GameManager.instance._map)
    }

    resetProp() {
        if (this.currentTouchNode) {
            this.currentTouchNode.active = true;
            this.currentProp.destroy();
            this.currentProp = null;
            this.currentTouchNode = null;
        }
    }


    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}


