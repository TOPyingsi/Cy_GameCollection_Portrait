import { _decorator, BoxCollider2D, Collider2D, Color, Component, Contact2DType, IPhysics2DContact, Label, Node, PolygonCollider2D, RigidBody2D, Sprite } from 'cc';
import { GLDS_GameManager } from './GLDS_GameManager';
import { GLDS_AudioManager } from './GLDS_AudioManager';
import { GLDS_UIManager } from './GLDS_UIManager';
const { ccclass } = _decorator;

@ccclass('GLDS_ColliderHandler')
export class GLDS_ColliderHandler extends Component {
    public static Instance: GLDS_ColliderHandler = null;

    private polygonCollider2D: PolygonCollider2D[] = [];
    private rigidBody: RigidBody2D = null;
    public isTouchingWeapon: boolean = false;

    F: number = 0;//记录失败的
    T: number = 0;//记录成功的

    thresholdValue: number = 0;
    threshold: number = 0;
    isPlaying: boolean = false;

    protected onLoad(): void {
        GLDS_ColliderHandler.Instance = this;

        this.polygonCollider2D = this.node.getComponents(PolygonCollider2D);
        this.rigidBody = this.node.getComponent(RigidBody2D);

        this.polygonCollider2D[0].on(Contact2DType.BEGIN_CONTACT, this.onBeginContactA, this);
        this.polygonCollider2D[1].on(Contact2DType.BEGIN_CONTACT, this.onBeginContactB, this);

        this.scheduleOnce(() => {
            this.ovo();
        }, 0)
    }

    onBeginContactA(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (!this.isTouchingWeapon) return;
        const targetNode = otherCollider?.node;

        this.scheduleOnce(() => {
            if (targetNode && targetNode.isValid) {
                if (!this.isPlaying) {
                    GLDS_AudioManager.Instance.playXC();
                    this.isPlaying = true;
                    this.scheduleOnce(() => {
                        this.isPlaying = false;
                    }, 0.1);
                }

                const s = targetNode.destroy();
                if (s) {
                    this.T += this.threshold;
                    GLDS_UIManager._instance.updateScale(this.T);


                }
            }
        }, 0);
    }

    onBeginContactB(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (!this.isTouchingWeapon) return;
        const targetNode = otherCollider?.node;

        this.scheduleOnce(() => {
            if (!targetNode || !targetNode.isValid) return;

            const sprite = targetNode.getComponent(Sprite);
            if (sprite) {
                sprite.color = Color.RED;
                this.F += this.threshold
            }

            const boxCollider = targetNode.getComponent(BoxCollider2D);
            if (boxCollider) {
                boxCollider.enabled = false;
            }
        }, 0);
    }

    ovo() {
        console.log(100 - (GLDS_GameManager.Instance.threshold * 100))

        const scaleMap = GLDS_GameManager.Instance.fishInfo.get(GLDS_GameManager.Instance.sceneNumber);
        if (scaleMap) this.thresholdValue = scaleMap.get(GLDS_GameManager.Instance.currentFishName) / 100 - (GLDS_GameManager.Instance.threshold * 100);
        const x = GLDS_GameManager.Instance.getGrandChildrenCount()
        this.threshold = GLDS_GameManager.Instance.currentFishScale / x;

        console.log(this.threshold)
    }

    clear() {
        this.F = 0;
        this.T = 0;
        this.threshold = 0;
        this.thresholdValue = 0;
    }

    protected onDestroy(): void {
        this.polygonCollider2D[0].off(Contact2DType.BEGIN_CONTACT, this.onBeginContactA, this);
        this.polygonCollider2D[1].off(Contact2DType.BEGIN_CONTACT, this.onBeginContactB, this);
    }
}



