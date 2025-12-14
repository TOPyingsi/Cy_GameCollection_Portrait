import { _decorator, Collider2D, Color, ERaycast2DType, find, FixedJoint2D, Graphics, Node, PhysicsSystem2D, RigidBody2D, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { ZDXS_PlayerController } from './ZDXS_PlayerController';
import { ZDXS_PoolManager } from './ZDXS_PoolManager';
import { ZDXS_BulletController } from './ZDXS_BulletController';
import { ZDXS_ENEMY_SPIN, ZDXS_EnemyController } from './ZDXS_EnemyController';
import { ZDXS_Attracted } from './ZDXS_Attracted';
import { ZDXS_ANI, ZDXS_AUDIO } from './ZDXS_Constant';
import { ZDXS_GameManager } from './ZDXS_GameManager';
import { ZDXS_AudioManager } from './ZDXS_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_PlayerGravity')
export class ZDXS_PlayerGravity extends ZDXS_PlayerController {
    @property
    LineWidth: number = 10;

    @property(Color)
    LineColor: Color = new Color();

    @property
    LineLength: number = 100;

    @property
    SendForce: number = 5000;

    AttractTarget: RigidBody2D = null;

    private _fixedRigidBody: RigidBody2D = null;
    private _isFirstAttrace: boolean = false;
    private _attraceEnemy: ZDXS_Attracted = null;
    private _attraceName: string = "";

    protected onLoad(): void {
        super.onLoad();
        this._fixedRigidBody = find("Aim/FixedJoint", this.node).getComponent(RigidBody2D);
        // PhysicsSystem2D.instance.debugDrawFlags = 1;
    }

    Aim(dirX: number, dirY: number) {
        if (!ZDXS_GameManager.Instance.IsFire) return;
        super.Aim(dirX, dirY);
        this.DrawLine();
    }

    AimEnd() {
        if (!ZDXS_GameManager.Instance.IsFire) return;
        if (this.IsPlaying) return;

        ZDXS_AudioManager.Instance.Play(ZDXS_AUDIO.重力枪开枪);

        const startPos: Vec3 = this.GunUITransform.convertToWorldSpaceAR(v3(this.FireBone.worldX, this.FireBone.worldY, 0));
        const endPos: Vec3 = startPos.clone().add(this.LineDir.clone().normalize().multiplyScalar(this.LineLength));

        this.IsPlaying = true;
        this.FireEffect.Play(startPos.clone());
        this.PlayAni(ZDXS_ANI.FIRE_GUN, false, () => {
            this.PlayAni(ZDXS_ANI.IDLE_GUN, true);
            this.FireEffect.End();
            this.IsPlaying = false;
        })
        // this.Fire();
        // 清空之前的线条
        this.Line.clear();
        // this.node.scale = v3(1, 1, 1);
        // this.Gun.angle = 0;

        if (this._attraceEnemy) {
            this._attraceEnemy.Send(v2(this.LineDir.x, this.LineDir.y), this.SendForce);
            this._attraceEnemy = null;
            super.AimEnd();
        } else {
            // 定义起点和终点
            // const startPos: Vec3 = this.Line.node.worldPosition;
            // const endPos: Vec3 = this.Line.node.worldPosition.clone().add(this.LineDir.clone().normalize().multiplyScalar(this.LineLength));



            const targetCollider: Collider2D = this.RayClosest(startPos, endPos);
            if (targetCollider) {
                switch (targetCollider.node.name) {
                    case "Enemy":
                        this._isFirstAttrace = true;
                        this._attraceName = "Body";
                        // this.AttractTarget = targetCollider.node.getComponent(ZDXS_EnemyController).Attract();
                        this._attraceEnemy = targetCollider.node.getComponent(ZDXS_Attracted).Attract(this._fixedRigidBody);
                        break;
                    case "Box":
                        this._isFirstAttrace = true;
                        this._attraceName = "Box";
                        this._attraceEnemy = targetCollider.node.getComponent(ZDXS_Attracted).Attract(this._fixedRigidBody);
                        break;
                    case "Circle":
                        this._isFirstAttrace = true;
                        this._attraceName = "Circle";
                        this._attraceEnemy = targetCollider.node.getComponent(ZDXS_Attracted).Attract(this._fixedRigidBody);
                        break;
                    case "Iron":
                        this._isFirstAttrace = true;
                        this._attraceName = "Iron";
                        this._attraceEnemy = targetCollider.node.getComponent(ZDXS_Attracted).Attract(this._fixedRigidBody);
                        break;
                    default:
                        super.AimEnd();
                        break;
                }
            } else {
                super.AimEnd();
            }
        }
    }

    Fire() {
        const bullet: Node = ZDXS_PoolManager.GetNodeByPrefab(this.BulletPrefab);
        bullet.getComponent(ZDXS_BulletController).Init(this.node.parent, this.Line.node.getWorldPosition().clone(), v2(this.LineDir.x, this.LineDir.y), this.BulletSpeed, this.BulletLifeTime);
    }

    DrawLine() {
        // 定义起点和终点--世界坐标
        // const startPos: Vec3 = this.Line.node.worldPosition;
        const startPos: Vec3 = this.GunUITransform.convertToWorldSpaceAR(v3(this.FireBone.worldX, this.FireBone.worldY, 0));
        const endPos: Vec3 = startPos.clone().add(this.LineDir.clone().normalize().multiplyScalar(this.LineLength));

        if (this._attraceEnemy) {
            if (!this.RayAll(startPos, endPos, this._attraceName) && !this._isFirstAttrace) {
                // this._attraceEnemy.Release();
                // this._attraceEnemy = null;
            }
            this._isFirstAttrace = false;
            return;
        }
        // 定义起点和终点--局部
        this.LineStartPos = this.LineUITransform.convertToNodeSpaceAR(startPos);
        this.LineTargetPos = v3(this.LineStartPos.x + this.LineLength, this.LineStartPos.y, 0);

        const targetCollider: Collider2D = this.RayClosest(startPos, endPos);
        if (targetCollider && targetCollider.node.name === "Enemy") {
            if (!this.AimTarget) {
                this.AimTarget = targetCollider.node.getComponent(ZDXS_EnemyController);
                this.AimTarget.PlaySpin(ZDXS_ENEMY_SPIN.Fear, true);
            }
        } else {
            if (this.AimTarget) {
                this.AimTarget.PlaySpin(ZDXS_ENEMY_SPIN.Idle, true);
                this.AimTarget = null;
            }
        }
        // 清空之前的线条
        this.Line.clear();

        // 设置线条样式
        this.Line.lineWidth = this.LineWidth;
        this.Line.strokeColor = this.LineColor;

        // 开始画线
        this.Line.moveTo(this.LineStartPos.x, this.LineStartPos.y);
        this.Line.lineTo(this.LineTargetPos.x, this.LineTargetPos.y);
        // this.Line.lineTo(this._lineTargetPos.x, this._lineTargetPos.y);
        this.Line.stroke();
    }


}


