import { _decorator, Component, find, instantiate, Node, Prefab, resources } from 'cc';
import Banner from 'db://assets/Scripts/Banner';
import { UIManager, Panel } from 'db://assets/Scripts/Framework/Managers/UIManager';
import PrivacyPanel from 'db://assets/Scripts/UI/Panel/PrivacyPanel';
const { ccclass, property } = _decorator;

@ccclass('HideButton')
export class HideButton extends Component {
    start() {

    }

    update(deltaTime: number) {

    }

    Hide() {
        // Banner.Instance.AndroidPrivacy();
        UIManager.ShowPanel(Panel.PrivacyPanel, false);
    }

    Kefu() {
        Banner.Instance.AndroidKeFu();
    }

    More() {
        Banner.Instance.AndroidMoreGame();
    }
}


