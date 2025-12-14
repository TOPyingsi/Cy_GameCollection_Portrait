import { _decorator, Component, Node, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NDPA_GoldAwad')
export class NDPA_GoldAwad extends Component {
    @property({ type: Vec3 })
    Dir: Vec3;

    @property
    Speed: number = 0;

    @property
    Dis: number = 0;

    dir: Vec3;
    TargetPos: Vec3;
    cb: Function = null;

    init(startPos: Vec3, targetPos: Vec3, cb: Function = null) {
        this.node.setWorldPosition(startPos);
        this.TargetPos = targetPos;
        this.dir = this.normalize(this.Dir);
        this.cb = cb;
        this.move();
    }

    normalize(vec: Vec3): Vec3 {
        let length = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
        return v3(vec.x / length, vec.y / length, vec.z / length);
    }

    move() {
        tween(this.node)
            .by(this.Dis / this.Speed, { position: v3(this.dir.x * this.Dis, this.dir.y * this.Dis, 0) })
            .delay(0.2)
            .to(0.5, { worldPosition: this.TargetPos })
            .call(() => {
                this.scheduleOnce(() => {
                    this.cb && this.cb();
                    if (this.node.parent) {
                        this.node.parent.destroy();
                    }
                })
            })
            .start();
    }
}

