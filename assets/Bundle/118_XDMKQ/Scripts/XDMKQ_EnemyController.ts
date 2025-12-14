import { _decorator, animation, Component, EventTouch, math, Node, Quat, Vec2, Vec3 } from 'cc';
import { XDMKQ_AUDIO, XDMKQ_ENUM_STATE, XDMKQ_WEAPON } from './XDMKQ_Constant';
import { XDMKQ_PathManager } from './XDMKQ_PathManager';
import { XDMKQ_PlayerController } from './XDMKQ_PlayerController';
import { XDMKQ_PoolManager } from './XDMKQ_PoolManager';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import Banner, { VibrateType } from 'db://assets/Scripts/Banner';
import { XDMKQ_GameData } from './XDMKQ_GameData';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_EnemyController')
export class XDMKQ_EnemyController extends Component {

    @property
    MoveSpeed: number = 1;

    @property({ displayName: "定时切换位置" })
    Timer: number = 5;

    IsOnCar: boolean = false;
    AnimationController: animation.AnimationController = null;

    StartPoint: string = "";
    TargetPoint: string = "";
    private _path: Vec3[] = [];
    private _curTarget: Vec3 | null = null;
    private _curID: string = "";    // 当前目标点ID
    private _curTimer: number = 0;

    private _targetQuat = new Quat();
    private _tmpQuat = new Quat();

    private _curHp: number = 100;
    private _die: boolean = false;

    protected onEnable(): void {
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_ENEMY_SPEED, this.AniSpeed, this)
    }

    protected onDisable(): void {
        XDMKQ_EventManager.Off(XDMKQ_MyEvent.XDMKQ_ENEMY_SPEED, this.AniSpeed, this);
    }

    Init(satrtPoint: string, targetPoint: string) {
        XDMKQ_GameManager.Instance.ShowEnemy(1);
        this.IsOnCar = false;
        this._curHp = 100;
        this._die = false;
        this.StartPoint = satrtPoint;
        this.TargetPoint = targetPoint;
        this._path = XDMKQ_PathManager.Instance.FindPathById(this.StartPoint, this.TargetPoint);
        if (this._path.length > 0) this._curTarget = this._path.shift();

        this.node.setWorldPosition(XDMKQ_PathManager.Instance.GetWorldPosById(this.StartPoint));
        this.AnimationController = this.getComponent(animation.AnimationController);
        this.AnimationController.setValue("State", XDMKQ_ENUM_STATE.RUN);
        this.AnimationController.setValue("PlaySpeed", 1);
        XDMKQ_PathManager.Instance.AddTargetPoint(targetPoint);
    }

    AniSpeed(speed: number) {
        this.AnimationController.setValue("PlaySpeed", speed);
    }

    InitOnCar(pos: Vec3) {
        XDMKQ_GameManager.Instance.ShowEnemy(1);
        this.IsOnCar = true;
        this._curHp = 100;
        this._die = false;
        this.node.setWorldPosition(pos);
        this.AnimationController = this.getComponent(animation.AnimationController);
        this.AnimationController.setValue("State", XDMKQ_ENUM_STATE.STAND);
        this.AnimationController.setValue("PlaySpeed", 1);
    }


    protected update(dt: number): void {
        if (this._die || XDMKQ_GameManager.Instance.GamePause) return;
        if (this.IsOnCar) return;
        if (!this._curTarget) {
            this._curTimer += dt;
            if (this._curTimer > this.Timer) {
                this._curTimer = 0;
                this._curID = XDMKQ_PathManager.Instance.PickNearestPointId(this.node.worldPosition);
                this._path = XDMKQ_PathManager.Instance.GetRandomPath(this._curID, 0.5);
                // console.error(this._path.length);
                if (this._path.length > 1) {
                    XDMKQ_PathManager.Instance.ChangeTargetPoint(this._curID, XDMKQ_PathManager.Instance.PickNearestPointId(this._path[this._path.length - 1]));
                    this._path.shift();
                    this._curTarget = this._path.shift();
                    this.AnimationController.setValue("State", XDMKQ_ENUM_STATE.RUN);
                } else {
                    this.AnimationController.setValue("State", XDMKQ_ENUM_STATE.FIRE);
                }
                return;
            }
            return;
        }
        // 当前节点位置
        let currentPosition = this.node.worldPosition;
        // 计算从当前节点到目标位置的方向
        let direction = this._curTarget.clone().subtract(currentPosition);
        // 判断是否到达目标位置（距离小于某个阈值时停止移动）
        if (direction.length() < 0.1) {
            // 到达当前目标点，切换到下一个目标点
            if (this._path.length > 0) {
                // 如果还有目标点，继续向下一个目标移动
                this._curTarget = this._path.shift();
            } else {
                this._curTarget = null;
                // this.AnimationController.setValue("State", math.randomRangeInt(0, 4));
                math.random() > 0.5 ? this.AnimationController.setValue("State", XDMKQ_ENUM_STATE.STAND) : this.AnimationController.setValue("State", XDMKQ_ENUM_STATE.SQUAT);
                this.faceDirY(XDMKQ_PlayerController.Instance.node.worldPosition.clone().subtract(currentPosition));
                return;  // 如果所有目标点都已到达，结束
            }
        }

        // 更新节点位置：每帧按速度和时间增量进行移动
        let movement = direction.normalize().multiplyScalar(this.MoveSpeed * dt);
        this.node.worldPosition = this.node.worldPosition.add(movement);
        this.faceDirY(direction);
    }

    // dir 是你已经算好的移动方向（世界空间）
    faceDirY(dir: Vec3) {
        // 忽略零方向
        if (dir.length() < 0.0001) return;

        // 取水平方向（忽略Y）
        const flatDir = new Vec3(dir.x, 0, dir.z);
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
        // 获取 Player 和 Enemy 相对摄像机的世界坐标
        const playerPosWorld = XDMKQ_PlayerController.Instance.Camera.node.worldPosition;  // Vec3
        const enemyPosWorld = this.node.worldPosition;   // Vec3

        // 计算 Player 到 Enemy 的向量
        const playerToEnemy = enemyPosWorld.clone().subtract(playerPosWorld);  // Vec3
        XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_INJURED, playerToEnemy.normalize());

        XDMKQ_GameManager.Instance.HitPlayer(1);
    }

    Hit(weapon: XDMKQ_WEAPON) {
        if (this._die) return;
        this._curHp -= XDMKQ_GameManager.Instance.GetHarmByWeapon(weapon);
        if (this._curHp <= 0) {
            Math.random() > 0.5 ? XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.敌人死亡1) : XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.敌人死亡2);
            this._die = true;
            this.AnimationController.setValue("State", XDMKQ_ENUM_STATE.DIE);
            XDMKQ_GameManager.Instance.ShowEnemy(-1);
            XDMKQ_GameManager.Instance.ShowGold(20);
            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_FKP_ADD_JD);
            if (XDMKQ_GameData.Instance.Shake) Banner.Instance.VibrateShort(VibrateType.Light);
            this.scheduleOnce(() => {
                // 回收Enemy
                this.node.destroy();
                // XDMKQ_PoolManager.PutNode(this.node);
            }, 2);
        }
    }
}


