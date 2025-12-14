import { _decorator, Component, Enum, find, tween, Node, v3 } from 'cc';
import { GFS_NZ } from './GFS_NZ';
import { GFS_LVController } from './GFS_LVController';
import { GFS_ITEM } from './GFS_Constant';
const { ccclass, property } = _decorator;

@ccclass('GFS_Item')
export class GFS_Item extends Component {
    @property({ type: Enum(GFS_ITEM) })
    Items: GFS_ITEM[] = [];

    @property({ type: Enum(GFS_ITEM) })
    NormalItem: GFS_ITEM = GFS_ITEM.默认;

    @property
    IsHaveBlackDog: boolean = false;

    BlackDog: Node = null;

    protected onLoad(): void {
        if (this.IsHaveBlackDog) {
            this.BlackDog = find("黑狗", this.node);
            GFS_LVController.Instance.BlackDogItem = this;
        }
    }

    protected start(): void {
        GFS_LVController.Instance.Items.push(this);
    }

    init() {
        GFS_NZ.Instance.NGNumber++;
        tween(this.node)
            .to(5, { scale: v3(1.6, 1.6, 1.6) })
            .start();

        tween(this.node)
            .to(5, { worldPosition: GFS_NZ.Instance.RemovePos })
            .call(() => {
                this.check();
                this.node.destroy();
            })
            .start();
    }

    switchBlackDogBlood() {
        this.BlackDog.active = false;
        this.Items[1] = GFS_ITEM.黑狗血;
    }

    check() {
        if (GFS_NZ.Instance.OffsetX == 0) {
            GFS_NZ.Instance.check(this.NormalItem);
            return;
        }
        let item = GFS_NZ.Instance.OffsetX > 0 ? this.Items[1] : this.Items[0];
        GFS_NZ.Instance.check(item);
    }
}


