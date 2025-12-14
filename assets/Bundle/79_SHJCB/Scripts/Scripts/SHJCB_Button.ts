import { _decorator, Animation, Component, Node } from 'cc';
import { SHJCB_AudioManager } from './SHJCB_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_Button')
export class SHJCB_Button extends Component {

    ani: Animation;

    start() {
        this.ani = this.getComponent(Animation);
    }

    update(deltaTime: number) {

    }

    Click() {
        this.ani.play();
        SHJCB_AudioManager.Instance._PlaySound(1);
    }
}


