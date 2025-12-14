import { _decorator, Component, director, Node, Prefab, Vec3 } from 'cc';
import { baseState } from '../HARXMRS_baseState';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('level_4')
export class level_4 extends baseState {
    womenLogs : string[] = ["什么科技火热难耐了", "这下更冷了"];
    menLogs : string[] = ["凉凉的很舒心", "这下更热了"];

    enter(): void { 
        super.enter();
        this.leftMove.canMove = false;
        this.rightMove.canMove = false;
    }

    playMenLog(type : number){
        AudioManager.Instance.PlaySFX(this.menLogClip[type]);
    }
    playWomenLog(type : number){
        AudioManager.Instance.PlaySFX(this.womenLogClip[type]);
    }


    work(): void {
        // console.log(this.roleController.leftName + "---" + this.roleController.rightName);
        let ok = 1;
        if (this.roleController.leftName == "women"){
            this.roleController.winCnt++;
            director.getScene().emit("changeSkinLeft", "暖宝宝", 1);
            this.womenYes();
            ok = 0;
        }else{
            this.menNo();
            director.getScene().emit("changeSkinLeft", "暖宝宝", 1);
        }
        if (this.roleController.rightName == "men"){
            this.menYes();
            director.getScene().emit("changeSkinRight", "退热贴", 1);
        }else{
            this.womenNo();
            director.getScene().emit("changeSkinRight", "退热贴", 1);
        }

        this.roleController.appearWomenLog();
        this.playWomenLog(ok);
        this.scheduleOnce(()=>{
            this.roleController.disappearWomenLog();
            this.roleController.appearmenLog();
            this.playMenLog(ok);
        }, 2.5 );
        this.scheduleOnce(()=>{
            this.roleController.disappearmenLog();
            this.roleController.appearCill();
            this.roleController.womenSk.setAnimation(1, "human-cold", true);
            this.roleController.menSk.setAnimation(1, "man-hot", true);
        }, 4);

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


