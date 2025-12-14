import { _decorator, Collider2D, Component, ERaycast2DType, find, Graphics, math, Node, PhysicsSystem2D, Prefab, sp, UITransform, v3, Vec3 } from 'cc';
import { ZDXS_MyEvent, ZDXS_EventManager } from './ZDXS_EventManager';
import { ZDXS_EnemyController } from './ZDXS_EnemyController';
import { ZDXS_GameManager } from './ZDXS_GameManager';
import { ZDXS_ANI, ZDXS_ANI_WIN, ZDXS_PLAYER_SKIN } from './ZDXS_Constant';
import { ZDXS_GameData } from './ZDXS_GameData';
import { ZDXS_Fire } from './ZDXS_Fire';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_PlayerController')
export class ZDXS_PlayerController extends Component {

    @property(Prefab)
    BulletPrefab: Prefab = null;

    @property
    BulletSpeed: number = 10;

    @property
    BulletLifeTime: number = 5;

    // Gun: Node = null;
    PlayerSpine: sp.Skeleton = null;
    GunSpine: sp.Skeleton = null;

    PlayerBone: sp.spine.Bone = null;
    GunBone: sp.spine.Bone = null;
    FireBone: sp.spine.Bone = null;
    AimNode: Node = null;
    FireEffect: ZDXS_Fire = null;

    public Line: Graphics = null;
    public LineUITransform: UITransform = null;
    public GunUITransform: UITransform = null;

    public LineDir: Vec3 = new Vec3();
    public LineStartPos: Vec3 = new Vec3();
    public LineTargetPos: Vec3 = new Vec3();

    public AimTarget: ZDXS_EnemyController = null;

    public IsPlaying: boolean = false;

    private _ani: string = "";
    private _cb: Function = null;

    protected onLoad(): void {
        this.PlayerSpine = find("Player", this.node).getComponent(sp.Skeleton);
        this.GunSpine = find("Gun", this.node).getComponent(sp.Skeleton);
        this.PlayerBone = this.PlayerSpine.findBone("rotation");
        this.GunBone = this.GunSpine.findBone("rotation");
        this.FireBone = this.GunSpine.findBone("rotation3");
        this.AimNode = find("Aim", this.node);
        this.FireEffect = find("Fire", this.node).getComponent(ZDXS_Fire);
        this.Line = find("Aim/Line", this.node).getComponent(Graphics);
        this.LineUITransform = find("Aim/Line", this.node).getComponent(UITransform);
        this.GunUITransform = find("Gun", this.node).getComponent(UITransform);

        this.PlayerSpine.setCompleteListener(() => { this._cb && this._cb(); })
        // this.FireBone.active = true;

        this.SwitchSkin();
    }

    SwitchSkin(skin: number = ZDXS_GameData.Instance.CurSkin) {
        const skinName: string = ZDXS_PLAYER_SKIN[skin];
        this.PlayerSpine.setSkin(skinName);
    }

    PlayAni(ani: string, loop: boolean, cb?: Function) {
        if (ani === this._ani) return;
        this._ani = ani;
        this._cb = cb;
        this.PlayerSpine.setAnimation(0, ani, loop);
        this.GunSpine.setAnimation(0, ani, loop);
    }

    WinAni() {
        const index = math.randomRangeInt(0, ZDXS_ANI_WIN.length);
        const ani: string = ZDXS_ANI_WIN[index];
        this.PlayAni(ani, true);
    }

    FailAni() {
        this.PlayAni(ZDXS_ANI.FAIL, true);
    }

    Aim(dirX: number, dirY: number) {
        if (!ZDXS_GameManager.Instance.IsFire) return;
        Vec3.subtract(this.LineDir, v3(dirX, dirY, 0), v3(this.node.worldPositionX, this.node.worldPositionY, 0));
        // this.LineDir.normalize();
        let angleRad = Math.atan2(this.LineDir.y, this.LineDir.x);   // 得到弧度 (-π, π]
        let angleDeg = angleRad * 180 / Math.PI; // 转换为角度
        if (this.LineDir.x < 0) {
            this.node.scale = v3(-0.88, 0.88, 0.88);
            this.PlayerBone.rotation = 180 - angleDeg;
            this.GunBone.rotation = 180 - angleDeg;
            this.AimNode.angle = 180 - angleDeg;
            this.FireEffect.node.angle = 180 - angleDeg;
        } else if (this.LineDir.x > 0) {
            this.node.scale = v3(0.88, 0.88, 0.88);
            this.PlayerBone.rotation = angleDeg;
            this.GunBone.rotation = angleDeg;
            this.AimNode.angle = angleDeg;
            this.FireEffect.node.angle = angleDeg;
        }
    }

    AimEnd() {
        if (!ZDXS_GameManager.Instance.IsFire) return;

        ZDXS_GameManager.Instance.Fire();
    }

    RayClosest(startPos: Vec3, endPos: Vec3): Collider2D {
        const results = PhysicsSystem2D.instance.raycast(startPos, endPos, ERaycast2DType.Closest, 0xffffffff);
        if (results.length > 0) {
            const result = results[0];
            this.LineTargetPos = this.LineUITransform.convertToNodeSpaceAR(v3(result.point.x, result.point.y));
            return result.collider;
        }
        return null;
    }

    RayAll(startPos: Vec3, endPos: Vec3, check: string): boolean {
        const results = PhysicsSystem2D.instance.raycast(startPos, endPos, ERaycast2DType.All, 0xffffffff);
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            if (result.collider.node.name == check) return true;
        }
        return false;
    }

    protected onEnable(): void {
        ZDXS_EventManager.On(ZDXS_MyEvent.ZDXS_TOUCH_MOVE, this.Aim, this);
        ZDXS_EventManager.On(ZDXS_MyEvent.ZDXS_TOUCH_END, this.AimEnd, this);
        ZDXS_EventManager.On(ZDXS_MyEvent.ZDXS_PLAYER_SKIN, this.SwitchSkin, this);
        ZDXS_EventManager.On(ZDXS_MyEvent.ZDXS_PLAYER_WIN_SHOW, this.WinAni, this);
        ZDXS_EventManager.On(ZDXS_MyEvent.ZDXS_PLAYER_FAIL_SHOW, this.FailAni, this);
    }

    protected onDisable(): void {
        ZDXS_EventManager.Off(ZDXS_MyEvent.ZDXS_TOUCH_MOVE, this.Aim, this);
        ZDXS_EventManager.Off(ZDXS_MyEvent.ZDXS_TOUCH_END, this.AimEnd, this);
        ZDXS_EventManager.Off(ZDXS_MyEvent.ZDXS_PLAYER_SKIN, this.SwitchSkin, this);
        ZDXS_EventManager.Off(ZDXS_MyEvent.ZDXS_PLAYER_WIN_SHOW, this.WinAni, this);
        ZDXS_EventManager.Off(ZDXS_MyEvent.ZDXS_PLAYER_FAIL_SHOW, this.FailAni, this);
    }
}


