import { _decorator, Camera, Component, Animation, find, geometry, math, Node, PhysicsSystem, Quat, SkeletalAnimation, tween, Tween, Vec2, Vec3, view, error, physics, Collider } from 'cc';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
import { XDMKQ_AMPLIFICATION, XDMKQ_AUDIO, XDMKQ_PANEL, XDMKQ_WEAPON, XDMKQ_WEAPON_ANI, XDMKQ_WEAPON_ANIS } from './XDMKQ_Constant';
import { XDMKQ_ThrowPreview } from './XDMKQ_ThrowPreview';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_BulletManager } from './XDMKQ_BulletManager';
import { XDMKQ_EnemyController } from './XDMKQ_EnemyController';
import { XDMKQ_MilitaryVehicleController } from './XDMKQ_MilitaryVehicleController';
import { XDMKQ_PlaneController } from './XDMKQ_PlaneController';
import { XDMKQ_KTController } from './XDMKQ_KTController';
import { XDMKQ_CameraController } from './XDMKQ_CameraController';
import { XDMKQ_PanelManager } from './XDMKQ_PanelManager';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_PlayerController')
export class XDMKQ_PlayerController extends Component {
    public static Instance: XDMKQ_PlayerController;

    @property(Camera)
    Camera: Camera = null;

    @property
    NormalFov: number = 60;

    @property
    AimFov: number = 30;

    @property
    AimDrution: number = 0.2;

    @property
    AimEndDrution: number = 0.7;

    @property({ type: Vec2, displayName: "X轴视角限制" })
    ClampX: Vec2 = new Vec2();

    @property({ type: Vec2, displayName: "Y轴视角限制" })
    ClampY: Vec2 = new Vec2();

    @property(Node)
    WeaponNodes: Node[] = [];

    @property(Node)
    RPGMuzzle: Node = null;

    @property(Node)
    Muzzle_98K: Node = null;

    @property(SkeletalAnimation)
    FKPSkeletal: SkeletalAnimation = null;

    @property({ displayName: "汤姆逊抖动幅度" })
    TMXShake: number = 0.03;

    @property({ displayName: "轻机枪抖动幅度" })
    QJQShake: number = 0.05;

    HandSkeletal: SkeletalAnimation = null;
    GunSkeletal: SkeletalAnimation = null;
    CurWeapon: XDMKQ_WEAPON = null;
    ThrowPreview: XDMKQ_ThrowPreview = null;

    CurWeaponAni: XDMKQ_WEAPON_ANI = null;

    TargetEnemy: XDMKQ_EnemyController = null;

    private _ray = new geometry.Ray();
    private _aniCB: Function = null;
    private _ptClosing: boolean = false;
    private _fire: boolean = false;
    private _fireStart: boolean = false;
    private _startWeapon: XDMKQ_WEAPON = null;
    protected onLoad(): void {
        XDMKQ_PlayerController.Instance = this;

        this.HandSkeletal = find("Weapon/Hand", this.node).getComponent(SkeletalAnimation);
        this.ThrowPreview = this.getComponent(XDMKQ_ThrowPreview);

        this.HandSkeletal.on(Animation.EventType.FINISHED, () => { this._aniCB && this._aniCB(); }, this);
        this.FKPSkeletal.on(Animation.EventType.FINISHED, () => { this._aniCB && this._aniCB(); }, this);
    }

    protected start(): void {
        XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CHANGE_BULLET);
        this.SwitchWeapon(XDMKQ_WEAPON.步枪);
    }

    protected onEnable(): void {
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_TOUCH_MOVE, this.Rotate, this);
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_FIRE_START, this.FireStart, this);
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_FIRE_END, this.FireEnd, this);
    }

    //#region 玩家开枪
    Rotate(x: number, y: number) {
        const curEulerAngles = this.node.eulerAngles;
        const target: Vec3 = curEulerAngles.clone();
        const temp = new Vec3(math.clamp(curEulerAngles.x + y, this.ClampX.x, this.ClampX.y), math.clamp(curEulerAngles.y - x, this.ClampY.x, this.ClampY.y), 0);
        // const temp = new Vec3(curEulerAngles.x + y, curEulerAngles.y - x, 0);
        // console.error(target.x, target.y);
        Vec3.lerp(target, curEulerAngles, temp, 0.1);
        this.node.eulerAngles = target;
    }

    FireStart() {
        this._startWeapon = this.CurWeapon;
        if (this._fire) return;
        if (XDMKQ_GameManager.Instance.CurBullet.CurBullet <= 0) {
            //弹匣没子弹
            if (XDMKQ_GameManager.Instance.CurBullet.ReduceBullet > 0) {
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_RELOAD_SHOW, this.HandSkeletal.getState(this.CurWeaponAni.Reload).duration * (1 + XDMKQ_GameManager.Instance.GetAmpByWeapon(this.CurWeapon, XDMKQ_AMPLIFICATION.换弹时间)));
                // XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_RELOAD_SHOW, this.HandSkeletal.getState(this.CurWeaponAni.Reload).duration);
                if (this.CurWeaponAni) {
                    switch (this.CurWeapon) {
                        case XDMKQ_WEAPON.步枪:
                            XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.Reload_98K);
                            break;
                        case XDMKQ_WEAPON.汤姆逊:
                            XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.Reload_TMX);
                            break;
                        case XDMKQ_WEAPON.轻机枪:
                            XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.Reload_QJQ);
                            break;
                    }
                    this.PlaySkeletalAni(this.CurWeaponAni.Reload);
                }
            }
            else {
                // XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CURWEAPON_BULLET_SHOW);
                // 没有子弹 ---显示广告界面
                if (this.CurWeapon == XDMKQ_WEAPON.炮台 && !this._ptClosing) {
                    this.ClosePT();
                    return;
                }
                // XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_TIPS_SHOW, "没有子弹了!");
                XDMKQ_PanelManager.Instance.ShowPanel(XDMKQ_PANEL.VideoPanel);
                XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.没子弹);
            }
            return;
        }

        this._fireStart = true;
        XDMKQ_GameManager.Instance.IsSwitch = false;

        if (this.CurWeapon == XDMKQ_WEAPON.步枪) {
            this.Aim();
            this.PlaySkeletalAni(this.CurWeaponAni.Aim, () => {
                XDMKQ_GameManager.Instance.ShowAim98K();
                this.GunSkeletal.node.active = false;
            })
        } else if (this.CurWeapon == XDMKQ_WEAPON.手雷 || this.CurWeapon == XDMKQ_WEAPON.燃烧弹) {
            this.ThrowPreview.IsPreview = true;
        } else if (this.CurWeapon == XDMKQ_WEAPON.汤姆逊 || this.CurWeapon == XDMKQ_WEAPON.轻机枪 || this.CurWeapon == XDMKQ_WEAPON.炮台) {
            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_SIGHT_ENLARGEMENT);
            const druation: number = this.CurWeapon == XDMKQ_WEAPON.炮台 ? this.FKPSkeletal.getState(this.CurWeaponAni.Fires).duration / this.FKPSkeletal.getState(this.CurWeaponAni.Fires).speed : this.HandSkeletal.getState(this.CurWeaponAni.Fires).duration / this.HandSkeletal.getState(this.CurWeaponAni.Fires).speed;
            this.StartCheckLongPress(druation, () => {
                if (XDMKQ_GameManager.Instance.CurBullet.CurBullet <= 0) {
                    //弹匣没子弹
                    if (this.CurWeapon == XDMKQ_WEAPON.炮台) {
                        this.ClosePT();
                    } else {
                        if (XDMKQ_GameManager.Instance.CurBullet.ReduceBullet > 0) {
                            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_RELOAD_SHOW, this.HandSkeletal.getState(this.CurWeaponAni.Reload).duration * (1 + XDMKQ_GameManager.Instance.GetAmpByWeapon(this.CurWeapon, XDMKQ_AMPLIFICATION.换弹时间)));
                            // XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_RELOAD_SHOW, this.HandSkeletal.getState(this.CurWeaponAni.Reload).duration);
                            this.CurWeapon == XDMKQ_WEAPON.汤姆逊 ? XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.Reload_TMX) : XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.Reload_QJQ);
                            this.PlaySkeletalAni(this.CurWeaponAni.Reload);
                        } else {
                            // 没有子弹 ---显示广告界面
                            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_TIPS_SHOW, "没有子弹了!");
                        }
                    }
                    this.EndCheckLongPress();
                    XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_SIGHT_REDUCE);
                    return;
                }
                const shake: number = this.CurWeapon == XDMKQ_WEAPON.轻机枪 ? this.QJQShake : this.TMXShake;
                XDMKQ_CameraController.Instance.shake(0.2, shake);
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_FIRE_EFFECT);
                this.PlaySkeletalAni(this.CurWeaponAni.Fires, () => {
                    this.FireBullet();
                });
            });
        } else if (this.CurWeapon == XDMKQ_WEAPON.RPG) {
            const dir: Vec3 = this.GetRayResult() ? this.GetRayResult().hitPoint.subtract(this.RPGMuzzle.getWorldPosition()) : this.Camera.node.forward;
            XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.FIre_RPG);
            this.scheduleOnce(() => {
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_FIRE_EFFECT);
                XDMKQ_BulletManager.Instance.CreateRPG(this.RPGMuzzle.getWorldPosition(), dir);
            }, 0.2);
            this.PlaySkeletalAni(this.CurWeaponAni.Fire, () => {
                XDMKQ_GameManager.Instance.IsSwitch = true;
                XDMKQ_GameManager.Instance.CurBullet.CurBullet--;
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CURWEAPON_BULLET_SHOW);
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CHANGE_BULLET);
                if (XDMKQ_GameManager.Instance.CurBullet.ReduceBullet > 0) {
                    XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_RELOAD_SHOW, this.HandSkeletal.getState(this.CurWeaponAni.Reload).duration * (1 + XDMKQ_GameManager.Instance.GetAmpByWeapon(this.CurWeapon, XDMKQ_AMPLIFICATION.换弹时间)));
                    // XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_RELOAD_SHOW, this.HandSkeletal.getState(this.CurWeaponAni.Reload).duration);
                    this.PlaySkeletalAni(this.CurWeaponAni.Reload);
                }
            })
        }
    }

    FireEnd() {
        if (this._startWeapon != this.CurWeapon) return;
        if (this._fire || !this._fireStart) {
            XDMKQ_GameManager.Instance.IsSwitch = true;
            return;
        }
        if (XDMKQ_GameManager.Instance.CurBullet.CurBullet <= 0) {
            XDMKQ_GameManager.Instance.IsSwitch = true;
            //弹匣没子弹
            if (XDMKQ_GameManager.Instance.CurBullet.ReduceBullet > 0) {
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_RELOAD_SHOW, this.HandSkeletal.getState(this.CurWeaponAni.Reload).duration * (1 + XDMKQ_GameManager.Instance.GetAmpByWeapon(this.CurWeapon, XDMKQ_AMPLIFICATION.换弹时间)));
                // XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_RELOAD_SHOW, this.HandSkeletal.getState(this.CurWeaponAni.Reload).duration);
                if (this.CurWeaponAni) {
                    switch (this.CurWeapon) {
                        case XDMKQ_WEAPON.步枪:
                            XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.Reload_98K);
                            break;
                        case XDMKQ_WEAPON.汤姆逊:
                            XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.Reload_TMX);
                            break;
                        case XDMKQ_WEAPON.轻机枪:
                            XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.Reload_QJQ);
                            break;
                    }
                    this.PlaySkeletalAni(this.CurWeaponAni.Reload);
                }
            } else {
                // XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CURWEAPON_BULLET_SHOW);
                // 没有子弹 ---显示广告界面
                if (this.CurWeapon == XDMKQ_WEAPON.炮台 && !this._ptClosing) {
                    this.ClosePT();
                    return;
                }
                XDMKQ_PanelManager.Instance.ShowPanel(XDMKQ_PANEL.VideoPanel);
                XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.没子弹);
                // XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_TIPS_SHOW, "没有子弹了!");
            }
            return;
        }

        this._fireStart = false;

        if (this.CurWeapon == XDMKQ_WEAPON.步枪) {
            this.AimEnd();
            this.GunSkeletal.node.active = true;
            XDMKQ_GameManager.Instance.ShowAim98K(false);
            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_FIRE_EFFECT);
            this.PlaySkeletalAni(this.CurWeaponAni.AimEnd);
            //开枪
            this.FireBullet();
        } else if (this.CurWeapon == XDMKQ_WEAPON.手雷 || this.CurWeapon == XDMKQ_WEAPON.燃烧弹) {
            this._fire = true;
            this.ThrowPreview.CloseRender();
            const duration = this.CurWeapon == XDMKQ_WEAPON.手雷 ? 1.5 : 0.7;
            XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.扔);
            this.scheduleOnce(() => {
                this.ThrowPreview.Throw(this.CurWeapon);
            }, duration);
            this.PlaySkeletalAni(this.CurWeaponAni.Fire, () => {
                this._fire = false;
                XDMKQ_GameManager.Instance.IsSwitch = true;
                XDMKQ_GameManager.Instance.CurBullet.CurBullet--;
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CURWEAPON_BULLET_SHOW);
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CHANGE_BULLET);
            })
            return;
        } else if (this.CurWeapon == XDMKQ_WEAPON.汤姆逊 || this.CurWeapon == XDMKQ_WEAPON.轻机枪 || this.CurWeapon == XDMKQ_WEAPON.炮台) {
            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_SIGHT_REDUCE);
            XDMKQ_GameManager.Instance.IsSwitch = true;
            this.EndCheckLongPress(() => {
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_FIRE_EFFECT);
                const shake: number = this.CurWeapon == XDMKQ_WEAPON.轻机枪 ? this.QJQShake : this.TMXShake;
                XDMKQ_CameraController.Instance.shake(0.2, shake);
                this.PlaySkeletalAni(this.CurWeaponAni.FireOnce);
                this.FireBullet();
            });
        }
    }

    GetRayResult(): physics.PhysicsRayResult | null {
        // 1️ 获取摄像机世界位置
        const camPos = this.Camera.node.worldPosition;

        // 2️ 获取摄像机朝向（注意 Creator 的“前”为 -Z）
        const forward = this.Camera.node.forward.clone();

        // 3️ 构造射线：起点=相机位置，方向=forward
        geometry.Ray.fromPoints(this._ray, camPos, Vec3.add(new Vec3(), camPos, forward));

        // 4️ 进行最近碰撞检测
        const hit = PhysicsSystem.instance.raycastClosest(this._ray);

        if (hit) {
            const res: physics.PhysicsRayResult = PhysicsSystem.instance.raycastClosestResult;
            return res;
        }
        return null;
    }

    FireBullet() {
        XDMKQ_GameManager.Instance.CurBullet.CurBullet--;
        XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CURWEAPON_BULLET_SHOW);
        XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CHANGE_BULLET);

        switch (this.CurWeapon) {
            case XDMKQ_WEAPON.步枪:
                XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.FIre_98K);
                break;
            case XDMKQ_WEAPON.汤姆逊:
                XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.FIre_TMX);
                break;
            case XDMKQ_WEAPON.轻机枪:
                XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.FIre_QJQ);
                break;
            case XDMKQ_WEAPON.炮台:
                XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.FIre_PT);
                break;
        }

        const result = this.GetRayResult();
        if (result) {
            if (result.collider.getGroup() == 1 << 1) {
                //打中敌人
                const hitName: string = result.collider.node.name;
                this.TargetEnemy = this.GetEnemyController(result.collider.node);
                if (this.CurWeapon == XDMKQ_WEAPON.步枪 && hitName == "Head_M") {
                    // const dir: Vec3 = result.hitPoint.subtract(this.Muzzle_98K.getWorldPosition());
                    XDMKQ_BulletManager.Instance.Create98K(this.Muzzle_98K.getWorldPosition(), result.hitPoint);
                    // XDMKQ_BulletManager.Instance.Create98K(this.Muzzle_98K.getWorldPosition(), dir);
                } else if (this.TargetEnemy) {
                    this.TargetEnemy.Hit(this.CurWeapon);
                    XDMKQ_BulletManager.Instance.CreateHitEffect(result.hitPoint);
                }
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_HIT_SHOW);
            } else if (result.collider.node.name == "油桶") {
                result.collider.node.parent.getComponent(XDMKQ_MilitaryVehicleController).Hit(this.CurWeapon, true);
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_HIT_SHOW);
            } else if (result.collider.node.name == "军车") {
                result.collider.node.getComponent(XDMKQ_MilitaryVehicleController).Hit(this.CurWeapon);
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_HIT_SHOW);
            } else if (result.collider.node.name == "飞机") {
                result.collider.node.getComponent(XDMKQ_PlaneController).Hit(this.CurWeapon);
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_HIT_SHOW);
            } else if (result.collider.node.name == "空投") {
                result.collider.node.getComponent(XDMKQ_KTController).Hit();
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_HIT_SHOW);
            } else {
                // console.error(result.collider.node.name);
                XDMKQ_BulletManager.Instance.CreateSoilEffect(result.hitPoint);
            }
        }
    }

    //#region 切换武器播放动画
    PlaySkeletalAni(aniName: string, cb: Function = null) {
        if (this.CurWeapon != XDMKQ_WEAPON.炮台) {
            if (this.HandSkeletal.getState(aniName) && this.HandSkeletal.getState(aniName).isPlaying) return;
        } else {
            if (this.GunSkeletal.getState(aniName) && this.GunSkeletal.getState(aniName).isPlaying) return;
        }
        if (this.CurWeapon != XDMKQ_WEAPON.炮台) this.HandSkeletal.crossFade(aniName);
        if (this.CurWeaponAni.IsWeaponAni) this.GunSkeletal.crossFade(aniName);
        this._aniCB = cb;
    }

    SwitchWeapon(weapon: XDMKQ_WEAPON) {
        if (this.CurWeapon == weapon) return;
        const cb: Function = () => {
            this.CurWeapon = weapon;
            this.CurWeaponAni = XDMKQ_WEAPON_ANIS.get(this.CurWeapon);
            this.ShowGun();
            if (this.CurWeaponAni.IsWeaponAni) this.GunSkeletal = this.WeaponNodes[this.CurWeapon].getComponent(SkeletalAnimation);
            this.CurWeapon == XDMKQ_WEAPON.炮台 ? this.OpenPT() : this.PlaySkeletalAni(this.CurWeaponAni.TakeUp);
            XDMKQ_GameManager.Instance.CurBullet = XDMKQ_GameManager.Instance.MapBullet.get(this.CurWeapon);
            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CURWEAPON_BULLET_SHOW);
            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_AIM_SHOW, this.CurWeapon != XDMKQ_WEAPON.手雷 && this.CurWeapon != XDMKQ_WEAPON.燃烧弹);
            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_WEAPONITEM_SHOW, this.CurWeapon);
        }

        this.CurWeapon != null && this.CurWeapon != XDMKQ_WEAPON.炮台 ? this.PlaySkeletalAni(this.CurWeaponAni.LayDown, cb) : cb();
    }

    ShowGun() {
        for (let index = 0; index < this.WeaponNodes.length; index++) {
            this.WeaponNodes[index].active = index == this.CurWeapon;
        }
    }

    //#region 98K 瞄准
    Aim() {
        Tween.stopAllByTarget(this.Camera);
        tween(this.Camera)
            .to(this.AimDrution, { fov: this.AimFov }, { easing: 'sineIn' })
            .start();
    }

    AimEnd() {
        this._fire = true;
        Tween.stopAllByTarget(this.Camera);
        tween(this.Camera)
            .to(this.AimEndDrution, { fov: this.NormalFov }, { easing: 'sineOut' })
            .call(() => {
                this._fire = false;
                XDMKQ_GameManager.Instance.IsSwitch = true;
            })
            .start();
    }

    //#region 长按检测
    private _onLongPress: Function = null;
    private _onClick: Function = null;
    private _isLongPressTriggered = false;
    private _pressStartTime: number = 0;
    StartCheckLongPress(longPressThreshold: number, longPress?: Function) {
        this._isLongPressTriggered = false;
        this._pressStartTime = Date.now();

        this._onLongPress = longPress;

        // 启动一个计时器检测长按
        this.schedule(this.LongPress, longPressThreshold);
    }

    LongPress() {
        this._isLongPressTriggered = true;
        this._onLongPress && this._onLongPress();
    }

    EndCheckLongPress(click?: Function) {
        this.unschedule(this.LongPress); // 停止长按检测
        const pressDuration = Date.now() - this._pressStartTime;
        this._onClick = click;

        if (!this._isLongPressTriggered) {
            this._onClick && this._onClick();
        }

        this._onLongPress = null;
        this._onClick = null;
    }

    //#region 炮台

    OpenPT() {
        XDMKQ_GameManager.Instance.Weapons.active = false;
        XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_FIRE_SHOW, false, false);
        tween(this.node)
            .by(1, { y: 1 })
            .call(() => {
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_FIRE_SHOW, true);
            })
            .start();
    }

    ClosePT() {
        this._ptClosing = true;
        XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_FIRE_SHOW, false, false);
        tween(this.node)
            .by(1, { y: -1 })
            .call(() => {
                this._ptClosing = false;
                XDMKQ_GameManager.Instance.Weapons.active = true;
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_FIRE_SHOW, true);
                XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_FKP_ADD_JD, -100);
                XDMKQ_GameManager.Instance.CurBullet.CurBullet += XDMKQ_GameManager.Instance.CurBullet.MagazineCapacity;
                this.SwitchWeapon(XDMKQ_WEAPON.步枪);
            })
            .start();
    }

    /**获取节点的父节点中的EnemyController脚本 */
    GetEnemyController(node: Node): XDMKQ_EnemyController {
        if (node.getComponent(XDMKQ_EnemyController)) {
            return node.getComponent(XDMKQ_EnemyController);
        }
        return node.parent != null ? this.GetEnemyController(node.parent) : null;
    }

}


