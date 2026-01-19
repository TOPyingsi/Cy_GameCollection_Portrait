import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { YSMNQ_UIManager } from './YSMNQ_UIManager';
import { YSMNQ_ManagerBase } from './Common/YSMNQ_ManagerBase';
import { YSMNQ_PanelName } from './Common/YSMNQ_PanelName';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_GameManager')
export class YSMNQ_GameManager extends Component {
    static Instance: YSMNQ_GameManager = null;

      @property(Prefab)
      panelPrefab: Prefab[] = [];
   
      @property(Node)
      gameLayer: Node = null;

     onLoad(){
        YSMNQ_GameManager.Instance = this;
     }

     start(){
        YSMNQ_UIManager.Instance.showPanel(YSMNQ_PanelName.StartPanel);
     }


     enterGame(gameName: string){
         this.panelPrefab.forEach((prefab,index) => {
            if(prefab.name == gameName){
               let panelNode = instantiate(prefab);
               panelNode.parent = this.gameLayer;
               panelNode.getComponent(YSMNQ_ManagerBase).startGame();
               YSMNQ_UIManager.Instance.hidePanel(YSMNQ_PanelName.StartPanel);
            }
         })
     }


}


