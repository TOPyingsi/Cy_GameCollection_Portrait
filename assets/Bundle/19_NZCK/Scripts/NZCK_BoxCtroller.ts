import { _decorator, Component, Enum, Node, Tween, tween, v3, Vec3 } from 'cc';
import { NZCK_BOXTYPE } from './NZCK_Constant';
import { NZCK_LVController } from './NZCK_LVController';
import { NZCK_SoundController, NZCK_Sounds } from './NZCK_SoundController';
const { ccclass, property } = _decorator;

@ccclass('NZCK_BoxCtroller')
export class NZCK_BoxCtroller extends Component {
    @property({ type: Enum(NZCK_BOXTYPE) })
    Type: NZCK_BOXTYPE = NZCK_BOXTYPE.TYPE1;

    z: number = 0;
    angle: number = 10;
    startAngle: number = 0;

    protected onLoad(): void {
        this.z = this.node.getPosition().z;
        this.startAngle = this.node.angle;
    }

    protected start(): void {
        this.Shake();
    }

    Shake() {
        this.angle = Math.random() * 5 + 7
        tween(this.node)
            .delay(2)
            .by(0.1, { angle: this.angle }, { easing: `sineOut` }) // 向右晃动 10 个单位
            .by(0.2, { angle: - 2 * this.angle }, { easing: `sineOut` }) // 向右晃动 10 个单位
            .by(0.1, { angle: this.angle }, { easing: `sineOut` }) // 向右晃动 10 个单位
            .union()
            .repeatForever()  // 无限循环
            .start();
    }

    click() {
        if (NZCK_LVController.Instance.IsClickBox) return;
        NZCK_LVController.Instance.IsClickBox = true;
        NZCK_SoundController.Instance.PlaySound(NZCK_Sounds.Click);
        Tween.stopAllByTarget(this.node);
        this.node.angle = this.startAngle;
        this.node.setSiblingIndex(99);
        tween(this.node)
            .to(1, { position: Vec3.ZERO }, { easing: `sineOut` })
            .to(1, { scale: new Vec3(3, 3, 3) }, { easing: `sineOut` })
            .call(() => {
                this.node.destroy();
                NZCK_LVController.Instance.showMask(this.Type);
            })
            .start();
    }
}


