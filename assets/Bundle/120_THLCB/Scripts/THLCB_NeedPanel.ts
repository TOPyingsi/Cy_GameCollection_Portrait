import { _decorator, Animation, AnimationClip, Node, sp } from 'cc';
import { THLCB_UIBase } from './THLCB_UIBase';
import { THLCB_AniEvent } from './THLCB_AniEvent';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('THLCB_NeedPanel')
export class THLCB_NeedPanel extends THLCB_UIBase {

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
        THLCB_AniEvent.supermarketOpenShop = true;
    }

    ClosePanel(): void {
        let ani = this.node.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }
}