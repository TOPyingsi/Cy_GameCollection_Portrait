import { _decorator, Component, Enum, find, tween, Node, v3, Sprite, SpriteFrame, Collider2D, Contact2DType, IPhysics2DContact, log } from 'cc';
import { ZJAB_NZ } from './ZJAB_NZ';
import { ZJAB_ITEM } from './ZJAB_Constant';
const { ccclass, property } = _decorator;

@ccclass('ZJAB_Item')
export class ZJAB_Item extends Component {

    @property(SpriteFrame)
    SFs: SpriteFrame[] = [];

    Collider: Collider2D = null;
    Sprite: Sprite = null;
    Type: ZJAB_ITEM = ZJAB_ITEM.冰块;

    IsRemove: boolean = false;

    protected onLoad(): void {
        this.Sprite = this.getComponent(Sprite);
        this.Collider = this.getComponent(Collider2D);
        if (this.Collider) {
            this.Collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        this.init(ZJAB_ITEM.冰块);
    }

    init(type: ZJAB_ITEM) {
        this.Type = type;
        this.Sprite.spriteFrame = this.SFs[type];

        tween(this.node)
            .by(3, { position: v3(0, -800, 0) })
            .call(() => {
                if (this.IsRemove) return;
                tween(this.node)
                    .by(1, { position: v3(0, -600, 0) })
                    .call(() => {
                        if (this.IsRemove) return;
                        this.node.destroy();
                    })
                    .start();
            })
            .start();
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.IsRemove) return;
        this.IsRemove = true;
        ZJAB_NZ.Instance.getItem(this.Type);
        this.scheduleOnce(() => { this.node.destroy(); })
    }
}


