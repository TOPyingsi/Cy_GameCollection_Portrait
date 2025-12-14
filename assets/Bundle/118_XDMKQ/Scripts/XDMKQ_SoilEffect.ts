import { _decorator, Component, Node, ParticleSystem, Vec3 } from 'cc';
import { XDMKQ_PoolManager } from './XDMKQ_PoolManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_SoilEffect')
export class XDMKQ_SoilEffect extends Component {
    @property(ParticleSystem)
    Particle: ParticleSystem = null;
    Init(pos: Vec3) {
        this.node.setWorldPosition(pos);
        this.Particle.play();
        this.scheduleOnce(() => {
            this.node.destroy();
            // XDMKQ_PoolManager.PutNode(this.node);
        }, 2)
    }
}


