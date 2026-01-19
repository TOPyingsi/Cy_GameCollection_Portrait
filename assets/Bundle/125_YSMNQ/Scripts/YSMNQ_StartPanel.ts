import { _decorator, Component, Node } from 'cc';
import { YSMNQ_GameManager } from './YSMNQ_GameManager';
import { YSMNQ_GameName } from './Common/YSMNQ_GameName';
import { YSMNQ_AudioManager } from './YSMNQ_AudioManager';
import { Panel, UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_StartPanel')
export class YSMNQ_StartPanel extends Component {
    @property(Node)
    gameContainer: Node = null;

    init(){
        this.gameContainer.children.forEach((child,index) => {
            child.off(Node.EventType.TOUCH_END);
            child.on(Node.EventType.TOUCH_END, ()=>{this.onTouchEnd(child);});
        })
    }

    btnBackClick(){
        console.log("返回");
        UIManager.ShowPanel(Panel.ReturnPanel);
        // ProjectEventManager.emit(ProjectEvent.返回主页, () => {
        //     UIManager.ShowPanel(Panel.LoadingPanel, GameManager.StartScene, () => {
        //             ProjectEventManager.emit(ProjectEvent.返回主页, "医生模拟器");
        //     })
        // });
    }
    
    onTouchEnd(child: Node){
        YSMNQ_AudioManager.getInstance().playSound("按钮点击");
        ProjectEventManager.emit(ProjectEvent.游戏开始, "医生模拟器");
       switch(child.name){
            case "肠胃科":
                YSMNQ_GameManager.Instance.enterGame(YSMNQ_GameName.肠胃科);
                this.node.active = false;
                break;
            case "新生儿":
                YSMNQ_GameManager.Instance.enterGame(YSMNQ_GameName.新生儿);
                this.node.active = false;
               break;
            case "冻伤":
                YSMNQ_GameManager.Instance.enterGame(YSMNQ_GameName.冻伤);
                this.node.active = false;
               break;
            case "发热":
                YSMNQ_GameManager.Instance.enterGame(YSMNQ_GameName.发热);
                this.node.active = false;
               break;
            case "换牙齿":
                YSMNQ_GameManager.Instance.enterGame(YSMNQ_GameName.换牙齿);
                this.node.active = false;
               break;
            case "换心脏":
                YSMNQ_GameManager.Instance.enterGame(YSMNQ_GameName.换心脏);
                this.node.active = false;
                break;
            case "换眼睛":
                YSMNQ_GameManager.Instance.enterGame(YSMNQ_GameName.换眼睛);
                this.node.active = false;
                break;
            case "换大脑":
                YSMNQ_GameManager.Instance.enterGame(YSMNQ_GameName.换大脑);
                this.node.active = false;
                break;
            // case 0:
            //     YSMNQ_GameManager.Instance.enterGame(YSMNQ_GameName);
            //     this.node.active = false;
            //     break;
       }
    }
}


