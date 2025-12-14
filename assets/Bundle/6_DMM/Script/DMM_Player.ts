import { _decorator, Component, Enum, Node } from 'cc';
import { DMM_AREATYPE, DMM_PROP, DMM_PropPos, PLAYERTYPE } from './DMM_Constant';
import { DMM_Prop } from './DMM_Prop';
const { ccclass, property } = _decorator;

@ccclass('DMM_Player')
export class DMM_Player extends Component {

    @property
    Speed: number = 15;

    @property({ type: Enum(PLAYERTYPE) })
    PlayerType: PLAYERTYPE = PLAYERTYPE.PLYAER;

    @property
    Index: number = 0;

    Player: Node = null;
    PlayerProp: Node = null;

    IsCollider: boolean = false;
    AreaType: DMM_AREATYPE = DMM_AREATYPE.PROBABILITY;
    PropType: DMM_PROP = DMM_PROP.菜刀;
    IsJump: boolean = false;

    addProp(prop: Node) {
        this.PlayerProp = prop;
        this.PlayerProp.parent = this.node;
        this.PropType = prop.getComponent(DMM_Prop).PropType
        this.PlayerProp.setPosition(DMM_PropPos[this.PropType]);
    }

}


