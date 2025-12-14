import { _decorator, Animation, Component, Node } from 'cc';
import { GDDSCBASMR_AudioManager } from './GDDSCBASMR_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_Button')
export class GDDSCBASMR_Button extends Component {

    ani: Animation;

    start() {
        this.ani = this.getComponent(Animation);
    }

    update(deltaTime: number) {

    }

    Click() {
        this.ani.play();
        GDDSCBASMR_AudioManager.Instance._PlaySound(1);
    }
}


