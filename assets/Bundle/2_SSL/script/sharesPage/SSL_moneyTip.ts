import { _decorator, Color, color, Component, Label, labelAssembler, math, Node, tween, Vec3, Vec4 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('moneyTip')
export class moneyTip extends Component {

    lable : Label = null;

    isappear : boolean = false;

    protected onLoad(): void {
        this.lable = this.getComponent(Label);
        this.lable.color = color(255, 0, 0 , 0);
    }
    
    appear(){
        this.isappear = true;
        this.lable.color = color(255, 0, 0 , 255);
        console.log(this.lable.color);
        
    }
    
    protected update(dt: number): void {
        if (this.isappear){
            let cur = this.lable.color.a;
            if (cur == 0){
                this.isappear = false;
            }
            this.lable.color = color(255, 0, 0, math.lerp(cur, 0, dt));   
        }
    }
}


