import { _decorator, Color, Component, director, Node, Sprite, SpriteFrame } from 'cc';
import { SEX } from './ZCNCS_GameManager';
const { ccclass, property } = _decorator;

@ccclass('ZCNCS_ManCtrl')
export class ZCNCS_ManCtrl extends Component {

    private sp: Sprite = null;

    init(sf: SpriteFrame) {
        this.sp = this.node.getComponent(Sprite);
        this.sp.spriteFrame = sf;
    }

    buttonClick() {
        this.sp.color = Color.GREEN
        director.getScene().emit('selected', SEX.MAN);
    }

}


