import { _decorator, Component, Enum, find, Node } from 'cc';
import { SHJYYH_ITEM } from './SHJYYH_Contant';
const { ccclass, property } = _decorator;

@ccclass('SHJYYH_Item2')
export class SHJYYH_Item2 extends Component {

    @property({ type: Enum(SHJYYH_ITEM) })
    Type: SHJYYH_ITEM = SHJYYH_ITEM.Item1;

    Tips: Node = null;

    IsClick: boolean = true;

    protected onLoad(): void {
        this.Tips = find("Tips", this.node);
    }

    showTips() {
        this.IsClick = false;
        this.Tips.active = true;
    }

}


