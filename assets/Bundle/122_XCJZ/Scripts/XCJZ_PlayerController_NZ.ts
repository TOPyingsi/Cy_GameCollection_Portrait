import { _decorator, Component, find, Node, geometry, Material, math, MeshRenderer, PhysicsSystem, SkeletalAnimation, SkinnedMeshRenderer, tween, Vec3 } from 'cc';
import { XCJZ_ANI, XCJZ_BLOCK, XCJZ_GROUP } from './XCJZ_Constant';
import { XCJZ_EventManager, XCJZ_MyEvent } from './XCJZ_EventManager';
import { XCJZ_BlockController } from './XCJZ_BlockController';
import { XCJZ_GameManager } from './XCJZ_GameManager';
import { XCJZ_GameData } from './XCJZ_GameData';
import Banner, { VibrateType } from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

@ccclass('XCJZ_PlayerController_NZ')
export class XCJZ_PlayerController_NZ extends Component {

    @property(Material)
    SkinMaterial: Material[] = [];

    @property(Material)
    PendantMaterial: Material[] = [];

    @property
    smooth: number = 12; // 越大越“跟手”但仍平滑

    @property
    height: number = 5;     // 跳跃的最大高度

    @property
    Offset: number = 0.2;

    @property(MeshRenderer)
    FHL: MeshRenderer[] = [];

    @property(MeshRenderer)
    Pendant: MeshRenderer = null;

    PlayerSkeleton: SkeletalAnimation = null;
    BodyMesh: SkinnedMeshRenderer = null;

    TargetPos: Vec3 = new Vec3();
    CurColor: XCJZ_BLOCK = XCJZ_BLOCK.BLUE;

    private _tmp: Vec3 = new Vec3();
    private totalTime: number = 0;  // 总时间，单位秒

    private _ray1: geometry.Ray = new geometry.Ray();
    private _ray2: geometry.Ray = new geometry.Ray();
    private _v_0: Vec3 = new Vec3();

    private _curSpawn: number = 0;
    private _resurgenceCount: number = 0;
    protected onLoad(): void {
        this.PlayerSkeleton = find("哪吒", this.node).getComponent(SkeletalAnimation);
        this.BodyMesh = find("哪吒/Body", this.node).getComponent(SkinnedMeshRenderer);
    }

    protected onEnable(): void {
        XCJZ_EventManager.On(XCJZ_MyEvent.PLAYER_MOVE, this.Move, this)
        XCJZ_EventManager.On(XCJZ_MyEvent.PLAYER_RESUME, this.raycastClosest, this);
        XCJZ_EventManager.On(XCJZ_MyEvent.PLAYER_SWITCH_COLOR, this.SwitchColor, this);
        XCJZ_EventManager.On(XCJZ_MyEvent.RESURGENCE, this.Resurgence, this);
    }

    PlayAni(ani: string) {
        this.PlayerSkeleton.crossFade(ani, 0.1);
    }

    SwitchColor(color: XCJZ_BLOCK) {
        this.CurColor = color;
        this.BodyMesh.material = this.SkinMaterial[color];
        this.FHL.forEach(e => e.material = this.SkinMaterial[color])
        this.Pendant.material = this.PendantMaterial[color];
    }

    update(dt: number) {
        if (XCJZ_GameManager.Instance.GamePause) return;

        // 平滑跟随目标位置（不想平滑就直接 setWorldPosition(_targetPos)）
        this._tmp.set(this.node.worldPosition);
        Vec3.lerp(this._tmp, this._tmp, this.TargetPos, 1 - Math.exp(-this.smooth * dt));
        this.node.setWorldPosition(this._tmp);
        // this.node.setWorldPosition(this.TargetPos);
    }

    Move(x: number) {
        this.TargetPos.x = math.clamp(this.TargetPos.x - x, XCJZ_GameManager.Instance.PlayerArea.x, XCJZ_GameManager.Instance.PlayerArea.y);
    }


    //玩家向下打射线
    private raycastClosest() {
        this._curSpawn++;

        this._v_0.set(this.node.worldPosition);
        this._ray1 = new geometry.Ray(this._v_0.x - this.Offset, this._v_0.y + 1, this._v_0.z, 0, -1, 0);
        this._ray2 = new geometry.Ray(this._v_0.x + this.Offset, this._v_0.y + 1, this._v_0.z, 0, -1, 0);
        let block: XCJZ_BlockController = null;
        if (PhysicsSystem.instance.raycastClosest(this._ray1)) {
            const hit = PhysicsSystem.instance.raycastClosestResult;
            if (hit.collider.getGroup() == XCJZ_GROUP.DEFAULT) {
                block = hit.collider.node.getComponent(XCJZ_BlockController);
            }
        }
        if (PhysicsSystem.instance.raycastClosest(this._ray2)) {
            const hit = PhysicsSystem.instance.raycastClosestResult;
            if (hit.collider.getGroup() == XCJZ_GROUP.DEFAULT) {
                block = hit.collider.node.getComponent(XCJZ_BlockController);
            }
        }
        if (block) {
            this.StepOn(block);
        } else {
            this.Fail();
        }
    }

    Fail() {
        XCJZ_GameManager.Instance.GameOver = true;
        XCJZ_EventManager.Emit(XCJZ_MyEvent.PLAYER_PAUSE);
        this.scheduleOnce(() => {
            this.node.active = false;
            XCJZ_GameManager.Instance.ShowResurgenceWindow();
        }, 2);
    }

    Win() {
        //游戏胜利
        XCJZ_GameManager.Instance.GameOver = true;
        XCJZ_EventManager.Emit(XCJZ_MyEvent.PLAYER_PAUSE);
        // this.scheduleOnce(() => {
        this.node.active = false;
        // const starCount: number = math.randomRangeInt(1, 4);
        const starCount: number = 3;
        XCJZ_GameData.Instance.SetMusicStar(XCJZ_GameData.Instance.CurMusic, starCount);
        XCJZ_GameManager.Instance.ShowWinWindow(starCount);
        // }, 2);
    }

    StepOn(block: XCJZ_BlockController) {
        if (XCJZ_GameData.Instance.Shake) Banner.Instance.VibrateShort(VibrateType.Light);
        this.totalTime = block.JumpTime;
        if (block.IsLast) {
            this.SwitchColor(block.Block);
            this.PlayAni(XCJZ_ANI.Jump_Swim);
            block.StepOn();
            tween(this.node)
                .to(this.totalTime, { y: this.height }, { easing: `sineIn` })
                .call(() => {
                    this.Win();
                })
                .start();
            return;
        } else if (block.ChangeColor) {
            this.SwitchColor(block.Block);
            this.PlayAni(XCJZ_ANI.Jump_Rotate);
        } else if (this.CurColor != block.Block) {
            this.Fail();
            return;
        }
        else {
            this.PlayAni(XCJZ_ANI.Jump_Normal);
        }

        block.StepOn();

        XCJZ_EventManager.Emit(XCJZ_MyEvent.CHANGE_MAP_OFFSET, this.node.worldPositionZ - block.node.worldPositionZ);

        tween(this.node)
            .to(this.totalTime / 2, { y: this.height }, { easing: `quintOut` })
            .to(this.totalTime / 2, { y: 0 }, { easing: `quintIn` })
            .call(() => {
                this.raycastClosest();
            })
            .start();
    }

    Resurgence() {
        const block: Node = XCJZ_GameManager.Instance.GetBlockNode(this.CurColor, this._curSpawn);

        if (block) {
            XCJZ_EventManager.Emit(XCJZ_MyEvent.CHANGE_MAP_OFFSET, this.node.worldPositionZ - block.worldPositionZ);
            this.TargetPos.x = block.worldPositionX;
            this.node.setWorldPosition(this.TargetPos)
            this._curSpawn--;
            this.node.active = true;
            this.PlayAni(XCJZ_ANI.Idle);
            this._resurgenceCount++;
        } else {
            this.Fail();
        }
    }
}


