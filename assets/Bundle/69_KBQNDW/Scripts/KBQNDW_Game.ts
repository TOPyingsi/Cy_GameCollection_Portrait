import { _decorator, AudioSource, Component, director, Node, Prefab } from 'cc';
import { KBQNDW_GlobalDt } from './KBQNDW_GlobalDt';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('KBQNDW_Game')
export class KBQNDW_Game extends Component {

    @property(Prefab)
    panel:Prefab;
    
    protected onLoad(): void {
        GamePanel.Instance.answerPrefab = this.panel;
    }

    protected start(): void {
        if (ProjectEventManager.GameStartIsShowTreasureBox) director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
        else this.Init();
    }

    Init() {
        let audioSource = this.node.getComponent(AudioSource);
        audioSource.clip = KBQNDW_GlobalDt.Instance.audioGroup[0];
        let audioLength: number = audioSource.clip.getDuration()
        this.node.getComponent(AudioSource).play();
        this.node.getChildByName("notTouch").active = true;
        this.scheduleOnce(() => {
            this.node.getComponent(AudioSource).stop();
            this.node.getChildByName("wenzikuang").active = false;
            this.node.getChildByName("notTouch").active = false;
        }, audioLength)
    }
}


