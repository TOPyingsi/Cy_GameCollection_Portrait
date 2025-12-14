import { _decorator, Component, director, Input, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('inputSystem')
export class inputSystem extends Component {
    protected onEnable(): void {
        this.node.on(Input.EventType.TOUCH_START, this.TOUCH_START, this);
    }

    TOUCH_START(){
        director.getScene().emit('TOUCH_START');
    }

    protected onDisable(): void {
        this.node.off(Input.EventType.TOUCH_START, this.TOUCH_START, this);
    }
}


