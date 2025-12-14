import { _decorator, Button, Component, EventHandler, Node, tween, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gameStart')
export class gameStart extends Component {
    button: Button = null;

    onEnable() {
        this.button = this.node.getComponentInChildren(Button);
        this.button.node.scale = Vec3.ZERO;
        const clickEventHandler = new EventHandler();
        clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = 'gameStart';// 这个是脚本类名
        clickEventHandler.handler = 'OnButtonClick';
        clickEventHandler.customEventData = 'buttonDisapper';
        this.button.clickEvents.push(clickEventHandler);
    }

    OnButtonClick(event: Event, customEventData: string) {
        
        this.button.node.setScale(Vec3.ONE);
        this.DisappearButton();
        
    }

    public DisappearButton() {
        Tween.stopAllByTarget(this.button.node);
        tween(this.button.node).to(0.3, { scale: Vec3.ZERO}, {easing : "bounceOut"}).call(() => {
            this.button.node.setScale(Vec3.ZERO);
        }).start();
    }

    AppearButton() {
        Tween.stopAllByTarget(this.button.node);
        tween(this.button.node).to(0.3, { scale: new Vec3(1, 1, 1) }, {easing : "bounceIn"}).call(() => {
        }).start();
    }

}


