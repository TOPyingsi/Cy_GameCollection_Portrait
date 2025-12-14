import { _decorator, Collider, Component, ICollisionEvent, math, Node, RigidBody, Vec3 } from 'cc';
import { XDMKQ_PoolManager } from './XDMKQ_PoolManager';
import { XDMKQ_AUDIO, XDMKQ_PARACARGO, XDMKQ_PARACARGO_CONFIG, XDMKQ_WEAPON } from './XDMKQ_Constant';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
import { XDMKQ_GameData } from './XDMKQ_GameData';
import Banner from 'db://assets/Scripts/Banner';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_KTController')
export class XDMKQ_KTController extends Component {

    @property(Collider)
    Collider: Collider = null;

    private _isRemove: boolean = false;
    private _paracargoType: XDMKQ_WEAPON | null = null;
    private _paracargoCount: number = 0;

    private v_0: Vec3 = new Vec3(0, -1, 0);

    protected onEnable(): void {
        if (this.Collider) {
            this.Collider.on(`onCollisionEnter`, this.onCollisionEnter, this);
        }
    }

    protected onDisable(): void {
        if (this.Collider) {
            this.Collider.off(`onCollisionEnter`, this.onCollisionEnter, this);
        }
    }

    protected update(dt: number): void {
        if (XDMKQ_GameManager.Instance.GamePause) {
            this.getComponent(RigidBody).setLinearVelocity(Vec3.ZERO);
        } else {
            this.getComponent(RigidBody).setLinearVelocity(this.v_0);
        }
    }

    Init(pos: Vec3) {
        this.node.setWorldPosition(pos);

        this._isRemove = false;

        const paracargo: XDMKQ_PARACARGO = XDMKQ_PARACARGO_CONFIG[Math.floor(Math.random() * XDMKQ_PARACARGO_CONFIG.length)];
        this._paracargoType = paracargo.Type;
        this._paracargoCount = math.randomRangeInt(paracargo.MinCount, paracargo.MaxCount);
    }

    Hit() {
        if (this._isRemove) return;

        XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.空投击落);
        if (XDMKQ_GameData.Instance.Shake) Banner.Instance.VibrateShort();
        if (this._paracargoType == XDMKQ_WEAPON.金币) {
            XDMKQ_GameManager.Instance.ShowGold(this._paracargoCount);
        } else if (XDMKQ_GameManager.Instance.MapBullet.has(this._paracargoType)) {
            this._paracargoType == XDMKQ_WEAPON.手雷 || this._paracargoType == XDMKQ_WEAPON.燃烧弹 ? XDMKQ_GameManager.Instance.MapBullet.get(this._paracargoType).CurBullet += this._paracargoCount : XDMKQ_GameManager.Instance.MapBullet.get(this._paracargoType).ReduceBullet += this._paracargoCount;
            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CHANGE_BULLET);
            XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_CURWEAPON_BULLET_SHOW);
        }
        XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_TIPS_SHOW, `${this.getEnumKeyByValue(XDMKQ_WEAPON, this._paracargoType)} +${this._paracargoCount}`);
        this._isRemove = true;
        this.node.destroy();
        //XDMKQ_PoolManager.PutNode(this.node);
    }

    protected onCollisionEnter(event: ICollisionEvent) {
        if (this._isRemove) return;

        if (event.otherCollider.node.name != "飞机") {
            this._isRemove = true;
            this.node.destroy();

            // XDMKQ_PoolManager.PutNode(this.node);
        }
    }

    /** 根据枚举值找key*/
    private getEnumKeyByValue(enumObj: any, value: any): string | undefined {
        // 遍历枚举对象的键和值
        for (let key in enumObj) {
            if (enumObj[key] === value) {
                return key;
            }
        }
        return undefined; // 如果没有找到匹配的值，返回undefined
    }
}


