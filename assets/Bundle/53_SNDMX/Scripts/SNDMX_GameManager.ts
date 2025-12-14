import { _decorator, AnimationClip, AudioClip, Component, director, Node, Prefab } from 'cc';
import { UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { SNDMX_AduioMgr } from './SNDMX_AduioMgr';
import { SNDMX_Picturecontainer } from './SNDMX_Picturecontainer';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('SNDMX_GameManager')
export class SNDMX_GameManager extends Component {

    @property([Node])
    dropZonesContainerN: Node[] = []; // 存放所有目标区域节点的容器

    @property(Prefab)
    panel: Prefab;

    protected onLoad(): void {
        SNDMX_Picturecontainer.getInstance().dropZonesContainer = this.dropZonesContainerN;
        // UIManager.ShowTip("游戏载入");
        // GamePanel.Instance.time = 200;

        GamePanel.Instance.answerPrefab = this.panel;
        // this.dropZonesContainer.forEach(element => {
        //     console.log(element);
        //     SNDMX_Picturecontainer.getInstance().targetZones.push(element);
        // });
    }

    protected start(): void {
        if (ProjectEventManager.GameStartIsShowTreasureBox) director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
        else this.Init();
    }

    Init(){
        this.node.getComponent(SNDMX_AduioMgr).orderPlayClip(0);
    }



}


