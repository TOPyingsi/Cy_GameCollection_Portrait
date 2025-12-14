import { _decorator, AudioClip, Component, Node, Prefab } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SHJXXB_Global')
export class SHJXXB_Global extends Component {

    @property(Prefab)
    panel: Prefab;

    @property([Node])
    TriggerN: Node[] = [];

    @property([AudioClip])
    audios: AudioClip[] = [];

    public xin: number = 3;

    //判断是否可以进行触摸点击事件
    public curNotTouch: Boolean = false;

    //保存播放次数
    public Progress: number = 0;
    
    private static _instance: SHJXXB_Global = null;

    public static get Instance(): SHJXXB_Global {
        return SHJXXB_Global._instance;
    }

    protected onLoad(): void {
        SHJXXB_Global._instance = this;
    }



    protected onEnable(): void {
        GamePanel.Instance.answerPrefab = this.panel;

    }
}


