import { _decorator, AudioSource, Component, log, Node } from 'cc';
import { SHJXF_GlobalDt } from './SHJXF_GlobalDt';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SHJXF_CW')
export class SHJXF_CW extends Component {

    //判断是否游戏失败
    private isOver:Boolean =  false;

    update(deltaTime: number) {
        if (SHJXF_GlobalDt.Instance.curErrorNum) {
            if(this.isOver){
                return;
            }
            let n: string = SHJXF_GlobalDt.Instance.curErrorNum.toString();
            if (SHJXF_GlobalDt.Instance.curErrorNum >= 4) {
                
                //游戏失败
                GamePanel.Instance.Lost();
                this.isOver = true;
                return;

            }else{
                // this.playCuowu();
                this.node.getChildByName(n).active = true;
            }
            
        }

    }

    // playCuowu(){
    //     this.node.getComponent(AudioSource).play();

    // }
}


