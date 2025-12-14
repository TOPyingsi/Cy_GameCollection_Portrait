import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('confirmCheck')
export class confirmCheck extends Component {
    

    protected onEnable(): void {
        this.node.setScale(Vec3.ZERO);    
    }

    Openconfirm(){
        tween(this.node).to(0.3, {scale : Vec3.ONE} , {easing : 'quadIn'}).call(()=>{}).start();
    }
    Closeconfirm(){
        this.node.setScale(Vec3.ZERO);    
    }

}


