import { _decorator, Collider2D, Component, director, Node, RigidBody2D, Tween, tween, v2, v3, Vec2, Vec3 } from 'cc';
import { AStarNode } from '../../../Scripts/Framework/Algorithm/AStar';
import { TLQSH_GameManager } from './TLQSH_GameManager';
import { ProjectEventManager } from '../../../Scripts/Framework/Managers/ProjectEventManager';
import { MyEvent } from '../../../Scripts/Framework/Managers/EventManager';
const { ccclass, property } = _decorator;

@ccclass('TLQSH_Enemy')
export class TLQSH_Enemy extends Component {
    @property()
    public Speed: number = 100;
    public path: AStarNode[] = [];
    public twenn: Tween<Node> = null;
    public freezeTime: number = 0; //半速时间(冷冻)
    public startPos: Vec2 = v2(0, 0);
    protected update(dt: number): void {
        this.freezeTime -= dt;
    }

    start() {
        this.startPos = v2(this.node.position.x, this.node.position.y);
        if (ProjectEventManager.GameStartIsShowTreasureBox) {
            director.getScene().once(MyEvent.TreasureBoxDestroy, this.StartFind, this);
        } else {
            this.StartFind();
        }

    }
    StartFind() {
        this.scheduleOnce(() => {
            this.FindPath();
        }, 4)
    }

    FindPath() {
        this.path = TLQSH_GameManager.Instance.GetPath(this.node.worldPosition, TLQSH_GameManager.Instance.Player);
        if (this.path && this.path.length > 0) {
            this.execute();
        } else {
            this.scheduleOnce(() => {
                this.FindPath();
            }, 1)
        }

    }
    execute() {
        if (TLQSH_GameManager.Instance.GamePause == true) {
            this.scheduleOnce(() => {
                this.execute();
            }, 1);
            return;
        }
        if (this.path && this.path.length > 0) {
            let pos = TLQSH_GameManager.Instance.GetPositionByAStarPoint(v2(this.path[this.path.length - 1].x, this.path[this.path.length - 1].y));
            this.path.splice(this.path.length - 1, 1);
            // let pos2 = pos.subtract(v2(this.node.position.x, this.node.position.y)).normalize().multiplyScalar(this.Speed);
            // this.node.getComponent(RigidBody2D).linearVelocity = pos2;
            let time = Vec2.distance(v2(this.node.position.x, this.node.position.y), pos) / this.Speed;
            if (this.freezeTime > 0) time *= 2;
            console.log(time);
            this.twenn = tween(this.node)
                .to(time, { position: v3(pos.x, pos.y, 0) })
                .call(() => { this.execute() })
                .start();
        } else {
            this.FindPath();
        }
    }

    //冷冻
    Freeze(Time: number) {
        this.node.getChildByName("冰块").active = true;
        this.twenn?.stop();
        this.node.getComponent(Collider2D).enabled = false;
        this.scheduleOnce(() => {
            this.node.getChildByName("冰块").active = false;
            this.FindPath();
            this.node.getComponent(Collider2D).enabled = true;
        }, Time)
    }

    //回到初始位置
    RestartPos() {
        this.node.position = v3(this.startPos.x, this.startPos.y, 0);
    }
}


