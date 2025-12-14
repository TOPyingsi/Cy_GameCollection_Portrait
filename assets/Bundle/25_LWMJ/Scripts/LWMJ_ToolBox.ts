import { _decorator, Component, EventTouch, instantiate, Node, Prefab, UITransform, Vec3 } from 'cc';
import { LWMJ_AnimaControl } from './LWMJ_AnimaControl';
const { ccclass, property } = _decorator;

@ccclass('LWMJ_ToolBox')
export class LWMJ_ToolBox extends Component {
    @property
    private toolBoxId: number = 0;

    @property(Prefab)
    private toolPrefab: Prefab = null!;
    @property(Prefab)
    private toolPrefab2: Prefab = null!;

    private spawnedTool: Node | null = null; 
    private originalPos: Vec3 = new Vec3(); 

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        Vec3.copy(this.originalPos, this.node.position);
    }
    start() {

    }
    private onTouchStart(event: EventTouch) {
        if (this.toolBoxId === 20 && this.toolPrefab) {
            this.spawnedTool = instantiate(this.toolPrefab);
            this.spawnedTool.parent = this.node.parent;
            this.spawnedTool.setPosition(this.node.position);
        }
        else if (this.toolBoxId === 21 && this.toolPrefab2) {
            this.spawnedTool = instantiate(this.toolPrefab2);
            this.spawnedTool.parent = this.node.parent;
            this.spawnedTool.setPosition(this.node.position); 
        }
        
        event.propagationStopped = true;
    }

    private onTouchMove(event: EventTouch) {
         
        const touchPos = event.getUILocation();
        const worldPos = new Vec3(touchPos.x, touchPos.y, 0);
        const uiTrans = this.node.parent?.getComponent(UITransform);
        let newPos = uiTrans?.convertToNodeSpaceAR(worldPos) || worldPos;

        // 更新自身位置
        this.node.setPosition(newPos);

        // 同时更新生成的预制体位置
        if (this.spawnedTool) {
            this.spawnedTool.setPosition(newPos);
        }
    }
    private onTouchEnd() {
        const animControl = this.node.scene.getComponentInChildren(LWMJ_AnimaControl);
            if (animControl) {
                animControl.checkPosition(this.node.worldPosition,this.toolBoxId,this.node);
            }
        // 触摸结束重置位置
        this.node.setPosition(this.originalPos);
        
        // 移除生成的预制体
        if (this.spawnedTool) {
            this.spawnedTool.destroy();
            this.spawnedTool = null;
        }
    }

    update(deltaTime: number) {
        
    }
}


