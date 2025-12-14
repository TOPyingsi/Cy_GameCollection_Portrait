import { _decorator, Animation, AnimationClip, Label, Node } from 'cc';
import { GDDSCBASMR_UIBase } from './GDDSCBASMR_UIBase';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_FanUpgradePanel')
export class GDDSCBASMR_FanUpgradePanel extends GDDSCBASMR_UIBase {

    @property(Label)
    fanUpgradeLabel: Label;

    protected _InitData(): void {
        let level = GDDSCBASMR_DataManager.Instance.getNumberData("FanLevel");
        this.fanUpgradeLabel.string = `太棒了！！！\n你是“${GDDSCBASMR_DataManager.fanLevelNames[level]}”`;
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    ClosePanel(): void {
        let ani = this.node.getComponent(Animation);
        ani.getState("fanUpgrade").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }

}