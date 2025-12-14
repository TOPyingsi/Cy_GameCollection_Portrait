import { _decorator, Component, Node } from 'cc';
import { BigBanana_GameManager } from './BigBanana_GameManager';
const { ccclass, property } = _decorator;

@ccclass('BigBanana_ItemCtrl')
export class BigBanana_ItemCtrl extends Component {

    button() {
        BigBanana_GameManager.instance.failTip.active = true;
        this.scheduleOnce(() => {
            BigBanana_GameManager.instance.failTip.active = false;
        }, 0.5);
    }

}


