import { _decorator, Collider2D, Component, Contact2DType, FixedJoint2D, IPhysics2DContact, sp, Node, Sprite, Vec2, find, Joint2D } from 'cc';
import { ZDXS_Attracted } from './ZDXS_Attracted';
import { ZDXS_GameManager } from './ZDXS_GameManager';
import { ZDXS_AudioManager } from './ZDXS_AudioManager';
import { ZDXS_AUDIO } from './ZDXS_Constant';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_BoxController')
export class ZDXS_BoxController extends ZDXS_Attracted {

    @property
    IsExplosion: boolean = true;

    @property
    HaveHope: boolean = false;

    @property(Node)
    Target: Node = null;

    @property
    Impulse: number = 2000;

    Collider: Collider2D = null;

    Spine: sp.Skeleton

    // private _fixedJoint: FixedJoint2D = null;

    protected onLoad(): void {
        super.onLoad();

        this.Collider = this.getComponent(Collider2D);

        this.Spine = find("爆炸", this.node).getComponent(sp.Skeleton);

        this.Spine.setCompleteListener(() => this.node.destroy());
        if (this.IsExplosion) this.Collider.on(Contact2DType.POST_SOLVE, this.OnPostSolveContact, this);
    }

    protected start(): void {
        ZDXS_GameManager.Instance.Explosions.push(this.node);
    }


    OnPostSolveContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
        const impulse = contact.getImpulse();
        if (impulse) {
            // 法线方向的冲击力（数组，第0个元素通常就够用了）
            let normalImpulse = impulse.normalImpulses[0];

            // 如果冲击太大 → 角色死亡
            if (normalImpulse > this.Impulse) {
                // console.log('冲击强度:', normalImpulse);
                this.Blast();
                // this.node.destroy();
            }
        }
    }

    Blast() {
        this.scheduleOnce(() => {
            this.getComponent(Sprite).enabled = false;
            this.RigidBody.enabled = false;
            this.Spine.node.active = true;
            this.Spine.setAnimation(0, "animation", false);
            ZDXS_AudioManager.Instance.Play(ZDXS_AUDIO.箱子破裂);
            if (ZDXS_GameManager.Instance.Explosions.indexOf(this.node) != -1) ZDXS_GameManager.Instance.Explosions.splice(ZDXS_GameManager.Instance.Explosions.indexOf(this.node), 1);
            // this.EnemyRigidBody.enabled = false;
            if (this.HaveHope) {
                find("绳子", this.node).active = false;
                this.Target.getComponent(Joint2D).enabled = false;
            }
        });
    }

    // Attract(target: RigidBody2D): ZDXS_Attracted {
    //     this._fixedJoint = this.node.addComponent(FixedJoint2D);
    //     this._fixedJoint.connectedBody = target;
    //     this._fixedJoint.frequency = 0.2;
    //     this._fixedJoint.apply();
    //     return this;
    // }

    // Send(dir: Vec2, force: number) {
    //     this.Release();
    //     this.RigidBody.applyForceToCenter(dir.normalize().multiplyScalar(force), true);
    // }

    // //释放
    // Release() {
    //     this._fixedJoint.enabled = false;
    //     this._fixedJoint.apply();
    // }
}


