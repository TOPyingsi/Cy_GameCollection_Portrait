import { _decorator, Component, director, game, math, Node, PhysicsSystem2D, Vec3 } from 'cc';
import { QBT_RoleControl } from './QBT_RoleControl';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
const { ccclass, property } = _decorator;

export enum QBT_CollideEnum {
    Ground = 2, // 地面
    Role = 4, // 角色
    Arrow = 8 // 箭头
}

export enum QBT_AnimType {
    None, MatingEnd
}

export class QBT_AnimEvent {
    private animNode: Node;
    private time: number = 0;
    private animType: QBT_AnimType = QBT_AnimType.None;
    private stage: number = 0; // 阶段

    private tempVect3: Vec3 = new Vec3();

    private finish: boolean = false;

    public get isFinish(): boolean { return this.finish; }

    constructor(animNode: Node, animType: QBT_AnimType = QBT_AnimType.None) {
        this.animNode = animNode;
        this.animType = animType;
    }

    // 更新动画事件
    public update(deltaTime: number) {
        if (this.isFinish) return;
        switch (this.animType) {
            case QBT_AnimType.MatingEnd: {
                this.matingEnd(deltaTime);
                break;
            }
        }
    }

    private matingEnd(deltaTime: number) {
        switch (this.stage) {
            case 0: {
                Vec3.moveTowards(this.tempVect3, this.animNode.getPosition(), Vec3.ZERO, 200 * deltaTime)
                this.animNode.setPosition(this.tempVect3);
                if (this.tempVect3.length() < 5) {
                    this.stage = 1;
                }
                break;
            }
            case 1: {
                Vec3.moveTowards(this.tempVect3, this.animNode.getScale(), Vec3.ZERO, 2 * deltaTime)
                this.animNode.setScale(this.tempVect3);
                if (this.tempVect3.length() < 0.1) {
                    this.animNode.active = false;
                    this.finish = true;
                }
                break;
            }
        }
    }
}

@ccclass('QBT_GameManage')
export class QBT_GameManage extends Component {

    public static instace: QBT_GameManage;

    private loveRoles: QBT_RoleControl[] = new Array();

    @property(Node)
    public touchPlane: Node;
    @property(Node)
    public arrowsNode: Node;
    @property(Node)
    private pausePlane: Node;
    @property(Node)
    private settlementPlane: Node;

    private aminEventList: QBT_AnimEvent[] = new Array();

    private gameRunStage: boolean = true;

    public get isGameRunStage(): boolean { return this.gameRunStage; }

    public pause: boolean = false;

    protected onLoad(): void {
        QBT_GameManage.instace = this;
    }

    start() {

    }

    protected onEnable(): void {
        PhysicsSystem2D.instance.enable = true
        this.pausePlane.active = false;
        this.settlementPlane.active = false;
    }

    update(deltaTime: number) {
        if (this.pause) return;
        for (let index = this.aminEventList.length - 1; index >= 0; index--) {
            const element = this.aminEventList[index];
            element.update(deltaTime);
            if (element.isFinish) {
                this.aminEventList.splice(index, 1);
                this.levelFinish(); //临时使用
            }
        }
    }

    public addLoveRole(role: QBT_RoleControl) {
        if (!this.loveRoles.includes(role)) {
            this.loveRoles.push(role);
        }
    }

    public getOtherRole(t: QBT_RoleControl): QBT_RoleControl {
        for (let index = 0; index < this.loveRoles.length; index++) {
            const element = this.loveRoles[index];
            if (element !== t && element.getOtherRole === null) {
                return element;
            }
        }
        return null;
    }

    public matingEnd(r1: QBT_RoleControl, r2: QBT_RoleControl, baby: Node) {
        this.gameRunStage = false;
    }

    public levelFinish() {
        this.settlementPlane.active = true;

        ProjectEventManager.emit(ProjectEvent.游戏结束, "丘比特");
    }

    public addAnimEvent(ae: QBT_AnimEvent) {
        this.aminEventList.push(ae);
    }

    public gamePause() {
        this.pausePlane.active = true;
        this.pause = true;
        PhysicsSystem2D.instance.enable = false;
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "丘比特");
    }

    public gameResume() {
        this.pausePlane.active = false;
        this.pause = false;
        PhysicsSystem2D.instance.enable = true
    }

    public toHome() {
        ProjectEventManager.emit(ProjectEvent.返回主页, "丘比特");
        director.loadScene("QBT_Home");
    }

    public nextLevel() {
        GameManager.Instance.ReturnAndShowMoreGame();
    }

    public newResume() {
        director.loadScene("QBT_Game");
    }

    protected onDestroy(): void {
        QBT_GameManage.instace = null;
    }

}


