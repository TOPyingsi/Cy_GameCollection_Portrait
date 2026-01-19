import { _decorator, Component, Node, Sprite, SpriteFrame, tween, v3 } from 'cc';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_ItemSelectedPanel')
export class YSMNQ_ItemSelectedPanel extends Component {


    @property(Node)
    container: Node = null;


    @property([SpriteFrame])
    sps: SpriteFrame[] = [];


    private _cb:Function = null;

    onLoad(): void {
        this.node.active = false;
    }

    show(cb:(idx:number,spriteFrame:SpriteFrame)=>void): void {
        this._cb = cb;
        this.container.children.forEach((child,index) => {
            child.getChildByName("icon").getComponent(Sprite).spriteFrame = this.sps[index];
            child.off("click");
            child.on("click",() => {
                let idxs = [2,3,4,5]
                if(idxs.indexOf(index) != -1){
                   Banner.Instance.ShowVideoAd(()=>{
                    this.hide(()=>{
                        this._cb&&this._cb(index,this.sps[index]);
                    });
                   })
                }
                else{
                    this.hide(()=>{
                        this._cb&&this._cb(index,this.sps[index]);
                    });
                }
                
            })
        })
        this.node.active = true;
        this.node.scale = v3(0,0,0);
        tween(this.node)
            .to(0.5,{scale:v3(1,1,1)})
            .call(()=>{
                this.node.scale = v3(1,1,1);
            })
            .start();
    }

    hide(callback:()=>void): void {
       tween(this.node)
            .to(0.5,{scale:v3(0,0,0)})
            .call(()=>{
                callback&&callback();
                this.node.active = false;
            })
            .start();
       
    }
}


