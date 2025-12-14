import { _decorator, Component, FixedJoint2D, Node, RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_Attracted')
export class ZDXS_Attracted extends Component {

    RigidBody: RigidBody2D = null;
    FixedJoint: FixedJoint2D = null;

    protected onLoad(): void {
        this.RigidBody = this.node.getComponent(RigidBody2D);
    }

    Attract(target: RigidBody2D): ZDXS_Attracted {
        this.FixedJoint = this.node.addComponent(FixedJoint2D);
        this.FixedJoint.connectedBody = target;
        this.FixedJoint.frequency = 0.2;
        this.FixedJoint.apply();
        return this;
    }

    Send(dir: Vec2, force: number) {
        this.Release();
        this.RigidBody.applyForceToCenter(dir.normalize().multiplyScalar(force), true);
    }

    //释放
    Release() {
        if (!this.FixedJoint) return;
        this.FixedJoint.enabled = false;
        this.FixedJoint.apply();
    }
}


