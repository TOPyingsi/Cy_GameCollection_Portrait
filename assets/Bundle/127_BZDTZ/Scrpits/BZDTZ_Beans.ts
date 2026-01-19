import { _decorator, Component, Node, Sprite } from 'cc';
import { BZDTZ_GmaeManager } from './BZDTZ_GmaeManager';
const { ccclass, property } = _decorator;

@ccclass('BZDTZ_Beans')
export class BZDTZ_Beans extends Component {
    public Isbomb: boolean = false;//是否是炸弹

    start() {
        this.node.getComponent(Sprite).spriteFrame = BZDTZ_GmaeManager.instance.sprites[Math.floor(Math.random() * BZDTZ_GmaeManager.instance.sprites.length)];
    }
    //豆子被单击
    OnClick() {
        if (this.Isbomb) {
            BZDTZ_GmaeManager.instance.ClickBoom();
        } else {
            BZDTZ_GmaeManager.instance.ClickBeans();
        }
        this.node.active = false;
    }
}


