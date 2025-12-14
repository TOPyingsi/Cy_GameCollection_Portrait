import { _decorator, CCBoolean, Component, Node, Quat, quat, tween, Tween, UITransform, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZCJNZ_TweenController')
export class ZCJNZ_TweenController extends Component {

    static _instance: ZCJNZ_TweenController | null = null;

    @property(CCBoolean)
    playOnAwake: boolean = true;

    @property
    speed: number = 10;

    @property
    angle: number = 5;

    transform: UITransform;

    oriRotation: Quat = quat();

    originalPosition: Vec3 = v3();

    loadDone: boolean = false;

    protected onLoad(): void {
        this.transform = this.node.getComponent(UITransform);
        this.oriRotation.set(this.node.rotation);

        // 设置锚点为左下角
        this.transform.setAnchorPoint(0, 0);

        this.loadDone = true;
        if (this.playOnAwake) this.Shaking(this.speed, this.angle);
    }

    Shaking(speed: number, angle: number) {
        if (!this.loadDone) this.onLoad();

        Tween.stopAllByTarget(this.node);

        tween(this.node)
            .to(1 / speed, { rotation: Quat.fromEuler(new Quat(), 0, 0, angle) })
            .to(1 / speed, { rotation: Quat.fromEuler(new Quat(), 0, 0, -angle) })
            .union().repeatForever().start();
    }

    Stop() {
        if (!this.loadDone) this.onLoad();
        Tween.stopAllByTarget(this.node);
        this.node.setRotation(this.oriRotation);
    }
}