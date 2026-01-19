import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { YSMNQ_StartPanel } from './YSMNQ_StartPanel';
import { YSMNQ_PanelName } from './Common/YSMNQ_PanelName';

const { ccclass, property } = _decorator;

@ccclass('YSMNQ_UIManager')
export class YSMNQ_UIManager extends Component {
    static Instance: YSMNQ_UIManager = null;
    
    @property({type: YSMNQ_StartPanel})
    startPanel: YSMNQ_StartPanel = null;


    onLoad(){
        YSMNQ_UIManager.Instance = this;
    }
    

    private _showStartPanel(){
        this.startPanel.node.active = true;
        this.startPanel.init();
    }

    public showPanel(panel: YSMNQ_PanelName){
        switch(panel){
            case YSMNQ_PanelName.StartPanel:
                this._showStartPanel();
                break;
            default:
                break;
        }
    }

    public hidePanel(panel: YSMNQ_PanelName){
        switch(panel){
            case YSMNQ_PanelName.StartPanel:
                this.startPanel.node.active = false;
                break;
            default:
                break;
        }
    }
}


