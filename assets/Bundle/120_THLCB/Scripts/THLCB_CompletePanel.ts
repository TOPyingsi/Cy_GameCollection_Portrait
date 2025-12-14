import { _decorator, Animation, Node, randomRangeInt, Sprite, tween, UIOpacity, v3, Vec3 } from 'cc';
import { THLCB_UIBase } from './THLCB_UIBase';
import { THLCB_DataManager } from './THLCB_DataManager';
import { THLCB_MainPanel } from './THLCB_MainPanel';
import { eventCenter } from './THLCB_EventCenter';
import { THLCB_AudioManager } from './THLCB_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('THLCB_CompletePanel')
export class THLCB_CompletePanel extends THLCB_UIBase {

    @property(Animation)
    bunny: Animation;

    @property(Node)
    thl: Node;

    @property(Node)
    title: Node;

    @property(UIOpacity)
    bg: UIOpacity;

    protected onEnable(): void {
        THLCB_AudioManager.Instance._PlaySound(49);
        this.bg.opacity = 0;
        tween(this.bg).to(0.5, { opacity: 255 }).start();
        this.bunny.node.setPosition(v3(0, -250));
        this.title.setScale(Vec3.ZERO);
        tween(this.title)
            .to(0.5, { scale: Vec3.ONE })
            .call(() => { this.bunny.play(); })
            .start();
        for (let i = 0; i < this.thl.children.length; i++) {
            const element = this.thl.children[i].getComponent(Sprite);
            element.spriteFrame = THLCB_DataManager.thl2Sfs.find((value, index, obj) => { if (value.name == (THLCB_DataManager.curThl[i] + 1).toString()) return value; });
        }
        this.scheduleOnce(() => {
            THLCB_MainPanel.Instance._Fade(() => {
                THLCB_MainPanel.Instance.gamePanel.active = false;
                this.node.active = false;
                THLCB_MainPanel.Instance.eatPanel.active = true;
            })
        }, 3);
    }

}