import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('changeticketMove')
export class changeticketMove extends Component {
    @property(Vec3)
    gamePos : Vec3 = new Vec3();
    @property(Vec3)
    LeavePos : Vec3 = new Vec3();
    enterGame(){
        tween(this.node).to(0.3, {position : this.gamePos}).call(()=>{}).start();
    }
    
    leaveGame(){
        tween(this.node).to(0.3, {position : this.LeavePos}).call(()=>{}).start();
    }
}


