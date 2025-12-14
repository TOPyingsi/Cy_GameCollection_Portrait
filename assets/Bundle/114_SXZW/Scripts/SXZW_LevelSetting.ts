import { _decorator, Component, Node, ParticleSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SXZW_LevelSetting')
export class SXZW_LevelSetting extends Component {

    @property(Node)
    playerPosition: Node
    @property(Node)
    aiPosition: Node

    public useBloodParticles: ParticleSystem[] = []

    protected onEnable(): void {

    }

    start() {

    }

    update(deltaTime: number) {

    }
}


