import { _decorator, Camera, Component, Node, Quat, tween, Tween, Vec3 } from 'cc';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_CameraController')
export class XDMKQ_CameraController extends Component {
    public static Instance: XDMKQ_CameraController;

    @property
    NormalFov: number = 60;

    @property
    AimFov: number = 30;

    public Camera: Camera = null;
    public Fire: boolean = false;

    private _curPos: Vec3 = new Vec3();
    private _curAngle: Vec3 = new Vec3();
    private _curParent: Node = null;

    protected onLoad(): void {
        XDMKQ_CameraController.Instance = this;

        this.Camera = this.getComponent(Camera);
    }

    TraceTarget(target: Node, pos: Vec3, angle: Vec3) {
        XDMKQ_GameManager.Instance.ShowUIPanel(false);
        XDMKQ_GameManager.Instance.GamePause = true;
        this._curPos = this.node.getWorldPosition().clone();
        this._curAngle = this.node.eulerAngles.clone();
        this._curParent = this.node.parent;

        this.node.setParent(target);
        this.node.setWorldPosition(pos);
        this.node.eulerAngles = angle;
        XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_ENEMY_SPEED, 0.3);
    }

    ReCover() {
        const tempPos: Vec3 = this.node.getWorldPosition().clone();
        const tempForward: Vec3 = this.node.forward;
        this.node.parent = this._curParent;
        this.node.setWorldPosition(tempPos);
        this.node.forward = tempForward;
        this.scheduleOnce(() => {
            XDMKQ_GameManager.Instance.ShowUIPanel(true);
            XDMKQ_GameManager.Instance.GamePause = false;
            this.node.setWorldPosition(this._curPos);
            this.node.eulerAngles = this._curAngle;
            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_ENEMY_SPEED, 1);
        }, 2);
    }

    private _originPos: Vec3 = new Vec3();
    private _shaking = false;
    /**
 * 触发屏幕抖动
 * @param duration 抖动持续时间（秒）
 * @param magnitude 抖动幅度（单位：世界坐标 / 本地坐标）
 */
    public shake(duration: number = 0.2, magnitude: number = 10) {
        if (this._shaking) return;  // 防止重复触发
        this._shaking = true;

        // 记录初始位置
        this._originPos.set(this.node.position);

        const startTime = performance.now();

        const updateShake = () => {
            const now = performance.now();
            const elapsed = (now - startTime) / 1000; // 秒

            if (elapsed >= duration) {
                // 结束抖动，恢复位置
                this.node.setPosition(this._originPos);
                this._shaking = false;
                return;
            }

            // 当前进度 0~1，用来做衰减
            const progress = elapsed / duration;
            const damping = 1 - progress; // 越到后面抖动越小

            // 随机偏移
            const offsetX = (Math.random() * 2 - 1) * magnitude * damping;
            const offsetY = (Math.random() * 2 - 1) * magnitude * damping;

            const newPos = new Vec3(
                this._originPos.x + offsetX,
                this._originPos.y + offsetY,
                this._originPos.z
            );
            this.node.setPosition(newPos);

            // 下一帧继续
            requestAnimationFrame(updateShake);
        };

        requestAnimationFrame(updateShake);
    }

}


