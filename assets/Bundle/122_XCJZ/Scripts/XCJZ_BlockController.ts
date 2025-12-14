import { _decorator, Component, Enum, Node, Tween, tween, v3, Vec3 } from 'cc';
import { XCJZ_BLOCK } from './XCJZ_Constant';
const { ccclass, property } = _decorator;

@ccclass('XCJZ_BlockController')
export class XCJZ_BlockController extends Component {

    @property({ type: Enum(XCJZ_BLOCK) })
    Block: XCJZ_BLOCK = XCJZ_BLOCK.BLUE;

    @property({ displayName: "碰到是否变色" })
    ChangeColor: boolean = true;

    @property(Node)
    Effect: Node = null;

    JumpTime: number = 0;
    // Dis: number = 0;
    IsLast: boolean = false;
    CurSpawn: number = 0;

    Init(parent: Node, pos: Vec3, jumpTime: number, isLast: boolean = false, spawn: number = 0) {
        this.node.parent = parent;
        this.node.setWorldPosition(pos);
        this.JumpTime = jumpTime;
        this.IsLast = isLast;
        this.CurSpawn = spawn;
    }

    StepOn() {
        if (this.Effect) {
            this.Effect.active = true;
            Tween.stopAllByTarget(this.Effect);
            this.Effect.scale = v3(1.3, 1.3, 1.3);
            tween(this.Effect)
                .to(0.5, { scale: v3(2.2, 2.2, 2.2) }, { easing: `sineOut` })
                .call(() => {
                    this.Effect.active = false;
                })
                .start();
        }

        tween(this.node)
            .to(0.1, { y: -1 }, { easing: `sineOut` })
            .start();
    }
}


