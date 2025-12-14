import { _decorator, Component, director, easing, Enum, error, instantiate, math, Node, Prefab, Quat, RigidBody, SkeletalAnimation, TERRAIN_HEIGHT_BASE, Tween, tween, v3, Vec3 } from 'cc';
import { COLOR, DMM_AREATYPE, DMM_GENDER, DMM_PropPos } from './DMM_Constant';
import { DMM_Camera } from './DMM_Camera';
import { DMM_Area } from './DMM_Area';
import { DMM_Player } from './DMM_Player';
import { DMM_LV } from './DMM_LV';
import { DMM_Prop } from './DMM_Prop';
import { DMM_Blast } from './DMM_Blast';
import { Label3D } from '../1/Label3D';
import { DMM_GameTool } from './DMM_GameTool';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { DMM_EventManager, DMM_MyEvent } from './DMM_EventManager';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

enum AniState {
    Idle = "Idle",
    Walk = "Walk",
}

@ccclass('DMM_PlayerAI')
export class DMM_PlayerAI extends DMM_Player {

    @property({ type: Enum(DMM_GENDER) })
    Gender: DMM_GENDER = DMM_GENDER.男;

    @property(Node)
    Path1: Node[] = [];

    @property(Node)
    Path2: Node[] = [];

    SkeletalAnimation: SkeletalAnimation = null;
    NameTs: Label3D = null;
    State: AniState = AniState.Idle;
    RigidBody: RigidBody = null;
    AIName: string = "";

    private _isNameRotation: boolean = false;
    private _targetPath: Node[] = [];
    private _isStart: boolean = false;

    protected onLoad(): void {
        this.Player = this.node.getChildByName("Player");
        this.SkeletalAnimation = this.Player.getComponent(SkeletalAnimation);
        this.NameTs = this.node.getChildByName("Name").getComponent(Label3D);
        this.RigidBody = this.getComponent(RigidBody);
    }

    protected update(dt: number): void {
        this.SetNameRotation(dt);
    }

    startMove() {
        if (this._isStart) return;
        this._isStart = true;
        this.changePlayer();
        const index = DMM_GameTool.GetRandomIntWithMax(1, 2);
        if (index == 1) {
            this._targetPath = this.Path1;
        } else if (index == 2) {
            this._targetPath = this.Path2;
        }
        this.move();
    }

    move() {
        if (this._targetPath.length <= 0) {
            //停下
            this.hide();
            return;
        }
        this.PlayAni(AniState.Walk);
        this.AreaType = DMM_AREATYPE.PROBABILITY;

        const path: Node = this._targetPath.shift();
        const pathPos = path.getWorldPosition();
        const aiPos = this.node.getWorldPosition();
        //设置节点的旋转
        const dir: Vec3 = new Vec3();
        Vec3.subtract(dir, pathPos, aiPos);
        dir.normalize();
        const rotation = new Quat();
        Quat.fromViewUp(rotation, dir, Vec3.UP);
        rotation.x = 0;  // 确保不会有俯仰角度
        rotation.z = 0;  // 确保不会有滚动角度
        tween(this.node)
            .to(0.1, { rotation: rotation }, { easing: `sineOut` })
            .start();
        //设置节点的位移
        const dis = Vec3.distance(pathPos, aiPos);
        tween(this.node)
            .to(dis / this.Speed, { worldPosition: pathPos }, { easing: `sineOut` })
            .call(() => {
                this.PlayAni(AniState.Idle);
                // this.AreaType = path.getComponent(DMM_Area).Type;
                this.move();
            })
            .start();
    }

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

    setName(name: string) {
        // if (!this.NameTs) console.error(this.node.name);
        this.AIName = name;
        this.NameTs.string = name;
    }

    PlayAni(state: AniState) {
        if (this.State === state) return;
        this.State = state;
        this.SkeletalAnimation.play(state);
    }

    hide() {
        Tween.stopAllByTarget(this.node);
        this.changeProp();

        if (this.AreaType == DMM_AREATYPE.DANGER) {
            DMM_LV.Instance.DangeNode.unshift(this.node);
        } else if (this.AreaType == DMM_AREATYPE.PROBABILITY) {
            const isDanger = DMM_GameTool.GetRandom(0, 1) > 0.5 ? true : false;
            if (isDanger) DMM_LV.Instance.DangeNode.unshift(this.node);
        }
    }

    changePlayer() {
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

    changeProp() {
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

    protected onEnable(): void {
        DMM_EventManager.ON(DMM_MyEvent.DMM_AI_MOVE, this.startMove, this);
        DMM_EventManager.ON(DMM_MyEvent.DMM_HIDE, this.hide, this);
        DMM_EventManager.ON(DMM_MyEvent.DMM_AI_CHANGEAI, this.changePlayer, this);
        DMM_EventManager.ON(DMM_MyEvent.DMM_AI_CHANGEPROP, this.changeProp, this);
    }

    protected onDisable(): void {
        DMM_EventManager.OFF(DMM_MyEvent.DMM_AI_MOVE, this.startMove, this);
        DMM_EventManager.OFF(DMM_MyEvent.DMM_HIDE, this.hide, this);
        DMM_EventManager.OFF(DMM_MyEvent.DMM_AI_CHANGEAI, this.changePlayer, this);
        DMM_EventManager.OFF(DMM_MyEvent.DMM_AI_CHANGEPROP, this.changeProp, this);
    }
}


