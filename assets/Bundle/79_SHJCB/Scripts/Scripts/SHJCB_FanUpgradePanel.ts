import { _decorator, Animation, AnimationClip, Label, Node } from 'cc';
import { SHJCB_UIBase } from './SHJCB_UIBase';
import { SHJCB_DataManager } from './SHJCB_DataManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_FanUpgradePanel')
export class SHJCB_FanUpgradePanel extends SHJCB_UIBase {

    @property(Label)
    fanUpgradeLabel: Label;

    protected _InitData(): void {
        let level = SHJCB_DataManager.Instance.getNumberData("FanLevel");
        this.fanUpgradeLabel.string = `太棒了！！！\n你是“${SHJCB_DataManager.fanLevelNames[level]}”`;
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    ClosePanel(): void {
        let ani = this.node.getComponent(Animation);
        ani.getState("fanUpgrade").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }

}