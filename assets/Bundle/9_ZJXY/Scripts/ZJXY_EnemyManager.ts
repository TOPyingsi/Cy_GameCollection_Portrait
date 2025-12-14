import { _decorator, BoxCollider2D, Collider, Collider2D, Component, Contact2DType, find, IPhysics2DContact, Node, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZJXY_EnemyManager')
export class ZJXY_EnemyManager extends Component {
    start() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

    }

    onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.node.name == "岩浆") {
            tween(this.node.getComponent(UIOpacity))
                .to(0, { opacity: 255 })
                .to(1, { opacity: 0 })
                .call(() => {
                    this.node.destroy();
                })
                .start();
        }
        if (otherCollider.node.name == "石头") {
            tween(this.node.getComponent(UIOpacity))
                .to(0, { opacity: 255 })
                .to(1, { opacity: 0 })
                .call(() => {
                    this.node.destroy();

                })

                .start();
            tween(find("Canvas/地图/石头").getComponent(UIOpacity))
                .to(0, { opacity: 255 })
                .to(1, { opacity: 0 })
                .call(() => {
                    otherCollider.node.destroy();
                })

                .start();
        }
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    }

}


