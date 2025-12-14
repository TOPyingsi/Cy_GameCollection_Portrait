import { _decorator, Color, Node, v2, v3, Vec3 } from 'cc';
import { ZDXS_PlayerController } from './ZDXS_PlayerController';
import { ZDXS_PoolManager } from './ZDXS_PoolManager';
import { ZDXS_BulletGrenade } from './ZDXS_BulletGrenade';
import { ZDXS_ANI, ZDXS_AUDIO } from './ZDXS_Constant';
import { ZDXS_GameManager } from './ZDXS_GameManager';
import { ZDXS_AudioManager } from './ZDXS_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_PlayerGrenade')
export class ZDXS_PlayerGrenade extends ZDXS_PlayerController {

    @property(Color)
    LineColor: Color = new Color();

    @property
    DotRadius: number = 15;

    @property
    SegmentCount: number = 30;   // 轨迹分段数量

    @property
    TimeStep: number = 0.1;      // 每段时间间隔

    @property
    Force: number = 10;      // 每段时间间隔

    @property
    G: number = 10;

    Aim(dirX: number, dirY: number) {
        if (!ZDXS_GameManager.Instance.IsFire) return;
        super.Aim(dirX, dirY);
        this.DrawTrajectory();
    }

    AimEnd() {
        if (!ZDXS_GameManager.Instance.IsFire) return;
        if (this.IsPlaying) return;
        this.IsPlaying = true;
        this.PlayAni(ZDXS_ANI.FIRE_GREGRENADE, false, () => {
            this.PlayAni(ZDXS_ANI.IDLE_GREGRENADE, true);
            this.IsPlaying = false;
        })
        ZDXS_AudioManager.Instance.Play(ZDXS_AUDIO.投掷手雷);
        super.AimEnd();
        this.Fire();
        // 清空之前的线条
        this.Line.clear();
        this.PlayerBone.rotation = 0;
        this.GunBone.rotation = 0;
        this.AimNode.angle = 0;
    }

    DrawTrajectory() {
        if (!this.Line) return;

        this.Line.clear();
        this.Line.fillColor = this.LineColor;

        const g = this.G; // 获取 2D 重力大小

        const startPos: Vec3 = this.Line.node.getWorldPosition().clone();
        let prev: Vec3 = startPos.clone();

        const dir = this.LineDir.clone().multiplyScalar(this.Force);

        for (let i = 1; i <= this.SegmentCount; i++) {
            const t: number = this.TimeStep * i;
            const x: number = startPos.x + dir.x * t;
            const y: number = startPos.y + dir.y * t - 0.5 * g * t * t;
            const pos: Vec3 = new Vec3(x, y, 0);

            // 在每个点画一个小圆
            this.Line.circle(this.GetLineNodeSpace(pos).x, this.GetLineNodeSpace(pos).y, this.DotRadius);
            this.Line.fill();

            prev = pos;
        }

    }

    GetLineNodeSpace(worldPos: Vec3): Vec3 {
        return this.LineUITransform.convertToNodeSpaceAR(worldPos);
    }

    Fire() {
        const dir = this.LineDir.clone().multiplyScalar(this.Force);
        const bullet: Node = ZDXS_PoolManager.GetNodeByPrefab(this.BulletPrefab);
        bullet.getComponent(ZDXS_BulletGrenade).InitGrenade(this.node.parent, this.Line.node.getWorldPosition().clone(), v2(dir.x, dir.y), this.G);
    }
}


