import { _decorator, BoxCollider, Collider, Component, Enum, Node, RigidBody, v3, Vec3 } from 'cc';
import { NDPA_EventManager, NDPA_MyEvent } from './NDPA_EventManager';
import { NDPA_GROUP, NDPA_TIPSORDER } from './NDPA_GameConstant';
import { NDPA_TipsManager } from './NDPA_TipsManager';
import { NDPA_AudioManager, NDPA_Audios } from './NDPA_AudioManager';
import { NDPA_GameManager } from './NDPA_GameManager';
import { Group } from '../../../Scripts/Framework/Utils/Tween';
const { ccclass, property } = _decorator;

@ccclass('NDPA_Clickable')
export class NDPA_Clickable extends Component {
    @property
    IsExist: boolean = false;

    @property
    IsBall: boolean = false;

    @property({ type: Enum(NDPA_TIPSORDER) })
    TipsOrder: NDPA_TIPSORDER = NDPA_TIPSORDER.EXIT;

    @property(Vec3)
    Offset: Vec3 = v3(0, 0, 0)!;

    rigidBody: RigidBody = null;
    Collider: Collider[] = null;
    IsClick: boolean = true;

    protected onLoad(): void {
        this.rigidBody = this.node.getComponent(RigidBody);
        this.Collider = this.node.getComponents(Collider);
    }

    protected start(): void {
        if (this.IsExist) {
            //已经存在不需要点击
            this.IsClick = false;
            return;
        }
        NDPA_GameManager.Instance.remain++;
        if (this.TipsOrder != NDPA_TIPSORDER.EXIT) NDPA_TipsManager.Instance.TargetTips[this.TipsOrder] = this.node;
    }

    click() {
        if (!this.IsClick) return;
        if (this.IsExist) return;
        NDPA_AudioManager.PlaySound(NDPA_Audios.PartClick);
        this.IsClick = false;
        this.rigidBody.useGravity = true;
        this.Collider.forEach(e => {
            e.isTrigger = false;
        })
        NDPA_EventManager.Scene.emit(NDPA_MyEvent.NDPA_REMAINING);
    }

}


