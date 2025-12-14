import { _decorator, Component, Node, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_Rotate')
export class ZDXS_Rotate extends Component {

    @property()
    public RotateSpeed: number = 100;

    CurZ: number = 0;
    protected update(dt: number): void {
        // this.node.angle += dt * this.RotateSpeed;
        this.CurZ += dt * this.RotateSpeed;
        if (this.CurZ > 360) {
            this.CurZ -= 360;
        }
        this.node.eulerAngles = v3(0, 0, this.CurZ);
    }

}


