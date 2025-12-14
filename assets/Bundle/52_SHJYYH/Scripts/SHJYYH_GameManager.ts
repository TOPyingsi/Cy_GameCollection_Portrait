import { _decorator, Component, Node } from 'cc';
import { GamePanel } from '../../../Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SHJYYH_GameManager')
export class SHJYYH_GameManager extends Component {
    protected onLoad(): void {
        GamePanel.Instance.time = 480;
    }
}


