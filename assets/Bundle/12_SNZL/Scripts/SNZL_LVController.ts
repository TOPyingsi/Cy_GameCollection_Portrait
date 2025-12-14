import { _decorator, Component, find, Node, Vec3 } from 'cc';
import { SNZL_TYPE } from './SNZL_Constant';
import { SNZL_Item } from './SNZL_Item';
import { EventManager, MyEvent } from '../../../Scripts/Framework/Managers/EventManager';
import { UIManager } from '../../../Scripts/Framework/Managers/UIManager';
import { SNZL_GameManager } from './SNZL_GameManager';
const { ccclass, property } = _decorator;

@ccclass('SNZL_LVController')
export class SNZL_LVController extends Component {
    public static Instance: SNZL_LVController = null;

    Content: Node = null;
    CutY: number = 0;
    ItemParent: Node = null;
    Items: Map<SNZL_TYPE, SNZL_Item> = new Map();

    offset: number = 150;

    protected onLoad(): void {
        SNZL_LVController.Instance = this;
        this.ItemParent = find("摆放", this.node);
        this.Content = find("PageView/view/content", this.node);
        this.CutY = find("分割线", this.node).getWorldPosition().y;
    }

    addItem(type: SNZL_TYPE, item: SNZL_Item) {
        this.Items.set(type, item);
    }

    removeItem(type: SNZL_TYPE) {
        this.Items.delete(type);
    }

    checkItem(type: SNZL_TYPE, pos: Vec3): boolean {
        const item = this.Items.get(type);
        if (!item) {
            console.error(`没找到Item${type}`);
            return false;
        }
        return item.checkPos(pos);
    }

    checkFinish() {
        if (this.Items.size <= 0) {
            //过关
            console.error('过关');
            SNZL_GameManager.Instance.GamePanel.Win();
        }
    }
}


