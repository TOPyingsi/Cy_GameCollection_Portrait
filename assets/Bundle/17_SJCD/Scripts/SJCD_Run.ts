import { _decorator, Animation, BoxCollider, BoxCollider2D, Collider2D, Component, Contact2DType, error, EventTouch, find, Graphics, IPhysics2DContact, Node, PhysicsSystem, PhysicsSystem2D, Sprite, v3, Vec3 } from 'cc';
import { BOXCOLLIDER2D } from '../../../../extensions/plugin-import-2x/creator/components/BoxCollider2D';
import { SJCD_GameManager } from './SJCD_GameManager';

const { ccclass, property } = _decorator;

@ccclass('SJCD_Run')
export class SJCD_Run extends Component {
    @property(Node)
    startNode: Node = null; // 电器节点
    @property(Node)
    endNode: Node = null; // 插头节点
    @property(Node)
    Wire: Node = null; // 线节点
    @property(Node)
    DianLia: Node = null; // 电量节点
    @property(Node)
    Limit: Node[] = []; // 插座节点
    private graphics: Graphics = null;
    Collider: Collider2D = null;
    private ChaZuo: Node = null;
    private i: number = null;
    private BaChu: boolean = false;
    onLoad() {
        // PhysicsSystem2D.instance.enable = true;
        // PhysicsSystem2D.instance.debugDrawFlags = 1;
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



    start() {

        this.graphics = this.Wire.getComponent(Graphics);
        this.graphics.moveTo(this.startNode.worldPosition.x, this.startNode.worldPosition.y);
        this.graphics.lineTo(this.endNode.worldPosition.x, this.endNode.worldPosition.y);
        this.graphics.stroke();
    }
    CreatWire() {
        this.graphics.clear();
        this.graphics.moveTo(this.startNode.worldPosition.x, this.startNode.worldPosition.y);
        this.graphics.lineTo(this.endNode.worldPosition.x, this.endNode.worldPosition.y);
        this.graphics.stroke();

    }
    onDragStart(event: EventTouch) {


        if (this.ChaZuo != null && this.BaChu == true) {

            this.ChaZuo.getComponent(BoxCollider2D).enabled = true;
            this.BaChu = null;
        }

        this.node.getComponent(Sprite).enabled = true;
        this.node.children[0].active = false;
        this.DianLia.active = false;
        this.DianLia.getComponent(Animation).stop();
        this.ChaZuo = null;


    }
    onDrag(event: EventTouch) {
        for (let i = 0; i < this.Limit.length; i++) {
            const Distance = Math.abs(this.node.worldPosition.y - this.Limit[i].worldPosition.y);
            // console.error(Distance);

            if (Distance < 300) {
                this.BaChu = false;
            }
            else {
                this.BaChu = null;
            }
        }

        const pos = event.getUILocation()
        this.node.worldPosition = v3(pos.x, pos.y, 0);
        this.CreatWire();
    }
    private onDrop() {

        this.NodePosChange();

    }
    public onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.node.name == "插座") {
            this.ChaZuo = otherCollider.node;

            this.BaChu = false;
        } else {
        }

    }
    // ,
    // {
    //   "gameName": "手机充电",
    //   "startScene": "SJCD_GameSence",
    //   "bundles": "17_SJCD",
    //   "collisionMatrix": "00000000000000000000000-00000000000000000000010-00000000000000000001000-00000000000000000010100-00000000000000000111000-00000000000000000010000-00000000000000000000000-00000000000000000000000-00000000000000000000000-00000000000000000000000-00000000001110000000001-00000000000110000000001-00000000000010000000000-00000000000000000000000-00000000000000000000000-00000000000000000000000-00000000000000000000000-00000000000000000000000-00000000000000000000000-00000000000000000000000-00000000000000000000000-00000000000000000000000-00000000000000000000000-00000000000000000000000"
    // }
    onEndConstact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    }
    NodePosChange() {
        if (this.BaChu == false) {
            if (this.ChaZuo != null) {
                this.node.setWorldPosition(this.ChaZuo.worldPosition.x - 15, this.ChaZuo.worldPosition.y + 110, this.ChaZuo.worldPosition.z);
                this.ChaZuo.getComponent(BoxCollider2D).enabled = false;
                this.node.getComponent(Sprite).enabled = false;
                this.node.children[0].active = true;
                this.CreatWire();
                this.DianLia.active = true;
                this.DianLia.getComponent(Animation).play();
                this.BaChu = true;
                SJCD_GameManager.Instance.win();
            }
        }
    }
}


