import { _decorator, Animation, AudioSource, Component, Label, Node, Sprite } from 'cc';
import { SHJDDH_GlobalDt } from './SHJDDH_GlobalDt';
import { SHJDDH_Phone } from './SHJDDH_Phone';
const { ccclass, property } = _decorator;

@ccclass('SHJDDH_Click')
export class SHJDDH_Click extends Component {
    
    clickN(){
        SHJDDH_GlobalDt.Instance.clickObject = Number(this.node.name);
        for(let child of this.node.parent.children){
            child.getChildByName("bg").active = false;
        }
        this.node.getChildByName("bg").active = true;
        console.log(this.node.name);
        console.log(SHJDDH_GlobalDt.Instance.clickObject);
    }

    clickAnswer(){//接听

        this.node.parent.active = false;
        //跳到对应的电话界面
        console.log("接听");
        let video:Node = this.node.parent.parent.getChildByName("video");

        video.getComponent(AudioSource).clip =  SHJDDH_GlobalDt.Instance.cilps[SHJDDH_GlobalDt.Instance.clickObject];
        video.getChildByName("bg").getComponent(Sprite).spriteFrame = SHJDDH_GlobalDt.Instance.bgs[SHJDDH_GlobalDt.Instance.clickObject];

        video.active = true;

        let roleAni:Animation = video.getChildByName("role").getComponent(Animation);
        roleAni.defaultClip = roleAni.clips[SHJDDH_GlobalDt.Instance.clickObject];
        roleAni.play();

    }

    clickReject(){//拒绝

        this.node.parent.active = false;
        this.node.parent.parent.getChildByName("playArea").active = true;

    }

    clickDial(){//拨号

        let p:Node = this.node.parent.parent.getChildByName("phone");
        let pTs:SHJDDH_Phone = p.getComponent(SHJDDH_Phone);
        p.getChildByName("role").getComponent(Sprite).spriteFrame = pTs.roleImg[SHJDDH_GlobalDt.Instance.clickObject];

        let n:string = SHJDDH_GlobalDt.Instance.clickObject.toString();
        let str:string = this.node.parent.getChildByName("ScrollView").getChildByName("view").getChildByName("content").getChildByName(n).getChildByName("Label").getComponent(Label).string;
        p.getChildByName("Label").getComponent(Label).string = str;
        p.active = true;
        this.node.parent.active = false;

    }

    clickE(){//挂断

        this.node.parent.parent.getComponent(AudioSource).play();
        this.node.parent.active = false;
        this.node.parent.parent.getChildByName("playArea").active = true;

    }
}


