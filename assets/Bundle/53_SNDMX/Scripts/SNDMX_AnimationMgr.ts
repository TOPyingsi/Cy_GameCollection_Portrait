import { _decorator, Animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SNDMX_AnimMgr')
export class SNDMX_AnimMgr extends Component {

    @property(Node)
    door:Node;
    @property(Node)
    Strike:Node;

    canPlay(){
        
        this.door.getComponent(Animation).play();
        this.Strike.getComponent(Animation).play();
        
    }
}


