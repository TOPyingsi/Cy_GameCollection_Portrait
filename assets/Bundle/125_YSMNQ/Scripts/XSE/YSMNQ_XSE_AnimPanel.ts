import { _decorator, Animation, Component, Label, Node, Sprite, SpriteFrame, tween, v3 } from 'cc';
import Banner from 'db://assets/Scripts/Banner';
import { YSMNQ_AnimBase } from '../Common/YSMNQ_AnimBase';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_XSE_AnimPanel')
export class YSMNQ_XSE_AnimPanel extends Component {


    @property(Node)
    lblAnim: Node = null;

    @property(Node)
    btnBack: Node = null;

    
    @property(Node)
    tutorialAnim: Node = null;



    private _cb:Function = null;

    onLoad(): void {
        this.node.active = false;
    }

    show(cb:()=>void): void {
        this.tutorialAnim.active = false;
        this.btnBack.active = false;

        this._cb = cb;
        this.node.active = true;
        this.node.scale = v3(0,0,0);
        tween(this.node)
            .to(0.5,{scale:v3(1,1,1)})
            .call(()=>{
                this.node.scale = v3(1,1,1);
                this.node.getComponent(Animation).play("start");
                let duration = this.node.getComponent(Animation).getState("start").duration;
                this.scheduleOnce(()=>{
                    this.lblAnim.getComponent(YSMNQ_AnimBase).play();
                    this.scheduleOnce(()=>{
                        this.btnBack.active = true;
                        this.btnBack.on("click",()=>{
                            this.hide();
                        })
                        this.tutorialAnim.active = true;
                        this.node.getComponent(Animation).play("tutorial");
                    },3.2);
                },duration);

            })
            .start();
    }

    hide(): void {
       tween(this.node)
            .to(0.5,{scale:v3(0,0,0)})
            .call(()=>{
                this._cb&&this._cb();
                this.node.active = false;
            })
            .start();
    }
}


