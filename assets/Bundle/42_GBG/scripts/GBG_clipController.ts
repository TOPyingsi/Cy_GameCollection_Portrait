import { _decorator, Component, director, EventTouch, Graphics, Input, input, Node, tween, Vec2, Vec3 } from 'cc';
import { buttonClipController } from './GBG_buttonClipController';
import { leftClipController } from './GBG_leftClipController';
import { rightClipController } from './GBG_rightClipController';
const { ccclass, property } = _decorator;

@ccclass('clipController')
export class clipController extends Component {
    @property(buttonClipController)
    button : buttonClipController;
    @property(leftClipController)
    left : leftClipController;
    @property(rightClipController)
    right : rightClipController;

    @property(Vec3)
    buttonLeavePos : Vec3 = new Vec3();
    isbuttonLeave : boolean = false;
    @property(Vec3)
    rightLeavePos : Vec3 = new Vec3();
    isrightLeave : boolean = false;
    @property(Vec3)
    leftLeavePos : Vec3 = new Vec3();
    isleftLeave : boolean = false;

    buttonLeave(){
        tween(this.button.node).to(1, {position : this.buttonLeavePos}).call(()=>{}).start();
    }
    leftLeave(){
        tween(this.left.node).to(1, {position : this.leftLeavePos}).call(()=>{}).start();
    }
    rightLeave(){
        tween(this.right.node).to(1, {position : this.rightLeavePos}).call(()=>{}).start();
    }
    wincnt : number = 0;
    protected update(dt: number): void {
        if (!this.isbuttonLeave && this.button.firstT && this.button.secondT) {
            this.isbuttonLeave = true;
            this.buttonLeave();
            this.wincnt++;
        }
        if (!this.isleftLeave && this.left.firstT && this.left.secondT){
            this.isleftLeave = true;
            this.leftLeave();
            this.wincnt++;
        }
        if (!this.isrightLeave && this.right.firstT && this.right.secondT){
            this.isrightLeave = true;
            this.rightLeave();
            this.wincnt++;
        }
        if (this.wincnt == 3){
            this.wincnt++;
            director.getScene().emit("Win");
        }
    }

}


