import { _decorator, Component, math, Node, ParticleSystem, Quat, Vec3 } from 'cc';
import { XDMKQ_PathManager } from './XDMKQ_PathManager';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_AUDIO, XDMKQ_WEAPON } from './XDMKQ_Constant';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
import { XDMKQ_PoolManager } from './XDMKQ_PoolManager';
import { XDMKQ_GameData } from './XDMKQ_GameData';
import Banner, { VibrateType } from 'db://assets/Scripts/Banner';
import { XDMKQ_PlayerController } from './XDMKQ_PlayerController';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_PlaneController')
export class XDMKQ_PlaneController extends Component {

    @property(Node)
    LXJ: Node = null;

    @property
    MoveSpeed: number = 0;

    @property
    RotateSpeed: number = 100;

    @property(Node)
    Explode: Node = null;

    @property(Node)
    FireEffect: Node[] = [];

    TargetPoint: string = "";

    private _path: Vec3[] = [];
    private _curTarget: Vec3 | null = null;

    private _targetQuat = new Quat();
    private _tmpQuat = new Quat();

    private _die: boolean = false;
    private _curHp: number = 500;
    private _timer: number = 0;

    Init(startPoint: string, targetPoint: string) {
        XDMKQ_GameManager.Instance.ShowEnemy(1);
        this.TargetPoint = targetPoint;
        this._path = XDMKQ_PathManager.Instance.FindPathById(startPoint, this.TargetPoint);
        if (this._path.length > 0) this._curTarget = this._path.shift();
        this.node.setWorldPosition(XDMKQ_PathManager.Instance.GetWorldPosById(startPoint));
        this._curHp = 500;
        XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.飞机出场);
        this._timer = 0;
    }

    protected update(dt: number): void {
        if (XDMKQ_GameManager.Instance.GamePause) return;
        if (this._die) return;

        if (!this._curTarget) return;

        this._timer += dt;
        if (this._timer > 4) {
            this._timer = 0;
            XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.飞机飞行);
        }
        // 当前节点位置
        let currentPosition = this.node.worldPosition;
        // 计算从当前节点到目标位置的方向
        let direction = this._curTarget.clone().subtract(currentPosition);
        // 判断是否到达目标位置（距离小于某个阈值时停止移动）
        if (direction.length() < 0.5) {
            // 到达当前目标点，切换到下一个目标点
            if (this._path.length > 0) {
                // 如果还有目标点，继续向下一个目标移动
                this._curTarget = this._path.shift();
            } else {
                const curID = XDMKQ_PathManager.Instance.PickNearestPointId(this.node.worldPosition);
                if (curID === this.TargetPoint) {
                    this.Fire();
                }
                this._curTarget = XDMKQ_PathManager.Instance.GetWorldPosById(XDMKQ_PathManager.Instance.GetRandomPoint(curID));
                return;  // 如果所有目标点都已到达，结束
            }
        }

        // 更新节点位置：每帧按速度和时间增量进行移动
        let movement = direction.normalize().multiplyScalar(this.MoveSpeed * dt);
        this.node.worldPosition = this.node.worldPosition.add(movement);
        this.faceDirY(direction);

        //旋转螺旋桨
        this.LXJ.angle > 360 ? this.LXJ.angle += dt * this.RotateSpeed - 360 : this.LXJ.angle += dt * this.RotateSpeed;
    }

    // dir 是你已经算好的移动方向（世界空间）
    faceDirY(dir: Vec3) {
        // 忽略零方向
        if (dir.length() < 0.0001) return;

        // 取水平方向（忽略Y）
        const flatDir = new Vec3(dir.x, dir.y, dir.z);
        flatDir.normalize();

        // 计算目标朝向角（注意 Creator 的前方是 -Z）
        // const targetYaw = Math.atan2(-flatDir.x, -flatDir.z);
        const targetYaw = Math.atan2(flatDir.x, flatDir.z);
        Quat.fromEuler(this._targetQuat, 0, math.toDegree(targetYaw), 0);

        // 平滑转向
        Quat.slerp(this._tmpQuat, this.node.worldRotation, this._targetQuat, 1);
        this.node.setWorldRotation(this._tmpQuat);
    }

    Fire() {
        this.schedule(() => {
            if (this._die) return;
            this.FireEffect.forEach(node => {
                node.children.forEach(e => {
                    e.getComponent(ParticleSystem).play();
                })
            })
            XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.飞机开枪);
            // 获取 Player 和 Enemy 相对摄像机的世界坐标
            const playerPosWorld = XDMKQ_PlayerController.Instance.Camera.node.worldPosition;  // Vec3
            const enemyPosWorld = this.node.worldPosition;   // Vec3

            // 计算 Player 到 Enemy 的向量
            const playerToEnemy = enemyPosWorld.clone().subtract(playerPosWorld);  // Vec3
            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_INJURED, playerToEnemy.normalize());

            XDMKQ_GameManager.Instance.HitPlayer(1);
            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_ROLE_SHOW);
        }, 0.2, 5);

    }

    Hit(weapon: XDMKQ_WEAPON) {
        if (this._die) return;
        this._curHp -= XDMKQ_GameManager.Instance.GetHarmByWeapon(weapon);
        if (this._curHp <= 0) {
            this._die = true;

            XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.轰炸);
            this.node.children[0].active = false;
            this.node.children[1].active = false;
            this.Explode.active = true;
            XDMKQ_GameManager.Instance.ShowEnemy(-1);
            XDMKQ_GameManager.Instance.ShowGold(800);
            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_FKP_ADD_JD, 3);
            if (XDMKQ_GameData.Instance.Shake) Banner.Instance.VibrateShort(VibrateType.Light);

            this.scheduleOnce(() => {
                this._die = false;
                this.node.children[0].active = true;
                this.node.children[1].active = true;
                this.Explode.active = false;
                this.node.destroy();

                // XDMKQ_PoolManager.PutNode(this.node);
            }, 2);
        }
    }
}


