import { _decorator, Component, Node, sp, Sprite, SpriteFrame } from 'cc';
import { baseState } from '../HARXMRS_baseState';
import { itemController } from '../HARXMRS_itemController';
import { stateMachine } from '../HARXMRS_stateMachine';
import { moveController } from '../HARXMRS_moveController';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('level_7')
export class level_7 extends baseState {
    womenLogs : string[] = ["还是很冷", "还是很冷"];
    menLogs : string[] = ["这下凉快多了", "这下更热了"];

    enter(): void {
        super.enter();
        this.leftMove.canMove = true;
        this.rightMove.canMove = true;

        moveController.womenCanWear = true;
    }

    menBed : Sprite;
    womenBed : Sprite;
    menBeds : SpriteFrame[] = [];
    womenBeds : SpriteFrame[] = [];

    playMenLog(type : number){
        AudioManager.Instance.PlaySFX(this.menLogClip[type]);
    }
    playWomenLog(type : number){
        AudioManager.Instance.PlaySFX(this.womenLogClip[type]);
    }

    initS(menBed : Sprite, womenBed : Sprite, menBeds : SpriteFrame[], womenBeds : SpriteFrame[]){
        this.menBed = menBed;
        this.womenBed = womenBed;
        this.menBeds = menBeds;
        this.womenBeds = womenBeds;
    }

    work(): void {
        let ok = 1;
        // console.log(this.roleController.leftName + "---" + this.roleController.rightName);
        this.womenNo();
        if (this.roleController.lastLevelType == 0){
            this.menNo();
            if (this.roleController.leftName == "women"){
                this.womenBed.spriteFrame = this.womenBeds[0];
                this.womenBed.node.setScale(this.womenBed.node.scale.x * -1, 1 ,1);
                this.menBed.spriteFrame = this.menBeds[1];
            }else{
                this.womenBed.spriteFrame = this.womenBeds[1];
                this.womenBed.node.setScale(this.womenBed.node.scale.x * -1, 1 ,1);
                this.menBed.spriteFrame = this.menBeds[0];
            }
        }else if (this.roleController.lastLevelType == 1 && this.roleController.leftName == "men"){
            this.menYes();
            ok = 0;
            this.roleController.winCnt++;
            this.menBed.spriteFrame = this.menBeds[2];
        }else if (this.roleController.lastLevelType == 2 && this.roleController.rightName == "men"){
            this.menYes();
            ok = 0;
            this.roleController.winCnt++;
            this.menBed.spriteFrame = this.menBeds[2];
        }else{
            this.menNo();
            this.womenBed.node.setScale(this.womenBed.node.scale.x * -1, 1 ,1);
            this.womenBed.spriteFrame = this.womenBeds[2];
        }

        this.roleController.appearWomenLog();
        this.playWomenLog(ok);
        this.scheduleOnce(()=>{
            this.roleController.disappearWomenLog();
            this.roleController.appearmenLog();
            this.playMenLog(ok);
        }, 1.5 );
        this.scheduleOnce(()=>{
            this.roleController.disappearmenLog();
            this.roleController.appearCill();
            this.roleController.womenSk.setAnimation(1, "human-cold", true);
            this.roleController.menSk.setAnimation(1, "man-hot", true);
        }, 3);

        // end 恢复状态。
    }

    private menYes() {
        this.roleController.setmenLog(this.menLogs[0]);
        this.roleController.menSk.setAnimation(1, "man-happy-shorts", true);
    }

    private womenYes() {
        this.roleController.setWomenLog(this.womenLogs[0]);
        this.roleController.womenSk.setAnimation(1, "human-normal", true);
        this.roleController.disappearCill();
    }

    private menNo() {
        this.roleController.setmenLog(this.menLogs[1]);
        this.roleController.menSk.setAnimation(1, "man-mistake", true);
    }

    private womenNo() {
        this.roleController.womenSk.setAnimation(1, "human-mistake", true);
        this.roleController.setWomenLog(this.womenLogs[1]);
    }
    exit(): void {
        super.exit();
    }
}


