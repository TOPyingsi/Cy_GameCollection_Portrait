import { _decorator, Component, director, Input, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('KDZLM_TouchEvent')
export class KDZLM_TouchEvent extends Component {

    private isCanTouch: boolean = false;

    protected onLoad(): void {
        this.node.on(Input.EventType.TOUCH_START, this.TOUCH_START, this);
        director.getScene().on("startGame", this.isTouch, this);
        director.getScene().on("gameOver", this.isTouch, this);
    }

    TOUCH_START() {
        if (!this.isCanTouch) return;
        director.getScene().emit('TOUCH_START');
    }

    isTouch(bol: boolean) {
        this.isCanTouch = bol;
    }

    protected onDisable(): void {
        this.node.off(Input.EventType.TOUCH_START, this.TOUCH_START, this);
        director.getScene().off("startGame", this.isTouch, this);
        director.getScene().off("gameOver", this.isTouch, this);
    }
}


