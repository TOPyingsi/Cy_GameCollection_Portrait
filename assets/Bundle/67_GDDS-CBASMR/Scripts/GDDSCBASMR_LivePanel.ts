import { _decorator, Animation, AnimationClip, Button, Component, Node, randomRangeInt, Sprite, tween, Vec3 } from 'cc';
import { GDDSCBASMR_UIBase } from './GDDSCBASMR_UIBase';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import { GDDSCBASMR_AudioManager } from './GDDSCBASMR_AudioManager';
import { GDDSCBASMR_MainPanel } from './GDDSCBASMR_MainPanel';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import { eventCenter } from './GDDSCBASMR_EventCenter';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_LivePanel')
export class GDDSCBASMR_LivePanel extends GDDSCBASMR_UIBase {

    private static instance: GDDSCBASMR_LivePanel;
    public static get Instance(): GDDSCBASMR_LivePanel {
        return this.instance;
    }

    @property(Animation)
    liveDown: Animation;

    @property(Animation)
    phone: Animation;

    @property(Node)
    playButton: Node;

    @property(Node)
    request: Node;

    @property(Node)
    mubkang: Node;

    protected onLoad(): void {
        super.onLoad();
        GDDSCBASMR_LivePanel.instance = this;
    }

    protected onEnable(): void {
        GDDSCBASMR_AudioManager.Instance._PlayLiveMusic();
        this.playButton.getComponent(Animation).stop();
        this.playButton.getComponent(Sprite).grayscale = true;
        this.playButton.getComponent(Button).interactable = false;
        this.liveDown.getState(this.liveDown.defaultClip.name).wrapMode = AnimationClip.WrapMode.Reverse;
        this.liveDown.play();
        this.phone.node.active = true;
        this.request.setScale(Vec3.ZERO);
        this.scheduleOnce(() => {
            GDDSCBASMR_AudioManager.Instance._PlaySound(43);
            this.phone.play();
        }, 2);
    }

    _InitRequest() {
        this.playButton.getComponent(Animation).play();
        this.playButton.getComponent(Sprite).grayscale = false;
        this.playButton.getComponent(Button).interactable = true;
        GDDSCBASMR_DataManager.requestViewer = randomRangeInt(0, 16);
        if (GDDSCBASMR_DataManager.chatSfs) this.request.children[3].getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.chatSfs[GDDSCBASMR_DataManager.requestViewer];
        else eventCenter.once("chatSfs", () => { this.request.children[3].getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.chatSfs[GDDSCBASMR_DataManager.requestViewer]; }, this);
        GDDSCBASMR_DataManager.requestMubkang = [randomRangeInt(0, 5), randomRangeInt(0, GDDSCBASMR_DataManager.jellySfs.length), randomRangeInt(0, GDDSCBASMR_DataManager.top1.length), randomRangeInt(0, GDDSCBASMR_DataManager.top2.length)];
        this.mubkang.getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.mukbangSfs.find((value, index, obj) => { if (value.name == `mold${GDDSCBASMR_DataManager.requestMubkang[0] + 1}-${GDDSCBASMR_DataManager.jellyName[GDDSCBASMR_DataManager.requestMubkang[1]]}_1`) return value; });
        this.mubkang.children[0].getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.requestMubkang[3] == 0 ? null : GDDSCBASMR_DataManager.gameTop2.find((value, index, obj) => { if (value.name == `blink${GDDSCBASMR_DataManager.requestMubkang[3]}`) return value; });
        this.mubkang.children[1].getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.top1.find((value, index, obj) => { if (value.name == GDDSCBASMR_DataManager.top1Name[GDDSCBASMR_DataManager.requestMubkang[2]]) return value; });
        tween(this.request)
            .to(0.25, { scale: Vec3.ONE }, { easing: EasingType.backOut })
            .start();
    }

    Play() {
        GDDSCBASMR_AudioManager.Instance._PlaySound(1);
        GDDSCBASMR_MainPanel.Instance._Fade(this.node, GDDSCBASMR_MainPanel.Instance.gamePanel);
    }

}