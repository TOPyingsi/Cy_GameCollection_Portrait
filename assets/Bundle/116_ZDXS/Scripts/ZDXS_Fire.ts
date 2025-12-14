import { _decorator, Animation, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_Fire')
export class ZDXS_Fire extends Component {

    Animation: Animation = null;

    Play(pos: Vec3) {
        if (!this.Animation) this.Animation = this.getComponent(Animation);
        this.node.active = true;
        this.node.setWorldPosition(pos);
        this.Animation.play("Fire");
    }

    End() {
        this.node.active = false;
    }

}


