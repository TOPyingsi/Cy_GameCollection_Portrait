import { _decorator, Collider2D, Color, find, Graphics, Node, UITransform, v2, v3, Vec3 } from 'cc';
import { ZDXS_PlayerController } from './ZDXS_PlayerController';
import { ZDXS_BulletController } from './ZDXS_BulletController';
import { ZDXS_PoolManager } from './ZDXS_PoolManager';
import { ZDXS_ENEMY_SPIN, ZDXS_EnemyController } from './ZDXS_EnemyController';
import { ZDXS_GameManager } from './ZDXS_GameManager';
import { ZDXS_AudioManager } from './ZDXS_AudioManager';
import { ZDXS_AUDIO } from './ZDXS_Constant';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_PlayerBounce')
export class ZDXS_PlayerBounce extends ZDXS_PlayerController {

    @property
    LineWidth: number = 10;

    @property(Color)
    LineColor: Color = new Color();

    @property
    LineLength: number = 100;

    Line: Graphics = null;
    LineUITransform: UITransform = null;

    private _lineStartPos: Vec3 = new Vec3();


    DrawLine() {
        // 定义起点和终点
        this._lineStartPos = this.LineUITransform.convertToNodeSpaceAR(this.Line.node.worldPosition);
        // this._lineTargetPos = this._lineStartPos.clone().add(this._lineDir.normalize().multiplyScalar(this.LineLength));

        // 定义起点和终点--世界坐标
        const startPos: Vec3 = this.Line.node.worldPosition;
        const endPos: Vec3 = this.Line.node.worldPosition.clone().add(this.LineDir.clone().normalize().multiplyScalar(this.LineLength));

        // const targetCollider: Collider2D = this.RayClosest(startPos, endPos);
        // if (targetCollider && targetCollider.node.name === "Enemy") {
        //     if (!this.AimTarget) {
        //         this.AimTarget = targetCollider.node.getComponent(ZDXS_EnemyController);
        //         this.AimTarget.PlaySpin(ZDXS_ENEMY_SPIN.Fear, true);
        //     }
        // } else {
        //     if (this.AimTarget) {
        //         this.AimTarget.PlaySpin(ZDXS_ENEMY_SPIN.Idle, true);
        //         this.AimTarget = null;
        //     }
        // }

        // 清空之前的线条
        this.Line.clear();

        // 设置线条样式
        this.Line.lineWidth = this.LineWidth;
        this.Line.strokeColor = this.LineColor;

        // 开始画线
        this.Line.moveTo(this._lineStartPos.x, this._lineStartPos.y);
        this.Line.lineTo(this._lineStartPos.x + this.LineLength, this._lineStartPos.y);
        // this.Line.lineTo(this._lineTargetPos.x, this._lineTargetPos.y);
        this.Line.stroke();
    }

    Aim(dirX: number, dirY: number) {
        if (!ZDXS_GameManager.Instance.IsFire) return;
        super.Aim(dirX, dirY);
        this.DrawLine();
    }

    AimEnd() {
        if (!ZDXS_GameManager.Instance.IsFire) return;
        ZDXS_AudioManager.Instance.Play(ZDXS_AUDIO.跳弹开枪);
        super.AimEnd();
        this.Fire();
        // 清空之前的线条
        this.Line.clear();
        this.PlayerBone.rotation = 0;
        this.GunBone.rotation = 0;
        this.AimNode.angle = 0;
    }

    Fire() {
        const bullet: Node = ZDXS_PoolManager.GetNodeByPrefab(this.BulletPrefab);
        bullet.getComponent(ZDXS_BulletController).Init(this.node.parent, this.Line.node.getWorldPosition().clone(), v2(this.LineDir.x, this.LineDir.y), this.BulletSpeed, this.BulletLifeTime);
    }

}


