import { _decorator, Component, EventTouch, Node, Tween, tween, UITransform, Vec2, Vec3 } from 'cc';
import { LWMJ_ToolBlock } from './LWMJ_ToolBlock';
import { LWMJ_AnimaControl } from './LWMJ_AnimaControl';
const { ccclass, property } = _decorator;

@ccclass('LWMJ_Tool')
export class LWMJ_Tool extends Component {
    private originalPos: Vec3 = new Vec3();
    private lastTouchPos: Vec3 = new Vec3(); 
    private isDragging: boolean = false;
    private boxId: number = -1;
    public getBoxId() {
        return this.boxId;
    }
    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        
        Vec3.copy(this.originalPos, this.node.position);
    }
    private onTouchStart(event: EventTouch) {
        event.propagationStopped = true;
    } 
    private onTouchMove(event: EventTouch) {
        
        const touchPos = event.getUILocation();
        const worldPos = new Vec3(touchPos.x, touchPos.y, 0);
        const uiTrans = this.node.parent?.getComponent(UITransform);
        let newPos = uiTrans?.convertToNodeSpaceAR(worldPos) || worldPos;
        this.node.setPosition(newPos);

    } 
    private onTouchEnd() {
        const animControl = this.node.scene.getComponentInChildren(LWMJ_AnimaControl);
    if (animControl) {
        animControl.checkPosition(this.node.worldPosition,this.boxId,this.node);
    }
    this.node.setPosition(this.originalPos);
    if(this.boxId==12)
    this.node.parent.getChildByName("CloseBg").active=true;
    }
    start() {
        this.boxId=this.node.parent.getComponent(LWMJ_ToolBlock).getID();
    }

    update(deltaTime: number) {
        
    }
}


