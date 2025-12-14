import { _decorator, Animation, AnimationClip, Button, Component, Node } from 'cc';
import { THLCB_UIBase } from './THLCB_UIBase';
import Banner from 'db://assets/Scripts/Banner';
import { THLCB_DataManager } from './THLCB_DataManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('THLCB_ShopPanel')
export class THLCB_ShopPanel extends THLCB_UIBase {

    @property(Node)
    videoButton: Node;

    protected onEnable(): void {
        super.onEnable();
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    VideoCoin() {
        let x = this;
        Banner.Instance.ShowVideoAd(() => {
            THLCB_DataManager.coinSpawn = x.videoButton.getWorldPosition();
            let coin = THLCB_DataManager.Instance.getNumberData("Coin");
            coin += 1000;
            THLCB_DataManager.Instance.setNumberData("Coin", coin);
        })
    }

    ClosePanel(): void {
        let ani = this.node.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }
}