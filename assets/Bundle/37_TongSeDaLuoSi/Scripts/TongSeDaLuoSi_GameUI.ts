import { _decorator, Component, Node } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('TongSeDaLuoSi_GameUI')
export class TongSeDaLuoSi_GameUI extends Component {

    private static instance: TongSeDaLuoSi_GameUI;
    static get Instance(): TongSeDaLuoSi_GameUI {
        return this.instance;
    }

    @property(GamePanel)
    panel: GamePanel;

    protected onLoad(): void {
        TongSeDaLuoSi_GameUI.instance = this;
        this.panel.winStr = "打螺丝达人！";
    }

    start() {

    }

    update(deltaTime: number) {

    }

    Victory() {
        console.log("Victory")
        this.panel.Win();
    }

    Fail() {
        console.log("Fail")
        this.panel.Lost();
    }
}


