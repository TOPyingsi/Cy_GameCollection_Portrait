import { _decorator, Animation, Button, Component, Label, Node, Touch, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_FR_ItemMonitor')
export class YSMNQ_FR_ItemMonitor extends Component {

    @property(Node)
    tutorialNode: Node = null;

    @property(Node)
    btnPress: Node = null;

    @property(Label)
    lbl1: Label = null;

    @property(Label)
    lbl2: Label = null;

    @property(Label)
    lbl3: Label = null;



    label_1start: number = 90;
    label_1end: number = 139;

    label_2start: number = 60;
    label_2end: number = 89;

    label_3start: number = 60;
    label_3end: number = 100;

    isPressed: boolean = false;

    count:number = 0;

    // 计时器，用于控制label更新间隔
    private _timer: number = 0;

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
        this.isPressed = false;

        this.lbl1.string = this.lbl2.string = this.lbl3.string = "0";
        this.showTutorial();
    }

    onBtnClick(){
        this.count++;
        this.isPressed = true;
        this.hideTutorial();
        this.btnPress.off(Node.EventType.TOUCH_END);
        
        this.scheduleOnce(()=>{
            if(this.count>=3){
                this.count = 0;
                this.btnPress.off("click");
                this.isPressed = false;
                this.lbl1.string = "122";
                this.lbl2.string = "68";
                this.lbl3.string = "96";
                this.scheduleOnce(()=>{
                    this._cb();
                    this.node.active = false;
                },1)
            }
            else{
                this.showTutorial();
                this.btnPress.on(Node.EventType.TOUCH_END, this.onBtnClick, this);
            }
        }, 0.7);
    }



    update(deltaTime: number){
        if(this.isPressed){
            this._timer += deltaTime;
            
            // 每0.2秒更新一次label值
            if(this._timer >= 0.05){
                this._timer = 0;
                
                // 更新lbl1的值 (90-139)
                this.lbl1.string = Math.floor(Math.random() * (this.label_1end - this.label_1start + 1) + this.label_1start).toString();
                
                // 更新lbl2的值 (60-89)
                this.lbl2.string = Math.floor(Math.random() * (this.label_2end - this.label_2start + 1) + this.label_2start).toString();
                
                // 更新lbl3的值 (60-100)
                this.lbl3.string = Math.floor(Math.random() * (this.label_3end - this.label_3start + 1) + this.label_3start).toString();
            }
        }
    }
 

}


