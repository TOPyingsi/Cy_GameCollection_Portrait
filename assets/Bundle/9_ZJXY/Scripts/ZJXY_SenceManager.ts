import { _decorator, Component, EventTouch, Node, tween, UIOpacity, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZJXY_SenceManager')
export class ZJXY_SenceManager extends Component {
    onLoad() {


        this.node.on(Node.EventType.TOUCH_START, this.onDragStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onDrag, this);
        this.node.on(Node.EventType.TOUCH_END, this.onDrop, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onDrop, this);
    }



    onDragStart(event: EventTouch) {


    }
    onDrag(event: EventTouch) {
        const pos = event.getUILocation()
        this.node.worldPosition = v3(pos.x, pos.y, 0);
    }
    private onDrop() {
        tween(this.node.getComponent(UIOpacity))
            .to(0, { opacity: 255 })
            .to(1, { opacity: 0 })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}


