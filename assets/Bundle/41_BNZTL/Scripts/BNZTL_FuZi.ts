import { _decorator, Animation, animation, Component, error, EventTouch, Node, Sprite, tween, UITransform, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BNZTL_FuZi')
export class BNZTL_FuZi extends Component {
    @property(Node)
    Door: Node = null;
    @property(Node)
    MoBan: Node = null;
    private startpos: Vec3;
    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    start() {
        this.startpos = this.node.worldPosition.clone();
    }


    onTouchStart(event: EventTouch) {


    }
    onTouchMove(event: EventTouch) {
        const pos = event.getUILocation();
        this.node.worldPosition = v3(pos.x, pos.y);
    }
    onTouchEnd() {

        const uiTransform = this.Door.getComponent(UITransform);
        const spawnAreaWidth = uiTransform.width;
        const spawnAreaHeight = uiTransform.height;
        const spawnAreaPos = this.Door.worldPosition;
        let MaxX = spawnAreaPos.x + spawnAreaWidth / 2;
        let MinX = spawnAreaPos.x - spawnAreaWidth / 2;
        let MaxY = spawnAreaPos.y + spawnAreaHeight / 2;
        let MinY = spawnAreaPos.y - spawnAreaHeight / 2;
        if (this.node.worldPosition.x > MinX && this.node.worldPosition.x < MaxX && this.node.worldPosition.y > MinY && this.node.worldPosition.y < MaxY) {
            this.node.getComponent(Animation).play();
            tween(this.node)
                .delay(1.5)
                .call(() => {

                    this.Door.children[0].active = false;
                    this.node.active = false;
                    this.MoBan.active = true;

                })
                .start();
        }
        if (this.node != null) {
            this.node.worldPosition = this.startpos;

        }

    }
}


