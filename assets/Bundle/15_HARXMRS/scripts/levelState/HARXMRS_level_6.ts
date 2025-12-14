import { _decorator, Component, director, instantiate, Node, Prefab, Vec3 } from 'cc';
import { baseState } from '../HARXMRS_baseState';
import { moveController } from '../HARXMRS_moveController';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('level_6')
export class level_6 extends baseState {
    womenLogs : string[] = ["这里面加了什么感觉身体热热的", "这下更冷了"];
    menLogs : string[] = ["心静自然凉", "这下更热了"];

    chabeiPos : Vec3 = new Vec3(330.989, 1020.492 + 200, 0);

    chabei : Prefab;
    enter(): void {
        super.enter();
        this.leftMove.canMove = false;
        this.rightMove.canMove = false;
        moveController.womenCanWear = true;
    }


    playMenLog(type : number){
        AudioManager.Instance.PlaySFX(this.menLogClip[type]);
    }
    playWomenLog(type : number){
        AudioManager.Instance.PlaySFX(this.womenLogClip[type]);
    }

    initS(chabei : Prefab){
        this.chabei = chabei;
    }

    work(): void {
        // console.log(this.roleController.leftName + "---" + this.roleController.rightName);
        let ok = 1;
        let chabei = instantiate(this.chabei);
        chabei.setParent(this.roleController.leftSk.node.parent);
        
        chabei.setWorldPosition(this.chabeiPos);
        if (this.roleController.leftName == "women"){
            chabei.setScale(chabei.scale.x * -1, chabei.scale.y, 0);
        }
        this.scheduleOnce(()=>{
            chabei.destroy();
        },1.5);

        if (this.roleController.leftName == "women"){
            this.womenYes();
            ok = 0;
        }else{
            this.menNo();
        }
        if (this.roleController.rightName == "men"){
            this.roleController.winCnt++;
            this.menYes();
            this.roleController.menSk.setAnimation(1, "man-meditation", true);
        }else{
            this.womenNo();
            // this.roleController.womenSk.setAnimation(2, "mingxiang", true);
        }

        // this.roleController.womenSk.setAnimation(1, "mingxiang", true);

        // 冥想播放有问题

        this.playWomenLog(ok);
        this.roleController.appearWomenLog();
        this.scheduleOnce(()=>{
            this.playMenLog(ok);
            this.roleController.disappearWomenLog();
            this.roleController.appearmenLog();
        }, 3 );
        this.scheduleOnce(()=>{
            this.roleController.disappearmenLog();
            this.roleController.appearCill();
            this.roleController.womenSk.setAnimation(1, "human-cold", true);
            this.roleController.menSk.setAnimation(1, "man-hot", true);
        }, 3 + 2);

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
        
        this.roleController.womenSk.setAnimation(1, "humen-mistake", true);
        this.roleController.setWomenLog(this.womenLogs[1]);
    }


    exit(): void {
        super.exit();
    }
}


