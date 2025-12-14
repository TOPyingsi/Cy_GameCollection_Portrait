import { _decorator, Component, director, Node, Sprite, SpriteFrame, tween, Tween, TweenEasing, Vec3 } from 'cc';
import { SoundplayManager } from '../Manage/SSL_SoundplayManager';
const { ccclass, property } = _decorator;

@ccclass('mainPageTicketController')
export class mainPageTicketController extends Component {
    @property(Vec3)
    gamePos : Vec3 = new Vec3();

    @property(Vec3)
    leftPos : Vec3 = new Vec3();

    @property(Vec3)
    rightPos : Vec3 = new Vec3();

    @property([SpriteFrame])
    Backgrounds : SpriteFrame[] = [];

    @property(Sprite)
    sp : Sprite = new Sprite();

    currentPrice : number[] = [5, 50];
    currentidx : number = 0;

    protected start(): void {
        this.node.position = this.leftPos;
    }
    
    Entering(){
        Tween.stopAllByTarget(this.node);
        this.node.position = this.leftPos;
        tween(this.node).to(0.3, {position : this.gamePos}, {easing : "bounceInOut"}).call(() => {}).start();
    }
    Leaving(){
        Tween.stopAllByTarget(this.node);
        tween(this.node).to(0.3, {position : this.rightPos}).call(() => {}).start();    
    }
    
    goTo(Startpos : Vec3, Endpos : Vec3, easingS : TweenEasing, duration : number){
        Tween.stopAllByTarget(this.node);
        this.node.position = Startpos;  
        tween(this.node).to(duration, {position : Endpos}, {easing : easingS}).call(() => {}).start();    
    }

    changeSpf(idx : number){
        idx = (idx + this.Backgrounds.length) % this.Backgrounds.length;
        this.currentidx = idx;
        this.sp.spriteFrame = this.Backgrounds[this.currentidx];
        director.getScene().emit("changeNum", this.currentPrice[idx]);
    }

    goLeft(){
        SoundplayManager.instance.playOnce("点击");
        this.goTo(this.node.position, this.leftPos, "smooth", 0.3);
        this.scheduleOnce(() => {this.changeSpf(this.currentidx - 1)}, 0.3);
        this.scheduleOnce(() => {this.goTo(this.rightPos, this.gamePos, "smooth", 0.3)}, 0.3);
    }
    goRight(){
        SoundplayManager.instance.playOnce("点击");
        this.goTo(this.node.position, this.rightPos, "smooth", 0.3);
        this.scheduleOnce(() => {this.changeSpf(this.currentidx + 1)}, 0.3);
        this.scheduleOnce(() => {this.goTo(this.leftPos, this.gamePos, "smooth", 0.3)}, 0.3);
    }
}


