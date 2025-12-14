import { _decorator, Component, Contact2DType, Node, PhysicsSystem2D, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OFNR_BlockMove')
export class OFNR_BlockMove extends Component {
    @property(Node)
    block1: Node = null;

    @property(Node)
    block2: Node = null;

    protected onLoad(): void {
        this.block1=this.node.getChildByName("OFNR_MoveBlock1");
        this.block2=this.node.getChildByName("OFNR_MoveBlock2");
        this.blockAnimation();
    }
    start() {
        
    }
        
    

    update(deltaTime: number) {
        
    }

    blockAnimation(){
        if (!this.block1 || !this.block2) return;
        tween(this.block1)
        .set({ position: new Vec3(0, 300, 0), scale: Vec3.ZERO })
        .to(1, { 
            position: new Vec3(0, 0, 0), 
            scale: Vec3.ONE 
        }, { easing: "smooth" })
        .repeatForever()
        .start();

    tween(this.block2)
        .set({ position: new Vec3(0, 300, 0), scale:new Vec3(0.7,0.7,1) })
        .to(1, {
            position: new Vec3(0, 0, 0),
            scale: Vec3.ONE
        }, { easing: "smooth" })
        .repeatForever()
        .start();
    }
}


