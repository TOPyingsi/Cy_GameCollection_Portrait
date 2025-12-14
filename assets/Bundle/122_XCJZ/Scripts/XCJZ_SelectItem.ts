import { _decorator, Component, Enum, Node } from 'cc';
import { XCJZ_SELECT } from './XCJZ_Constant';
import { XCJZ_EventManager, XCJZ_MyEvent } from './XCJZ_EventManager';
import { XCJZ_MenuManager } from './XCJZ_MenuManager';
const { ccclass, property } = _decorator;

@ccclass('XCJZ_SelectItem')
export class XCJZ_SelectItem extends Component {

    @property({ type: Enum(XCJZ_SELECT) })
    Type: XCJZ_SELECT = XCJZ_SELECT.MAIN;

    CheckedIcon: Node = null;

    protected onLoad(): void {
        this.CheckedIcon = this.node.getChildByName("Checked");
        this.node.on(Node.EventType.TOUCH_START, this.OnClick, this);
    }

    protected start(): void {
        // this.Check(XCJZ_SELECT.MAIN);
    }

    protected onEnable(): void {
        XCJZ_EventManager.On(XCJZ_MyEvent.XCJZ_SELECT_ITEM, this.Check, this);
    }

    protected onDisable(): void {
        XCJZ_EventManager.Off(XCJZ_MyEvent.XCJZ_SELECT_ITEM, this.Check, this);
    }

    OnClick() {
        XCJZ_EventManager.Emit(XCJZ_MyEvent.XCJZ_SELECT_ITEM, this.Type);
    }

    Check(type: XCJZ_SELECT) {
        this.CheckedIcon.active = type == this.Type;
        if (type == this.Type) {
            //选中
            type == XCJZ_SELECT.MAIN ? XCJZ_MenuManager.Instance.ShowPanel(XCJZ_MenuManager.Instance.MainPanel) : XCJZ_MenuManager.Instance.ShowPanel(XCJZ_MenuManager.Instance.ShopPanel);
        }
    }
}


