import { _decorator, Component, EventTouch, Node, UITransform, v3, Vec3 } from 'cc';
import { BNZTL_SenceManager } from './BNZTL_SenceManager';
import { BNZTL_GameManager } from './BNZTL_GameManager';
const { ccclass, property } = _decorator;

@ccclass('BNZTL_WallAdd')
export class BNZTL_WallAdd extends Component {
    @property(Node)
    WallCanva: Node = null;
    private startPos: Vec3 = null;
    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

    }
    start() {
        this.startPos = this.node.worldPosition.clone();
    }
    onTouchStart(event: EventTouch) {


    }
    onTouchMove(event: EventTouch) {
        const pos = event.getUILocation();
        if (this.node.name == "冰箱") {
            this.node.worldPosition = v3(pos.x, this.node.worldPosition.y);
        }
        else {
            this.node.worldPosition = v3(pos.x, pos.y);
        }
    }
    onTouchEnd() {
        const uiTransform = this.WallCanva.getComponent(UITransform);
        const spawnAreaWidth = uiTransform.width;
        const spawnAreaHeight = uiTransform.height;
        const spawnAreaPos = this.WallCanva.worldPosition;
        let MaxX = spawnAreaPos.x + spawnAreaWidth / 2;
        let MinX = spawnAreaPos.x - spawnAreaWidth / 2;
        let MaxY = spawnAreaPos.y + spawnAreaHeight / 2;
        let MinY = spawnAreaPos.y - spawnAreaHeight / 2;
        if (this.node.worldPosition.x > MinX && this.node.worldPosition.x < MaxX && this.node.worldPosition.y > MinY && this.node.worldPosition.y < MaxY) {
            this.WallCanva.children[0].active = true;
            this.node.destroy();
            BNZTL_GameManager.Instance._gameSence += 1;
            BNZTL_GameManager.Instance.Music(0);
        }
        if (this.node != null) {
            this.node.worldPosition = this.startPos;
        }



    }
}


