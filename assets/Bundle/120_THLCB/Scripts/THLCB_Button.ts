import { _decorator, Animation, Component, Node } from 'cc';
import { THLCB_AudioManager } from './THLCB_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('THLCB_Button')
export class THLCB_Button extends Component {

    ani: Animation;

    start() {
        this.ani = this.getComponent(Animation);
    }

    update(deltaTime: number) {

    }

    Click() {
        this.ani.play();
        THLCB_AudioManager.Instance._PlaySound(1);
    }
}


