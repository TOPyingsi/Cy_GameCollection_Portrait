import { _decorator, Component, Label, Node, sp, Sprite } from 'cc';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_UIBase')
export class GDDSCBASMR_UIBase extends Component {

    protected onLoad(): void {
        this._InitUpdateEvent();
    }

    protected onEnable(): void {
        this._InitData();
    }

    protected _InitData() { };

    protected _InitUpdateEvent() { };

    protected _UpdateLabel(label: Label, dataName: string, preStr = "", posStr = "") {
        let data = GDDSCBASMR_DataManager.Instance.getNumberData(dataName);
        label.string = preStr + data + posStr;
    }

    protected _UpdateProgress(sprite: Sprite, dataName: string, limitName: string) {
        let data = GDDSCBASMR_DataManager.Instance.getNumberData(dataName);
        let limit = limitName ? GDDSCBASMR_DataManager.Instance.getNumberData(limitName) : 100;
        sprite.fillRange = data / limit;
    }

    ClosePanel() {
        this.node.active = false;
    }
}