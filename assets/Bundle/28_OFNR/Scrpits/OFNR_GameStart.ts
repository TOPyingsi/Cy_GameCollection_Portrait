import { _decorator, Component, Node } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('OFNR_GameStart')
export class OFNR_GameStart extends Component {
    start() {
        this.scheduleOnce(()=>{
            this.node.parent.getChildByName("OFNR_GameBg").active=true;
        },5);
    }

    update(deltaTime: number) {
        
    }
}


