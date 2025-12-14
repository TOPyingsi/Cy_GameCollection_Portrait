import { _decorator, Collider, Component, Enum, ITriggerEvent, Node, RigidBody } from 'cc';
import { DMM_AREATYPE, DMM_PROP, GROUP } from './DMM_Constant';
import { DMM_PlayerController } from './DMM_PlayerController';
import { DMM_Player } from './DMM_Player';
const { ccclass, property } = _decorator;

@ccclass('DMM_Area')
export class DMM_Area extends Component {

    @property({ type: Enum(DMM_AREATYPE) })
    Type: DMM_AREATYPE = DMM_AREATYPE.SAFETY;

    @property({ type: [Enum(DMM_PROP)] })
    SafetyProps: DMM_PROP[] = [];

    @property({ type: [Enum(DMM_PROP)] })
    DangerProps: DMM_PROP[] = [];

    @property
    IsPath: boolean = false;

    RigidBody: RigidBody = null;
    Collider: Collider = null;
    IsCollider: boolean = false;

    protected onLoad(): void {
        this.RigidBody = this.getComponent(RigidBody);
        this.Collider = this.getComponent(Collider);
    }

    onTriggerStay(event: ITriggerEvent) {
        if (this.IsPath) return;
        if (event.otherCollider.getGroup() == GROUP.DMM_PLAYER) {
            const player: DMM_Player = event.otherCollider.node.getComponent(DMM_Player);

            if (player.IsCollider) return;
            player.IsCollider = true;
            player.AreaType = this.getAreaType(player.PropType);
        }
    }

    onTriggerExit(event: ITriggerEvent) {
        if (this.IsPath) return;
        if (event.otherCollider.getGroup() == GROUP.DMM_PLAYER) {
            const player: DMM_Player = event.otherCollider.node.getComponent(DMM_Player);
            if (!player.IsCollider) return;
            player.IsCollider = false;
            player.AreaType = DMM_AREATYPE.PROBABILITY;
        }
    }

    getAreaType(propType: DMM_PROP) {
        if (this.SafetyProps.indexOf(propType) != -1) {
            return DMM_AREATYPE.SAFETY;
        } else if (this.DangerProps.indexOf(propType) != -1) {
            return DMM_AREATYPE.DANGER;
        }
        return DMM_AREATYPE.PROBABILITY;
    }

    protected onEnable(): void {
        this.Collider.on(`onTriggerStay`, this.onTriggerStay, this);
        this.Collider.on(`onTriggerExit`, this.onTriggerExit, this);
    }
}


