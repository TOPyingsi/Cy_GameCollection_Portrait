import { _decorator, Component, Node, Sprite, SpriteFrame, tween, v3, Vec3 } from 'cc';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('NDPA_MZAward')
export class NDPA_MZAward extends Component {

    Sprite: Sprite = null;
    TargetPos: Vec3;
    cb: Function = null;

    protected onLoad(): void {
        this.Sprite = this.getComponent(Sprite);
    }

    init(startPos: Vec3, targetPos: Vec3, path: string, cb: Function = null) {
        this.node.setWorldPosition(startPos);
        this.TargetPos = targetPos;
        BundleManager.LoadSpriteFrame(GameManager.GameData.DefaultBundle, path).then((sf: SpriteFrame) => {
            this.Sprite.spriteFrame = sf;
        })
        this.cb = cb;
        this.move();
    }

    move() {
        tween(this.node)
            .to(1, { worldPosition: this.TargetPos })
            .call(() => {
                this.scheduleOnce(() => {
                    this.cb && this.cb();
                    if (this.node) {
                        this.node.destroy();
                    }
                })
            })
            .start();
    }
}


