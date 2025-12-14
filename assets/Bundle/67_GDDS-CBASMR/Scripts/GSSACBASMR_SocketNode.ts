import { _decorator, CCBoolean, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GSSACBASMR_SocketNode')
export class GSSACBASMR_SocketNode extends Component {

    @property(Node)
    target: Node;

    @property(CCBoolean)
    isScale = false;

    start() {

    }

    update(deltaTime: number) {
        this.node.setWorldPosition(this.target.worldPosition);
        this.node.setWorldRotation(this.target.worldRotation);
        if (this.isScale) {
            let ui = this.node.getComponent(UITransform);
            let ui2 = this.target.getComponent(UITransform);
            ui.setContentSize(ui2.contentSize);
            ui.setAnchorPoint(ui2.anchorPoint);
            this.node.setWorldScale(this.target.getWorldScale());
        }
    }
}


