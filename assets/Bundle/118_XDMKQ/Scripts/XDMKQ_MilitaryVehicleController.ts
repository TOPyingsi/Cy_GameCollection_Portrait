import { _decorator, Collider, Component, ITriggerEvent, math, Node, Quat, v3, Vec3 } from 'cc';
import { XDMKQ_PathManager } from './XDMKQ_PathManager';
import { XDMKQ_EnemyManager } from './XDMKQ_EnemyManager';
import { XDMKQ_PoolManager } from './XDMKQ_PoolManager';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
import { XDMKQ_EnemyController } from './XDMKQ_EnemyController';
import { XDMKQ_AMPLIFICATION, XDMKQ_SUPPLY, XDMKQ_WEAPON, XDMKQ_WEAPON_HARM_CONFIG } from './XDMKQ_Constant';
import Banner, { VibrateType } from 'db://assets/Scripts/Banner';
import { XDMKQ_GameData } from './XDMKQ_GameData';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_MilitaryVehicleController')
export class XDMKQ_MilitaryVehicleController extends Component {

    @property(Node)
    Tyres: Node[] = [];

    @property
    MoveSpeed: number = 0;

    @property
    RotateSpeed: number = 0;

    @property({ displayName: "Enmey下车间隔" })
    Timer: number = 2;

    @property({ displayName: "Enmey人数" })
    EnemyCount: number = 8;

    @property(Node)
    Enemys: Node = null;

    @property(Node)
    Explode: Node = null;

    StartPoint: string = "";
    TargetPoint: string = "";
    EnemysOnCar: XDMKQ_EnemyController[] = [];

    private _tyreRotate: Vec3 = new Vec3();
    private _path: Vec3[] = [];
    private _curTarget: Vec3 | null = null;
    private _curID: string = "";

    private _targetQuat = new Quat();
    private _tmpQuat = new Quat();

    private _timer: number = 0;
    private _curCount: number = 0;
    private _die: boolean = false;
    private _curHp: number = 300;

    protected onEnable(): void {
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_REMOVE_ENEMY_ON_CAR, this.RemoveEnemy, this);

        if (this.Explode) {
            this.Explode.getComponent(Collider).on('onTriggerEnter', this.onTriggerEnter, this);
        }
    }

    protected onDisable(): void {
        XDMKQ_EventManager.Off(XDMKQ_MyEvent.XDMKQ_REMOVE_ENEMY_ON_CAR, this.RemoveEnemy, this);

        if (this.Explode) {
            this.Explode.getComponent(Collider).off('onTriggerEnter', this.onTriggerEnter, this);
        }
    }
    Init(satrtPoint: string, targetPoint: string) {
        XDMKQ_GameManager.Instance.ShowEnemy(1);
        this.StartPoint = satrtPoint;
        this.TargetPoint = targetPoint;
        this._curID = targetPoint;
        this._path = XDMKQ_PathManager.Instance.FindPathById(this.StartPoint, this.TargetPoint);
        if (this._path.length > 0) this._curTarget = this._path.shift();
        this.node.setWorldPosition(XDMKQ_PathManager.Instance.GetWorldPosById(this.StartPoint));
        XDMKQ_PathManager.Instance.AddTargetPoint(this._curID);

        this._curHp = 300;
        this._timer = 0;
        this._curCount = this.EnemyCount;
        this.EnemysOnCar = [];
        this.Enemys.children.forEach(enemy => {
            this.EnemysOnCar.push(XDMKQ_EnemyManager.Instance.CreateEnemyOnCar(this.node, enemy.worldPosition.clone()));
        });
    }


    protected update(dt: number): void {
        if (XDMKQ_GameManager.Instance.GamePause) return;
        if (this._die) return;
        if (!this._curTarget) {
            this._timer += dt;
            if (this._timer > this.Timer && this.EnemysOnCar.length > 0) {
                this._timer = 0;
                // console.error(this._curCount);
                XDMKQ_EnemyManager.Instance.MoveEnemyOnCar(this.EnemysOnCar.shift().node, this._curID);
            }
            // else if (this._curCount <= 0) {
            //     XDMKQ_PathManager.Instance.RemoveTargetPoint(this._curID);
            //     XDMKQ_PoolManager.PutNode(this.node);
            // }
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
                return;  // 如果所有目标点都已到达，结束
            }
        }

        // 更新节点位置：每帧按速度和时间增量进行移动
        let movement = direction.normalize().multiplyScalar(this.MoveSpeed * dt);
        this.node.worldPosition = this.node.worldPosition.add(movement);
        this.faceDirY(direction);
        this.RotateTyre(dt);
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

    //旋转轮胎
    RotateTyre(dt: number) {
        for (let i = 0; i < this.Tyres.length; i++) {
            this._tyreRotate = v3(this.Tyres[i].eulerAngles.x + dt * this.RotateSpeed, 0, 0);
            if (this._tyreRotate.x > 360) this._tyreRotate.x -= 360;
            this.Tyres[i].eulerAngles = this._tyreRotate;
        }
    }
    Hit(weapon: XDMKQ_WEAPON, isMax: boolean = false) {
        if (this._die) return;
        XDMKQ_GameManager.Instance.GetAmplificationCount(XDMKQ_SUPPLY.火箭筒, XDMKQ_AMPLIFICATION.伤害)
        this._curHp -= XDMKQ_GameManager.Instance.GetHarmByWeapon(weapon);
        if (isMax) this._curHp = 0;
        if (this._curHp <= 0) {
            this._die = true;

            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_FKP_ADD_JD);
            XDMKQ_GameManager.Instance.ShowEnemy(-1);
            XDMKQ_GameManager.Instance.ShowGold(200);
            if (XDMKQ_GameData.Instance.Shake) Banner.Instance.VibrateShort(VibrateType.Light);

            this.EnemysOnCar.forEach(enemy => {
                enemy.Hit(XDMKQ_WEAPON.手雷);
            });

            this.Explode.active = true;
            this.scheduleOnce(() => {
                this.Explode.getComponent(Collider).enabled = false;
            })

            this.scheduleOnce(() => {
                this._die = false;
                this.Explode.active = false;
                this.Explode.getComponent(Collider).enabled = true;
                this.node.destroy();

                // XDMKQ_PoolManager.PutNode(this.node);
            }, 2);
        }
    }

    RemoveEnemy(enemy: XDMKQ_EnemyController) {
        const index = this.EnemysOnCar.indexOf(enemy);
        if (index == -1) return;
        this.EnemysOnCar.splice(index, 1);
    }

    onTriggerEnter(event: ITriggerEvent) {
        // console.log(event.otherCollider.node.name);
        if (event.otherCollider.node.name == "Enemy") {
            console.error(event.otherCollider.node.name);
            event.otherCollider.node.getComponent(XDMKQ_EnemyController).Hit(XDMKQ_WEAPON.手雷);
        }
    }
}


