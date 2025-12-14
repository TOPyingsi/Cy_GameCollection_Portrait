import { _decorator, Component, Enum, Node, Vec3 } from 'cc';
import { SNZL_TYPE } from './SNZL_Constant';
import { SNZL_LVController } from './SNZL_LVController';
const { ccclass, property } = _decorator;

@ccclass('SNZL_Item')
export class SNZL_Item extends Component {
    @property({ type: Enum(SNZL_TYPE) })
    Type: SNZL_TYPE = SNZL_TYPE.TYPE1;

    protected start(): void {
        SNZL_LVController.Instance.addItem(this.Type, this);
        this.node.active = false;
    }

    checkPos(pos: Vec3) {
        let selfPos = this.node.getWorldPosition();
        if (Math.abs(selfPos.x - pos.x) <= SNZL_LVController.Instance.offset && Math.abs(selfPos.y - pos.y) <= SNZL_LVController.Instance.offset) {
            this.node.active = true;
            SNZL_LVController.Instance.removeItem(this.Type);
            return true;
        }
        return false;
    }
}


