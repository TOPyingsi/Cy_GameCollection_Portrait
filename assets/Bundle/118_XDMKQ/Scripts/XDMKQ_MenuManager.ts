import { _decorator, Component, EventTouch, Node } from 'cc';
import { XDMKQ_Panel } from './XDMKQ_Panel';
import { XDMKQ_PanelManager } from './XDMKQ_PanelManager';
import { XDMKQ_AUDIO, XDMKQ_PANEL } from './XDMKQ_Constant';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_MenuManager')
export class XDMKQ_MenuManager extends Component {

    public TargetPanel: XDMKQ_Panel = null;

    protected start(): void {
        ProjectEventManager.emit(ProjectEvent.游戏开始, "兄弟们开枪");

        XDMKQ_AudioManager.Instance.PlayMusic(XDMKQ_AUDIO.BGM1);
    }

    OnButtonClick(event: EventTouch) {
        XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.点击);
        switch (event.target.name) {
            case "设置":
                XDMKQ_PanelManager.Instance.ShowPanel(XDMKQ_PANEL.SetPanel);
                break;
            case "开始游戏":
                XDMKQ_PanelManager.Instance.ShowPanel(XDMKQ_PANEL.LevelPanel);
                break;
        }
    }
}


