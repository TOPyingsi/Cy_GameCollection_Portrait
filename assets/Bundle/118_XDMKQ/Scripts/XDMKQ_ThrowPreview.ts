import { _decorator, Component, Node, Prefab, instantiate, Vec3, Camera, geometry, PhysicsSystem, Layers, floatToHalf, v3, gfx, utils, MeshRenderer, Material, Mesh } from 'cc';
import { XDMKQ_WEAPON } from './XDMKQ_Constant';
import { XDMKQ_BulletManager } from './XDMKQ_BulletManager';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
import { XDMKQ_PlayerController } from './XDMKQ_PlayerController';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_ThrowPreview')
export class XDMKQ_ThrowPreview extends Component {
    @property(Node) muzzle!: Node;                 // 起点
    @property(Camera) camera!: Camera;             // 主摄
    @property(Prefab) dotPrefab!: Prefab;          // 轨迹点
    @property(Prefab) hitPrefab!: Prefab;          // 落点指示
    @property({ tooltip: '最大采样点数' }) maxDots = 40;
    @property({ tooltip: '时间步长（秒）' }) dt = 1 / 30;
    @property({ tooltip: '初速度（米/秒）' }) throwSpeed = 18;
    @property({ tooltip: '调节这个值来增加斜向上的程度' }) additionalUpwardSpeed: number = 5;

    public IsPreview: boolean = false;
    public G = new Vec3(0, -9.81, 0);

    private _dots: Node[] = [];
    private _hitMark: Node | null = null;
    private _tmp = {
        p: new Vec3(), pPrev: new Vec3(), v0: new Vec3(),
        seg: new geometry.Ray(), dir: new Vec3(), delta: new Vec3()
    };
    private _ray = new geometry.Ray();
    private _v0 = new Vec3();
    private _normalV0 = new Vec3(0.3, 6.8, 19.1);
    onLoad() {
        // 预生成点
        for (let i = 0; i < this.maxDots; i++) {
            const n = instantiate(this.dotPrefab);
            n.setParent(this.node);
            n.active = false;
            this._dots.push(n);
        }
        this._hitMark = instantiate(this.hitPrefab);
        this._hitMark.setParent(this.node);
        this._hitMark.active = false;
    }

    /**
     * A. 根据镜头朝向得到 v0（适合 FPS/第三人称）
     * 如果想要根据落点计算v0，可以修改此方法
     */
    private getTargetPos(): Vec3 | null {
        const camPos = this.camera.node.worldPosition;
        const forward = this.camera.node.forward.clone();
        geometry.Ray.fromPoints(this._ray, camPos, Vec3.add(new Vec3(), camPos, forward));
        // 4️ 进行最近碰撞检测
        const hit = PhysicsSystem.instance.raycastClosest(this._ray);

        if (hit) {
            const res = PhysicsSystem.instance.raycastClosestResult;
            const collider = res.collider;        // 最近的 Collider
            const hitPoint = res.hitPoint;
            // 临时打印
            // console.log(' node=', res.collider?.node?.name);
            return hitPoint;
        }
        return null;
    }

    /**
     * 通过落点位置计算出初始速度
     */
    private calculateInitialVelocity(targetPosition: Vec3) {
        const muzzlePosition: Vec3 = this.muzzle.worldPosition;

        // 目标位置和起点位置的差值
        const distance: Vec3 = targetPosition.clone().subtract(muzzlePosition);
        const yDiff: number = distance.y;

        // 计算时间步长：在y轴上的抛物线时间
        const timeToReachTarget: number = Math.sqrt(Math.abs((2 * yDiff) / this.G.y));

        // 计算在y轴方向上的初始速度
        const initialSpeedY: number = yDiff / timeToReachTarget; // 只计算y轴的初始速度

        // 给y轴的速度加一个额外的偏移量，使得抛物线更加斜向上
        const finalSpeedY: number = initialSpeedY + this.additionalUpwardSpeed;

        // 计算在x轴和z轴上的速度
        // 先计算总速度在水平面（x, z）方向上的分量
        const horizontalSpeed: number = Math.sqrt(distance.x * distance.x + distance.z * distance.z) / timeToReachTarget;

        // 计算最终的x和z方向的速度分量
        const speedX: number = distance.x / Math.sqrt(distance.x * distance.x + distance.z * distance.z) * horizontalSpeed;
        const speedZ: number = distance.z / Math.sqrt(distance.x * distance.x + distance.z * distance.z) * horizontalSpeed;

        // 设置最终的初始速度（包含x、y、z方向）
        this._v0.set(speedX, finalSpeedY, speedZ);
    }

    private _points: Vec3[] = [];
    private _dir: Vec3 = new Vec3();
    /**
     * 渲染轨迹并计算碰撞点
     */
    public renderPreview(v0: Vec3) {
        const p0 = this.muzzle.worldPosition;
        const { p, pPrev, seg, delta } = this._tmp;
        p.set(p0);
        pPrev.set(p0);
        const g = this.G;
        let t = 0;
        let hit = false;
        let hitPos = new Vec3();

        // 清空所有点
        for (let i = 0; i < this._dots.length; i++) this._dots[i].active = false;
        if (this._hitMark) this._hitMark.active = false;
        this._points = [];

        for (let i = 0; i < this.maxDots; i++, t += this.dt) {
            // 计算当前位置
            p.set(
                p0.x + v0.x * t + 0.5 * g.x * t * t,
                p0.y + v0.y * t + 0.5 * g.y * t * t,
                p0.z + v0.z * t + 0.5 * g.z * t * t
            );

            // 使用射线检测碰撞
            delta.set(p).subtract(pPrev);
            const len = delta.length();
            if (len > 1e-5) {
                seg.o.set(pPrev);
                seg.d.set(delta).normalize();
                if (PhysicsSystem.instance.raycastClosest(seg, 0xffffffff, len)) {
                    const res = PhysicsSystem.instance.raycastClosestResult!;
                    hit = true;
                    hitPos.set(res.hitPoint);
                    p.set(hitPos); // 如果碰撞了，更新位置为命中点
                }
            }

            // 显示轨迹点
            const dot = this._dots[i];
            dot.worldPosition = p;
            dot.active = true;
            this._points.push(p.clone());

            if (hit) break;

            pPrev.set(p);
        }

        //前一个dot指向下一个dot
        for (let i = 0; i < this._dots.length - 1; i++) {
            if (this._dots[i].active) {
                this._dir = this._dots[i].worldPosition.clone().subtract(XDMKQ_PlayerController.Instance.node.worldPosition);
                this._dots[i].forward = this._dir;
                break;
            }

        }

        // 显示落点
        if (hit && this._hitMark) {
            this._hitMark.worldPosition = hitPos;
            this._hitMark.active = true;
        }
    }

    /**
     * 关闭渲染
     */

    public CloseRender() {
        this.IsPreview = false
        this._dots.forEach(dot => dot.active = false);
        this._hitMark.active = false;
        // XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_GJ_SHOW, []);
    }


    public Throw(weapon: XDMKQ_WEAPON) {
        if (weapon == XDMKQ_WEAPON.手雷) {
            XDMKQ_BulletManager.Instance.CreateSL(this.muzzle.getWorldPosition(), this._v0.clone(), this.G);
        } else if (weapon == XDMKQ_WEAPON.燃烧弹) {
            XDMKQ_BulletManager.Instance.CreateRSP(this.muzzle.getWorldPosition(), this._v0.clone(), this.G);
        }
    }

    /**
     * 演示用：每帧根据摄像机方向做提示
     */
    update() {
        if (this.IsPreview && this.getTargetPos()) {
            this.calculateInitialVelocity(this.getTargetPos()); // 计算初始速度
            this.renderPreview(this._v0); // 渲染轨迹
        }
    }
}
