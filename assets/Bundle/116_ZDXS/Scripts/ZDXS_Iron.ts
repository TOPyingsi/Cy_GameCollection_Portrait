import { _decorator, Component, Node, RigidBody2D, Vec2 } from 'cc';
import { ZDXS_Attracted } from './ZDXS_Attracted';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_Iron')
export class ZDXS_Iron extends ZDXS_Attracted {

    protected onLoad(): void {
        super.onLoad();
    }
    Attract(target: RigidBody2D): ZDXS_Attracted {
        this.RigidBody.gravityScale = 100;
        return this;
    }

    Send(dir: Vec2, force: number) {
        this.Release();
        this.RigidBody.applyForceToCenter(dir.normalize().multiplyScalar(force), true);
    }

    //释放
    Release() {
        this.RigidBody.gravityScale = 3;
    }

}


