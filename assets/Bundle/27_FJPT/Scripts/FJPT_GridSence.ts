import { _decorator, Component, Node } from 'cc';
import { GridManager } from './FJPT_GridManager';
const { ccclass, property } = _decorator;

@ccclass('FJPT_GridSence')
export class FJPT_GridSence extends Component {
    public static Instance: FJPT_GridSence = null;
    public gridManager: GridManager = null;

    protected onLoad(): void {
        FJPT_GridSence.Instance = this;
    }
    start() {
        this.gridManager = new GridManager();

    }
}


