import { _decorator, Component, debug, director, Node, Sprite, SpriteFrame, Tween, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TicketController')
export class TicketController extends Component {

    @property(Vec3)
    gamePos : Vec3 = new Vec3();

    @property(Vec3)
    enterPos : Vec3 = new Vec3();

    @property(Vec3)
    leavePos : Vec3 = new Vec3();

    
    @property([SpriteFrame])
    Backgrounds : SpriteFrame[] = [];

    @property(Sprite)
    sp : Sprite = new Sprite();

    currentidx : number = 0;

    currentPrice : number[] = [5, 50];
    
    protected onEnable(): void {
        director.getScene().on("initSp", this.initSp, this);
    }

    protected start(): void {
        this.node.position = this.gamePos;
    }

    initSp(idx : number){
        this.sp.spriteFrame = this.Backgrounds[idx];
        this.currentidx = idx;
    }
    
    Entering(){
        Tween.stopAllByTarget(this.node);
        this.node.position = this.enterPos;
        tween(this.node).to(0.3, {position : this.gamePos}).call(() => {}).start();
    }
    Leaving(){
        Tween.stopAllByTarget(this.node);
        tween(this.node).to(0.3, {position : this.leavePos}).call(() => {}).start();    
    }

    protected onDisable(): void {
        director.getScene().off("initSp", this.initSp, this);
    }
}


