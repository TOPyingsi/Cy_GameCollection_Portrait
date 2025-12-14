import { _decorator, Component, Enum, Node } from 'cc';
import { DMM_PROP } from './DMM_Constant';
const { ccclass, property } = _decorator;

@ccclass('DMM_Prop')
export class DMM_Prop extends Component {
    @property({ type: Enum(DMM_PROP) })
    PropType: DMM_PROP = DMM_PROP.乒乓球拍;
}


