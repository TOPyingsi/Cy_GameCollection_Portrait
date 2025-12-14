import { _decorator, Component, HingeJoint2D, Node } from 'cc';
import { TongSeDaLuoSi_GameManager } from './TongSeDaLuoSi_GameManager';
const { ccclass, property } = _decorator;

@ccclass('TongSeDaLuoSi_Wood')
export class TongSeDaLuoSi_Wood extends Component {
    start() {
        this.WoodFall();
    }

    update(deltaTime: number) {

    }

    WoodFall() {
        this.schedule(() => {
            if (this.node.position.y < -2000) {
                var num = TongSeDaLuoSi_GameManager.Instance.woodArr.indexOf(this.node);
                TongSeDaLuoSi_GameManager.Instance.SpliceWoodArr(num, 1);
                this.unscheduleAllCallbacks();
                this.node.active = false;
            }
        }, 1);
    }
}


