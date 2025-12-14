import { _decorator, Collider, Component, ITriggerEvent, Node, Vec3 } from 'cc';
import { GROUP } from './DMM_Constant';
import { DMM_Player } from './DMM_Player';
import { DMM_PlayerController } from './DMM_PlayerController';
const { ccclass, property } = _decorator;

@ccclass('DMM_Trigger')
export class DMM_Trigger extends Component {
    @property(Node)
    target: Node = null;

    Collider: Collider = null;

    protected onLoad(): void {
        this.Collider = this.getComponent(Collider);
        if (this.Collider) {
            this.Collider.on(`onTriggerStay`, this.onTriggerStay, this);
        }
    }

    protected start(): void {
        // DMM_PlayerController.Instance.jump(this.target.getWorldPosition());
    }

    onTriggerStay(event: ITriggerEvent) {
        if (event.otherCollider.getGroup() == GROUP.DMM_PLAYER) {
            if (event.otherCollider.node.getComponent(DMM_PlayerController) && !event.otherCollider.node.getComponent(DMM_PlayerController).IsJump) {
                event.otherCollider.node.getComponent(DMM_PlayerController).jump(this.target.getWorldPosition());
            }
        }
    }

}


