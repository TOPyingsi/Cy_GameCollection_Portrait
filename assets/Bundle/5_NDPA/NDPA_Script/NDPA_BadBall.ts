import { _decorator, AudioSource, Collider, Component, ICollisionEvent, Node, RigidBody } from 'cc';
import { NDPA_EventManager, NDPA_MyEvent } from './NDPA_EventManager';
import { NDPA_AudioManager, NDPA_Audios } from './NDPA_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('NDPA_BadBall')
export class NDPA_BadBall extends Component {
    rigidBody: RigidBody = null;
    collider: Collider = null;
    isMute: boolean = false;
    AudioSource: AudioSource = null;
    protected onLoad(): void {
        this.rigidBody = this.node.getComponent(RigidBody);
        this.collider = this.getComponent(Collider);
        this.AudioSource = this.getComponent(AudioSource);
        NDPA_EventManager.ON(NDPA_MyEvent.NDPA_FALLING, this.falling, this);
        this.collider.on(`onCollisionStay`, this.onCollisionStay, this);

    }

    falling() {
        this.rigidBody.useGravity = true;
        this.collider.isTrigger = false;
    }

    onCollisionStay(event: ICollisionEvent) {
        if (!this.isMute) {
            this.isMute = true;
            NDPA_AudioManager.PlaySound(NDPA_Audios.BallFall);
        }
    }
}


