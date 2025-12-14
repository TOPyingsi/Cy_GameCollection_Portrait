import { _decorator, Component, instantiate, math, Node, Prefab, Quat, v3, Vec2, Vec3 } from 'cc';
import { XDMKQ_PoolManager } from './XDMKQ_PoolManager';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
import { XDMKQ_CameraController } from './XDMKQ_CameraController';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_InjuredTips')
export class XDMKQ_InjuredTips extends Component {

    @property(Prefab)
    InjuredPrefab: Prefab = null;

    @property
    Length: number = 100;

    private _dir: Vec3 = new Vec3();
    private _angle: number = 0;

    protected onEnable(): void {
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_INJURED, this.CreateInjured, this);
    }

    protected onDisable(): void {
        XDMKQ_EventManager.Off(XDMKQ_MyEvent.XDMKQ_INJURED, this.CreateInjured, this);
    }

    //dir是Player 到 Enemy 的向量
    CreateInjured(dir: Vec3) {
        let node = XDMKQ_PoolManager.GetNodeByPrefab(this.InjuredPrefab);
        // let node = instantiate(this.InjuredPrefab);
        node.parent = this.node;

        // 获取摄像机节点
        const camNode = XDMKQ_CameraController.Instance.node;

        // 1. 取摄像机的前向和右向（只看水平面）
        const forward = camNode.forward.clone();
        forward.y = 0;
        forward.normalize();

        const right = camNode.right.clone();
        right.y = 0;
        right.normalize();

        // 2. 玩家→敌人的方向（只看水平面）
        const d = dir.clone();
        d.y = 0;
        if (d.lengthSqr() === 0) {
            // 敌人和玩家在同一位置，没方向可算，你可以直接 return 或者随便给个方向
            return;
        }
        d.normalize();

        // 3. 计算相对于摄像机“朝前”的带符号角度
        const cos = Vec3.dot(forward, d); // 在 forward 方向上的分量
        const sin = Vec3.dot(right, d); // 在 right   方向上的分量

        const angleRad = Math.atan2(sin, cos);   // 弧度，0 = 摄像机正前方，右边为正，左边为负
        const angleDeg = angleRad * 180 / Math.PI;

        // 4. 用这个角度去转 UI（看你的贴图朝向，可能要取负号）
        this._angle = angleDeg;
        node.angle = -this._angle;  // 或者 -angleDeg，看你箭头图片默认朝向

        // 5. 再用同样的角度在 UI 上做一个圆环偏移
        const radius = this.Length;
        const offsetX = Math.sin(angleRad) * radius;
        const offsetY = Math.cos(angleRad) * radius;

        // 这里我是当 node 的父节点是 2D UI（以玩家为中心）
        node.setPosition(offsetX, offsetY, 0);

        this.scheduleOnce(() => {
            // node.destroy();
            XDMKQ_PoolManager.PutNode(node);
        }, 2);
    }
}


