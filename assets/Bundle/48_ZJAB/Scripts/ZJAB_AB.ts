import { _decorator, Component, find, Node, Sprite, SpriteFrame, tween, v3 } from 'cc';
import { ZJAB_SoundController, ZJAB_Sounds } from './ZJAB_SoundController';
const { ccclass, property } = _decorator;

@ccclass('ZJAB_AB')
export class ZJAB_AB extends Component {
    public static Instance: ZJAB_AB = null;
    @property(Node)
    Talks: Node[] = [];

    @property(SpriteFrame)
    NormalSF: SpriteFrame = null;

    IconNode: Node = null;
    TalkNode: Node = null;
    protected onLoad(): void {
        ZJAB_AB.Instance = this;

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
        ZJAB_SoundController.Instance.PlaySound(ZJAB_Sounds.AB_1);
        this.scheduleOnce(() => {
            this.TalkNode.active = false;
            this.Talks[index].active = false;
            cb && cb();
        }, time);
    }

    change() {
        this.IconNode.getComponent(Sprite).spriteFrame = this.NormalSF;
    }
}


