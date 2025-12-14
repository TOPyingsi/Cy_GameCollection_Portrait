import { _decorator, BoxCollider2D, CCInteger, Collider2D, Component, Contact2DType, Node, Prefab, Tween, tween, UITransform, Vec2, Vec3 } from 'cc';
import { JZHZLX_RoleAndGoalsController } from './JZHZLX_RoleAndGoalsController';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

export enum EJZHZLX_GROUP {
    Role = 1 << 7,
    Goal = 1 << 8,
}

@ccclass('JZHZLX_GameManager')
export class JZHZLX_GameManager extends Component {

    static Instance: JZHZLX_GameManager = null;

    @property([JZHZLX_RoleAndGoalsController])
    roles: JZHZLX_RoleAndGoalsController[] = [];

    @property(GamePanel)
    gamePanel: GamePanel = null;

    @property(Prefab)
    answer: Prefab = null;
    private gameEnded: boolean = false; // 添加一个标志来跟踪游戏是否已经结束


    protected onLoad(): void {
        JZHZLX_GameManager.Instance = this;
        this.gamePanel.answerPrefab = this.answer;
    }




    GetPointInRoleBoundingBox(point: Vec2) {
        for (let i = 0; i < this.roles.length; i++) {
            const role = this.roles[i];
            if (role.getComponent(UITransform).getBoundingBox().contains(point)) {
                return role;
            }
        }

        return null;
    }

    CheckMove() {
        for (let i = 0; i < this.roles.length; i++) {
            const role = this.roles[i];
            if (!role.path || role.path.length === 0) return;
        }

        for (let i = 0; i < this.roles.length; i++) {
            const role = this.roles[i];
            role.moveRoleAlongPath();
        }
    }

    CheckWin() {
        for (let i = 0; i < this.roles.length; i++) {
            const role = this.roles[i];
            if (role.success == false) {
                return;
            }
        }
        this.gamePanel.Win();
        console.error("恭喜通关");
        this.stopAllRoles();
        this.gameEnded = true; // 设置游戏结束标志
    }

    HandleCollision() {
        if (!this.gameEnded) {
            this.gamePanel.Lost();
            console.error("角色相撞，游戏失败");
            this.stopAllRoles();
            this.gameEnded = true; // 设置游戏结束标志
        }
    }

    CheckAllRolesFinished() {
        let allRolesFinished = true;
        let allRolesSuccessful = true;

        for (let i = 0; i < this.roles.length; i++) {
            const role = this.roles[i];
            if (!role.path || role.path.length === 0) {
                allRolesFinished = false;
                break;
            }

            if (!role.success) {
                allRolesSuccessful = false;
            }
        }

        if (allRolesFinished) {
            if (allRolesSuccessful) {
                this.gamePanel.Win();
                console.error("恭喜通关");
            } else {
                if (!this.gameEnded) {
                    this.gamePanel.Lost();
                    console.error("游戏失败");
                    this.gameEnded = true; // 设置游戏结束标志
                }
            }
            this.stopAllRoles();
        }
    }

    stopAllRoles() {
        for (let i = 0; i < this.roles.length; i++) {
            const role = this.roles[i];
            role.stopMoving();
        }
    }


}