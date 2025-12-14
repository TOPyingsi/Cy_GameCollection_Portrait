import { _decorator, BoxCollider2D, Collider2D, Color, Component, Contact2DType, Node, RigidBody2D, tween, Vec3 } from 'cc';
import { EJZHZLX_GROUP, JZHZLX_GameManager } from './JZHZLX_GameManager';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('JZHZLX_RoleAndGoalsController')
export class JZHZLX_RoleAndGoalsController extends Component {

    boxCollider: BoxCollider2D = null;
    rigidBody: RigidBody2D = null;
    role: Node = null;
    GetAngry: Node = null;
    Happy: Node = null;
    Sad: Node = null;

    @property({ type: Color })
    color: Color = new Color(60, 0, 255);

    @property(GamePanel)
    gamePanel: GamePanel = null;

    path: Vec3[] = [];

    sequence: any = null;

    success: boolean = false;

    isCollider: boolean = false;

    protected onLoad(): void {
        this.role = NodeUtil.GetNode("Role", this.node);
        this.GetAngry = NodeUtil.GetNode("GetAngry", this.node);
        this.Happy = NodeUtil.GetNode("Happy", this.node);
        this.Sad = NodeUtil.GetNode("Sad", this.node);

        this.boxCollider = this.node.getComponent(BoxCollider2D);
        this.rigidBody = this.node.getComponent(RigidBody2D);

        this.boxCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.success = false;
        this.path = [];
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {

        if (this.sequence) {
            this.sequence.stop();
        }

        this.isCollider = true;
        selfCollider.enabled = false;

        // 角色
        if (otherCollider.group == EJZHZLX_GROUP.Role) {
            if (this.GetAngry != null) {
                this.GetAngry.active = true;
                JZHZLX_GameManager.Instance.HandleCollision();
                console.log("人物相撞");
            }
            // 角色之间相撞，立即结束游戏
            return;
        }
        // 目标
        else if (otherCollider.group == EJZHZLX_GROUP.Goal) {
            this.isGoalsByRole(selfCollider.node, otherCollider.node);
        }
    }

    isGoalsByRole(role: Node, goals: Node) {

        let roleTag = role.getComponent(BoxCollider2D).tag;
        let goalsTag = goals.getComponent(BoxCollider2D).tag;

        if (roleTag == goalsTag) {

            if (this.Happy != null) {
                this.Happy.active = true;
            }

            this.success = true;
            JZHZLX_GameManager.Instance.CheckWin();

        } else if (roleTag != goalsTag) {
            JZHZLX_GameManager.Instance.HandleCollision();


            if (this.Sad != null) {
                this.Sad.active = true;
            }
            return;


        }
    }

    moveRoleAlongPath() {
        if (this.path.length === 0) return;

        // 计算总路径长度
        let totalLength = 0;
        for (let i = 1; i < this.path.length; i++) {
            const prev = this.path[i - 1];
            const current = this.path[i];
            totalLength += Vec3.distance(prev, current);
        }

        const time = 3; // 总时长（秒）
        let accumulatedTime = 0;
        this.sequence = tween(this.node)
            .set({ position: this.path[0] });

        for (let i = 1; i < this.path.length; i++) {
            const segmentLength = Vec3.distance(this.path[i - 1], this.path[i]);
            const segmentTime = (segmentLength / totalLength) * time;
            accumulatedTime += segmentTime;

            this.sequence.to(segmentTime, { position: this.path[i] }, { easing: 'linear' });
        }

        // 确保总时长精确为3秒（处理浮点误差）
        if (accumulatedTime < time - 0.001) {
            this.sequence.to(time - accumulatedTime, { position: this.path[this.path.length - 1] });
        }

        this.sequence.call(() => {
            if (!this.isCollider) {
                this.GetAngry.active = true;
            }
            this.isCollider = false;
            // 移动完成后检查所有角色的状态
            JZHZLX_GameManager.Instance.CheckAllRolesFinished();
        });

        this.sequence.start();
    }


    stopMoving() {
        if (this.sequence) {
            this.sequence.stop();
            this.sequence = null;
        }
    }
}