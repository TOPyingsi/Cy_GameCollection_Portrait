import { _decorator, Component, Node, Sprite, tween } from 'cc';
import { BigBanana_GameManager } from './BigBanana_GameManager';
const { ccclass, property } = _decorator;

@ccclass('BigBanana_Item')
export class BigBanana_Item extends Component {

    button() {
        BigBanana_GameManager.instance.count++;
        BigBanana_GameManager.instance.rightTip.active = true;
        const r = this.node.getChildByName("R")
        const sp = r.getComponent(Sprite)
        tween(sp)
            .to(0.5, { fillRange: 1 })
            .call(() => {
                r.active = false;
                BigBanana_GameManager.instance.rightTip.active = false;
                if (BigBanana_GameManager.instance.count >= 3) {
                    BigBanana_GameManager.instance.gamePanel.Win();
                } else {
                    BigBanana_GameManager.instance.reGame();
                }
            })
            .start();
    }
}


