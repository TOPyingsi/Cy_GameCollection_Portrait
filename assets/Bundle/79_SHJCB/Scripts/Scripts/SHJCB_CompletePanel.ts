import { _decorator, Animation, Node, randomRangeInt, Sprite, tween, UIOpacity, v3, Vec3 } from 'cc';
import { SHJCB_UIBase } from './SHJCB_UIBase';
import { SHJCB_DataManager } from './SHJCB_DataManager';
import { SHJCB_MainPanel } from './SHJCB_MainPanel';
import { eventCenter } from './SHJCB_EventCenter';
import { SHJCB_AudioManager } from './SHJCB_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_CompletePanel')
export class SHJCB_CompletePanel extends SHJCB_UIBase {

    @property(Animation)
    bunny: Animation;

    @property(Node)
    mubkang: Node;

    @property(Node)
    title: Node;

    @property(UIOpacity)
    bg: UIOpacity;

    protected onEnable(): void {
        SHJCB_AudioManager.Instance._PlaySound(49);
        this.bg.opacity = 0;
        tween(this.bg).to(0.5, { opacity: 255 }).start();
        this.bunny.node.setPosition(v3(0, -250));
        this.title.setScale(Vec3.ZERO);
        tween(this.title)
            .to(0.5, { scale: Vec3.ONE })
            .call(() => { this.bunny.play(); })
            .start();
        if (SHJCB_DataManager.mukbangSfs) this.mubkang.getComponent(Sprite).spriteFrame = SHJCB_DataManager.mukbangSfs.find((value, index, obj) => { if (value.name == `mold${SHJCB_DataManager.curMubkang[0] + 1}-${SHJCB_DataManager.jellyName[SHJCB_DataManager.curMubkang[1]]}_1`) return value; });
        else eventCenter.once("mukbangSfs", () => { this.mubkang.getComponent(Sprite).spriteFrame = SHJCB_DataManager.mukbangSfs.find((value, index, obj) => { if (value.name == `mold${SHJCB_DataManager.curMubkang[0] + 1}-${SHJCB_DataManager.jellyName[SHJCB_DataManager.curMubkang[1]]}_1`) return value; }); });
        this.mubkang.children[0].getComponent(Sprite).spriteFrame = SHJCB_DataManager.curMubkang[3] == 0 ? null : SHJCB_DataManager.gameTop2.find((value, index, obj) => { if (value.name == `blink${SHJCB_DataManager.curMubkang[3]}`) return value; });
        this.mubkang.children[1].getComponent(Sprite).spriteFrame = SHJCB_DataManager.top1.find((value, index, obj) => { if (value.name == SHJCB_DataManager.top1Name[SHJCB_DataManager.curMubkang[2]]) return value; });
        this.scheduleOnce(() => {
            SHJCB_MainPanel.Instance._Fade(() => {
                SHJCB_MainPanel.Instance.gamePanel.active = false;
                this.node.active = false;
                SHJCB_MainPanel.Instance.eatPanel.active = true;
            })
        }, 3);
    }

}