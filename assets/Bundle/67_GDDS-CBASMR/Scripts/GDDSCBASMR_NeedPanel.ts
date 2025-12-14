import { _decorator, Animation, AnimationClip, Node, sp } from 'cc';
import { GDDSCBASMR_UIBase } from './GDDSCBASMR_UIBase';
import { GDDSCBASMR_AniEvent } from './GDDSCBASMR_AniEvent';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_NeedPanel')
export class GDDSCBASMR_NeedPanel extends GDDSCBASMR_UIBase {

    @property(sp.Skeleton)
    needMoney: sp.Skeleton;

    protected _InitData(): void {
        this.needMoney.animation = "animation";
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    OpenShop() {
        let ani = this.node.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
        GDDSCBASMR_AniEvent.supermarketOpenShop = true;
    }

    ClosePanel(): void {
        let ani = this.node.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }
}