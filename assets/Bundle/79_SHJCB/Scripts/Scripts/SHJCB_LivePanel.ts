import { _decorator, Animation, AnimationClip, Button, Component, Node, randomRangeInt, Sprite, tween, Vec3 } from 'cc';
import { SHJCB_UIBase } from './SHJCB_UIBase';
import { SHJCB_DataManager } from './SHJCB_DataManager';
import { SHJCB_AudioManager } from './SHJCB_AudioManager';
import { SHJCB_MainPanel } from './SHJCB_MainPanel';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import { eventCenter } from './SHJCB_EventCenter';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_LivePanel')
export class SHJCB_LivePanel extends SHJCB_UIBase {

    private static instance: SHJCB_LivePanel;
    public static get Instance(): SHJCB_LivePanel {
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
        SHJCB_LivePanel.instance = this;
    }

    protected onEnable(): void {
        SHJCB_AudioManager.Instance._PlayLiveMusic();
        this.playButton.getComponent(Animation).stop();
        this.playButton.getComponent(Sprite).grayscale = true;
        this.playButton.getComponent(Button).interactable = false;
        this.liveDown.getState(this.liveDown.defaultClip.name).wrapMode = AnimationClip.WrapMode.Reverse;
        this.liveDown.play();
        this.phone.node.active = true;
        this.request.setScale(Vec3.ZERO);
        this.scheduleOnce(() => {
            SHJCB_AudioManager.Instance._PlaySound(43);
            this.phone.play();
        }, 2);
    }

    _InitRequest() {
        this.playButton.getComponent(Animation).play();
        this.playButton.getComponent(Sprite).grayscale = false;
        this.playButton.getComponent(Button).interactable = true;
        SHJCB_DataManager.requestViewer = randomRangeInt(0, 16);
        if (SHJCB_DataManager.chatSfs) this.request.children[3].getComponent(Sprite).spriteFrame = SHJCB_DataManager.chatSfs[SHJCB_DataManager.requestViewer];
        else eventCenter.once("chatSfs", () => { this.request.children[3].getComponent(Sprite).spriteFrame = SHJCB_DataManager.chatSfs[SHJCB_DataManager.requestViewer]; }, this);
        SHJCB_DataManager.requestMubkang = [randomRangeInt(0, 5), randomRangeInt(0, SHJCB_DataManager.jellySfs.length), randomRangeInt(0, SHJCB_DataManager.top1.length), randomRangeInt(0, SHJCB_DataManager.top2.length)];
        this.mubkang.getComponent(Sprite).spriteFrame = SHJCB_DataManager.mukbangSfs.find((value, index, obj) => { if (value.name == `mold${SHJCB_DataManager.requestMubkang[0] + 1}-${SHJCB_DataManager.jellyName[SHJCB_DataManager.requestMubkang[1]]}_1`) return value; });
        this.mubkang.children[0].getComponent(Sprite).spriteFrame = SHJCB_DataManager.requestMubkang[3] == 0 ? null : SHJCB_DataManager.gameTop2.find((value, index, obj) => { if (value.name == `blink${SHJCB_DataManager.requestMubkang[3]}`) return value; });
        this.mubkang.children[1].getComponent(Sprite).spriteFrame = SHJCB_DataManager.top1.find((value, index, obj) => { if (value.name == SHJCB_DataManager.top1Name[SHJCB_DataManager.requestMubkang[2]]) return value; });
        tween(this.request)
            .to(0.25, { scale: Vec3.ONE }, { easing: EasingType.backOut })
            .start();
    }

    Play() {
        SHJCB_AudioManager.Instance._PlaySound(1);
        SHJCB_MainPanel.Instance._Fade(this.node, SHJCB_MainPanel.Instance.gamePanel);
    }

}