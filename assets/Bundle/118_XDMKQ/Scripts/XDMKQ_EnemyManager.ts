import { _decorator, Component, Enum, instantiate, math, Node, Prefab, Vec3 } from 'cc';
import { XDMKQ_MAP, XDMKQ_MAP_ENEMY_PATHS, XDMKQ_MAP_PLANE_PATHS, XDMKQ_MAP_VEHICLE_PATHS, XDMKQ_PATH, XDMKQ_WAVE, XDMKQ_WAVE_CONFIG } from './XDMKQ_Constant';
import { XDMKQ_PoolManager } from './XDMKQ_PoolManager';
import { XDMKQ_EnemyController } from './XDMKQ_EnemyController';
import { XDMKQ_MilitaryVehicleController } from './XDMKQ_MilitaryVehicleController';
import { XDMKQ_PathManager } from './XDMKQ_PathManager';
import { XDMKQ_PlaneController } from './XDMKQ_PlaneController';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_EnemyManager')
export class XDMKQ_EnemyManager extends Component {
    public static Instance: XDMKQ_EnemyManager;

    @property(Prefab)
    EnemyPrefab: Prefab = null;

    @property(Prefab)
    MilitaryVehiclePrefab: Prefab = null;

    @property(Prefab)
    PlanePrefab: Prefab = null;

    @property({ displayName: "Enemy创建间隔" })
    CreateEnemyTimer: number = 0.5;

    @property({ displayName: "MilitaryVehicle创建间隔" })
    CreateVehicleTimer: number = 2;

    @property({ displayName: "开启Enemy测试" })
    IsTestEnemy: boolean = false;

    @property({ displayName: "开启Vehicle测试" })
    IsTestVehicle: boolean = false;

    @property({ displayName: "开启Plane测试" })
    IsTestPlane: boolean = false;

    IsPlane: boolean = false;//是否存在飞机
    IsOver: boolean = false;//当前波次是否结束

    private _curMapEnemyPath: XDMKQ_PATH[] = [];
    private _curMapVehiclePath: XDMKQ_PATH[] = [];
    private _curMapPlanePath: XDMKQ_PATH[] = [];
    // private _enemyCount: number = 0;
    // private _vehicleCount: number = 0;
    // private _planeCount: number = 0;
    private _timerEnemy: number = 0;
    private _timerVehicle: number = 0;
    private _nextMapVehicleIndex: number = 0;

    private _wave: XDMKQ_WAVE[] = [];
    private _curWave: XDMKQ_WAVE = null;
    private _timeWave: number = 0;
    private _curWaveCount: number = 0;
    private _curWaveMaxEnemyCount: number = 0;
    private _curWaveEnemyCount: number = 0;
    protected onLoad(): void {
        XDMKQ_EnemyManager.Instance = this;
    }

    protected start(): void {
        if (XDMKQ_GameManager.Instance.IsTest) this.Init(XDMKQ_GameManager.Instance.TestMap);
    }

    Init(map: XDMKQ_MAP) {
        this.IsOver = false;
        this._curMapEnemyPath = XDMKQ_MAP_ENEMY_PATHS[map];
        this._curMapVehiclePath = XDMKQ_MAP_VEHICLE_PATHS[map];
        this._curMapPlanePath = XDMKQ_MAP_PLANE_PATHS[map];

        this._wave = XDMKQ_WAVE_CONFIG.get(map);
        const curWave: XDMKQ_WAVE = this._wave[XDMKQ_GameManager.Instance.WaveCount];
        this._curWave = new XDMKQ_WAVE(curWave.Enemy, curWave.Car, curWave.Plane, curWave.MaxCount, curWave.Duration);
        this._timeWave = this._curWave.Duration;
        this._curWaveCount = 0;
        this._curWaveMaxEnemyCount = curWave.Enemy + curWave.Car * 8 + curWave.Plane;
        this._curWaveEnemyCount = 0;
        // if (this.IsTestEnemy) this.CreateEnemys(10);
        // if (this.IsTestVehicle) this.CreateVehicles(3);
        // if (this.IsTestPlane) this.CreatePlanes(1);
    }

    NextWave() {
        this.IsOver = false;
        const curWaveIndex: number = XDMKQ_GameManager.Instance.WaveCount < this._wave.length ? XDMKQ_GameManager.Instance.WaveCount : this._wave.length - 1;
        const curWave: XDMKQ_WAVE = this._wave[curWaveIndex];
        this._curWave = new XDMKQ_WAVE(curWave.Enemy, curWave.Car, curWave.Plane, curWave.MaxCount, curWave.Duration);
        this._timeWave = this._curWave.Duration;
        this._curWaveCount = 0;
        this._curWaveMaxEnemyCount = curWave.Enemy + curWave.Car * 8 + curWave.Plane;
        this._curWaveEnemyCount = 0;
    }

    protected update(dt: number): void {
        if (XDMKQ_GameManager.Instance.GamePause || this.IsOver) return;
        if (this._curWaveEnemyCount >= this._curWaveMaxEnemyCount) {
            this.IsOver = true;
            return;
        }
        this._timeWave += dt;

        if (this._curWaveCount >= this._curWave.MaxCount) {
            this._curWaveEnemyCount += this._curWaveCount;
            this._curWaveCount = 0;
            this._timeWave = 0;
            this._timerEnemy = 0;
            this._timerVehicle = 0;
        }

        if (this._timeWave >= this._curWave.Duration) {
            this._timerEnemy += dt;
            this._timerVehicle += dt;
            if (this._timerEnemy > this.CreateEnemyTimer && this._curWave.Enemy > 0) {
                this._timerEnemy = 0;
                this._curWave.Enemy--;
                this._curWaveCount++;
                this.CreateEnemy();
            }

            if (this._timerVehicle > this.CreateVehicleTimer && this._curWave.Car > 0) {
                this._timerVehicle = 0;
                this._curWave.Car--;
                this._curWaveCount += 8;
                this.CreateMilitaryVehicle();
            }

            if (!this.IsPlane && this._curWave.Plane > 0) {
                this.IsPlane = true;
                this._curWave.Plane--;
                this._curWaveCount++;
                this.CreatePlane();
            }
        }
    }

    CreateEnemy() {
        let path = this._curMapEnemyPath[Math.floor(Math.random() * this._curMapEnemyPath.length)];
        let enemy = instantiate(this.EnemyPrefab);
        enemy.parent = this.node;
        const endPoint: string = path.end[math.randomRangeInt(0, path.end.length)];
        enemy.getComponent(XDMKQ_EnemyController).Init(path.start, endPoint);
    }

    CreateEnemyOnCar(car: Node, pos: Vec3): XDMKQ_EnemyController {
        let enemy = instantiate(this.EnemyPrefab);
        enemy.parent = car;
        enemy.getComponent(XDMKQ_EnemyController).InitOnCar(pos);
        return enemy.getComponent(XDMKQ_EnemyController);
    }

    MoveEnemyOnCar(enemy: Node, startId: string) {
        const path: Vec3[] = XDMKQ_PathManager.Instance.GetRandomPath(startId, 1);

        if (path.length >= 1) {
            const endId: string = XDMKQ_PathManager.Instance.PickNearestPointId(path[path.length - 1]);
            enemy.parent = this.node;
            XDMKQ_GameManager.Instance.ShowEnemy(-1);
            enemy.getComponent(XDMKQ_EnemyController).Init(startId, endId);
        }
    }

    CreateMilitaryVehicle() {
        const path: string[] = this.getNextMilitaryVehiclePaths();
        let militaryVehicle = instantiate(this.MilitaryVehiclePrefab);
        militaryVehicle.parent = this.node;
        militaryVehicle.getComponent(XDMKQ_MilitaryVehicleController).Init(path[0], path[1]);
    }

    getNextMilitaryVehiclePaths(): string[] {
        this._nextMapVehicleIndex++;
        if (this._nextMapVehicleIndex >= this._curMapVehiclePath.length) {
            this._nextMapVehicleIndex = 0;
        }
        const path: XDMKQ_PATH = this._curMapVehiclePath[this._nextMapVehicleIndex];
        const endPoint: string = path.end[math.randomRangeInt(0, path.end.length)];
        return [path.start, endPoint];
    }

    CreatePlane() {
        let path = this._curMapPlanePath[Math.floor(Math.random() * this._curMapPlanePath.length)];
        let plane = instantiate(this.PlanePrefab);
        plane.parent = this.node;
        plane.getComponent(XDMKQ_PlaneController).Init(path.start, path.end[0]);
    }

}


