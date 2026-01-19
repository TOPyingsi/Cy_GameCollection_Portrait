import { _decorator, Button, Component, Node } from 'cc';
import { eventCenter } from '../Utils/JJWXR_pigeon_EventCenter';
import { JJWXR_pigeon_Events } from '../Utils/JJWXR_pigeon_Events';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_pigeon_ArmoryUI')
export class JJWXR_pigeon_ArmoryUI extends Component {

    @property(Button)
    private btnCameBack: Button = null;

    @property(Button)
    private btnGetMoreMoney: Button = null;

    start() {
        this.btnCameBack.node.on(Button.EventType.CLICK, this.onCameBack, this);
        this.btnGetMoreMoney.node.on(Button.EventType.CLICK, this.onGetMoreMoney, this);
    }

    onCameBack() {
        this.node.active = false;
    }

    onGetMoreMoney() {
        // TODO: 获取更多金币
        Banner.Instance.ShowVideoAd(() => {
            eventCenter.emit(JJWXR_pigeon_Events.GET_MORE_MONEY);
            eventCenter.emit(JJWXR_pigeon_Events.UPDATE_MONEY);
        })
    }
}