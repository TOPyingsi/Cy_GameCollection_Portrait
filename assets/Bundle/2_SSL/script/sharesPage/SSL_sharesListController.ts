import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('sharesListController')
export class sharesListController extends Component {


    

    protected onLoad(): void {
        this.node.setScale(Vec3.ZERO);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    enterPage(){
        tween(this.node).to(0.3, {scale : Vec3.ONE}, {easing : "smooth"}).call(() => {}).start();
    }

    leavePage(){
        tween(this.node).to(0.3, {scale : Vec3.ZERO}, {easing : "smooth"}).call(() => {}).start();    
    }

}


