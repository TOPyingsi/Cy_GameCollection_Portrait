import { _decorator, AudioSource, Component, Node } from 'cc';
import { SHJXF_GlobalDt } from '../../59_SHJXF/Scripts/SHJXF_GlobalDt';
import { SHJXXB_Global } from './SHJXXB_GlobalDt';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SHJXXB_Frame')
export class SHJXXB_Frame extends Component {


    xinEnd() {
        this.scheduleOnce(() => {
            SHJXXB_Global.Instance.curNotTouch = false;
        }, 0.5);
    }

    over() {
        this.scheduleOnce(()=>{
            GamePanel.Instance.Lost();
        },0.5);


    }
    bingoStart() {
        let bingoAudio: AudioSource = this.node.getComponent(AudioSource);
        let audioLength: number = bingoAudio.clip.getDuration();
        this.scheduleOnce(() => {
            this.node.active = false;
        }, 1);
    }


}


