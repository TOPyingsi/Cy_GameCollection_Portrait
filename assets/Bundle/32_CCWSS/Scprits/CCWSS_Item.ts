import { _decorator, AssetLibrary, Component, Enum, EventTouch, find, Node, tween, Vec3 } from 'cc';
import { AddApPanel } from '../../../Scripts/UI/Panel/AddApPanel';
import { CCWSS_LVController, CCWSS_WAVE } from './CCWSS_LVController';
const { ccclass, property } = _decorator;

@ccclass('CCWSS_Item')
export class CCWSS_Item extends Component {

    @property({ type: Enum(CCWSS_WAVE) })
    Wave: CCWSS_WAVE = CCWSS_WAVE.WAVE1;

    False: Node = null;
    True: Node = null;

    IsClick: boolean = true;//能否点击

    protected onLoad(): void {
        this.False = find("错误", this.node);
        this.True = find("正确", this.node);

        this.False.active = false;
        this.True.active = false;
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected start(): void {
        console.log(2);

        CCWSS_LVController.Instance.addItem(this.Wave);
    }

    onTouchEnd(event: EventTouch) {
        if (!this.IsClick) return;
        this.IsClick = false;
        if (CCWSS_LVController.Instance.CurWave == this.Wave) {
            this.showTarget(this.True, () => {
                CCWSS_LVController.Instance.removeItem(this.Wave);
                this.node.destroy();
            });
        } else {
            CCWSS_LVController.Instance.loseFalseNumber(1);
            this.showTarget(this.False, () => {
                this.IsClick = true;
                this.False.active = false;
            });
        }
    }

    showTarget(target: Node, cb: Function = null) {
        target.scale = Vec3.ZERO;
        target.active = true;
        tween(target)
            .to(0.2, { scale: Vec3.ONE }, { easing: `sineOut` })
            .delay(0.5)
            .call(() => {
                cb && cb();
            })
            .start();
    }
}


