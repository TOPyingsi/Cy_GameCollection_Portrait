import { _decorator, AudioClip, Color, Component, EventTouch, instantiate, Label, Node, Prefab, Skeleton, sp, Sprite, SpriteFrame, tween, Tween, UITransform, v2, v3, Vec2, Vec3, Widget } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('LDTJ_RoleController')
export class LDTJ_RoleController extends Component {

    public static Instance: LDTJ_RoleController;

    index: Vec3 = null;

    private isTouch: boolean = false;

    @property(Node)
    role: Node = null;

    @property(Node)
    weight: Node = null;


  

    private oriScale: Vec3 = v3();

    @property
    speed: number = 1;

    @property
    scaleGap: number = 0.05;

    @property([SpriteFrame])
    xx: SpriteFrame[] = [];

    @property(Prefab)
    specialEffects: Prefab = null;

    protected onLoad(): void {
        LDTJ_RoleController.Instance = this;
        this.index = this.role.position;
    }

    start() {

        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);

        this.bottom(this.role)
    }

    protected update(dt: number): void {
        const label = this.weight.getComponent(Label);
        const w = parseInt(label.string)
        if (w <= 1000 && w >= 500) {
            this.role.getComponent(Sprite).spriteFrame = this.xx[0];
            label.color = new Color(255, 200, 0, 255);
        } else if (w <= 500 && w >= 100) {
            this.role.getComponent(Sprite).spriteFrame = this.xx[1];
            label.color = new Color(180, 255, 0, 255);
        } else if (w <= 100) {
            this.role.getComponent(Sprite).spriteFrame = this.xx[2];
            label.color = new Color(50, 255, 0, 255);
        }
    }

    touchStart(event: EventTouch) {
        const touchStartPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        const isRole = this.role.getComponent(UITransform).getBoundingBox().contains(v2(touchStartPos.x, touchStartPos.y));
        if (!isRole) return;
        this.isTouch = true;
    }

    touchMove(event: EventTouch) {
        if (!this.isTouch) return;
        const touchPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        this.role.setPosition(touchPos.x, this.index.y);
    }

    touchEnd(event: EventTouch) {
        if (this.isTouch) {
            this.isTouch = false;
            this.role.setPosition(0, this.index.y);
        }
    }

    bottom(node: Node) {
        Tween.stopAllByTarget(node);
        this.oriScale.set(node.getScale());

        tween(node)
            .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y + this.scaleGap) })
            .to(1 / this.speed, { scale: this.oriScale })
            .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y - this.scaleGap) })
            .to(1 / this.speed, { scale: this.oriScale })
            .union().repeatForever().start();
    }

    loadSE() {
        const se = instantiate(this.specialEffects);
        let wid = se.addComponent(Widget)
        wid.isAlignHorizontalCenter = true;
        wid.isAlignVerticalCenter = true;
        se.parent = this.role;
        se.active = true;

        tween(se)
            .to(0.5, { scale: new Vec3(2, 2, 0) })
            .call(() => {
                se.destroy();
            })
            .start();
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.node.off(Node.EventType.TOUCH_END, this.touchEnd, this);
    }
}


