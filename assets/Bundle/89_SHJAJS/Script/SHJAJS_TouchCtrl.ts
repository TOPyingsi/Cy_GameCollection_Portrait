import { _decorator, Component, director, EventTouch, find, instantiate, Node, Prefab, Sprite, SpriteFrame, UITransform, v2, Vec3 } from 'cc';
import { SHJAJS_GameManager } from './SHJAJS_GameManager';
const { ccclass, property } = _decorator;

@ccclass('SHJAJS_TouchCtrl')
export class SHJAJS_TouchCtrl extends Component {

    @property(Node) nodeArea: Node = null;
    @property(Prefab) prop: Prefab = null;
    @property([SpriteFrame]) sfs: SpriteFrame[] = []

    private panel: Node = null;
    /**prefab实例化出来的节点 */
    private initProp: Node = null;
    private touchNode: Node = null;
    private nodes: Node[] = []
    map: Map<string, Node> = new Map()

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        director.getScene().on("changePropPanel", this.changePropPanel, this)
        director.getScene().on("recoveryNode", this.recoveryNode, this)
    }

    recoveryNode(node: Node) {
        console.log("恢复节点", node)
        this.nodes.push(node)
    }

    onTouchStart(event: EventTouch) {
        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        this.nodes.forEach(node => {
            const bol = node.getComponent(UITransform).getBoundingBox().contains(v2(pos.x, pos.y))
            if (bol) {
                this.touchNode = node;
                const prop = instantiate(this.prop)
                const sf = this.sfs.find(sf => sf.name == node.getComponent(Sprite).spriteFrame.name)
                prop.getComponent(Sprite).spriteFrame = sf
                prop.name = node.name
                // prop.setParent(this.node)
                prop.setParent(find("Canvas/GameArea/6"))
                prop.setPosition(pos)
                this.initProp = prop;
                node.active = false;
            }
        })
    }

    onTouchMove(event: EventTouch) {
        try {
            if (this.initProp && !this.initProp.isValid) {
                return;
            }
            if (this.initProp) {
                const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
                this.initProp.setPosition(pos);
            }
        } catch (e) {
            console.log(e);
        }
    }

    onTouchEnd(event: EventTouch) {
        if (this.initProp) {
            const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
            const bol = this.nodeArea.getComponent(UITransform).getBoundingBox().contains(v2(pos.x, pos.y));
            if (bol) {
                SHJAJS_GameManager.instance._map.set(this.initProp, this.panel);
                if (SHJAJS_GameManager.instance._map.size >= 10) {
                    SHJAJS_GameManager.instance.submitButton.active = true;
                    SHJAJS_GameManager.instance.submitButton.setSiblingIndex(999)
                }
                SHJAJS_GameManager.instance.map.set(this.initProp, this.touchNode);
                this.initProp.setPosition(pos);
                this.nodes = this.nodes.filter(node => node.name != this.initProp.name);
                this.initProp = null;
            } else {
                this.initProp.destroy();
                this.initProp = null; // 销毁后置为 null
                this.touchNode.active = true;
            }
        }
    }

    changePropPanel(panel: Node) {
        this.panel = panel
        this.nodes = panel.children
    }
}


