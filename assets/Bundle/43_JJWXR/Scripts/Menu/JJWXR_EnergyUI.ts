import { _decorator, Button, Component, Node } from 'cc';
import { eventCenter } from '../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../Utils/JJWXR_Events';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_EnergyUI')
export class JJWXR_EnergyUI extends Component {

    @property(Button)
    private btnEscape: Button = null;
    @property(Button)
    private btnEnergy: Button = null;

    start() {
        this.btnEscape.node.on(Button.EventType.CLICK, this.onEscape, this);
        this.btnEnergy.node.on(Button.EventType.CLICK, this.onGetMoreEnergy, this);
    }

    onEscape() {
        eventCenter.emit(JJWXR_Events.HIDE_ADD_ENERGY_UI);
    }

    onGetMoreEnergy() {
        eventCenter.emit(JJWXR_Events.GET_MORE_ENERGY);
    }
}