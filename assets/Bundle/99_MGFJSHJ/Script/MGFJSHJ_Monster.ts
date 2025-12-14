import { _decorator, Component, math, Node, tween, v3, Vec3 } from 'cc';
import { MGFJSHJ_GameMgr } from './MGFJSHJ_GameMgr';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('MGFJSHJ_Monster')
export class MGFJSHJ_Monster extends Component {


    private startPos: Vec3 = null;
    private playerPos: Vec3[] = [];

    protected start(): void {
        this.initData();
    }

    startAttack() {
        if (MGFJSHJ_GameMgr.instance.isGameOver) {
            this.unscheduleAllCallbacks();
            return;
        }

        if (MGFJSHJ_GameMgr.instance.isPlayerChoose) {
            this.unscheduleAllCallbacks();
            return;
        }

        this.curPosArr = Array.from(this.playerPos);

        //随机移动
        this.randomMove();
        //每8-10秒攻击一次
        let moveTime = 4;

        this.scheduleOnce(this.Attacking, moveTime);
        //几秒后攻击

    }

    //攻击中
    isAttacking: boolean = false;
    Attacking() {

        this.isAttacking = true;

        let randomIndex = math.randomRangeInt(0, this.playerPos.length);

        randomIndex = this.voidPlayer(randomIndex);

        let pointX = this.playerPos[randomIndex].x;
        let pointY = this.playerPos[randomIndex].y;

        tween(this.node)
            .to(0.5, { worldPosition: v3(pointX, pointY, 0) })
            .call(this.AttackEnd(randomIndex))
            .start();
    }

    //攻击结束
    AttackEnd(index: number) {
        return () => {
            this.isPlayerDie(index)

            this.playerPos.splice(index, 1);

            this.isAttacking = false;

            MGFJSHJ_GameMgr.instance.kill(index);

            tween(this.node)
                .to(0.8, { worldPosition: this.startPos })
                .call(() => {
                    MGFJSHJ_GameMgr.instance.arrowNode.active = false;

                    if (MGFJSHJ_GameMgr.instance.isGameOver) {
                        MGFJSHJ_GameMgr.instance.lost();
                        return;
                    }

                    MGFJSHJ_GameMgr.instance.startInterval();

                })
                .start();
            // this.startAttack();
        }
    }

    voidPlayer(index: number): number {
        let node = MGFJSHJ_GameMgr.instance.curNode[index];

        let indexOf = MGFJSHJ_GameMgr.instance.seatsNodes.indexOf(node);

        let flag1 = MGFJSHJ_GameMgr.instance.DieNum < 6;
        let flag2 = (indexOf === MGFJSHJ_GameMgr.instance.playerSeat);

        console.log(flag1);
        console.log(flag2);

        if (flag1 && flag2) {
            console.error("避开玩家");

            if (index + 1 === MGFJSHJ_GameMgr.instance.curNode.length) {
                index = index - 1;
            }
            else {
                index = index + 1;
            }

        }

        return index;

    }

    isPlayerDie(index: number) {
        let playerIndex = MGFJSHJ_GameMgr.instance.playerSeat;
        let dieIndex = MGFJSHJ_GameMgr.instance.seatsIndex[index];

        if (playerIndex === dieIndex) {
            //玩家被杀了
            console.error("玩家被杀了");

            MGFJSHJ_GameMgr.instance.isPlayerDie = true;
            MGFJSHJ_GameMgr.instance.isGameOver = true;

            // MGFJSHJ_GameMgr.instance.kill(index);

            return true;
        }

        return false;
    }

    curPosArr: Vec3[] = [];
    randomMove() {
        if (MGFJSHJ_GameMgr.instance.isGameOver) {
            return;
        }

        if (this.isAttacking) {
            return;
        }


        let randomIndex = math.randomRangeInt(0, this.curPosArr.length);

        if (this.curPosArr.length == 0) {
            return;
        }
        let pointX = this.curPosArr[randomIndex].x;
        let pointY = this.curPosArr[randomIndex].y;

        tween(this.node)
            .to(1, { worldPosition: v3(this.startPos.x, pointY, 0) })
            .call(() => {
                this.curPosArr.splice(randomIndex, 1);

                this.randomMove();
            })
            .start();
    }

    public initData() {
        //保存所有座位的世界坐标
        let posArr = MGFJSHJ_GameMgr.instance.seatsNodes;

        for (let i = 0; i < posArr.length; i++) {
            this.playerPos[i] = posArr[i].worldPosition.clone();
        }

        this.startPos = this.node.worldPosition.clone();

    }
}


