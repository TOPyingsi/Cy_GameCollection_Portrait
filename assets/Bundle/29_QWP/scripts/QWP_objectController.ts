import { _decorator, Component, director, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('objectController')
export class objectController extends Component {
    @property([SpriteFrame])
    spf : SpriteFrame[] = [];
    sp : Sprite;
    protected onLoad(): void {
        this.sp = this.getComponent(Sprite);
        let idx = (Number)(director.getScene().name[director.getScene().name.length - 1]) - 1;
        // console.log(idx);
        this.sp.spriteFrame = this.spf[idx];
    }
    
    protected start(): void {
        director.getScene().emit("uiT", this.node);
    }

}


