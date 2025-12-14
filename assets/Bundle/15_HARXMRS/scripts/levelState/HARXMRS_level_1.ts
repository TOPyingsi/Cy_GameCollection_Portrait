import { _decorator, Component, director, Node } from 'cc';
import { baseState } from '../HARXMRS_baseState';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('level_1')
export class level_1 extends baseState {


    womenLogs : string[] = ["脚暖全身暖", "这下更冷了"];
    menLogs : string[] = ["穿上短裤凉快多了", "这下更热了"];

    enter(): void {
        super.enter();
        this.leftMove.canMove = false;
        this.rightMove.canMove = false;
    }
    work(): void {
        let ok = 1;
        // console.log(this.roleController.leftName + "---" + this.roleController.rightName);
        if (this.roleController.leftName == "women"){
            director.getScene().emit("changeSkinLeft", "袜子", 1);
            ok = 0;
            this.roleController.setWomenLog(this.womenLogs[0]);
            this.roleController.womenSk.setAnimation(1, "human-normal", true);
            this.roleController.disappearCill();
            this.roleController.winCnt++;
            // console.log("CNM");
        }else{
            director.getScene().emit("changeSkinLeft", "袜子", 1);
            this.roleController.setmenLog(this.menLogs[1]);
            this.roleController.menSk.setAnimation(1, "man-mistake", true);
        }
        if (this.roleController.rightName == "men"){
            // console.log("SB");
            director.getScene().emit("changeSkinRight", "裤子", 0);
            this.roleController.setmenLog(this.menLogs[0]);
            this.roleController.menSk.setAnimation(1, "man-happy-shorts", true);
        }else{
            this.roleController.womenSk.setAnimation(1, "human-mistake", true);
            director.getScene().emit("changeSkinRight", "短裤", 1);
            this.roleController.setWomenLog(this.womenLogs[1]);
        }

        this.roleController.appearWomenLog();
        this.playWomenLog(ok);
        this.scheduleOnce(()=>{
            this.roleController.disappearWomenLog();
            this.roleController.appearmenLog();
            this.playMenLog(ok);
        }, 2.5);
        this.scheduleOnce(()=>{
            this.roleController.disappearmenLog();
            this.roleController.appearCill();
            this.roleController.womenSk.setAnimation(1, "human-cold", true);
            this.roleController.menSk.setAnimation(1, "man-hot", true);
        }, 4);

        // end 恢复状态。
    }

    playMenLog(type : number){
        AudioManager.Instance.PlaySFX(this.menLogClip[type]);
    }
    playWomenLog(type : number){
        AudioManager.Instance.PlaySFX(this.womenLogClip[type]);
    }
    exit(): void {
        super.exit();
    }

}


