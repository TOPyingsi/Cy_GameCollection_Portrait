import { _decorator, Animation, AnimationClip, Button, Component, Node, randomRangeInt, Sprite, tween, Vec3 } from 'cc';
import { THLCB_UIBase } from './THLCB_UIBase';
import { THLCB_DataManager } from './THLCB_DataManager';
import { THLCB_AudioManager } from './THLCB_AudioManager';
import { THLCB_MainPanel } from './THLCB_MainPanel';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import { eventCenter } from './THLCB_EventCenter';
const { ccclass, property } = _decorator;

@ccclass('THLCB_LivePanel')
export class THLCB_LivePanel extends THLCB_UIBase {

    private static instance: THLCB_LivePanel;
    public static get Instance(): THLCB_LivePanel {
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
    thl: Node;

    protected onLoad(): void {
        super.onLoad();
        THLCB_LivePanel.instance = this;
    }

    protected onEnable(): void {
        THLCB_AudioManager.Instance._PlayLiveMusic();
        this.playButton.getComponent(Animation).stop();
        this.playButton.getComponent(Sprite).grayscale = true;
        this.playButton.getComponent(Button).interactable = false;
        this.liveDown.getState(this.liveDown.defaultClip.name).wrapMode = AnimationClip.WrapMode.Reverse;
        this.liveDown.play();
        this.phone.node.active = true;
        this.request.setScale(Vec3.ZERO);
        this.scheduleOnce(() => {
            THLCB_AudioManager.Instance._PlaySound(43);
            this.phone.play();
        }, 2);
    }

    _InitRequest() {
        this.playButton.getComponent(Animation).play();
        this.playButton.getComponent(Sprite).grayscale = false;
        this.playButton.getComponent(Button).interactable = true;
        THLCB_DataManager.requestViewer = randomRangeInt(0, 16);
        if (THLCB_DataManager.chatSfs) this.request.children[4].getComponent(Sprite).spriteFrame = THLCB_DataManager.chatSfs[THLCB_DataManager.requestViewer];
        else eventCenter.once("chatSfs", () => { this.request.children[4].getComponent(Sprite).spriteFrame = THLCB_DataManager.chatSfs[THLCB_DataManager.requestViewer]; }, this);
        THLCB_DataManager.requestThl = [randomRangeInt(0, 30), randomRangeInt(0, 30), randomRangeInt(0, 30), randomRangeInt(0, 30)];
        for (let i = 0; i < this.thl.children.length; i++) {
            const element = this.thl.children[i].getComponent(Sprite);
            element.spriteFrame = THLCB_DataManager.thl2Sfs.find((value, index, obj) => { if (value.name == (THLCB_DataManager.requestThl[i] + 1).toString()) return value; });
        }
        tween(this.request)
            .to(0.25, { scale: Vec3.ONE }, { easing: EasingType.backOut })
            .start();
    }

    Play() {
        THLCB_AudioManager.Instance._PlaySound(1);
        THLCB_MainPanel.Instance._Fade(this.node, THLCB_MainPanel.Instance.gamePanel);
    }

}