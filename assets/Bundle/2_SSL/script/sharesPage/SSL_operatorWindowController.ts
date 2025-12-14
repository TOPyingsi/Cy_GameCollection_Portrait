import { _decorator, Component, Label, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { sharesData } from '../SSL_sharesData';
import { SoundplayManager } from '../Manage/SSL_SoundplayManager';
const { ccclass, property } = _decorator;

@ccclass('operatorWindowController')
export class operatorWindowController extends Component {


    sharesdata : sharesData = null;
    @property([SpriteFrame])
    spss : SpriteFrame[] = [];
    @property([Sprite])
    sp : Sprite = null;
    @property([Label])
    haveNumber : Label = null;
    
    type : number = 0;

    protected onLoad(): void {
        this.node.setScale(Vec3.ZERO);    
    }
    Openwindow(_sharesdata : sharesData, opType : number){
        SoundplayManager.instance.playOnce("点击");
        this.sharesdata = _sharesdata;
        this.sp.spriteFrame = this.spss[opType];
        this.type = opType == 0 ? -1 : 1;
        this.haveNumber.string = this.sharesdata.sharesHave.toString();
        tween(this.node).to(0.3, {scale : Vec3.ONE}).call(()=>{}).start();
    }
    Closewindow(){    
        SoundplayManager.instance.playOnce("点击");
        tween(this.node).to(0.3, {scale : Vec3.ZERO}).call(()=>{}).start();
    }


}


