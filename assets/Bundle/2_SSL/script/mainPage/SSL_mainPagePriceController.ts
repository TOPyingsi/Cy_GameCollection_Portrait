import { _decorator, Component, director, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('mainPagePriceController')
export class mainPagePriceController extends Component {
    @property(Vec3)
    Inpos : Vec3 = new Vec3();
    @property(Vec3)
    Outpos : Vec3 = new Vec3();

    Ining : boolean = false;
    Outing : boolean = false;
    lable : Label = null;

    protected onEnable(): void {
        
        director.getScene().on("changeNum", this.changeNum, this);
    }

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

    changeNum(num : number){
        this.lable.string = num.toString();
        console.log("DSDSA");
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

    protected onDisable(): void {
        
        director.getScene().off("changeNum", this.changeNum, this);
    }
}


