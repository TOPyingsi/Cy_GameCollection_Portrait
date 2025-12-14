import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import { MHLX_GameManager } from './MHLX_GameManager';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('MHLX_TutorialPanel')
export class MHLX_TutorialPanel extends Component {

    @property(Label)
    tutorialLabel: Label;

    @property(Node)
    title: Node;

    isTween = false;

    strs: string[] = [
        "选择一列牌堆，并翻开最下面这张",
        "只有当翻开的牌是人形山海经的时候你才能继续推牌！",
        "当翻开的牌是水果动物时，对方推牌"
    ]

    protected onEnable(): void {
        this.tutorialLabel.string = this.strs[MHLX_GameManager.Instance.tutorialStep];
        tween(this.title)
            .to(0.5, { scale: Vec3.ONE }, { easing: EasingType.backOut })
            .start();
    }

    Show(fun: Function = () => { }) {
        this.node.active = true;
    }

    Click() {
        AudioManager.Instance.PlaySFX(MHLX_GameManager.Instance.clips[3]);
        if (this.isTween) return;
        this.isTween = true;
        MHLX_GameManager.Instance.tutorialStep++;
        tween(this.title)
            .to(0.5, { scale: Vec3.ZERO }, { easing: EasingType.backIn })
            .call(() => {
                this.node.active = false;
                this.isTween = false;
            })
            .start();
    }

}


