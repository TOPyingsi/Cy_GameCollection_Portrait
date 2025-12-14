import { _decorator, Button, Component, director, EventHandler, Node, Tween, tween, v3, Vec3 } from 'cc';
import PlayerManager from '../Manage/SSL_PlayerManager';
const { ccclass, property } = _decorator;

@ccclass('oneMore')
export class oneMore extends Component {

    button: Button = null;
    
    start() {
        this.button = this.node.getComponent(Button);
        this.button.node.scale = Vec3.ZERO;
        const clickEventHandler = new EventHandler();
        clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = 'oneMore';// 这个是脚本类名
        clickEventHandler.handler = 'OnButtonClick';
        clickEventHandler.customEventData = 'buttonDisapper';
        this.button.clickEvents.push(clickEventHandler);
    }

    OnButtonClick(event: Event, customEventData: string) {
        this.button.node.setScale(Vec3.ONE);
        this.DisappearButton();
        if (PlayerManager.Instance.Cashnum >= 5){
            director.getScene().emit("Renew");
        }else{
            director.getScene().emit("Reborn");
        }
    }

    public DisappearButton() {
        Tween.stopAllByTarget(this.button.node);
        tween(this.button.node).to(0.3, { scale: Vec3.ZERO }).call(() => {
            this.button.node.setScale(Vec3.ZERO);
        }).start();
    }

    AppearButton() {
        Tween.stopAllByTarget(this.button.node);
        tween(this.node).to(0.3, { scale: new Vec3(1, 1, 1) }).call(() => {
        }).start();
    }

    update(deltaTime: number) {

    }
}


