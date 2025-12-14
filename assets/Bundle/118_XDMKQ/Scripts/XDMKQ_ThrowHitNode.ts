import { _decorator, Component, Node } from 'cc';
import { XDMKQ_CameraController } from './XDMKQ_CameraController';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_ThrowHitNode')
export class XDMKQ_ThrowHitNode extends Component {

    update(deltaTime: number) {
        this.node.forward = XDMKQ_CameraController.Instance.node.forward;
    }
}


