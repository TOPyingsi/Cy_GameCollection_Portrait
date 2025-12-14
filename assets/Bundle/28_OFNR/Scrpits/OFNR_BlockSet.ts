import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, director, IPhysics2DContact, Node, PhysicsSystem2D, Sprite, SpriteFrame, tween, UITransform, Vec2, Vec3 } from 'cc';
import { OFNR_BlockSpawn } from './OFNR_BlockSpawn';
import { OFNR_RoleControl } from './OFNR_RoleControl';
const { ccclass, property } = _decorator;

@ccclass('OFNR_BlockSet')
export class OFNR_BlockSet extends Component {

    @property([SpriteFrame])
    private blockSpriteFrames: SpriteFrame[] = [];
    private _uiTransform: UITransform = null;
    private blockId:number=-1;

    private currentTween: any;

    private targetPrefab1: Node = null; 
    private targetPrefab2:Node=null;
    public setBlockId(id:number){
       this.blockId=id; 
    }
    public getBlockId(){
        return this.blockId;
    }

    protected onLoad(): void {
        this._uiTransform = this.getComponent(UITransform);
        director.on("DontMove",this.dontMove,this);
        director.on("Move",this.move,this);
        this.targetPrefab1=this.node.parent.getChildByName("OFNR_Nezha")
        this.targetPrefab2 =this.node.parent.getChildByName("OFNR_Aobin")
    }
    dontMove(){
        if(this.currentTween){
            this.currentTween.stop();
        }
    }
    move(){
        if(this.currentTween){
            this.currentTween.start();
        }
    }
   
    start() {
        
         this.node.setScale(new Vec3(0.3, 0.3, 1));
         this.currentTween = tween(this.node)
            .parallel(  // 同时执行位移和缩放动画
                tween()
                .by(8, { position: new Vec3(0, -1500, 0) }, { easing: 'sineOut' }),
                tween()
                .to(8, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            )
            .start()
        this.node.getComponent(Sprite).spriteFrame=this.blockSpriteFrames[this.blockId];
    }


    update(deltaTime: number) {
        
    }
}


