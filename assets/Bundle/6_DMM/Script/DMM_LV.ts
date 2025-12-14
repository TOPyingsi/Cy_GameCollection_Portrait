import { _decorator, Component, director, error, instantiate, math, Node, Prefab, Quat, size, tween, v3, Vec3 } from 'cc';
import { DMM_PlayerController } from './DMM_PlayerController';
import { BADMENNAME, COLOR, DMM_GENDER, MenName, WomenName } from './DMM_Constant';
import { DMM_PlayerAI } from './DMM_PlayerAI';
import { DMM_Camera } from './DMM_Camera';
import { DMM_Blast } from './DMM_Blast';
import { DMM_PrefsManager } from './DMM_PrefsManager';
import { DMM_GameManager } from './DMM_GameManager';
import { DMM_Player } from './DMM_Player';
import { DMM_GameTool } from './DMM_GameTool';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { DMM_EventManager, DMM_MyEvent } from './DMM_EventManager';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('DMM_LV')
export class DMM_LV extends Component {
    public static Instance: DMM_LV = null;

    @property(Node)
    Door: Node = null;

    @property({ type: Node, displayName: "圆心" })
    Center: Node = null;

    @property({ displayName: "圆的半径" })
    Radius: number = 1;

    // @property({ displayName: "玩家个数" })
    AICount: number = 5;

    @property(Node)
    AI: Node[] = [];

    @property(Node)
    ArrsetNodes: Node[] = [];//被抓住的道具

    @property(Node)
    CameraEnd: Node = null;

    @property(Node)
    BadMenNode: Node = null;

    @property(Node)
    Prop: Node[] = [];

    @property(Node)
    BadMenFirstTarget: Node = null;

    @property({ type: Vec3 })
    BadMenPos: Vec3 = new Vec3();

    @property(Node)
    TargetNode: Node = null;

    @property(Node)
    TipsTarget: Node = null;

    IsGameStart: boolean = false;
    StartTips: boolean = true;
    BadMen: Node = null;

    DangeNode: Node[] = [];

    private height: number = 1.071;
    private centerPos: Vec3 = new Vec3(0, 0, 0);
    private _ai: Node[] = [];
    private _prop: Node[] = [];

    protected onLoad(): void {
        DMM_LV.Instance = this;
    }

    protected start(): void {
        this.centerPos = this.Center.getWorldPosition();
        this.loadBadMen();
        this.loadAI();
        this.loadProp();
    }


    /**
    * 加载BadMen
    */
    loadBadMen() {
        this.BadMenNode.removeAllChildren();
        const name: string = DMM_GameTool.GetEnumKeyByValue(BADMENNAME, DMM_PrefsManager.Instance.userData.BadMen);
        BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], `Bundle/DMM_Prefabs/${name}`).then((prefab: Prefab) => {
            this.BadMen = instantiate(prefab);
            this.BadMen.parent = this.BadMenNode;
            this.BadMen.setPosition(this.BadMenPos);
        })
    }

    /**
    * 加载PlayerAI
    */
    loadAI() {
        let count = 5;
        while (count > 0) {
            const ai: Node = this.AI[DMM_GameTool.GetRandomInt(0, this.AI.length)];
            if (ai.getComponent(DMM_Player).Index != DMM_PlayerController.Instance.Index && this._ai.indexOf(ai) == -1) {
                this._ai.push(ai);
                ai.active = true;
                count--;
            }
        }
        this.addName();
    }

    /**
     * 为PlayerAI赋名
     */
    addName() {
        let menName: string[] = DMM_GameTool.GetRandomMFromArr(this.AICount, MenName);
        let womenName: string[] = DMM_GameTool.GetRandomMFromArr(this.AICount, WomenName);
        for (let i = 0; i < this._ai.length; i++) {
            const ts = this._ai[i].getComponent(DMM_PlayerAI);
            if (ts.Gender == DMM_GENDER.男) {
                ts.setName(menName.shift());
            } else if (ts.Gender == DMM_GENDER.女) {
                ts.setName(womenName.shift());
            }
        }
    }

    //加载道具
    loadProp() {
        this._prop = DMM_GameTool.GetRandomMFromArr(6, this.Prop);
    }


    oppenDoor(cb: Function = null) {
        tween(this.Door)
            .to(0.5, { eulerAngles: v3(0, -120, 0) })
            .call(() => {
                cb && cb();
            })
            .start();
    }


    /**
     * 将角色排列成圆形并面向圆心
    */
    placeRolesInCircle() {
        const angleStep = (2 * Math.PI) / (this.AICount + 1); // 每个角色之间的角度（弧度）

        for (let i = 0; i < this.AICount + 1; i++) {
            // 计算角色在圆上的位置
            const angle = (i - 1) * angleStep;
            const x = this.Radius * Math.cos(angle) + this.centerPos.x;
            const z = this.Radius * Math.sin(angle) + this.centerPos.z;

            // 设置角色位置
            const position = new Vec3(x, this.height, z);

            // 计算角色朝向圆心的旋转（锁定水平面）
            const direction = this.centerPos.clone().subtract(position);
            direction.y = 0; // 忽略 Y 轴分量，保持水平

            const rotation = this.lookAtDirection(direction); // 水平旋转
            rotation.x = 0;  // 确保不会有俯仰角度
            rotation.z = 0;  // 确保不会有滚动角度

            // 设置角色的旋转
            if (i == 0) {
                DMM_PlayerController.Instance.setWorldPos(position);
                DMM_PlayerController.Instance.node.setRotation(rotation);
            } else {
                this._ai[i - 1].setWorldPosition(position);
                this._ai[i - 1].setRotation(rotation);
            }

        }
        this.targetNode = DMM_GameTool.GetRandomItemFromArray(this._ai);
        this.rotateAndPointToTarget();
    }

    /**
     * 计算角色的旋转四元数，让角色朝向指定方向
     * @param direction 目标方向向量
     * @returns 旋转四元数
     */
    lookAtDirection(direction: Vec3): math.Quat {
        const up = new Vec3(0, 1, 0); // 角色默认向上的法向量
        const rotation = new math.Quat();
        math.Quat.fromViewUp(rotation, direction.normalize(), up);
        return rotation;
    }

    // @property({ type: Node, tooltip: "目标指向的节点" })
    targetNode: Node = null; // 要指向的目标节点

    // @property({ tooltip: "旋转的持续时间（秒）" })
    rotationDuration: number = 4; // 每圈旋转的持续时间

    // @property({ tooltip: "慢到快的圈数" })
    initialCircles: number = 4; // 初始慢到快的圈数

    // @property({ tooltip: "快到慢的时间" })
    slowDownDuration: number = 2; // 慢下来指向目标的时间


    /**
     * 旋转--指向的玩家变成BadMen
     */
    rotateAndPointToTarget() {
        this.Center.active = true;
        const currentRotation = this.Center.eulerAngles.y; // 获取当前 Y 轴旋转角度
        const currentPos = this.Center.getWorldPosition();
        const targetPos = this.targetNode.getWorldPosition();

        // 计算目标节点的角度
        const direction = new Vec3();
        Vec3.subtract(direction, targetPos, currentPos);
        direction.normalize();

        const targetAngleRad = Math.atan2(direction.x, direction.z); // 目标角度（弧度）
        const targetAngleDeg = math.toDegree(targetAngleRad); // 转换为角度

        // 确保旋转角度是连续方向（顺时针/逆时针）
        let deltaAngle = targetAngleDeg - currentRotation;

        const totalRotations = this.initialCircles * 360 + deltaAngle - 10; // 总旋转角度（慢到快的旋转圈数）

        // 分段 Tween 动画：
        // 1. 箭头从慢到快旋转指定圈数
        // 2. 从快到慢旋转指向目标节点
        tween(this.Center)
            .to(this.rotationDuration, { eulerAngles: new Vec3(0, totalRotations / 2, 0) }, { easing: 'sineIn' }) // 加速旋转半圈
            .to(this.rotationDuration, { eulerAngles: new Vec3(0, totalRotations, 0) }, { easing: 'sineOut' }) // 慢下来完成两圈
            .call(() => {
                this.change();
            })
            .start();
    }

    //变身
    change() {
        const name: string = DMM_GameTool.GetEnumKeyByValue(BADMENNAME, DMM_PrefsManager.Instance.userData.BadMen);
        BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], `Bundle/DMM_Prefabs/${name}`).then((prefab: Prefab) => {
            const node: Node = instantiate(prefab);
            node.parent = director.getScene();
            node.setWorldPosition(this.targetNode.getWorldPosition());
            node.setWorldRotation(this.targetNode.getWorldRotation());
            node.setScale(v3(0, 0, 0));
            tween(node)
                .to(0.5, { scale: v3(100, 100, 100) })
                .start();
            DMM_Camera.Instance.fov(80, 1);
            DMM_Camera.Instance.IsMoveTrace = false;
            DMM_Camera.Instance.orientationBuyTarget(node, 1, () => {

                this.scheduleOnce(() => {
                    BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], "Bundle/DMM_Prefabs/Blast").then((prefab: Prefab) => {
                        const blast: Node = instantiate(prefab);
                        blast.parent = director.getScene();
                        blast.getComponent(DMM_Blast).show(node.getWorldPosition().add3f(0, 10, 0), v3(10, 10, 10), COLOR.SkyBlue, () => {
                            // DMM_Camera.Instance.fov(60, 1);
                            DMM_Camera.Instance.fov(45, 1);
                            DMM_Camera.Instance.orientationTarget(1, () => {
                                //游戏开始
                                this.gameStart();
                            });
                        });
                        node.destroy()
                    });
                }, 1)
            });
            this._ai.splice(this._ai.indexOf(this.targetNode), 1);
            this.targetNode.destroy();
            this.addProp();
        })
    }

    gameStart() {
        DMM_EventManager.Scene.emit(DMM_MyEvent.DMM_AI_CHANGEPROP);
        DMM_Camera.Instance.startMoveTrace();
        DMM_GameManager.Instance.showTouchPanel();
        this.scheduleOnce(() => {
            DMM_EventManager.Scene.emit(DMM_MyEvent.DMM_AI_MOVE);
            DMM_GameManager.Instance.startTimer();
        }, 1);
        this.IsGameStart = true;
        this.Center.active = false;
        DMM_PlayerController.Instance.StopMove();
        DMM_GameManager.Instance.showGameStartTips();
    }

    addProp() {
        if (DMM_PrefsManager.Instance.userData.LV == 1) {
            DMM_PlayerController.Instance.addProp(this.Prop[8]);
        } else {
            DMM_PlayerController.Instance.addProp(this._prop.shift());
        }
        for (let i = 0; i < this._ai.length; i++) {
            if (this._prop[0].name == "小黄鸭") this._prop.shift();
            this._ai[i].getComponent(DMM_PlayerAI).addProp(this._prop.shift());
        };
    }

    hide() {
        this.IsGameStart = false;
        DMM_GameManager.Instance.showTouchPanel(false);
        DMM_GameManager.Instance.showCameraPanel();
        DMM_GameManager.Instance.hideHideBtn();
        DMM_EventManager.Scene.emit(DMM_MyEvent.DMM_HIDE);
        DMM_Camera.Instance.startRotateTrace(this.BadMen);
        DMM_Camera.Instance.moveByTarget(this.CameraEnd.getWorldPosition(), 1, () => {
            this.oppenDoor(() => {
                // DMM_Camera.Instance.shakeScreen(0.5, 4);
                DMM_EventManager.Scene.emit(DMM_MyEvent.DMM_ARREST);
            })
        });
    }

}


