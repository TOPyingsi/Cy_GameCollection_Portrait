import { _decorator, Component, Node, Vec2, Event, EventTouch, math, lerp, Vec3, UITransform, Sprite, color, Details, debug, Prefab, director } from 'cc';
import { down_page } from './SSL_down_page';
import { up_page } from './SSL_up_page';
import { maskController } from './SSL_maskController';
import { maskPicController } from './SSL_maskPicController';
import PlayerManager from '../Manage/SSL_PlayerManager';
import { moneyController } from './SSL_moneyController';
import { oneMore } from './SSL_oneMore';
import { pageController } from '../SSL_pageController';
import { backButtonController } from './SSL_backButtonController';
import { PricelableController } from './SSL_PricelableController';
import { SSL_UIManager } from '../Manage/SSL_UIManager';
import { TicketController } from './SSL_TicketController';
import { SoundplayManager } from '../Manage/SSL_SoundplayManager';
import { gameOverController } from './SSL_gameOverController';
const { ccclass, property } = _decorator;

@ccclass('Ticket_paly_pageController')
export class Ticket_paly_pageController extends pageController {

    ticket_down_page: down_page = null;
    ticket_up_page: up_page = null;
    mask: maskController = null;
    maskpic: maskPicController = null;
    oneMoresp: oneMore = null;
    backButton: backButtonController = null;
    pricelable: PricelableController = null;
    ticket: TicketController = null;
    gameOver : gameOverController = null;

    Uppage_Uitf: UITransform = null;
    mask_Uitf: UITransform = null;
    maskPic_Uitf: UITransform = null;
    maskPic_sp: Sprite = null;


    currentFinish: boolean = false;
    isAdding: boolean = false;
    isTouching: boolean = false;
    isTicketOpening: boolean = false;
    StartTouchingPosition: Vec2 = new Vec2();
    endTouchingPosition: Vec2 = new Vec2();
    TouchingDistance: number = 0;
    finalnumber: number = 0;

    public override init(): void {
        super.init();
    }
    public override Enter(): void {
        super.Enter();
        this.ticket.node.position = this.ticket.gamePos;
        this.flashTicket();
        this.pricelable.setLable(this.ticket.currentPrice[this.ticket.currentidx]);
        PlayerManager.Instance.addMoney(-this.ticket.currentPrice[this.ticket.currentidx]); // 彩票价格
        // this.Renew();
    }
    public override Exit(): void {
        super.Exit();
    }

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_START, this.TOUCHSTART, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.on(Node.EventType.TOUCH_END, this.TOUCH_END, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this);
        director.getScene().on("Renew", this.Renew, this);
        director.getScene().on("Reborn", this.Reborn, this);
        director.getScene().on("backToMain", this.backToMainPage, this);
    }

    start() {
        this.mask = this.node.getComponentInChildren(maskController);
        this.maskpic = this.node.getComponentInChildren(maskPicController);
        this.maskPic_Uitf = this.maskpic.getComponentInChildren(UITransform);
        this.maskPic_sp = this.maskPic_Uitf.node.getComponent(Sprite);
        this.mask_Uitf = this.mask.node.getComponent(UITransform);
        this.ticket_down_page = this.node.getComponentInChildren(down_page);
        this.ticket_up_page = this.node.getComponentInChildren(up_page);
        this.Uppage_Uitf = this.ticket_up_page.node.getComponent(UITransform);
        this.oneMoresp = this.node.getComponentInChildren(oneMore);
        this.backButton = this.node.getComponentInChildren(backButtonController);
        this.pricelable = this.node.getComponentInChildren(PricelableController);
        this.ticket = this.node.getComponentInChildren(TicketController);
        this.gameOver = this.node.getComponentInChildren(gameOverController);
        this.ticket.Entering();
        this.maskpic.node.setScale(new Vec3(0, 0, 0));
        moneyController.Instance.renew();
    }
    TOUCHSTART(event: EventTouch) {
        if (this.isTicketOpening == true) {
            return;
        }
        // SoundplayManager.instance.setLoop("彩票按住", true);
        SoundplayManager.instance.playBGM("彩票按住");
        this.isTouching = true;
        this.StartTouchingPosition = event.getUILocation();
        this.startOpening();
    }

    TOUCH_MOVE(event: EventTouch) {
        if (this.isTicketOpening == true) {
            return;
        }
        SoundplayManager.instance.stopBGM("彩票按住");
        this.isTouching = true;
        let dis = Math.abs(this.StartTouchingPosition.x - event.getUILocation().x) / 2;
        // console.log(dis);
        let change = math.clamp(dis, 0, this.Uppage_Uitf.width + 20);
        // console.log(change);
        this.mask_Uitf.width += change;
        // console.log(this.mask_Uitf.width);
        this.maskpic.node.setPosition(this.mask.node.position.x + this.mask_Uitf.width + 25, this.mask.node.position.y, 0);
    }

    TOUCH_END(event: EventTouch) {
        SoundplayManager.instance.stopBGM("彩票按住");
        this.isTouching = false;
    }

    public Renew(){
        
        SoundplayManager.instance.playOnce("点击");
        this.ticket.Leaving();

        PlayerManager.Instance.addMoney(-this.ticket.currentPrice[this.ticket.currentidx]); // 彩票价格
        
        this.scheduleOnce(this.flashTicket, 0.3);
        this.scheduleOnce(this.ticketEnter, 0.3);
    }

    private flashTicket() {
        this.maskpic.node.setScale(new Vec3(0, 0, 0));
        this.mask_Uitf.width = 0;
        this.currentFinish = false;
        this.isAdding = false;
        this.isTouching = false;
        this.isTicketOpening = false;
        this.StartTouchingPosition = new Vec2();
        this.endTouchingPosition = new Vec2();
        this.TouchingDistance = 0;
        this.finalnumber = 0;
        this.backButton.leaveTopage();
        this.pricelable.leaveTopage();
        moneyController.Instance.renew();
    }

    ticketEnter(){
        this.ticket.Entering();
    }


    startOpening() {
        this.maskpic.node.setScale(new Vec3(1.05, 1.05, 0));
        this.maskPic_sp.color = color(255, 255, 255, 255);
        this.mask_Uitf.width = 50;
        this.maskpic.node.setPosition(this.mask.node.position.x + 25, this.mask.node.position.y, 0);
    }

    update(deltaTime: number) {

        if (this.mask_Uitf.width >= this.Uppage_Uitf.width) {
            this.isTicketOpening = true;
            this.maskPic_sp.color = color(255, 255, 255, math.lerp(this.maskPic_sp.color.a, 0, deltaTime));
        }
        if (this.isTicketOpening && this.currentFinish == false && !this.isAdding) {
            // console.log(this.ticket.currentidx);
            // console.log((this.ticket.currentidx == 0 ? 1 : 20));
            this.finalnumber = (moneyController.getMoney() * (this.ticket.currentidx == 0 ? 1 : 20) + PlayerManager.Instance.Cashnum);
            this.isAdding = true;
            SoundplayManager.instance.playOnce("彩票撕开", 100);
        }
        if (this.isAdding){
            if (this.finalnumber != PlayerManager.Instance.Cashnum){
                PlayerManager.Instance.changeMoney(this.finalnumber);
            }else{
                this.isAdding = false;
                this.currentFinish = true;
                this.oneMoresp.AppearButton();
                this.backButton.comeTopage();
                this.pricelable.comeTopage();
            }
        }
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.TOUCHSTART, this);
        this.node.off(Node.EventType.TOUCH_END, this.TOUCH_END, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        director.getScene().off("Renew", this.Renew, this);
        director.getScene().off("Reborn", this.Reborn, this);
        director.getScene().off("backToMain", this.backToMainPage, this);
    }

    toMain(){
        SSL_UIManager.instance.uiMachine.changePage(SSL_UIManager.instance.mainPageScript);
    }

    public backToMainPage(){
        SoundplayManager.instance.playOnce("点击");
        this.backButton.leaveTopage();
        this.oneMoresp.DisappearButton();
        this.pricelable.leaveTopage();
        this.ticket.Leaving();
        this.scheduleOnce(this.toMain, 0.4);
    }
    Reborn(){
        this.gameOver.windownsComeIn();

    }

}


