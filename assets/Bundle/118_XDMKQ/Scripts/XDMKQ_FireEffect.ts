import { _decorator, Component, Node, ParticleSystem } from 'cc';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_FireEffect')
export class XDMKQ_FireEffect extends Component {

    protected onEnable(): void {
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_FIRE_EFFECT, this.FireEffect, this);
    }

    protected onDisable(): void {
        XDMKQ_EventManager.Off(XDMKQ_MyEvent.XDMKQ_FIRE_EFFECT, this.FireEffect, this);
    }

    FireEffect() {
        this.node.children.forEach(node => {
            node.getComponent(ParticleSystem).play();
        })
    }
}


