import { _decorator, BoxCollider2D, Collider2D, Color, Component, Contact2DType, IPhysics2DContact, Node, Sprite } from 'cc';
import { HLX_Item } from './HLX_Item';
import { HLX_GameManager } from './HLX_GameManager';
import { HLX_Touch } from './HLX_Touch';
const { ccclass, property } = _decorator;

@ccclass('HLX_Collider')
export class HLX_Collider extends Component {

    private boxCollider: BoxCollider2D = null;

    protected onLoad(): void {
        this.boxCollider = this.node.getComponent(BoxCollider2D);
        this.boxCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        const com = otherCollider.getComponent(HLX_Item);
        if (com) {
            console.log("碰到了", otherCollider.node.name, com.index);
            this.checkIsActive(otherCollider.node)
        }
    }

    checkIsActive(node: Node) {
        const num = HLX_GameManager.instance.nodes.indexOf(node)

        if (HLX_GameManager.instance.nodes.length == 0) {
            HLX_GameManager.instance.nodes.push(node);
            node.getComponent(Sprite).color = HLX_Touch.instance.color;
        }

        else {

            // 当节点不存在时 push节点并改变颜色 （选中状态）
            if (num == -1) {
                const last1_index = HLX_GameManager.instance.nodes[HLX_GameManager.instance.nodes.length - 1]?.getComponent(HLX_Item)?.index;
                const current_index = node.getComponent(HLX_Item)?.index;

                const x = last1_index.x;
                const y = last1_index.y;
                const _x = current_index.x;
                const _y = current_index.y;

                // 同行不同列 或 同列不同行 
                if (_x == x && (_y + 1 == y || _y - 1 == y) || _y == y && (_x + 1 == x || _x - 1 == x)) {
                    HLX_GameManager.instance.nodes.push(node);
                    node.getComponent(Sprite).color = HLX_Touch.instance.color;
                }
            }


            // 当节点存在时
            else {
                // 获取最后两个节点
                const last1 = HLX_GameManager.instance.nodes[HLX_GameManager.instance.nodes.length - 1]
                const last2 = HLX_GameManager.instance.nodes[HLX_GameManager.instance.nodes.length - 2]
                //如果当前节点是倒数第二个节点，即弹出最后一个节点并恢复颜色 （取消选中状态）
                if (last2 == node) {
                    last1.getComponent(Sprite).color = Color.WHITE;
                    HLX_GameManager.instance.nodes.pop();
                }
            }
        }
    }
}


