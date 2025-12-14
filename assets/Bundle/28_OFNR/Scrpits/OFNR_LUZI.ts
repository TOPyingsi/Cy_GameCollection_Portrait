import { _decorator, Component, director, EventTouch, Input, Node, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OFNR_LUZI')
export class OFNR_LUZI extends Component {
    private _offset = new Vec3();
    private _uiTransform: UITransform = null;
    private targetPrefab1: Node = null; 
    onLoad() {
        // 获取UI变换组件并绑定触摸事件
        this._uiTransform = this.getComponent(UITransform);
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch) {
        // 记录初始触摸位置差
        const touchPos = event.getUILocation();
        const nodePos = this.node.position.clone();
        this._offset = nodePos.subtract(new Vec3(touchPos.x, touchPos.y, 0));
    }

    private onTouchMove(event: EventTouch) {
        // 实时更新节点位置
        const touchPos = event.getUILocation();
        const newPos = new Vec3(touchPos.x + this._offset.x, touchPos.y + this._offset.y, 0);
        this.node.setPosition(newPos);
        director.emit("DontMove");
    }

    private onTouchEnd() {
        // 重置偏移量
        director.emit("Move");
        this._offset = new Vec3();
        this.node.setPosition(new Vec3(429.434,750.76,0));

    }
    start() {
        
    }

    update(deltaTime: number) {
        this.targetPrefab1=this.node.parent.getChildByName("滑动区域").getChildByName("移动方块").getChildByName("1");
            if (!this.targetPrefab1?.isValid) return;
            
            const targetPos3D = this.targetPrefab1.worldPosition;
            const targetPos = new Vec2(targetPos3D.x, targetPos3D.y);
            const bounds = this._uiTransform.getBoundingBoxToWorld();
            
            if (bounds.contains(targetPos)) {
                this.onTargetEnter(this.targetPrefab1); 
            }
    }
    private onTargetEnter(target:Node){
        this.node.active=false;
        target.destroy();
        director.emit("isSpawn",1);
        
    }
}


