import { _decorator, Collider, Component, Node, SkeletalAnimation, Animation, Vec3, Quat, tween, RigidBody, v3, director } from 'cc';
import { DMM_LV } from './DMM_LV';
import { DMM_Player } from './DMM_Player';
import { PLAYERTYPE } from './DMM_Constant';
import { DMM_PlayerController } from './DMM_PlayerController';
import { DMM_PlayerAI } from './DMM_PlayerAI';
import { DMM_GameManager } from './DMM_GameManager';
import { DMM_PrefsManager } from './DMM_PrefsManager';
import { DMM_AudioManager, DMM_Audios } from './DMM_AudioManager';
import { DMM_EventManager, DMM_MyEvent } from './DMM_EventManager';
import { DMM_GameTool } from './DMM_GameTool';
const { ccclass, property } = _decorator;

enum AniState {
    Idle = "Idle",
    Walk = "Walk",
    Arrest = "Arrest",
    ArrestPerson = "ArrestPerson",
    ArrestOther = "ArrestOther",
    End = "End",
}

const propPos: Vec3 = new Vec3(0.585, 0.027, 0.407);

@ccclass('DMM_BadMen')
export class DMM_BadMen extends Component {
    @property
    Speed: number = 15;

    @property(Node)
    Players: Node[] = [];

    @property(Node)
    Hand: Node = null;

    SkeletalAnimation: SkeletalAnimation = null;
    State: AniState = AniState.Idle;
    Target: Node[] = [];
    Collider: Collider = null;

    private _cb: Function = null;
    private _curShowPlayer = null;
    private _propNode: Node = null;

    protected onLoad(): void {
        this.SkeletalAnimation = this.getComponent(SkeletalAnimation);
        this.SkeletalAnimation.on(Animation.EventType.FINISHED, () => { this._cb && this._cb() }, this);
        this.Collider = this.getComponent(Collider);
        this.Collider.enabled = false;
    }

    PlayAni(state: AniState, cb: Function = null) {
        if (this.State === state) return;
        this.State = state;
        this.SkeletalAnimation.play(state);
        this._cb = cb;
    }

    startArrest() {
        this.getArrestTarget();
        this.Collider.enabled = true;
        const target = DMM_LV.Instance.BadMenFirstTarget;
        const targetPos = target.getWorldPosition();
        const selfPos = this.node.getWorldPosition();
        //设置节点的旋转
        const dir: Vec3 = new Vec3();
        Vec3.subtract(dir, targetPos, selfPos);
        dir.normalize();
        const rotation = new Quat();
        Quat.fromViewUp(rotation, dir, Vec3.UP);
        rotation.x = 0;  // 确保不会有俯仰角度
        rotation.z = 0;  // 确保不会有滚动角度
        tween(this.node)
            .to(0.1, { rotation: rotation }, { easing: `sineOut` })
            .start();

        //设置节点的位移
        this.PlayAni(AniState.Walk);
        const dis = Vec3.distance(targetPos, selfPos);
        tween(this.node)
            .to(dis / this.Speed, { worldPosition: v3(targetPos.x, selfPos.y, targetPos.z) }, { easing: `sineOut` })
            .call(() => {
                this.arrest();
            })
            .start();
    }

    getArrestTarget() {
        this.Target = DMM_LV.Instance.DangeNode;
        if (this.Target.length < 5) {
            const arr: Node[] = DMM_GameTool.GetRandomMFromArr(5 - this.Target.length, DMM_LV.Instance.ArrsetNodes);
            this.Target = [...this.Target, ...arr];
            this.Target = DMM_GameTool.shuffleArray(this.Target);
        }
    }

    arrest() {
        if (this.Target.length <= 0) {
            this.PlayAni(AniState.End, () => {
                //游戏胜利
                DMM_PrefsManager.Instance.userData.LV++;
                DMM_PrefsManager.Instance.saveData();
                DMM_GameManager.Instance.showSettlePanel();
            })
            return;
        }

        const target = this.Target.shift();
        const targetPos = target.getWorldPosition();
        const selfPos = this.node.getWorldPosition();
        //设置节点的旋转
        const dir: Vec3 = new Vec3();
        Vec3.subtract(dir, targetPos, selfPos);
        dir.normalize();
        const rotation = new Quat();
        Quat.fromViewUp(rotation, dir, Vec3.UP);
        rotation.x = 0;  // 确保不会有俯仰角度
        rotation.z = 0;  // 确保不会有滚动角度
        tween(this.node)
            .to(0.1, { rotation: rotation }, { easing: `sineOut` })
            .start();

        //设置节点的位移
        this.PlayAni(AniState.Walk);
        const dis = Vec3.distance(targetPos, selfPos);
        targetPos.subtract(dir.multiplyScalar(5));
        tween(this.node)
            .to(dis / this.Speed, { worldPosition: v3(targetPos.x, selfPos.y, targetPos.z) }, { easing: `sineOut` })
            .call(() => {
                if (target.getComponent(DMM_Player).PlayerType == PLAYERTYPE.PLYAER) {
                    target.active = false;
                    this.showArrestPlayerByIndex(target.getComponent(DMM_Player).Index);
                } else if (target.getComponent(DMM_Player).PlayerType == PLAYERTYPE.PROP) {
                    this.holdProp(target);
                }
                this.PlayAni(AniState.Arrest, () => {
                    if (target.getComponent(DMM_Player).PlayerType == PLAYERTYPE.PLYAER) {
                        this.arrestPlayer(target);
                    } else if (target.getComponent(DMM_Player).PlayerType == PLAYERTYPE.PROP) {
                        this.arrestProp(target);
                    }
                });
            })
            .start();
    }

    arrestPlayer(player: Node) {
        if (player === DMM_PlayerController.Instance.node) {
            DMM_AudioManager.PlaySound(DMM_Audios.DMM_Player);
        } else {
            DMM_AudioManager.PlaySound(DMM_Audios.DMM_AI);
        }
        this.PlayAni(AniState.ArrestPerson, () => {
            this._curShowPlayer.active = false;
            if (player === DMM_PlayerController.Instance.node) {
                DMM_GameManager.Instance.showTipsPabel("你");
                this.PlayAni(AniState.End, () => {
                    //游戏失败
                    DMM_GameManager.Instance.showSettlePanel();
                    player.active = true;

                })
                return;
            }
            DMM_GameManager.Instance.showTipsPabel(player.getComponent(DMM_PlayerAI).AIName);
            this.arrest();
        });
    }

    arrestProp(prop: Node) {
        this.scheduleOnce(() => this.throwProp(), 1);
        this.PlayAni(AniState.ArrestOther, () => {
            this.arrest();
        });
    }

    //展示被抓住的人物
    showArrestPlayerByIndex(index: number) {
        if (index < 0 || index > this.Players.length - 1) return;

        for (let i = 0; i < this.Players.length; i++) {
            this.Players[i].active = false;
        }

        this._curShowPlayer = this.Players[index];
        this._curShowPlayer.active = true;
    }


    holdProp(prop) {
        this._propNode = prop;
        const rigidBody = prop.getComponent(RigidBody);
        if (rigidBody) {
            rigidBody.useGravity = false;
            rigidBody.enabled = false;
        }
        prop.parent = this.Hand; // 将物体设置为角色节点的子节点
        prop.setPosition(propPos); // 将物体移动到手的位置
    }

    throwProp() {
        // this._propNode = this.Prop
        if (this._propNode) {
            const pos = this._propNode.getWorldPosition().clone();
            this._propNode.parent = director.getScene(); // 解除父子关系
            this._propNode.setWorldPosition(pos);
            const rigidBody = this._propNode.getComponent(RigidBody);
            if (rigidBody) {
                rigidBody.useGravity = true;
                rigidBody.enabled = true;
            }
            // 给物体施加力 (方向为角色后方)
            // const force = new Vec3(-5, 2, 0); // 假设角色后方为 -Z 方向
            const direction = this.node.forward;

            // const direction = new Vec3();
            // Vec3.negate(direction, this.node.forward);// 获取角色后方向
            direction.add3f(0, 1, 0);
            direction.multiplyScalar(600); // 可调整力度
            rigidBody.applyForce(direction); // 施加力
            // this.heldObject = null; // 清空当前拾取的物体
        }
    }

    protected onEnable(): void {
        DMM_EventManager.ON(DMM_MyEvent.DMM_ARREST, this.startArrest, this);
    }

    protected onDisable(): void {
        DMM_EventManager.OFF(DMM_MyEvent.DMM_ARREST, this.startArrest, this);
    }
}


