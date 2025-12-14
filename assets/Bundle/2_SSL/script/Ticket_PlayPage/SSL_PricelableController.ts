import { _decorator, Component, Label, lerp, math, Node, Sprite, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PricelableController')
export class PricelableController extends Component {

    @property(Vec3)
    Inpos : Vec3 = new Vec3();
    @property(Vec3)
    Outpos : Vec3 = new Vec3();

    Ining : boolean = false;
    Outing : boolean = false;

    lable : Label = null;

    protected onLoad(): void {
        this.node.setPosition(this.Outpos);
        this.lable = this.getComponentInChildren(Label);
    }

    public comeTopage(){
        this.Ining = true;
        tween(this.node).to(0.3, { position: this.Inpos }).call(() => {
            this.node.setPosition(this.Inpos);
        }).start();
    }
    public leaveTopage(){
        this.Outing = true;
        tween(this.node).to(0.3, { position: this.Outpos }).call(() => {
            this.node.setPosition(this.Outpos);
        }).start();
    }

    setLable(num : number){
        this.lable.string = num.toString();
    }

    update(deltaTime: number) {
        if (this.Ining){
            if (this.node.getPosition() == this.Inpos){
                this.Ining = false;
            }
        }else if (this.Outing){
            
            if (this.node.getPosition() == this.Outpos){
                this.Outing = false;
            }
        }
    }
}


