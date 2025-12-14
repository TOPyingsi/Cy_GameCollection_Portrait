import { _decorator, Camera, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NDPA_CameraController')
export class NDPA_CameraController extends Component {
    public static Instance: NDPA_CameraController = null;

    Camera: Camera = null;

    protected onLoad(): void {
        NDPA_CameraController.Instance = this;
        this.Camera = this.node.getComponent(Camera);
    }
}


