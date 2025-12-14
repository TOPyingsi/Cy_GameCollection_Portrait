import { _decorator, AudioClip, AudioSource, Component, director, EventTouch, Graphics, Input, Node, ParticleSystem2D, PhysicsSystem2D, tween, UITransform, Vec2, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('NeedleController')
export class NeedleController extends Component {
    @property(Graphics)
    graph: Graphics;

    GraphUIt: UITransform;

    pars : ParticleSystem2D;

    point: Vec3[] = [];

    as : AudioSource = new AudioSource();

    @property(Node)
    fx : Node;
    @property(Node)
    circle : Node;
    @property(AudioClip)
    clip : AudioClip;

    protected onLoad(): void {
        this.GraphUIt = this.graph.getComponent(UITransform);
        this.pars = this.getComponentInChildren(ParticleSystem2D);
    }
    
    protected onEnable(): void {
        this.node.on(Input.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.on(Input.EventType.TOUCH_END, this.TOUCH_END, this);
        this.pars.enabled = false;
        this.as.clip = this.clip;
    }

    startFx(){
        tween(this.fx).to(1, {angle : 360}).call(()=>{
            tween(this.fx).to(1, {angle : 0}).call(()=>{
                this.startFx();
            }).start();
        }).start();
    }
    
    startCircle(){
        tween(this.circle).to(1, {scale : Vec3.ONE}).call(()=>{
            tween(this.circle).to(1, {scale : Vec3.ZERO}).call(()=>{
                this.startCircle();
            }).start();
        }).start();
    }

    protected start(): void {
        this.startFx();
        this.startCircle();
    }

    TOUCH_START(event: EventTouch) {
        this.point.push((new Vec3(event.getUILocation().x, event.getUILocation().y, 0)));
        this.node.setWorldPosition(this.point[this.point.length - 1]);
        this.pars.enabled = true;
        this.fx.active = false;
        this.circle.active = false;
    }

    TOUCH_END(event : EventTouch){
        // director.getScene().emit("Lose");
    }

    play(){
        if (this.as.playing) return;
        this.as.play();
    }
    
    TOUCH_MOVE(event: EventTouch) {
        this.point.push(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        this.play();
        this.node.setWorldPosition(this.point[this.point.length - 1]);
    }

    protected update(dt: number): void {
        this.draw();
    }

    private draw() {
        this.graph.clear();
        if (this.point.length > 0) {
            // console.log(this.point.length);
            this.graph.moveTo(this.GraphUIt.convertToNodeSpaceAR(this.point[0]).x - 172, this.GraphUIt.convertToNodeSpaceAR(this.point[0]).y - 231);
            for (let i = 1; i < this.point.length; i++) {
                this.graph.lineTo(this.GraphUIt.convertToNodeSpaceAR(this.point[i]).x - 172, this.GraphUIt.convertToNodeSpaceAR(this.point[i]).y - 231);
            }
        }
        this.graph.stroke();
    }

    protected onDisable(): void {
        this.node.off(Input.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.off(Input.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
    }
}


