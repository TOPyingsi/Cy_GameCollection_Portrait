import { _decorator, Button, Component, Node } from 'cc';
import { sharesController } from './SSL_sharesController';
import { SSL_UIManager } from '../Manage/SSL_UIManager';
const { ccclass, property } = _decorator;

@ccclass('sellbutton')
export class sellbutton extends Component { 
    button : Button = null;

    protected start(): void {
        this.button = this.getComponent(Button);
        let data = this.button.node.parent.getComponent(sharesController).data;
        this.button.node.on(Button.EventType.CLICK, () => { SSL_UIManager.instance.sharesPageScript.cilckSell(data) }, this);
    }


}


