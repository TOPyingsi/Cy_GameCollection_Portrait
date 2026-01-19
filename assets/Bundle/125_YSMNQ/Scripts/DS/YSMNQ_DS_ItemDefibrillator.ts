import { _decorator, Animation, Button, Component, Node, Touch, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_DS_ItemDefibrillator')
export class YSMNQ_DS_ItemDefibrillator extends Component {

    @property(Node)
    tutorialNode: Node = null;

    @property(Node)
    electricShockAnim: Node = null;

    @property(Node)
    btnPress: Node = null;

    startPos: Vec3 = null;

    isEnough: boolean = false;

    count:number = 0;

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
        this.count = 0;
        this.btnPress.on(Node.EventType.TOUCH_END, this.onBtnClick, this);
        this.electricShockAnim.active = false;
        this.showTutorial();
    }

    onBtnClick(){
        this.count++;
        this.hideTutorial();
        this.btnPress.off(Node.EventType.TOUCH_END);
        this.electricShockAnim.active = true;
        this.node.getComponent(Animation).play("electricShock");
        let duration = this.node.getComponent(Animation).getState("electricShock").duration;
        this.scheduleOnce(()=>{
            if(this.count>=3){
                this.count = 0;
                this._cb();
                this.btnPress.off("click");
                this.node.active = false;
            }
            else{
                this.electricShockAnim.active = false;
                this.showTutorial();
                this.btnPress.on(Node.EventType.TOUCH_END, this.onBtnClick, this);
            }
        }, duration);
    }
 

}


