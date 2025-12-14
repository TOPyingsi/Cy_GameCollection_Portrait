import { _decorator, BoxCollider, Component, ICollisionEvent, instantiate, ITriggerEvent, Material, Node, Prefab, Quat, SkeletalAnimation, MeshRenderer, tween, v3, Vec3 } from 'cc';
import { NDPA_EventManager, NDPA_MyEvent } from './NDPA_EventManager';
import { NDPA_DW, NDPA_GAME, NDPA_GROUP, NDPA_NUMBER } from './NDPA_GameConstant';
import { NDPA_MZ } from './NDPA_MZ';
import { NDPA_AudioManager, NDPA_Audios } from './NDPA_AudioManager';
import { NDPA_GameManager } from './NDPA_GameManager';
import { NDPA_Clickable } from './NDPA_Clickable';
import { NDPA_PrefsManager } from './NDPA_PrefsManager';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { NDPA_GameUtil } from './NDPA_GameUtil';
import { PrefsManager } from '../../2_SSL/script/Manage/SSL_PrefsManager';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

const velocity: Vec3 = v3(0, 0, 0);

@ccclass('NDPA_Ball')
export class NDPA_Ball extends NDPA_Clickable {

    IsCollider: boolean = false;//是否已经发生碰撞 -- 防止多次触发
    IsTrigger: boolean = false;//是否已经发生碰撞 -- 防止多次触发

    isTween: boolean = true;
    isMute: boolean = false;//跟地板碰撞是否静音 --- 只有一次

    Ball: Node = null;
    MZParent: Node = null;
    protected onLoad(): void {
        super.onLoad();
        this.Collider[0].on(`onTriggerStay`, this.onTriggerStay, this);
        this.Collider[0].on(`onCollisionStay`, this.onCollisionStay, this);
        NDPA_EventManager.ON(NDPA_MyEvent.NDPA_SMILE, () => {
            tween(this.node)
                .to(0.5, { rotation: new Quat(0, 0, 0) })
                .start();
        }, this);
        this.initBall();
    }

    protected start(): void {
        super.start();
        if (this.IsExist) {
        }
    }

    initBall() {
        this.node.removeAllChildren();
        const name = NDPA_GameUtil.GetEnumKeyByValue(NDPA_DW, NDPA_PrefsManager.Instance.userData.UseDW);
        console.log(name);

        BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, `Bundle/NDPA_Prefabs/Ball/${name}`).then((prefab: Prefab) => {
            const ball = instantiate(prefab);
            ball.parent = this.node;
            this.Ball = ball.getChildByName("Ball");
            this.MZParent = ball.getChildByName("帽子");
            this.initMZ();
        })
    }

    protected update(dt: number): void {
        this.rigidBody.getLinearVelocity(velocity)
        if (!this.IsClick || this.IsExist && this.isTween && Math.abs(velocity.y) <= 0.00001) {
            this.isTween = false;
            this.scheduleOnce(() => {
                tween(this.node)
                    .to(0.5, { rotation: new Quat(0, 0, 0) })
                    .call(() => { this.isTween = true; })
                    .start();
            }, 2)
        }
    }

    initMZ() {
        const mz: NDPA_NUMBER = NDPA_PrefsManager.Instance.userData.UseMZ;
        if (mz == NDPA_NUMBER.NUMBER0 || mz == NDPA_NUMBER.NUMBER1) return;
        const path = "Bundle/NDPA_Prefabs/帽子/帽子" + (mz - 1);
        BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, path).then((prefab: Prefab) => {
            const MZNode: Node = instantiate(prefab);
            MZNode.parent = this.MZParent;
            if (this.IsExist) {
                MZNode.getComponent(NDPA_MZ).click();
            }
        })
    }

    click(): void {
        if (!this.IsClick) return;
        if (this.IsExist) return;
        super.click();
        this.changeTransparency();
        this.MZParent.children.map(e => {
            e.getComponent(NDPA_MZ).click();
        })
    }

    changeTransparency() {
        const meshRenderer = this.Ball.getComponent(MeshRenderer)
        if (meshRenderer) {
            meshRenderer.material = meshRenderer.materials[1];
        } else {
            console.error("未找到 meshRenderer 组件。");
        }
    }
    onCollisionStay(event: ICollisionEvent) {
        if (!this.isMute) {
            this.isMute = true;
            NDPA_AudioManager.PlaySound(NDPA_Audios.BallFall);
        }
        if (NDPA_GameManager.Instance.isRestart || NDPA_GameManager.Instance.isGameFail || NDPA_GameManager.Instance.isNext || NDPA_GameManager.Instance.isPass) return;
        if (this.IsCollider) return;

        if (event.otherCollider.getGroup() == NDPA_GROUP.BADBALL) {
            this.IsCollider = true;
            //碰到煤球 失败并且变化形状
            NDPA_GameManager.Instance.Game = NDPA_GAME.FAIL;
            NDPA_GameManager.Instance.gameFail();
        }
    }

    onTriggerStay(event: ITriggerEvent) {
        if (NDPA_GameManager.Instance.isRestart || NDPA_GameManager.Instance.isGameFail || NDPA_GameManager.Instance.isNext || NDPA_GameManager.Instance.isPass) return;
        if (this.IsTrigger) return;
        if (event.otherCollider.getGroup() == NDPA_GROUP.FLOOR) {
            this.IsTrigger = true;
            NDPA_GameManager.Instance.Game = NDPA_GAME.FAIL;
            NDPA_GameManager.Instance.gameFail();
        }
    }

}


