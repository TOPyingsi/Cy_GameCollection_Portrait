import { _decorator, Component, lerp, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UI_breath')
export class UI_breath extends Component {
    @property(Vec3)
    scale : Vec3 = new Vec3();

    @property(Boolean)
    isBreathing : boolean = true;

    isReduce : boolean = true;
    protected update(dt: number): void {
        if (this.isBreathing){
            // console.log("isbreathing");
            if (this.isReduce){
                // console.log("isreduce");
                tween(this.node).to(0.3, {scale : this.scale}, {easing : "bounceOut"} ).call(()=>{
                    this.isReduce = false;
                }).start();
            }else{
                // console.log("isadd");
                tween(this.node).to(0.3, {scale : Vec3.ONE}, {easing : "bounceIn"} ).call(()=>{
                    this.isReduce = true;
                }).start();
            }
        }
    }
}


