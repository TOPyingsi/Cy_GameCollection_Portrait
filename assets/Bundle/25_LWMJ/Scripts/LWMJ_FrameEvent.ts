import { _decorator, Animation, Component, find, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LWMJ_FrameEvent')
export class LWMJ_FrameEvent extends Component {
    private hand: Node = null!;
    @property(Node)
    private zjd1: Node = null!;

    protected start(): void {
        this.hand=this.node.parent.getChildByName("LWMJ_Hand");
        console.log(this.hand);
    }
    mabu(){
        this.hand.getChildByName("01").active=false;
        this.node.getComponent(Sprite).spriteFrame=null;
        this.node.getComponent(Animation).stop();
    }
    zjd(id:number){
        switch(id){
            case 1:
            this.zjd1.active=false;
            this.hand.getChildByName("1").active=false;
            this.hand.getChildByName("1-1").active=true;
            break; 
            case 2:
            this.hand.getChildByName("2").active=false;
            this.hand.getChildByName("2-1").active=true;
            break;
            case 3:
            this.hand.getChildByName("3").active=false;
            this.hand.getChildByName("3-1").active=true;
            break;
            case 4:
            this.hand.getChildByName("4").active=false;
            this.hand.getChildByName("4-1").active=true;
            break;
            case 5:
            this.hand.getChildByName("5").active=false;
            this.hand.getChildByName("5-1").active=true;
            this.zjd1.active=true;
            this.node.getComponent(Animation).stop();
            break;

        }
    }
    xiejia(id:number){
        switch(id){
            case 1:
            this.hand.getChildByName("xiejia").getChildByName("1").active=true;
            break; 
            case 2:
            this.hand.getChildByName("xiejia").getChildByName("2").active=true;
            break;
            case 3:
            this.hand.getChildByName("xiejia").getChildByName("3").active=true;
            break;
            case 4:
            this.hand.getChildByName("xiejia").getChildByName("4").active=true;
            break;
            case 5:
            this.hand.getChildByName("xiejia").getChildByName("5").active=true;
            this.node.getComponent(Animation).stop();
            break;
        }
    }
    gantui(id:number){
        switch(id){
            case 1:
            this.hand.getChildByName("gantui").getChildByName("1").active=true;
            break; 
            case 2:
            this.hand.getChildByName("gantui").getChildByName("2").active=true;
            break;
            case 3:
            this.hand.getChildByName("gantui").getChildByName("3").active=true;
            break;
            case 4:
            this.hand.getChildByName("gantui").getChildByName("4").active=true;
            break;
            case 5:
            this.hand.getChildByName("gantui").getChildByName("5").active=true;
            this.node.getComponent(Animation).stop();
            break;
        } 
    }
    spj(id:number){
        switch(id){
            case 1:
            this.hand.getChildByName("spj").getChildByName("61").active=false;
            break;
            case 2:
            this.hand.getChildByName("spj").getChildByName("62").active=false;
            break;
            case 3:
            this.hand.getChildByName("spj").getChildByName("63").active=false;
            break;
            case 4:
            this.hand.getChildByName("spj").getChildByName("64").active=false;
            break;
            case 5:
            this.hand.getChildByName("spj").getChildByName("65").active=false;
            this.node.getComponent(Animation).stop(); 
            break;
        }
    }
    hjt(id:number){
        switch(id){
            case 1:
            this.hand.getChildByName("hjt").getChildByName("1").active=true;
            break; 
            case 2:
            this.hand.getChildByName("hjt").getChildByName("2").active=true;
            break;
            case 3:
            this.hand.getChildByName("hjt").getChildByName("3").active=true;
            break;
            case 4:
            this.hand.getChildByName("hjt").getChildByName("4").active=true;
            break;
            case 5:
            this.hand.getChildByName("hjt").getChildByName("5").active=true;
            this.node.getComponent(Animation).stop();
            break;
        }
    }
    hjy(id:number){
        switch(id){
            case 1:
            this.hand.getChildByName("hjy").getChildByName("1").active=true;
            break;
            case 2:
            this.hand.getChildByName("hjy").getChildByName("2").active=true;
            break;
            case 3:
            this.hand.getChildByName("hjy").getChildByName("3").active=true;
            break;
            case 4:
            this.hand.getChildByName("hjy").getChildByName("4").active=true;
            break;
            case 5:
            this.hand.getChildByName("hjy").getChildByName("5").active=true;
            this.node.getComponent(Animation).stop();
            break; 
        } 
    }
    zd(id:number){
        switch(id){
            case 1:
            this.hand.getChildByName("zd").getChildByName("光").active=true;
            break; 
            case 2:
            this.hand.getChildByName("zd").getChildByName("光").active=false;
            this.node.getComponent(Animation).stop();
            break;
        }
    }
    js(id:number){
        switch(id){
            case 1:
            this.hand.getChildByName("js").getChildByName("1").active=true;
            break; 
            case 2:
            this.hand.getChildByName("js").getChildByName("2").active=true;
            break;
            case 3:
            this.hand.getChildByName("js").getChildByName("3").active=true
            break;
            case 4:
            this.hand.getChildByName("js").getChildByName("4").active=true;
            break;
            case 5:
            this.hand.getChildByName("js").getChildByName("5").active=true;
            this.node.getComponent(Animation).stop();
            break;
        } 
    }
    jp(id:number){
        this.hand.getChildByName("甲片").active=true;
        this.node.getComponent(Animation).stop();
    }
    jzj(id:number){
        switch(id){
            case 1:
            this.hand.getChildByName("jzj").getChildByName("1").active=true;
            break;
            case 2:
            this.hand.getChildByName("jzj").getChildByName("2").active=true;
            break;
            case 3:
            this.hand.getChildByName("jzj").getChildByName("3").active=true;
            break;
            case 4:
            this.hand.getChildByName("jzj").getChildByName("4").active=true;
            break;
            case 5:
            this.hand.getChildByName("jzj").getChildByName("5").active=true;
            this.hand.getChildByName("甲片").active=false;
            this.node.getComponent(Animation).stop();
            break; 
        }
    }
    dmt(id:number){
        switch(id){
            case 1:
            this.hand.getChildByName("dmt").getChildByName("1").active=true;
            break;
            case 2:
            this.hand.getChildByName("dmt").getChildByName("2").active=true;
            break;
            case 3:
            this.hand.getChildByName("dmt").getChildByName("3").active=true;
            break;
            case 4:
            this.hand.getChildByName("dmt").getChildByName("4").active=true;
            break;
            case 5:
            this.hand.getChildByName("dmt").getChildByName("5").active=true;
            this.node.getComponent(Animation).stop();
            break; 
        } 
    }
    dj(id:number){
        switch(id){
            case 1:
            this.hand.getChildByName("dj").getChildByName("1").active=true;
            break; 
            case 2:
            this.hand.getChildByName("dj").getChildByName("2").active=true;
            break;
            case 3:
            this.hand.getChildByName("dj").getChildByName("3").active=true;
            break;
            case 4:
            this.hand.getChildByName("dj").getChildByName("4").active=true;
            break;
            case 5:
            this.hand.getChildByName("dj").getChildByName("5").active=true;
            this.node.getComponent(Animation).stop();
            break;
        }
    }
    tls(id:number){
        switch(id){
            case 1:
            this.hand.getChildByName("tls").getChildByName("1").active=true;
            break;
            case 2:
            this.hand.getChildByName("tls").getChildByName("2").active=true;
            break;
            case 3:
            this.hand.getChildByName("tls").getChildByName("3").active=true;
            break;
            case 4:
            this.hand.getChildByName("tls").getChildByName("4").active=true;
            break;
            case 5:
            this.hand.getChildByName("tls").getChildByName("5").active=true;
            this.node.getComponent(Animation).stop();
            break; 
        } 
    }
    fc(id:number){
        switch(id){
            case 1:
            this.hand.getChildByName("fc").getChildByName("1").active=true;
            break;
            case 2:
            this.hand.getChildByName("fc").getChildByName("2").active=true;
            break;
            case 3:
            this.hand.getChildByName("fc").getChildByName("3").active=true;
            break;
            case 4:
            this.hand.getChildByName("fc").getChildByName("4").active=true;
            break;
            case 5:
            this.hand.getChildByName("fc").getChildByName("5").active=true;
            this.node.getComponent(Animation).stop();
            break; 
        } 
    }
    jjm(){
        this.hand.getChildByName("gantui").active=false;
        this.hand.getChildByName("xiejia").active=false;
    }
}


