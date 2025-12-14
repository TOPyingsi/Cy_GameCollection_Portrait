import { _decorator, Component, director, Event, Node, Sprite, SpriteFrame } from 'cc';
import { QWBZY_GameManager } from './QWBZY_GameManager';
const { ccclass, property } = _decorator;

@ccclass('QWBZY_A')
export class QWBZY_A extends Component {

    init(sf: SpriteFrame) {
        this.node.getComponent(Sprite).spriteFrame = sf
    }

    select(event: Event) {
        QWBZY_GameManager.instance.select(event.target)
    }
}


