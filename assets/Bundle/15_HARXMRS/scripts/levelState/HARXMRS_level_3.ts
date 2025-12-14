import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { baseState } from '../HARXMRS_baseState';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('level_3')
export class level_3 extends baseState {
    womenLogs : string[] = ["小火炉真暖和", "这下更冷了"];
    menLogs : string[] = ["吹吹风凉快多了", "这下更热了"];

    shanziPos : Vec3 = new Vec3(108.006, 765 + 200, 0);
    huoluPos : Vec3 = new Vec3(997.8, 874 + 200 + 200, 0);
    shanzi : Prefab;
    huolu : Prefab;
    enter(): void {
        super.enter();
        this.leftMove.canMove = false;
        this.rightMove.canMove = false;
    }


    initS(shanzi : Prefab, huolu : Prefab){
        this.shanzi = shanzi;
        this.huolu = huolu;
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
        let shanzi = instantiate(this.shanzi);
        let huolu = instantiate(this.huolu);
        shanzi.setParent(this.roleController.leftSk.node.parent);
        huolu.setParent(this.roleController.rightSk.node.parent);
        console.log(this.roleController.rightSk.node.parent);
        shanzi.setWorldPosition(this.shanziPos);
        huolu.setWorldPosition(this.huoluPos);
        if (this.roleController.leftName == "men"){
            // console.log("FUCK");
            shanzi.setScale(shanzi.scale.x * -1, shanzi.scale.y, 0);
        }


        if (this.roleController.leftName == "men"){
            this.roleController.winCnt++;
            this.menYes();
            ok = 0;
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
        }, 2.1 );
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


