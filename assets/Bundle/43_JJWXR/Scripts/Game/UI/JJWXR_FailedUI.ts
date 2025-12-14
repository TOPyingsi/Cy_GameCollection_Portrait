import { _decorator, Component, Node, Button, Animation } from 'cc';
import { eventCenter } from '../../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../../Utils/JJWXR_Events';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_FailedUI')
export class JJWXR_FailedUI extends Component {
    @property(Button)
    private btnComeBack: Button = null;
    @property(Button)
    private btnAddTime: Button = null;
    @property(Button)
    private btnRestart: Button = null;

    @property({ type: Node })
    private enemyNode: Node = null;

    @property({ type: Node })
    private warningUI: Node = null;

    onLoad() {
        this.btnComeBack.node.on(Button.EventType.CLICK, this.onComeBack, this);
        this.btnAddTime.node.on(Button.EventType.CLICK, this.onAddTime, this);
        this.btnRestart.node.on(Button.EventType.CLICK, this.onRestart, this);

        eventCenter.on(JJWXR_Events.SHOW_WARNING_UI, this.showWarningUI, this);
    }
    onDestroy() {
        eventCenter.off(JJWXR_Events.SHOW_WARNING_UI, this.showWarningUI, this);
    }

    start() {
        ProjectEventManager.emit(ProjectEvent.游戏结束);
        const enemy = this.enemyNode.getComponent(Animation);
        console.log('enemy', enemy);
        enemy.play();
    }

    onComeBack() {
        eventCenter.emit(JJWXR_Events.LOAD_MENU_SCENE);
    }

    onAddTime() {
        let x = this;
        Banner.Instance.ShowVideoAd(() => {
            eventCenter.emit(JJWXR_Events.GAME_START, 180);
            x.node.active = false;
        });
    }

    // 重新开始游戏
    onRestart() {
        eventCenter.emit(JJWXR_Events.USE_ENERGY);
        eventCenter.emit(JJWXR_Events.RESTART_GAME);
    }

    showWarningUI() {
        this.warningUI.active = true;
        this.scheduleOnce(() => {
            this.warningUI.active = false;
        }, 2);
    }
}