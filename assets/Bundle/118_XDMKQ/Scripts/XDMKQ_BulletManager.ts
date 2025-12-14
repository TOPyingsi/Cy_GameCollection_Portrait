import { _decorator, Component, instantiate, Node, Prefab, v3, Vec3 } from 'cc';
import { XDMKQ_PoolManager } from './XDMKQ_PoolManager';
import { XDMKQ_Bullet_SL } from './XDMKQ_Bullet_SL';
import { XDMKQ_BulletRPG } from './XDMKQ_BulletRPG';
import { XDMKQ_Bullet98K } from './XDMKQ_Bullet98K';
import { XDMKQ_PathManager } from './XDMKQ_PathManager';
import { XDMKQ_KTController } from './XDMKQ_KTController';
import { XDMKQ_HitEffect } from './XDMKQ_HitEffect';
import { XDMKQ_SoilEffect } from './XDMKQ_SoilEffect';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
import { XDMKQ_AUDIO } from './XDMKQ_Constant';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_BulletManager')
export class XDMKQ_BulletManager extends Component {

    public static Instance: XDMKQ_BulletManager;

    @property(Prefab)
    Prefab_SL: Prefab = null;

    @property(Prefab)
    Prefab_RSP: Prefab = null;

    @property(Prefab)
    PPrefab_RPG: Prefab = null;

    @property(Prefab)
    Prefab_98K: Prefab = null;

    @property(Prefab)
    Prefab_HZ: Prefab = null;

    @property(Prefab)
    Prefab_KT: Prefab = null;

    @property(Prefab)
    Prefab_HitEffect: Prefab = null;

    @property(Prefab)
    Prefab_SoilEffect: Prefab = null;

    @property
    Speed_RPG: number = 100;

    @property
    Speed_98K: number = 10;

    protected onLoad(): void {
        XDMKQ_BulletManager.Instance = this;
    }

    CreateSL(pos: Vec3, v0: Vec3, g: Vec3) {
        const sl = instantiate(this.Prefab_SL);
        sl.parent = this.node;
        sl.getComponent(XDMKQ_Bullet_SL).Init(pos, v0, g);
    }

    CreateRSP(pos: Vec3, v0: Vec3, g: Vec3) {
        const rsp = instantiate(this.Prefab_RSP);
        rsp.parent = this.node;
        rsp.getComponent(XDMKQ_Bullet_SL).Init(pos, v0, g);
    }

    CreateRPG(pos: Vec3, v0: Vec3) {
        const rpg = instantiate(this.PPrefab_RPG);
        rpg.parent = this.node;
        rpg.getComponent(XDMKQ_BulletRPG).Init(pos, v0, this.Speed_RPG);
    }


    Create98K(pos: Vec3, v0: Vec3) {
        const rpg = instantiate(this.Prefab_98K);
        rpg.parent = this.node;
        rpg.getComponent(XDMKQ_Bullet98K).Init(pos, v0, this.Speed_98K);
    }

    async CreateHZ() {
        const pos: Vec3[] = XDMKQ_PathManager.Instance.GetPosOnHZ();
        for (let i = pos.length - 1; i >= 0; i--) {
            const hz: Node = instantiate(this.Prefab_HZ);
            hz.parent = this.node;
            hz.getComponent(XDMKQ_BulletRPG).Init(pos[i], v3(0, -1, 0), 30);
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    CreateKT() {
        XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.空投出现);
        this.scheduleOnce(() => {
            const kt: Node = instantiate(this.Prefab_KT);
            kt.parent = this.node;
            kt.getComponent(XDMKQ_KTController).Init(XDMKQ_PathManager.Instance.GetPosOnKT());
        }, 7);
    }

    CreateHitEffect(pos: Vec3) {
        const hitEffect: Node = instantiate(this.Prefab_HitEffect);
        hitEffect.parent = this.node;
        hitEffect.getComponent(XDMKQ_HitEffect).Init(pos);
    }

    CreateSoilEffect(pos: Vec3) {
        const hitEffect: Node = instantiate(this.Prefab_SoilEffect);
        hitEffect.parent = this.node;
        hitEffect.getComponent(XDMKQ_SoilEffect).Init(pos);
    }

}


