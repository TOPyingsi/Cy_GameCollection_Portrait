import { _decorator, Animation, AnimationClip, Button, Component, Node } from 'cc';
import { GDDSCBASMR_UIBase } from './GDDSCBASMR_UIBase';
import Banner from 'db://assets/Scripts/Banner';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_ShopPanel')
export class GDDSCBASMR_ShopPanel extends GDDSCBASMR_UIBase {

    @property(Node)
    videoButton: Node;

    protected onEnable(): void {
        super.onEnable();
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    VideoCoin() {
        let x = this;
        Banner.Instance.ShowVideoAd(() => {
            GDDSCBASMR_DataManager.coinSpawn = x.videoButton.getWorldPosition();
            let coin = GDDSCBASMR_DataManager.Instance.getNumberData("Coin");
            coin += 1000;
            GDDSCBASMR_DataManager.Instance.setNumberData("Coin", coin);
        })
    }

    ClosePanel(): void {
        let ani = this.node.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }
}