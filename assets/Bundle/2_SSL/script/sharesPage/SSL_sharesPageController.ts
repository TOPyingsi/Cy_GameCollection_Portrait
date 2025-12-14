import { _decorator, Component, Node } from 'cc';
import { pageController } from '../SSL_pageController';
import { sharesListController } from './SSL_sharesListController';
import { sharesPageBackButton } from './SSL_sharesPageBackButton';
import { operatorWindowController } from './SSL_operatorWindowController';
import { sharesData } from '../SSL_sharesData';
import { moneyTip } from './SSL_moneyTip';
import { SSL_UIManager } from '../Manage/SSL_UIManager';
import { SoundplayManager } from '../Manage/SSL_SoundplayManager';
const { ccclass, property } = _decorator;

@ccclass('sharesPageController')
export class sharesPageController extends pageController {


    sharesList: sharesListController = null;
    backButton: sharesPageBackButton = null;
    operatorwindown: operatorWindowController = null;
    tips : moneyTip = null;

    public override init(): void {
        super.init();

    }
    public override Enter(): void {
        this.sharesList.enterPage();
        this.backButton.comeTopage();
        super.Enter();
    }
    public override Exit(): void {
        super.Exit();
    }

    protected onLoad(): void {
        this.operatorwindown = this.node.getChildByName("operatorWindow").getComponent(operatorWindowController);
        // console.log(this.operatorwindown);
        this.tips = this.getComponentInChildren(moneyTip);
        this.sharesList = this.getComponentInChildren(sharesListController);
        this.backButton = this.getComponentInChildren(sharesPageBackButton);
    }

    toMain() {
        SSL_UIManager.instance.uiMachine.changePage(SSL_UIManager.instance.mainPageScript);
    }

    goTomain() {
        SoundplayManager.instance.playOnce("点击");
        this.sharesList.leavePage();
        this.backButton.leaveTopage();
        this.scheduleOnce(this.toMain, 0.4);
    }

    cilckSell(sharesdata : sharesData) {
        
        SoundplayManager.instance.playOnce("点击");
        this.operatorwindown.Openwindow(sharesdata, 0);
    }
    cilckBuy(sharesdata : sharesData) {
        
        SoundplayManager.instance.playOnce("点击");
        this.operatorwindown.Openwindow(sharesdata, 1);
    }

    tipComing(){
        this.tips.appear();
    }

}


