import { _decorator, Component, Event, Node } from 'cc';
import { YSMNQ_UIManager } from '../YSMNQ_UIManager';
import { YSMNQ_PanelName } from './YSMNQ_PanelName';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_ManagerBase')
export class YSMNQ_ManagerBase extends Component {
    public startGame(): void {

    }

    


    backToMain(): void {
        YSMNQ_UIManager.Instance.showPanel(YSMNQ_PanelName.StartPanel);
        this.node.destroy();
        ProjectEventManager.emit(ProjectEvent.游戏结束, "医生模拟器");
    }


    backToStart(){
        YSMNQ_UIManager.Instance.showPanel(YSMNQ_PanelName.StartPanel);
        this.node.destroy();
        ProjectEventManager.emit(ProjectEvent.游戏结束, "医生模拟器");
    }
    
}


