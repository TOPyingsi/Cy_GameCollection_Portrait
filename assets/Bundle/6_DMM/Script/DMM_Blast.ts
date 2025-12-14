import { _decorator, Color, Component, ParticleSystem, v3, Vec3 } from 'cc';
import { COLOR } from './DMM_Constant';
const { ccclass, property } = _decorator;

@ccclass('DMM_Blast')
export class DMM_Blast extends Component {

    Particle: ParticleSystem = null;

    protected onLoad(): void {
        this.Particle = this.getComponent(ParticleSystem);
    }

    show(pos: Vec3, scale: Vec3 = v3(1, 1, 1), color: Color = COLOR.White, cb: Function = null) {
        this.node.setWorldPosition(pos);
        this.node.setScale(scale);
        this.Particle.startColor.color = color;

        this.scheduleOnce(() => {
            this.node.destroy();
            cb && cb();
        }, 1)
    }
}


