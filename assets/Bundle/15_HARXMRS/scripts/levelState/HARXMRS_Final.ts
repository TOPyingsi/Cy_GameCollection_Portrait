import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { baseState } from '../HARXMRS_baseState';
import { moveController } from '../HARXMRS_moveController';
import { itemController } from '../HARXMRS_itemController';
import { stateMachine } from '../HARXMRS_stateMachine';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Final')
export class Final extends baseState {


    womenLogs : string[] = ["暖和多了这下可以睡着啦", "还是很冷"];
    menLogs : string[] = ["这下凉快多了可以睡着啦", "这下更热了"];

    bk : Sprite;

    bkg : SpriteFrame;

    item : Node;

    yifu : Node;

    gamePanel : GamePanel;
    initS(bk : Sprite, bkg : SpriteFrame, item : Node, yifu : Node, gamePanel : GamePanel){
        this.bk = bk;
        this.bkg = bkg;
        this.item = item;
        this.yifu = yifu;
        this.gamePanel = gamePanel;
    }

    playMenLog(type : number){
        AudioManager.Instance.PlaySFX(this.menLogClip[type]);
    }
    playWomenLog(type : number){
        AudioManager.Instance.PlaySFX(this.womenLogClip[type]);
    }

    enter() {
        this.bk.spriteFrame = this.bkg;
        this.item.setScale(0,0,0);
        this.yifu.setScale(0,0,0);
        let ok = 1;
        if (this.roleController.winCnt == 8){
            this.menYes();
            this.womenYes();
            ok = 0;
        }else{
            this.menNo();
            this.womenNo();
            ok = 1;
        }

        this.roleController.appearWomenLog();
        this.playWomenLog(ok);
        this.scheduleOnce(()=>{
            this.roleController.disappearWomenLog();
            this.roleController.appearmenLog();
            this.playMenLog(ok);
        }, 3.5 );
        this.scheduleOnce(()=>{
            this.roleController.disappearmenLog();
            // this.roleController.appearCill();
            // this.roleController.womenSk.setAnimation(1, "human-cold", true);
            // this.roleController.menSk.setAnimation(1, "man-hot", true);
        }, 6);
        this.scheduleOnce(()=>{
            if (this.roleController.winCnt == 8)
                this.gamePanel.Win()
            else
                this.gamePanel.Lost();
        }, 8);
    }
    work(){

    }

    exit() {

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
}

