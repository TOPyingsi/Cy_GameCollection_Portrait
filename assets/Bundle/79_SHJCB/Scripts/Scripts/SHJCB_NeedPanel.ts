import { _decorator, Animation, AnimationClip, Node, sp } from 'cc';
import { SHJCB_UIBase } from './SHJCB_UIBase';
import { SHJCB_AniEvent } from './SHJCB_AniEvent';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_NeedPanel')
export class SHJCB_NeedPanel extends SHJCB_UIBase {

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
        SHJCB_AniEvent.supermarketOpenShop = true;
    }

    ClosePanel(): void {
        let ani = this.node.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }
}