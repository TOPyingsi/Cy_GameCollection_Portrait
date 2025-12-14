import { _decorator, Component, director, EventTouch, Input, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OFNR_HeYe')
export class OFNR_HeYe extends Component {
    private isMove:boolean=false;
    onLoad() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        director.on("isMove",this.moveSet,this);
    }
    moveSet(){
        this.isMove=true; 
    }
    // 触摸事件处理
    private onTouchStart(event: EventTouch) {
        if(this.isMove){
            const currentPos = this.node.getPosition();
        tween(this.node)
            .to(0.5, { position: new Vec3(currentPos.x + 300, currentPos.y, 0) }, { easing: 'sineOut' })
            .start();
        }
        
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
}


