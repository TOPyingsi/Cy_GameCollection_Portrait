import { _decorator, Component, Node } from 'cc';
import { DataManager, GameData } from '../../Framework/Managers/DataManager';
import { GameManager } from '../../GameManager';
import { Panel, UIManager } from '../../Framework/Managers/UIManager';
const { ccclass, property } = _decorator;

@ccclass('MoreGamePanelMoreItem')
export class MoreGamePanelMoreItem extends Component {
    public data: GameData = null;

    start() {
        this.data = DataManager.GetDataByName(this.node.name);
    }

    OnClikc() {
        if (GameManager.AP > 0) {
            UIManager.HidePanel(Panel.MoreGamePagePanel);
            GameManager.Instance.LoadGame(this.data);
        } else {
            UIManager.ShowPanel(Panel.AddApPanel);
        }

    }
}


