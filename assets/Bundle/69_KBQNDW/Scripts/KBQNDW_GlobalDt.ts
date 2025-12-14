import { _decorator, AudioClip, AudioSource, Component, Node, TERRAIN_HEIGHT_BASE } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('KBQNDW_GlobalDt')
export class KBQNDW_GlobalDt extends Component {

    @property([AudioClip])
    audioGroup: AudioClip[] = [];

    //触发节点数组(一开始只有一个鲨鱼节点)
    triggerN: Node[] = [];

    //保存当前可以移动的娃娃序号，从上到下，从0开始
    wawaSequence: number = 0;

    //保存忍者抱娃次数
    embrace: number = 0;

    private static _instance: KBQNDW_GlobalDt = null;
    public static get Instance(): KBQNDW_GlobalDt {
        return this._instance
    }

    protected onLoad(): void {
        KBQNDW_GlobalDt._instance = this;
        let n1 = this.node.getChildByName("shayu");
        let n2 = this.node.getChildByName("nvkafeii");
        let n3 = this.node.getChildByName("renzhe");
        this.addTriggerN(n1);
        this.addTriggerN(n2);
        this.addTriggerN(n3);

    }


    addTriggerN(node: Node) {
        this.triggerN.push(node);
    }

    deleteTriggerN(node: Node) {
        if (!this.triggerN) {
            return;
        }
        let index: number = this.triggerN.indexOf(node);
        this.triggerN.splice(index, 1);
    }

    delDHK1() {
        let audio = this.node.getComponent(AudioSource);
        let audioLength = audio.clip.getDuration();
        this.scheduleOnce(() => {
            this.node.getChildByName("notTouch").active = false;
            this.node.getChildByName("对话框1").active = false;
        }, audioLength);
    }

    delDHK2() {
        let audio = this.node.getComponent(AudioSource);
        let audioLength = audio.clip.getDuration();
        this.scheduleOnce(() => {
            this.node.getChildByName("notTouch").active = false;
            this.node.getChildByName("对话框2").active = false;
            this.node.getChildByName("Label").active = false;
        }, audioLength);
    }
    delDHK3() {
        let audio = this.node.getComponent(AudioSource);
        let audioLength = audio.clip.getDuration();
        this.scheduleOnce(() => {
            this.node.getChildByName("notTouch").active = false;
            this.node.getChildByName("对话框3").active = false;
            
        }, audioLength);
    }

    gamewin(){
        let audio = this.node.getComponent(AudioSource);
        let audioLength = audio.clip.getDuration();
        this.node.getChildByName("notTouch").active = true;
        this.scheduleOnce(()=>{
            GamePanel.Instance.Win();
        },audioLength+1);
    }

}


