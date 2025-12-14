import { _decorator, Component, find, Node, Sprite, SpriteFrame, tween, UIOpacity, v3 } from 'cc';
import { GFS_GHEFFECTS } from './GFS_Constant';
import { GFS_NZ } from './GFS_NZ';
const { ccclass, property } = _decorator;

@ccclass('GFS_GH')
export class GFS_GH extends Component {

    @property(SpriteFrame)
    SF: SpriteFrame[] = [];

    Sprite: Sprite = null;
    Effects: Node = null;
    UIOpacity: UIOpacity = null;

    protected onLoad(): void {
        this.Sprite = this.getComponent(Sprite);
        this.UIOpacity = this.getComponent(UIOpacity);
        this.Effects = find("击打特效", this.node);

    }

    start() {
        GFS_NZ.Instance.GHs.push(this);

        tween(this.node)
            .by(0.5, { angle: -4 })
            .by(1, { angle: 8 })
            .by(0.5, { angle: -4 })
            .union()
            .repeatForever()
            .start();

        tween(this.node)
            .to(0.5, { scale: v3(1, 1.07, 1) })
            .to(1, { scale: v3(1, 1, 1) })
            .to(0.5, { scale: v3(1, 1.07, 1) })
            .union()
            .repeatForever()
            .start();
    }

    show(type: GFS_GHEFFECTS, time: number = 2) {
        switch (type) {
            case GFS_GHEFFECTS.爱心:
                break;
            case GFS_GHEFFECTS.大惊:
                this.Effects.active = true;
                break;
            case GFS_GHEFFECTS.符纸:
                this.Effects.active = true;
                break;
        }
        this.Sprite.spriteFrame = this.SF[type];
        this.scheduleOnce(() => {
            this.removeSelf();
        }, time);
    }

    removeSelf() {
        tween(this.node)
            .by(2, { position: v3(0, 300, 0) }, { easing: `sineOut` })
            .start();
        tween(this.UIOpacity)
            .to(2, { opacity: 100 }, { easing: 'sineOut' })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }

}


