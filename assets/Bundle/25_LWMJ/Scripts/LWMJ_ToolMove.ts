import { _decorator, Component, EventTouch, input, Input, Node, ScrollView, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LWMJ_ToolMove')
export class LWMJ_ToolMove extends Component {
    @property(ScrollView)
    public scrollView: ScrollView = null!;

    @property(Node)
    public content: Node = null!;

    @property
    public scrollSpeed: number = 1;

    private _startPos: Vec2 = new Vec2();
    private _isDragging: boolean = false;

    start() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch) {
        console.log('触摸开始');
        this._startPos = event.getUILocation();
        this._isDragging = true;
    }

    private onTouchMove(event: EventTouch) {
        if (!this._isDragging) return;

        const currentPos = event.getUILocation();
        const deltaX = (currentPos.x - this._startPos.x) * this.scrollSpeed;
        
        // 更新内容位置
        const contentPos = this.content.position.clone();
        contentPos.x += deltaX;
        this.content.setPosition(contentPos);
        
        this._startPos = currentPos;
    }

    private onTouchEnd() {
        this._isDragging = false;
        // 这里可以添加惯性滚动逻辑
    }

    update(deltaTime: number) {
        // 可在此处添加边界限制逻辑
    }
}


