import { _decorator, Component, director, Enum, Label, Node, tween, Tween } from 'cc';
import { ZDXS_LABEL } from './ZDXS_Constant';
import { ZDXS_GameData } from './ZDXS_GameData';
import { ZDXS_MyEvent, ZDXS_EventManager } from './ZDXS_EventManager';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_LabelShow')
export class ZDXS_LabelShow extends Component {

    @property({ type: Enum(ZDXS_LABEL) })
    Label: ZDXS_LABEL = ZDXS_LABEL.GOLD;

    @property(Label)
    Count: Label = null;

    @property
    Duration: number = 1;

    private currentValue: number = 0;   // 当前数值
    private tweenAction: Tween<{ value: number }> | null = null;

    protected onEnable(): void {
        this.changeTo();

        ZDXS_EventManager.On(ZDXS_MyEvent.ZDXS_LABEL_CHANGE, this.changeTo, this);
    }

    protected onDisable(): void {
        ZDXS_EventManager.Off(ZDXS_MyEvent.ZDXS_LABEL_CHANGE, this.changeTo, this);
    }

    /**
     * 在 count 秒内，把 Label 从当前值变化到 target
     */
    public changeTo() {
        if (!this.Count) return;

        // 如果之前有 tween 动画，先停止
        if (this.tweenAction) {
            this.tweenAction.stop();
        }

        // 读取当前 Label 数值（如果为空就用缓存值）
        this.currentValue = parseFloat(this.Count.string) || this.currentValue;

        // 使用对象来承载插值
        let obj = { value: this.currentValue };

        const target = this.Label == ZDXS_LABEL.GOLD ? ZDXS_GameData.Instance.Gold : ZDXS_GameData.Instance.Stars;

        this.tweenAction = tween(obj)
            .to(this.Duration, { value: target }, {
                onUpdate: (val) => {
                    if (this.Count) {
                        this.Count.string = Math.floor(val.value).toString();
                    }
                }
            })
            .call(() => {
                this.currentValue = target; // 最终赋值
            })
            .start();
    }
}


