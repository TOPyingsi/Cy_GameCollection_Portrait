import { _decorator, Animation, Component, Node, Touch, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_HDN_ItemQuilt')
export class YSMNQ_HDN_ItemQuilt extends Component {

    @property(Node)
    tutorialNode: Node = null;

    @property(Node)
    touchNode: Node = null;

    startPos: Vec3 = null;

    isEnough: boolean = false;

    private _cb:Function = null;
    
    protected onLoad(): void {
        this.tutorialNode.active = false;
    }

    showTutorial(): void {
        let anim = this.node.getComponent(Animation)
        anim.play("tutorial");
        this.tutorialNode.active = true;
    }

    hideTutorial(){
        this.node.getComponent(Animation).stop();
        this.tutorialNode.active = false;
    }

    init(cb:()=>void){
        this._cb = cb;
        this.startPos = this.touchNode.worldPosition.clone();
        this.touchNode.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchNode.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchNode.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.showTutorial();
    }

    
    /** 触摸开始：初始化角度 */
    private onTouchStart(event: Touch): void {
        if(this.isEnough)return;
        const touchPos = event.getUILocation(); // 触摸点世界坐标
        this.touchNode.setWorldPosition(v3(touchPos.x, touchPos.y, 0));
        this.hideTutorial();
        console.log( this.touchNode.worldPosition.y)
    }

    /** 触摸移动：实时更新角度和旋转 */
    private onTouchMove(event: Touch): void {
        if(this.isEnough)return;
        const touchPos = event.getUILocation();
        this.touchNode.setWorldPosition(v3(touchPos.x, touchPos.y, 0));

        if(( this.touchNode.worldPosition.y - this.startPos.y) >=100){
            console.log("足够")
            this.playAnim2();
            this.onTouchEnd(event);
            this.isEnough = true;
            this.cancelTouch();
        }
    }



    /** 触摸结束：重置状态 */
    private onTouchEnd(event: Touch): void {
        if(this.isEnough)return;
         this.touchNode.setWorldPosition(this.startPos);
    }
    
        
    playAnim2(){
        let anim = this.node.getComponent(Animation)
        anim.play("pull");
        tween(this.node)
        .delay(anim.getState("pull").duration)
        .delay(0.5)
        .call(()=>{
            this._cb();
            // this.node.active = false;
        })
        .start();
    }





    private cancelTouch(){
        this.touchNode.off(Node.EventType.TOUCH_START);
        this.touchNode.off(Node.EventType.TOUCH_MOVE);
        this.touchNode.off(Node.EventType.TOUCH_END);
        this.touchNode.off(Node.EventType.TOUCH_CANCEL);
    }

}


