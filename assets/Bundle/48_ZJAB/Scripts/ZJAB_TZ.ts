import { _decorator, Component, find, Node, Sprite, SpriteFrame, tween, v3 } from 'cc';
import { ZJAB_SoundController, ZJAB_Sounds } from './ZJAB_SoundController';
const { ccclass, property } = _decorator;

@ccclass('ZJAB_TZ')
export class ZJAB_TZ extends Component {
    public static Instance: ZJAB_TZ = null;

    @property(Node)
    Talks: Node[] = [];

    @property(SpriteFrame)
    ChangeSF: SpriteFrame = null;

    IconNode: Node = null;
    TalkNode: Node = null;

    protected onLoad(): void {
        ZJAB_TZ.Instance = this;

        this.IconNode = find("Icon", this.node);
        this.TalkNode = find("Talk", this.node);
    }

    protected start(): void {
        tween(this.IconNode)
            .to(1, { scale: v3(1, 1.05, 1) })
            .to(1, { scale: v3(1, 1, 1) })
            .union()
            .repeatForever()
            .start();
    }

    showTalk(index: number, cb: Function = null, time: number = 3) {
        this.TalkNode.active = true;
        this.Talks[index].active = true;
        this.playSoundByIndex(index);
        this.scheduleOnce(() => {
            this.TalkNode.active = false;
            this.Talks[index].active = false;
            cb && cb();
        }, time);
    }

    playSoundByIndex(index: number) {
        switch (index) {
            case 0:
                ZJAB_SoundController.Instance.PlaySound(ZJAB_Sounds.TZ_1);
                break;
            case 1:
                ZJAB_SoundController.Instance.PlaySound(ZJAB_Sounds.TZ_2);
                break;
        }
    }

    change() {
        this.IconNode.getComponent(Sprite).spriteFrame = this.ChangeSF;
    }
}


