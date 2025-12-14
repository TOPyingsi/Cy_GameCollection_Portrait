import { _decorator, Component, director, instantiate, Node, Prefab, Vec3 } from 'cc';
import { baseState } from '../HARXMRS_baseState';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('level_2')
export class level_2 extends baseState {
    womenLogs : string[] = ["荔枝上火身上没那么冷了", "这下更冷了"];
    menLogs : string[] = ["透心凉心飞扬", "这下更热了"];

    xiguaPos : Vec3 = new Vec3(-157.854, -169.854 + 200, 0);
    lizhiPos : Vec3 = new Vec3(320.538, -146.33 + 200, 0);
    xigua : Prefab;
    lizhi : Prefab;
    parent : Node;
    enter(): void {
        super.enter();
        this.leftMove.canMove = false;
        this.rightMove.canMove = false;
    }


    initS(xigua : Prefab, lizhi : Prefab, parent : Node){
        this.xigua = xigua;
        this.lizhi = lizhi;
        this.parent = parent;
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
        let lizhi = instantiate(this.lizhi);
        let xigua = instantiate(this.xigua);
        lizhi.setParent(this.parent);
        xigua.setParent(this.parent);
        lizhi.setPosition(this.lizhiPos);
        xigua.setPosition(this.xiguaPos);

        this.scheduleOnce(()=>{
            lizhi.destroy();
            xigua.destroy();
        }, 1.5);
        if (this.roleController.leftName == "men"){
            this.roleController.winCnt++;
            ok = 0;
            this.menYes();
        }else{
            this.womenNo();
        }
        if (this.roleController.rightName == "women"){
            this.womenYes();
        }else{
            this.menNo();
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
        }, 2.5 + 1.5);

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


