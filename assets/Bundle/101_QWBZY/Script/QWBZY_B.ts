import { _decorator, Component, director, Event, Node, Sprite, SpriteFrame } from 'cc';
import { QWBZY_GameManager } from './QWBZY_GameManager';
const { ccclass, property } = _decorator;

@ccclass('QWBZY_B')
export class QWBZY_B extends Component {

    init(sf: SpriteFrame) {
        this.node.getComponent(Sprite).spriteFrame = sf
    }

    select(event: Event) {
        QWBZY_GameManager.instance.select(event.target)
    }
}


