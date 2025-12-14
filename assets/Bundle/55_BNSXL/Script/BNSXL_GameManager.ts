import { _decorator, Component, director, EventTarget, Label, Node, Prefab } from 'cc';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { BNSXL_AudioManager } from './BNSXL_AudioManager';
import { BNSXL_TouchHandler } from './BNSXL_TouchHandler';
import { ROLE } from './BNSXL_Enum';
const { ccclass, property } = _decorator;

@ccclass('BNSXL_GameManager')
export class BNSXL_GameManager extends Component {

    public static _instance: BNSXL_GameManager;

    @property(Prefab) answer: Prefab = null;
    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Label) ROP: Label = null;
    @property(Node) g_l: Node = null;
    @property(Node) m_l: Node = null;
    @property(Node) p_l: Node = null;
    @property(Node) winPanel: Node = null;

    count: number = 0;

    start() {
        BNSXL_GameManager._instance = this;
        this.gamePanel.answerPrefab = this.answer;
        this.gamePanel.time = 180;

        if (ProjectEventManager.GameStartIsShowTreasureBox) {
            director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
        } else {
            this.Init();
        }
    }

    Init() {
        this.setRoleLabel("我快坚持不住了，快救救我", ROLE.GIRL);
        this.scheduleOnce(() => {
            BNSXL_TouchHandler.instance.isTouching = false;
        }, 2);
    }

    refreshROP() {
        this.count++
        this.ROP.string = `已完成: ${this.count}/12`
        console.log(this.count)

        if (this.count >= 12) {
            this.scheduleOnce(() => {
                this.winPanel.active = true;
                const num = BNSXL_AudioManager.Instance.playAudio("GameWin");
                this.scheduleOnce(() => {
                    this.gamePanel.Win();
                }, num);
            }, 2);
        }
    }

    setRoleLabel(str: string, role: ROLE) {
        switch (role) {
            case ROLE.GIRL:
                this.x(this.g_l, str);
                break;
            case ROLE.MALE:
                this.x(this.m_l, str);
                break;
            case ROLE.POPE:
                this.x(this.p_l, str);
                break;
        }
    }

    x(n: Node, str: string) {
        n.active = true;
        const num = BNSXL_AudioManager.Instance.playAudio(str);
        n.getChildByName("Label").getComponent(Label).string = str;
        this.scheduleOnce(() => {
            n.active = false;
        }, num);
    }

}


