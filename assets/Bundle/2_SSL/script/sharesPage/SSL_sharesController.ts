import { _decorator, Component, director, game, Label, Node, Sprite, SpriteFrame } from 'cc';
import { sharesData } from '../SSL_sharesData';
import { PrefsManager } from '../Manage/SSL_PrefsManager';
const { ccclass, property } = _decorator;

@ccclass('sharesController')
export class sharesController extends Component {


    data: sharesData = null;
    @property(Label)
    sharesName: Label = new Label();

    @property(Sprite)
    sp: Sprite = new Sprite();

    @property([SpriteFrame])
    trendPics: SpriteFrame[] = [];

    currentPrice: Label = new Label();
    lastPrice: Label = new Label();
    currentHave: Label = new Label();


    setData(_data: sharesData) {
        this.data = _data;
    }

    protected onLoad(): void {
        this.currentPrice = this.node.getChildByName("currentPrice").getComponent(Label);
        this.lastPrice = this.node.getChildByName("LastPrice").getComponent(Label);
        this.currentHave = this.node.getChildByName("currentHave").getComponent(Label);
    }

    initShares() {
        this.sharesName.string = this.data.company_name.toString();
        this.currentPrice.string = "当前所需：" + (this.data.currentPrice.toString());
        // console.log()
        this.currentHave.string = "持有：" + this.data.sharesHave;
        this.lastPrice.string = "收益：" + this.data.lastPrice.toString();
    }

    flashState_price() {
        let trendState = Math.round(Math.random());
        this.sp.spriteFrame = this.trendPics[trendState];
        this.data.currentPrice = Math.round(this.data.currentPrice * (1 + (trendState ? -1 : 1) * this.data.sharesChangeRage));
        this.currentPrice.string = "当前所需：" + this.data.currentPrice.toString();
        this.lastPrice.string = "收益：" + (this.data.lastPrice + this.data.sharesHave * this.data.currentPrice).toString();
        PrefsManager.SetShares(this.data.company_name, this.data);
    }
    
    flashState_have() {
        this.currentHave.string = "持有：" + this.data.sharesHave;
        this.lastPrice.string = "收益：" + (this.data.lastPrice + this.data.sharesHave * this.data.currentPrice).toString();
        PrefsManager.SetShares(this.data.company_name, this.data);
    }

    addHave(num : number){
        this.data.sharesHave += num;
        this.data.lastPrice -= num * this.data.currentPrice;
        this.flashState_have();
    }

    Lastflash : number = 0;
    flash_deltaTime : number = 60 * 3 * 60;
    protected start(): void {
    }
    protected update(dt: number): void {
        if (game.totalTime - this.Lastflash > this.flash_deltaTime){
            this.flashState_price();
            this.Lastflash = game.totalTime;
        }
        
    }
}


