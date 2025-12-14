import { _decorator, AudioClip, Component, Node, tween, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
const { ccclass, property } = _decorator;

@ccclass('MHLX_X')
export class MHLX_X extends Component {

    @property(AudioClip)
    clip: AudioClip;

    protected onEnable(): void {
        AudioManager.Instance.PlaySFX(this.clip);
        tween(this.node)
            .to(0.25, { scale: Vec3.ONE }, { easing: EasingType.backOut })
            .delay(0.5)
            .to(0.25, { scale: Vec3.ZERO }, { easing: EasingType.backIn })
            .call(() => { PoolManager.PutNode(this.node); })
            .start();
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


