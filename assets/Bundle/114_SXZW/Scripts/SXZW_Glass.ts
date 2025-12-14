import { _decorator, Collider, Component, instantiate, ITriggerEvent, Node, Prefab } from 'cc';
import { SXZW_AudioManage } from './SXZW_AudioManage';
const { ccclass, property } = _decorator;

@ccclass('SXZW_Glass')
export class SXZW_Glass extends Component {

    @property(Prefab)
    psPrefab: Prefab

    collider: Collider = null

    protected onLoad(): void {
        this.collider = this.getComponent(Collider)
        this.collider.on("onTriggerEnter", this.onTriggerEnter, this);

    }

    start() {

    }

    update(deltaTime: number) {

    }

    onTriggerEnter(event: ITriggerEvent) {
        if (event.otherCollider.getGroup() == 8) {
            const ps = instantiate(this.psPrefab);
            ps.setParent(this.node.parent, true);
            ps.setWorldPosition(this.node.worldPosition)
            SXZW_AudioManage.Instance.playGlassBreakEffect();
            this.node.destroy();
        }
    }

    protected onDestroy(): void {
        this.collider.off("onTriggerEnter", this.onTriggerEnter, this);

    }
}


