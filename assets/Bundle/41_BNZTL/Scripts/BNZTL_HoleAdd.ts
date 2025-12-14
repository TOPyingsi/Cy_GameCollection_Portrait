import { _decorator, Animation, Component, EventTouch, Node, tween, TweenAction, UITransform, v3, Vec3 } from 'cc';
import { BNZTL_GameManager } from './BNZTL_GameManager';
const { ccclass, property } = _decorator;

@ccclass('BNZTL_HoleAdd')
export class BNZTL_HoleAdd extends Component {
    @property(Node)
    HoleCanva: Node = null;
    private startPos: Vec3 = null;
    start() {
        this.startPos = this.node.worldPosition.clone();
    }

    onLoad() {

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    update(deltaTime: number) {


    }
    onTouchStart(event: EventTouch) {


    }
    onTouchMove(event: EventTouch) {
        const pos = event.getUILocation();

        this.node.worldPosition = v3(pos.x, pos.y);



    }
    onTouchEnd() {
        const uiTransform = this.HoleCanva.getComponent(UITransform);
        const spawnAreaWidth = uiTransform.width;
        const spawnAreaHeight = uiTransform.height;
        const spawnAreaPos = this.HoleCanva.worldPosition;
        let MaxX = spawnAreaPos.x + spawnAreaWidth / 2;
        let MinX = spawnAreaPos.x - spawnAreaWidth / 2;
        let MaxY = spawnAreaPos.y + spawnAreaHeight / 2;
        let MinY = spawnAreaPos.y - spawnAreaHeight / 2;
        if (this.node.worldPosition.x > MinX && this.node.worldPosition.x < MaxX && this.node.worldPosition.y > MinY && this.node.worldPosition.y < MaxY && this.node.name != "扫把") {
            this.HoleCanva.children[0].active = true;
            this.node.destroy();
            BNZTL_GameManager.Instance._gameSence += 1;
            BNZTL_GameManager.Instance.Music(0);
        } else if (this.node.worldPosition.x > MinX && this.node.worldPosition.x < MaxX && this.node.worldPosition.y > MinY && this.node.worldPosition.y < MaxY && this.node.name == "扫把") {
            this.node.getComponent(Animation).play();
            this.scheduleOnce(() => {
                BNZTL_GameManager.Instance.Lost();

            }, 1);
        } if (this.node != null) {
            this.node.worldPosition = this.startPos;
        }

    }
}