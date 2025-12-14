import { _decorator, Component, Node, Prefab, instantiate, Vec3, math, Tween, tween } from 'cc';
import { XCJZ_BlockController } from './XCJZ_BlockController';
import { XCJZ_GameManager } from './XCJZ_GameManager';
import { XCJZ_EventManager, XCJZ_MyEvent } from './XCJZ_EventManager';
import { XCJZ_BLOCK } from './XCJZ_Constant';
const { ccclass, property } = _decorator;

@ccclass('XCJZ_MapController')
export class XCJZ_MapController extends Component {

    @property(Prefab)
    LittleBlockPrefabs: Prefab[] = []; // 普通梯子的预制体

    @property(Prefab)
    SpecialLadderPrefabs: Prefab[] = []; // 特定颜色的梯子预制体

    @property
    spawnStartZ: number = 0;             // 起始生成 Z

    @property
    forwardBuffer: number = 40;          // 前方预生成缓冲区（越大生成越提前）

    @property
    minGap: number = 6;                  // 两次生成梯子之间最小间隔
    @property
    maxGap: number = 14;                // 两次生成梯子之间最大间隔

    @property
    minCount: number = 1;               // 每组梯子最少数量
    @property
    maxCount: number = 3;               // 每组梯子最多数量

    @property
    laneOffsetX: number = 1.5;          // 梯子左右分布的间距（如果要多条道）

    @property
    lanes: number = 3;                  // 道数：默认 3 道（-1,0,1）

    @property
    InitCount: number = 10;

    OffsetZ: number = 0;
    MapBlock: Map<XCJZ_BLOCK, XCJZ_BlockController[]> = new Map();

    // ===== 内部状态 =====
    private _curSpawnZ = 0;
    private _nextSpawnZ = 0;

    // 每种预制体一组对象池
    // private _pools: Node[][] = [];
    private _isFirst = true;// 第一次生成
    private _curIndex: number = 0;

    private _curSpawn: number = 0;

    // private _z: number = 0;
    private _jumpTime: number = 0;

    // private _timer: number = 0.2;
    // private _curTimer: number = 0;
    onLoad() {
        this._curSpawnZ = this.spawnStartZ;
        this._nextSpawnZ = this.spawnStartZ;
        this._isFirst = true; // 第一次生成

        // // 初始化每个颜色的池子
        // this._pools = [];
        // if (this.LittleBlockPrefabs.length > 0) {
        //     for (let i = 0; i < this.LittleBlockPrefabs.length; i++) {
        //         this._pools.push([]);
        //     }
        // }

    }

    protected start(): void {
        while (XCJZ_GameManager.Instance.GameTimer > 0) {
            this._nextSpawnZ += this._randomGap();
            this._spawnLadderGroup(this._curSpawnZ);
        }
    }

    protected onEnable(): void {
        XCJZ_EventManager.On(XCJZ_MyEvent.PLAYER_RESUME, this.startMove, this);
        XCJZ_EventManager.On(XCJZ_MyEvent.PLAYER_PAUSE, this.stopMove, this);
        XCJZ_EventManager.On(XCJZ_MyEvent.CHANGE_MAP_OFFSET, this.addOffsetZ, this);
    }

    protected onDisable(): void {
        XCJZ_EventManager.Off(XCJZ_MyEvent.PLAYER_RESUME, this.startMove, this);
        XCJZ_EventManager.Off(XCJZ_MyEvent.PLAYER_PAUSE, this.stopMove, this);
        XCJZ_EventManager.Off(XCJZ_MyEvent.CHANGE_MAP_OFFSET, this.addOffsetZ, this);
    }

    startMove() {
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .by(1, { z: -XCJZ_GameManager.Instance.MapSpeed })
            .repeatForever()
            .start();
    }

    stopMove() {
        Tween.stopAllByTarget(this.node);
    }

    update(dt: number) {

        if (this.OffsetZ != 0) {
            this.stopMove();
            const temp = this.node.worldPosition.clone();
            temp.z += this.OffsetZ;
            this.node.setWorldPosition(temp);
            this.OffsetZ = 0;
            this.startMove();
        }

        // this._curTimer += dt;
        // if (this._curTimer < this._timer) return;
        // this._curTimer = 0;
        // this._nextSpawnZ += this._randomGap();
        // this._spawnLadderGroup(this._curSpawnZ);

        // this._z = this._getCurrentZ();
        // // 只要玩家接近 nextSpawnZ，就不断生成新的梯子组
        // while (this._curSpawnZ < this._z + this.forwardBuffer && XCJZ_GameManager.Instance.GameTimer > 0) {
        //     this._nextSpawnZ += this._randomGap();
        //     this._spawnLadderGroup(this._curSpawnZ);
        // }
    }

    addOffsetZ(z: number) {
        this.OffsetZ = z;
    }


    private _randomGap(): number {
        return math.randomRangeInt(this.minGap, this.maxGap);
    }

    private _getRandomIndex(): number[] {
        const shuffled = [1, 2, 0];
        for (let i = 0; i < shuffled.length; i++) {
            const randomIndex = Math.floor(Math.random() * (shuffled.length - i)) + i;
            [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
        }
        return shuffled;
    }

    /** 生成一组梯子（1~3个） */
    private _spawnLadderGroup(zPos: number) {
        if (!this.LittleBlockPrefabs || this.LittleBlockPrefabs.length === 0 || XCJZ_GameManager.Instance.GameTimer < 0) return;

        this._curSpawn++;

        const dis = Math.abs(this._nextSpawnZ - this._curSpawnZ);

        this._jumpTime = dis / XCJZ_GameManager.Instance.MapSpeed;
        XCJZ_GameManager.Instance.GameTimer -= this._jumpTime;
        this._curSpawnZ = this._nextSpawnZ;

        // console.log(dis, XCJZ_GameManager.Instance.MapSpeed, this._jumpTime);
        // 是否需要插入特定的梯子（例如每生成几组后插入一次）
        const insertSpecialLadder = math.randomRangeInt(1, 4) === 1;  // 例如每4组梯子中有一组特定梯子

        // 如果需要插入特定梯子，我们在组内插入一个
        if (XCJZ_GameManager.Instance.IsTest || this._isFirst || XCJZ_GameManager.Instance.GameTimer < 0 || (insertSpecialLadder && this.SpecialLadderPrefabs.length > 0)) {
            // const specialLadder = this._getFromPool(specialLadderPrefabIndex, true);  // 获取特定梯子
            this._curIndex = math.randomRangeInt(0, this.SpecialLadderPrefabs.length);
            const specialLadder: Node = instantiate(this.SpecialLadderPrefabs[this._curIndex]);  // 获取特定梯子
            specialLadder.getComponent(XCJZ_BlockController).Init(this.node, new Vec3(0, 0, zPos), this._jumpTime, XCJZ_GameManager.Instance.GameTimer < 0);
            if (this._isFirst) {
                this._isFirst = false;
                XCJZ_EventManager.Emit(XCJZ_MyEvent.PLAYER_SWITCH_COLOR, specialLadder.getComponent(XCJZ_BlockController).Block);
            }
            return;
        }

        const count = math.randomRangeInt(this.minCount, this.maxCount + 1);
        const randomPosIndex: number[] = this._getRandomIndex();
        const randomPrefabIndex: number[] = this._getRandomIndex();
        // 没有插入特定梯子，生成普通梯子
        for (let i = 0; i < count; i++) {
            const xPos = this._laneIndexToX(randomPosIndex.shift());
            let prefabIndex = 0;
            if (randomPrefabIndex.includes(this._curIndex)) {
                prefabIndex = this._curIndex;
                randomPrefabIndex.splice(randomPrefabIndex.indexOf(this._curIndex), 1);
            } else {
                prefabIndex = randomPrefabIndex.shift();
            }
            const ladder: Node = instantiate(this.LittleBlockPrefabs[prefabIndex]);
            // const ladder = this._getFromPool(prefabIndex);
            ladder.getComponent(XCJZ_BlockController).Init(this.node, new Vec3(xPos, ladder.worldPosition.y, zPos), this._jumpTime, false, this._curSpawn);
            this._pushBlock(ladder.getComponent(XCJZ_BlockController).Block, ladder.getComponent(XCJZ_BlockController));
        }

    }

    /** 把 laneIndex（0..lanes-1）映射成 x */
    private _laneIndexToX(laneIndex: number): number {
        const mid = (this.lanes - 1) / 2;
        return (laneIndex - mid) * this.laneOffsetX;
    }

    private _pushBlock(block: XCJZ_BLOCK, blockContr: XCJZ_BlockController) {
        if (!this.MapBlock.has(block)) {
            this.MapBlock.set(block, []);
        }
        this.MapBlock.get(block).push(blockContr);
    }

    GetBlockNode(block: XCJZ_BLOCK, spawn: number): Node | null {
        if (!this.MapBlock.has(block)) return null;
        const blockContr = this.MapBlock.get(block).find(item => item.CurSpawn === spawn);
        if (blockContr) {
            return blockContr.node;
        } else {
            return null;
        }
    }

}

