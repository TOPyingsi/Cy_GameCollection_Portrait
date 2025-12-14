import { _decorator, Collider, Component, director, error, find, geometry, instantiate, math, Node, PhysicsSystem, Prefab, Quat, RigidBody, SkeletalAnimation, tween, Tween, v3, Vec3 } from 'cc';
import { DMM_PrefsManager } from './DMM_PrefsManager';
import { COLOR, DMM_AREATYPE, DMM_GENDER, DMM_ITEM, DMM_PropPos, GROUP } from './DMM_Constant';
import { DMM_Camera } from './DMM_Camera';
import { DMM_Player } from './DMM_Player';
import { DMM_Blast } from './DMM_Blast';
import { DMM_Prop } from './DMM_Prop';
import { DMM_LV } from './DMM_LV';
import { DMM_GameManager } from './DMM_GameManager';
import { Label3D } from '../1/Label3D';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { DMM_GameTool } from './DMM_GameTool';
import { DMM_EventManager, DMM_MyEvent } from './DMM_EventManager';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

enum AniState {
    Idle = "Idle",
    Walk = "Walk",
    Jump = "Jump",
}

@ccclass('DMM_PlayerController')
export class DMM_PlayerController extends DMM_Player {
    public static Instance: DMM_PlayerController = null;

    @property
    Gravity: number = 1;

    @property(Prefab)
    Boom: Prefab = null;

    Tips: Node = null;

    MaxSpeed: number = 10;

    // AreaType: DMM_AREATYPE = DMM_AREATYPE.SAFETY;
    rigidBody: RigidBody = null;
    collider: Collider = null;
    skeletalAnimation: SkeletalAnimation = null;
    Name: Node = null;
    NameTs: Label3D = null;
    jumpHeight: number = 3;
    jumpDuration: number = 2;

    x: number = 0;
    y: number = 0;
    State: AniState = AniState.Idle;
    private _playerName: string = "";
    private _isRotation: boolean = false;
    private _isNameRotation: boolean = false;
    private _isMove: boolean = false;
    private _initPos: Vec3 = new Vec3();
    private _initRotation: Quat = new Quat();

    onLoad() {
        DMM_PlayerController.Instance = this;
        this.rigidBody = this.node.getComponent(RigidBody);
        this.collider = this.node.getComponent(Collider);
        this._initPos = this.node.getWorldPosition().clone();
        this._initRotation = this.node.getWorldRotation().clone();
        this.showPlayer();
    }

    init() {
        if (this.Player) this.Player.active = true;
        if (this.PlayerProp) {
            this.PlayerProp.destroy();
            this.PlayerProp = null;
        }
        if (this.NameTs) this.NameTs.string = "";
        this.node.setWorldPosition(this._initPos);
        this.node.setWorldRotation(this._initRotation);
        this.Tips = null;
        this.PlayAni(AniState.Idle);
        this.showPlayer();

        DMM_Camera.Instance.Target = DMM_PlayerController.Instance.node;
        if (!DMM_GameManager.Instance.IsClick) return;
        DMM_GameManager.Instance.IsClick = false;
        DMM_Camera.Instance.IsMoveTrace = false;
        DMM_Camera.Instance.IsRotateTrace = false;
        DMM_Camera.Instance.rotateAndMoveToTarget(1, () => {
            DMM_GameManager.Instance.IsClick = true;
        });
    }

    addTips() {
        BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], "Bundle/DMM_Prefabs/提示").then((prefab: Prefab) => {
            this.Tips = instantiate(prefab);
            this.Tips.parent = director.getScene();
            // this.Tips
        })
    }

    showPlayer() {
        const path: string = `Player${DMM_PrefsManager.Instance.userData.CurItem + 1}_${DMM_GameTool.GetEnumKeyByValue(DMM_GENDER, DMM_PrefsManager.Instance.userData.Gender)}`

        if (path === this._playerName) return;
        this._playerName = path;
        const num = DMM_PrefsManager.Instance.userData.Gender == DMM_GENDER.女 ? 0 : 1;
        this.Index = DMM_PrefsManager.Instance.userData.CurItem * 2 + num;

        this.node.removeAllChildren();
        BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], `Bundle/DMM_Prefabs/${path}`).then((prefab: Prefab) => {
            this.Player = instantiate(prefab);
            this.Player.parent = this.node;
            this.skeletalAnimation = this.Player.getChildByName("Player").getComponent(SkeletalAnimation);
            this.Name = this.Player.getChildByName("Name");
            this.NameTs = this.Name.getComponent(Label3D);
            this.NameTs.string = "";
        })
    }

    TryOutPlayer(item: DMM_ITEM, gender: number, cb: Function = null) {
        const Gender: string = gender == 0 ? `女` : `男`;
        this._playerName = `Player${item + 1}_${Gender}`;
        this.Index = item * 2 + gender;

        this.node.removeAllChildren();
        BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], `Bundle/DMM_Prefabs/${this._playerName}`).then((prefab: Prefab) => {
            this.Player = instantiate(prefab);
            this.Player.parent = this.node;
            this.skeletalAnimation = this.Player.getChildByName("Player").getComponent(SkeletalAnimation);
            this.Name = this.Player.getChildByName("Name");
            this.NameTs = this.Name.getComponent(Label3D);
            this.NameTs.string = "";
            cb && cb();
        })
    }

    SetMoveDir(x: number, y: number, radius: number) {
        if (!this._isMove) {
            this._isMove = true;
            if (!this.IsJump && !this.isDown) this.changePlayer();
        }
        this.x = -x;
        this.y = y;
        if (!this.IsJump && !this.isDown) this.PlayAni(AniState.Walk);
        this.Speed = this.MaxSpeed * radius;
    }

    changePlayer() {
        if (DMM_LV.Instance.IsGameStart) DMM_GameManager.Instance.hideHideBtn();
        if (this.Player && this.PlayerProp) {
            this.PlayerProp.active = false;
            this.Player.active = true;
            // this.collider.enabled = true;
            BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], "Bundle/DMM_Prefabs/Blast").then((prefab: Prefab) => {
                const blast: Node = instantiate(prefab);
                blast.parent = director.getScene();
                blast.getComponent(DMM_Blast).show(this.node.getWorldPosition(), v3(1, 1, 1), COLOR.White, () => {
                })
            })
        }
    }

    StopMove() {
        this._isMove = false;
        this.x = 0;
        this.y = 0;
        if (!this.IsJump && !this.isDown) this.PlayAni(AniState.Idle);
        if (!this.IsJump && !this.isDown) this.changeProp();
    }

    changeProp() {
        if (DMM_LV.Instance.IsGameStart) DMM_GameManager.Instance.showHideBtn();
        if (this.Player && this.PlayerProp) {
            this.Player.active = false;
            this.PlayerProp.active = true;

            // this.collider.enabled = false;
            BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], "Bundle/DMM_Prefabs/Blast").then((prefab: Prefab) => {
                const blast: Node = instantiate(prefab);
                blast.parent = director.getScene();
                blast.getComponent(DMM_Blast).show(this.node.getWorldPosition(), v3(1, 1, 1), COLOR.White, () => {
                })
            })
        }
    }

    PlayAni(state: AniState) {
        if (this.State === state) return;
        this.State = state;
        this.skeletalAnimation.play(state);
    }

    update(dt) {
        this.SetNameRotation(dt);
        if (!DMM_LV.Instance || !DMM_LV.Instance.IsGameStart) return;

        if (this.rigidBody.enabled) {
            if (this.IsJump) return;
            if (this.isFloor()) {
                this.rigidBody.setLinearVelocity(v3(this.x * this.Speed, 0, this.y * this.Speed));
            } else {
                this.rigidBody.setLinearVelocity(v3(this.x * this.Speed, -this.Gravity, this.y * this.Speed));
            }
            // 如果移动方向不为零，计算旋转
            if (this.x != 0 || this.y != 0) {
                // 计算移动向量长度
                const magnitude = Math.sqrt(this.x * this.x + this.y * this.y);

                // 添加阈值过滤，避免微小移动方向导致的抖动
                if (magnitude > 0.01) { // 阈值可以根据需求调整
                    const angle = Math.atan2(this.y, this.x); // 计算移动方向的角度 (弧度)
                    const angleInDegrees = angle * (180 / Math.PI); // 弧度转换为角度
                    // console.log(this.x, this.y, angleInDegrees);
                    // 设置玩家的旋转角度 (假设玩家面朝正 X 方向为初始状态)
                    let eulerAngles = -angleInDegrees + 90;

                    // if (eulerAngles > 180) {
                    //     eulerAngles -= 360;
                    // } else if (eulerAngles < -180) {
                    //     eulerAngles += 360;
                    // }

                    // 如果弧度小于阈值，则不发送信息
                    if (Math.abs(eulerAngles - this.node.eulerAngles.y) < 10) {
                        // return; // 跳过发送事件
                    } else {
                    }

                    this.node.setRotationFromEuler(0, eulerAngles, 0);
                    // this.SetRotation(eulerAngles, dt)
                }

            }
        }

        if (this.Tips) {
            this.Tips.setWorldPosition(this.node.getWorldPosition());
            const currentPos = this.node.worldPosition;
            const targetPos = DMM_LV.Instance.TargetNode.worldPosition;

            if (DMM_PrefsManager.Instance.userData.LV == 1 && Vec3.distance(currentPos, targetPos) <= 2) {
                this.arrive();
                return
            } else if (Vec3.distance(currentPos, targetPos) <= 2) {
                this.Tips.active = false;
            } else {
                this.Tips.active = true;
            }
        }
    }

    SetRotation(eulerAngles: number, duration: number) {
        if (this._isRotation) return;
        this._isRotation = true;
        Tween.stopAllByTarget(this.node);
        const rotate = new Quat();
        Quat.fromEuler(rotate, 0, eulerAngles, 0);
        tween(this.node)
            .to(duration, { rotation: rotate }, { easing: `sineOut` })
            .call(() => {
                this._isRotation = false;
            })
            .start();
    }


    /**到达隐藏地点 */
    arrive() {
        this.Tips.destroy();
        this.StopMove();
        DMM_GameManager.Instance.showTouchPanel(false);
        DMM_GameManager.Instance.closeMoveTipsPanel();
        DMM_GameManager.Instance.showHandTips();
        DMM_LV.Instance.IsGameStart = false;
    }

    setWorldPos(pos: Vec3) {
        const position = this.node.getWorldPosition();
        this.node.setWorldPosition(v3(pos.x, position.y, pos.z));
    }


    /**
     * 设置Name朝向摄像机
     * @param duration 
     * @returns 
     */
    SetNameRotation(duration: number) {
        if (this.NameTs && DMM_Camera.Instance.node) {
            if (this._isNameRotation) return;
            this._isNameRotation = true;
            const namePos = this.NameTs.node.getWorldPosition();
            const cameraPos = DMM_Camera.Instance.node.getWorldPosition();
            const dir: Vec3 = new Vec3();
            Vec3.subtract(dir, cameraPos, namePos);
            dir.normalize();
            const rotation = new Quat();
            Quat.fromViewUp(rotation, dir, Vec3.UP);
            tween(this.NameTs.node)
                .to(duration, { worldRotation: rotation }, { easing: `sineOut` })
                .call(() => {
                    this._isNameRotation = false;
                })
                .start();
        }
    }

    @property({ tooltip: '射线长度' })
    rayLength: number = 0.1; // 向下发射射线的长度

    isDown: boolean = false;

    /**
     * 玩家向脚下发射射线，判断是否碰撞到物体
     * @returns boolean - 是否碰撞到物体
     */
    isFloor() {
        // 1. 获取射线的起点（玩家位置）
        const playerPosition = this.node.worldPosition;

        // 2. 定义射线方向（向下）
        const rayDirection = new Vec3(0, -1, 0);

        // 3. 构建射线：起点 + 方向
        const ray = new geometry.Ray(playerPosition.x, playerPosition.y, playerPosition.z, rayDirection.x, rayDirection.y, rayDirection.z);

        // 4. 执行射线检测
        if (PhysicsSystem.instance.raycastClosest(ray, 0xffffffff, this.rayLength)) {
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            if (raycastClosestResult.collider.getGroup() == GROUP.DMM_FLOOR) {
                if (this.isDown) {
                    this.isDown = false;
                    if (this.x == 0 && this.y == 0) {
                        this.PlayAni(AniState.Idle);
                        this.changeProp();
                    }
                }
                return true;
            }

        } else {
            if (!this.IsJump && !this.isDown) {
                this.isDown = true;
                this.PlayAni(AniState.Jump)
            }
        }
        return false
    }

    jump(targetPosition: Vec3) {
        if (this.IsJump) return;
        this.IsJump = true;
        const startPosition = this.node.getWorldPosition();

        // 跳跃轨迹分为3段：上升、下降
        const midPosition = new Vec3(
            (startPosition.x + targetPosition.x) / 2,
            Math.max(startPosition.y, targetPosition.y) + this.jumpHeight,
            (startPosition.z + targetPosition.z) / 2
        );
        this.PlayAni(AniState.Jump);
        // 使用 tween 插值跳跃
        tween(this.node)
            .to(this.jumpDuration / 2, { position: midPosition }) // 上升到中间点
            .to(this.jumpDuration / 2, { position: targetPosition }) // 降落到目标点
            .call(() => {
                this.IsJump = false;
                if (this.x == 0 && this.y == 0) {
                    this.PlayAni(AniState.Idle);
                    this.changeProp();
                }
            })
            .start();
    }

    hide() {
        this.StopMove();
        if (this.AreaType == DMM_AREATYPE.DANGER) {
            DMM_LV.Instance.DangeNode.unshift(this.node);
        } else if (this.AreaType == DMM_AREATYPE.PROBABILITY) {
            const isDanger = DMM_GameTool.GetRandom(0, 1) > 0.5 ? true : false;
            if (isDanger) DMM_LV.Instance.DangeNode.unshift(this.node);
        }
    }

    protected onEnable(): void {
        DMM_EventManager.ON(DMM_MyEvent.DMM_MOVEMENT, this.SetMoveDir, this);
        DMM_EventManager.ON(DMM_MyEvent.DMM_MOVEMENT_STOP, this.StopMove, this);
        DMM_EventManager.ON(DMM_MyEvent.DMM_HIDE, this.hide, this);
    }

    protected onDisable(): void {
        DMM_EventManager.OFF(DMM_MyEvent.DMM_MOVEMENT, this.SetMoveDir, this);
        DMM_EventManager.OFF(DMM_MyEvent.DMM_MOVEMENT_STOP, this.StopMove, this);
        DMM_EventManager.OFF(DMM_MyEvent.DMM_HIDE, this.hide, this);
    }
}


