import { _decorator, Animation, Component, Node } from 'cc';
import { SNDMX_AduioMgr } from './SNDMX_AduioMgr';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SNDMX_mgr')
export class SNDMX_mgr extends Component {

    @property(SNDMX_AduioMgr)
    audioMgr: SNDMX_AduioMgr;
    @property(Node)
    renzhe:Node;
    @property(Node)
    kafei:Node;
    @property(Node)
    mugun:Node;
    //游戏失败
    gameOver() {
        
        // this.audioMgr.PlayClip(13);
    }
    huidao(){
        console.log("木棍人攻击");
        
        this.renzhe.getComponent(Animation).play("Fly ");
    }
    
    rzhuidao(){
        this.kafei.getComponent(Animation).play("Fly2")
        this.mugun.getComponent(Animation).play("Fly2anim")
        // this.node.parent.getChildByName("openDoor").active = true;
    }
    gameLost(){
        GamePanel.Instance.Lost();
    }

    gameWin(){
        GamePanel.Instance.Win();
    }
}


