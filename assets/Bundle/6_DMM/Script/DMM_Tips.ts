import { _decorator, Component, Node, Quat, Vec3 } from 'cc';
import { DMM_GameManager } from './DMM_GameManager';
import { DMM_LV } from './DMM_LV';
const { ccclass, property } = _decorator;

@ccclass('DMM_Tips')
export class DMM_Tips extends Component {

    Target: Node = null;

    private tempVec: Vec3 = new Vec3(); // 临时向量
    private adjustedTargetPos: Vec3 = new Vec3(); // 调整后的目标位置

    protected start(): void {
        this.Target = DMM_LV.Instance.TipsTarget;
    }

    update(deltaTime: number) {
        if (!this.Target) return;

        // 1. 获取当前节点和目标节点的位置
        const currentPos = this.node.worldPosition;
        const targetPos = this.Target.worldPosition;
        this.adjustedTargetPos.set(targetPos.x, currentPos.y, targetPos.z); // 保持 y 一致

        // 2. 计算方向向量
        Vec3.subtract(this.tempVec, this.adjustedTargetPos, currentPos);
        this.tempVec.normalize(); // 归一化

        // 3. 计算朝向的四元数
        const rotation = new Quat();
        Quat.fromViewUp(rotation, this.tempVec, Vec3.UP);

        // 4. 更新节点的旋转
        this.node.worldRotation = rotation;
    }
}


