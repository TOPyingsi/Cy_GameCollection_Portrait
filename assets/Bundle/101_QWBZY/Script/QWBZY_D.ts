import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('QWBZY_D')
export class QWBZY_D extends Component {

    init(sf: SpriteFrame) {
        this.node.getComponent(Sprite).spriteFrame = sf
    }
}


