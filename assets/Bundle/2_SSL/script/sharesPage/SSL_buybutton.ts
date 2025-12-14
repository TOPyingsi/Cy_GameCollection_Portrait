import { _decorator, Component, Node, Button } from 'cc';
import { sharesController } from './SSL_sharesController';
import { SSL_UIManager } from '../Manage/SSL_UIManager';
const { ccclass, property } = _decorator;

@ccclass('buybutton')
export class buybutton extends Component {
    button: Button = null;

    protected start(): void {
        this.button = this.getComponent(Button);
        let data = this.button.node.parent.getComponent(sharesController).data;
        this.button.node.on(Button.EventType.CLICK, () => { SSL_UIManager.instance.sharesPageScript.cilckBuy(data) }, this);
    }

}


