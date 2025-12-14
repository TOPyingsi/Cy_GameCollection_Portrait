import { _decorator, Component, Node, Vec3, tween} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('sharesbutton')
export class sharesbutton extends Component {
    @property(Vec3)
    Inpos : Vec3 = new Vec3();
    @property(Vec3)
    Outpos : Vec3 = new Vec3();

    Ining : boolean = false;
    Outing : boolean = false;

    protected onLoad(): void {
        this.node.setPosition(this.Outpos);
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


