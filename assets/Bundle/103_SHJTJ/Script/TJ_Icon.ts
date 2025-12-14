import { _decorator, Color, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TJ_Icon')
export class TJ_Icon extends Component {

    init(sf: SpriteFrame, parent: Node) {
        this.node.getComponent(Sprite).spriteFrame = sf
        this.node.setParent(parent)
        this.node.name = sf.name
    }
}


