import { _decorator, Collider2D, Component, Contact2DType, error, EventTouch, find, IPhysics2DContact, Node, PhysicsSystem2D, UITransform, v3, Vec3 } from 'cc';
import { CYTK_GameManger } from './CYTK_GameManger';
import { CYTK_AudManager } from './CYTK_AudManager';
const { ccclass, property } = _decorator;

@ccclass('CYTK_PrefabsRun')
export class CYTK_PrefabsRun extends Component {
    private startPos: Vec3 = new Vec3();
    private NodeName: string = null;
    private OtherName: string = null;
    private OtherNode: Node = null;
    public Touch: boolean = true;
    Collider: Collider2D = null;
    onLoad() {

        this.startPos = this.node.worldPosition.clone();
        this.node.on(Node.EventType.TOUCH_START, this.onDragStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onDrag, this);
        this.node.on(Node.EventType.TOUCH_END, this.onDrop, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onDrop, this);
        this.Collider = this.getComponent(Collider2D);
        if (this.Collider) {
            this.Collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
            this.Collider.on(Contact2DType.END_CONTACT, this.onEndConstact, this);
        }
    }


    onDragStart(event: EventTouch) {
        this.NodeName = this.node.name;

    }
    onDrag(event: EventTouch) {
        if (this.Touch === true) {
            const pos = event.getUILocation()
            this.node.worldPosition = v3(pos.x, pos.y, 0);
        }



    }
    private onDrop() {

        if (this.OtherName == this.NodeName) {
            this.node.worldPosition = this.OtherNode.worldPosition;
            if (this.Touch != false) {
                CYTK_GameManger.Instance._win += 1;
            }

            this.Touch = false;
            const uiTransform = this.node.parent.getComponent(UITransform);//获取组件
            const spawnAreaWidth = uiTransform.width; // 预支体的宽度
            const spawnAreaHeight = uiTransform.height; // 预支体的高度
            const spawnAreaPos = this.node.parent.worldPosition;
            CYTK_AudManager.Instance.GameChange(this.node.name);

            let MaxX = spawnAreaPos.x + spawnAreaWidth / 2;
            let MinX = spawnAreaPos.x - spawnAreaWidth / 2;
            let MaxY = spawnAreaPos.y + spawnAreaHeight / 2;
            let MinY = spawnAreaPos.y - spawnAreaHeight / 2;
            if (this.node.worldPosition.x < MaxX && this.node.worldPosition.x > MinX && this.node.worldPosition.y < MaxY && this.node.worldPosition.y > MinY) {
                this.Touch = true;
            }
            else {
                this.Touch = false;
            }
            this.scheduleOnce(() => {

                CYTK_GameManger.Instance.win();
            }, 4);

        }
        else {
            this.scheduleOnce(() => {
                this.node.worldPosition = this.startPos;
            });


        }


    }
    public onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        this.OtherName = otherCollider.node.name;
        this.OtherNode = otherCollider.node;
    }

    onEndConstact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        this.OtherName = null;
        this.OtherNode = null;
    }
}


