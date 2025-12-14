import { _decorator, Component, Enum, find, tween, Node, v3 } from 'cc';
import { ZJAB_NZ } from './ZJAB_NZ';
import { ZJAB_ITEM_CARD } from './ZJAB_Constant';
import { ZJAB_ItemManager } from './ZJAB_ItemManager';
const { ccclass, property } = _decorator;

@ccclass('ZJAB_Item_Card')
export class ZJAB_Item_Card extends Component {

    @property({ type: Enum(ZJAB_ITEM_CARD) })
    Items: ZJAB_ITEM_CARD[] = [];

    protected start(): void {
        ZJAB_ItemManager.Instance.Item_Card.push(this);
    }

    init() {
        tween(this.node)
            .to(5, { scale: v3(1.5, 1.5, 1.5) })
            .start();

        tween(this.node)
            .to(5, { worldPosition: ZJAB_NZ.Instance.RemovePos })
            .call(() => {
                this.check();
                this.node.destroy();
            })
            .start();
    }

    check() {
        if (ZJAB_NZ.Instance.OffsetX == 0) {
            return;
        }
        let item = ZJAB_NZ.Instance.OffsetX > 0 ? this.Items[1] : this.Items[0];
        ZJAB_NZ.Instance.check(item);
    }
}


