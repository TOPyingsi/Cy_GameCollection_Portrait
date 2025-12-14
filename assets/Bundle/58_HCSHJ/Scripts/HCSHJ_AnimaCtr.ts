import { _decorator, Animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HCSHJ_AnimaCtr')
export class HCSHJ_AnimaCtr extends Component {



    hintEnd() {
        this.node.active = false;
    }

    sss(){
        this.node.parent.getChildByName("eggAnim1").getComponent(Animation).play();
        this.node.active = false;
    }

    breakEnd() {
        
        this.node.parent.getChildByName("role").active = true;
        // this.node.parent.getChildByName("particle").active = false;
        this.node.active = false;

    }


    appearEnd() {
        this.node.parent.getChildByName("SpriteSplash").active = true;
        // this.scheduleOnce(() => {
        //     this.node.parent.getChildByName("SpriteSplash").active = true;
        //     console.log(222);

        // }, 1);
        this.node.active = false;

    }

    whiteEnd() {
        this.node.active = false;
        this.node.parent.getChildByName("settlement").active = true;
    }

    chuiziEnd(){
        this.node.parent.getChildByName("eggMask").active = false;
        this.node.parent.getChildByName("eggAnim").active = true;
        this.node.parent.getChildByName("egg").active = false;
        this.node.parent.getChildByName("eggFront-001").active = true;

        this.node.active = false;
    }
    particleEnd(){
        this.node.parent.getChildByName("particle").active = true;
    }
}


