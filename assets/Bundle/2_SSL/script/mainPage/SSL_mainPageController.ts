import { _decorator, Component, director, Node } from 'cc';
import { pageController } from '../SSL_pageController';
import { mainPageTicketController } from './SSL_mainPageTicketController';
import { gameStart } from './SSL_gameStart';

import { mainPagePriceController } from './SSL_mainPagePriceController';
import { sharesbutton } from './SSL_sharesbutton';
import { confirmCheck } from './SSL_confirmCheck';
import { SSL_UIManager } from '../Manage/SSL_UIManager';
import { SoundplayManager } from '../Manage/SSL_SoundplayManager';
import { gameOverController } from '../Ticket_PlayPage/SSL_gameOverController';
import PlayerManager from '../Manage/SSL_PlayerManager';
import { changeticketMove } from './SSL_changeticketButtonMove';
import Banner from 'db://assets/Scripts/Banner';
import { Panel, UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('mainPageController')
export class mainPageController extends pageController {

    mainTicket : mainPageTicketController = null;
    gameStart : gameStart = null; 
    pricelabe : mainPagePriceController = null;
    sharesButton : sharesbutton = null;
    confirmCheck : confirmCheck = null;
    gameOver : gameOverController = null;

    changeTicketButton : changeticketMove[] = [];

    protected onEnable(): void {
        this.pricelabe = this.getComponentInChildren(mainPagePriceController);
        this.gameStart = this.getComponentInChildren(gameStart);
        this.mainTicket = this.getComponentInChildren(mainPageTicketController);
        this.sharesButton = this.getComponentInChildren(sharesbutton);
        this.confirmCheck =  this.getComponentInChildren(confirmCheck);
        this.gameOver =  this.getComponentInChildren(gameOverController);
        this.changeTicketButton = this.getComponentsInChildren(changeticketMove);
    }

    
    public override init(): void {
        super.init();
    }
    public override Enter(): void {
        super.Enter();
        this.mainTicket.Entering();
        this.gameStart.AppearButton();
        this.pricelabe.comeTopage();
        this.sharesButton.comeTopage();
        for (let button of this.changeTicketButton){
            button.enterGame();
        }   
    }
    public override Exit(): void {
        super.Exit();
    }
    toGame(){
        SSL_UIManager.instance.uiMachine.changePage(SSL_UIManager.instance.Ticket_playPageScript);
    }

    toShares(){
        SSL_UIManager.instance.uiMachine.changePage(SSL_UIManager.instance.sharesPageScript);
    }
    confirmCheckCome(){
        SoundplayManager.instance.playOnce("点击");
        for (let button of this.changeTicketButton){
            button.leaveGame();
        }
        this.confirmCheck.Openconfirm();
    }
    confirmCheckOver(){
        SoundplayManager.instance.playOnce("点击");
        this.confirmCheck.Closeconfirm();
        for (let button of this.changeTicketButton){
            button.enterGame();
        }
        this.gameStart.AppearButton();
    }

    goTogamePage(){
        // this.mainTicket.Leaving();
        SoundplayManager.instance.playOnce("点击");
        this.confirmCheck.Closeconfirm();
        this.pricelabe.leaveTopage();
        this.sharesButton.leaveTopage();
        if (PlayerManager.Instance.Cashnum < 5){
            this.gameOver.windownsComeIn();
            return;
        }

        this.scheduleOnce(this.toGame, 0.4);
        console.log(this.mainTicket.currentidx);
        director.getScene().emit("initSp", this.mainTicket.currentidx);

    }

    goToSharesPage(){
        SoundplayManager.instance.playOnce("点击");
        this.pricelabe.leaveTopage();
        this.sharesButton.leaveTopage();
        this.mainTicket.Leaving();
        this.gameStart.DisappearButton();
        this.scheduleOnce(this.toShares, 0.4);
    }

    OnReturnButtonClick() {
        if (Banner.IsShowServerBundle) {
            UIManager.ShowPanel(Panel.MoreGamePagePanel);
        } else {
            director.loadScene(GameManager.StartScene);
        }
    }

}


