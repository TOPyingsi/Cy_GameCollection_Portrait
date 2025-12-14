import { _decorator, Collider2D, Component, Contact2DType, Event, IPhysics2DContact, Node, Sprite, SpriteFrame } from 'cc';
import { TongSeDaLuoSi_GameManager } from './TongSeDaLuoSi_GameManager';
const { ccclass, property } = _decorator;

@ccclass('TongSeDaLuoSi_Box')
export class TongSeDaLuoSi_Box extends Component {

    type = 0;
    nailNum = 0;
    realNailNum = 0;

    start() {
    }

    update(deltaTime: number) {

    }

    Init(num: number, sf: SpriteFrame) {
        this.type = num;
        this.nailNum = 0;
        this.realNailNum = 0;
        this.getComponent(Sprite).spriteFrame = sf;
        for (let i = 0; i < this.node.children.length; i++) {
            const element = this.node.children[i];
            element.active = false;
        }
    }

    CheckFull() {
        this.realNailNum++;
        if (this.realNailNum == 3) TongSeDaLuoSi_GameManager.Instance.RemoveBox(this);
    }
}


