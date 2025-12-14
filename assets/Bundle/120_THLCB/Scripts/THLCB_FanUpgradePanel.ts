import { _decorator, Animation, AnimationClip, Label, Node } from 'cc';
import { THLCB_UIBase } from './THLCB_UIBase';
import { THLCB_DataManager } from './THLCB_DataManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('THLCB_FanUpgradePanel')
export class THLCB_FanUpgradePanel extends THLCB_UIBase {

    @property(Label)
    fanUpgradeLabel: Label;

    protected _InitData(): void {
        let level = THLCB_DataManager.Instance.getNumberData("FanLevel");
        this.fanUpgradeLabel.string = `太棒了！！！\n你是“${THLCB_DataManager.fanLevelNames[level]}”`;
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    ClosePanel(): void {
        let ani = this.node.getComponent(Animation);
        ani.getState("fanUpgrade").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }

}