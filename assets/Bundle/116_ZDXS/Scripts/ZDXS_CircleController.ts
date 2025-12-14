import { _decorator, Collider2D, Component, Contact2DType, FixedJoint2D, IPhysics2DContact, sp, RigidBody2D, Sprite, Vec2, find } from 'cc';
import { ZDXS_Attracted } from './ZDXS_Attracted';
import { ZDXS_GameManager } from './ZDXS_GameManager';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_CircleController')
export class ZDXS_CircleController extends ZDXS_Attracted {
    RigidBody: RigidBody2D = null;
    Collider: Collider2D = null;

    Spine: sp.Skeleton

    private _fixedJoint: FixedJoint2D = null;

    protected onLoad(): void {
        super.onLoad();
        this.Collider = this.getComponent(Collider2D);
    }

    protected start(): void {
        ZDXS_GameManager.Instance.Explosions.push(this.node);
    }

    Blast() {
        this.scheduleOnce(() => {
            this.getComponent(Sprite).enabled = false;
            this.RigidBody.enabled = false;
            this.Spine.node.active = true;
            this.Spine.setAnimation(0, "animation", false);
            // this.EnemyRigidBody.enabled = false;

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


