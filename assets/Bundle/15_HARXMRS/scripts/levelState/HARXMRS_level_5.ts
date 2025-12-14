import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { baseState } from '../HARXMRS_baseState';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('level_5')
export class level_5 extends baseState {
    womenLogs : string[] = ["摩擦生热这下暖和点了", "沾了水更冷了"];
    menLogs : string[] = ["冲个澡清爽许多", "这下更热了"];

    pentouPos : Vec3 = new Vec3(270.844, 509 + 200, 0);
    maojinPos : Vec3 = new Vec3(800.795, 201.404 + 200, 0);
    pentou : Prefab;
    maojin : Prefab;
    enter(): void {
        super.enter();
        this.leftMove.canMove = false;
        this.rightMove.canMove = false;
    }


    initS(pentou : Prefab, maojin : Prefab){
        this.pentou = pentou;
        this.maojin = maojin;
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
        let pentou = instantiate(this.pentou);
        let maojin = instantiate(this.maojin);
        pentou.setParent(this.roleController.leftSk.node.parent);
        maojin.setParent(this.roleController.rightSk.node.parent);
        console.log(this.roleController.rightSk.node.parent);
        pentou.setWorldPosition(this.pentouPos);
        maojin.setWorldPosition(this.maojinPos);
        if (this.roleController.leftName == "women"){
            // console.log("FUCK");
            pentou.setScale(pentou.scale.x * -1, pentou.scale.y, 0);
        }
        this.scheduleOnce(()=>{
            pentou.destroy();
            maojin.destroy();
        },1.5);

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
        }, 2.5 );
        this.scheduleOnce(()=>{
            this.roleController.disappearmenLog();
            this.roleController.appearCill();
            this.roleController.womenSk.setAnimation(1, "human-cold", true);
            this.roleController.menSk.setAnimation(1, "man-hot", true);
        }, 3.2);

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


