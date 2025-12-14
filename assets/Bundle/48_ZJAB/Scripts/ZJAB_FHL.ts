import { _decorator, Component, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZJAB_FHL')
export class ZJAB_FHL extends Component {
    protected onLoad(): void {
        tween(this.node)
            .by(2, { angle: 360 })
            .repeatForever()
            .start();
    }
}


