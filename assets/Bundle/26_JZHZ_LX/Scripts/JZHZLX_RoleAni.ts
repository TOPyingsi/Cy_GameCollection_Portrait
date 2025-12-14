import { _decorator, Component, Node, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JZHZLX_RoleAni')
export class JZHZLX_RoleAni extends Component {

    @property
    speed: number = 10;

    @property
    scaleGap: number = 0.05;

    oriScale: Vec3 = v3();

    protected onLoad(): void {
        this.oriScale.set(this.node.getScale());
        this.Play();
    }

    Play() {
        tween(this.node)
            .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y + this.scaleGap) })
            .to(1 / this.speed, { scale: this.oriScale })
            .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y - this.scaleGap) })
            .to(1 / this.speed, { scale: this.oriScale })
            .union().repeatForever().start();
    }


}


