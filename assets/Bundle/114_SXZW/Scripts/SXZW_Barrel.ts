import { _decorator, Collider, Component, ICollisionEvent, instantiate, math, Node, Prefab, randomRange, randomRangeInt, RigidBody, Vec2, Vec3 } from 'cc';
import { SXZW_PlayManage } from './SXZW_PlayManage';
const { ccclass, property } = _decorator;

@ccclass('SXZW_Barrel')
export class SXZW_Barrel extends Component {

    @property(Prefab)
    barrelFracturedPrefab: Prefab = null

    start() {
        this.getComponent(Collider).on("onCollisionEnter", this.onCollisionEnter, this);
    }

    update(deltaTime: number) {

    }

    onCollisionEnter(event: ICollisionEvent) {
        if (event.otherCollider.getGroup() === 2) {
            const bf = instantiate(this.barrelFracturedPrefab);
            bf.setParent(this.node.parent, true)
            bf.setWorldPosition(this.node.worldPosition);
            const rigBodys = bf.getComponentsInChildren(RigidBody);
            rigBodys.forEach(element => {
                const angle = randomRange(0, Math.PI * 2);
                const dir = new Vec3(Math.cos(angle), Math.sin(angle), Math.tan(angle));
                const force = randomRange(7000, 10000);

                element.applyForce(dir.multiplyScalar(force));
            });

            const blask = SXZW_PlayManage.Instance.getBlastSeek;
            blask.node.setWorldPosition(this.node.worldPosition)
            blask.startSeek(2, 5);

            SXZW_PlayManage.Instance.scheduleOnce(() => {
                bf.destroy()
                this.node.destroy()
            }, 3)
            this.node.active = false;
        }
    }

    protected onDestroy(): void {
        this.getComponent(Collider).off("onCollisionEnter", this.onCollisionEnter, this);
    }
}


