import { _decorator, Component, find, Node, Sprite, SpriteFrame, tween, v3 } from 'cc';
import { GFS_SoundController, GFS_Sounds } from './GFS_SoundController';
const { ccclass, property } = _decorator;

@ccclass('GFS_DS')
export class GFS_DS extends Component {

    public static Instance: GFS_DS = null;

    @property(SpriteFrame)
    SF: SpriteFrame = null;

    IconNode: Node = null;
    IconSprite: Sprite = null;

    Talk: Node = null;

    protected onLoad(): void {
        GFS_DS.Instance = this;

        this.IconNode = find("Icon", this.node);
        this.IconSprite = find("Icon", this.node).getComponent(Sprite);

        this.Talk = find("Talk", this.node);
    }

    protected start(): void {
        if (this.IconNode) {
            tween(this.IconNode)
                .to(1, { scale: v3(1, 1.05, 1) }, { easing: 'sineOut' })
                .to(1, { scale: v3(1, 1, 1) }, { easing: 'sineOut' })
                .union()
                .repeatForever()
                .start();
        }
    }

    next(cb: Function = null) {
        this.IconSprite.spriteFrame = this.SF;
        this.Talk.active = true;
        GFS_SoundController.Instance.PlaySound(GFS_Sounds.DS_1);
        tween(this.node)
            .delay(4)
            .call(() => {
                this.Talk.active = false;
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.DS_2);
            })
            .by(2, { position: v3(1000, 0, 0) }, { easing: `sineOut` })
            .call(() => {
                cb && cb();
            })
            .start();
    }

}


