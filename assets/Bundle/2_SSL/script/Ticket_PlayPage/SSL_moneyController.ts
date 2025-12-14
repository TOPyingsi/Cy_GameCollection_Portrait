import { _decorator, Component, Node, random, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('moneyController')
export class moneyController extends Component {

    public static Instance: moneyController = null;
    protected onLoad(): void {
        moneyController.Instance = this;
        
    }
    cash_List: Map<string, Sprite> = new Map();

    @property(Sprite)
    numberOfCash: Sprite = null;
    @property(Sprite)
    TrueOfCash: Sprite = null;

    @property(SpriteFrame)
    TruePic: SpriteFrame;
    @property(SpriteFrame)
    FalsePic: SpriteFrame;

    @property([SpriteFrame])
    spfs: SpriteFrame[] = [];
    @property(Number)
    arr: number[] = [];
    sp : Sprite = null;
    size : number = 6;
    currentnumber: number;

    static isReal: any;
    static currentnumber: any;

    onLoading() {
        this.sp = this.node.getComponent(Sprite);
        // console.log(idx);
        this.renew();
    }

    public renew() {
        let idx = Math.floor(Math.random() * 5); 
        this.numberOfCash.spriteFrame = this.spfs[idx];
        moneyController.currentnumber = this.arr[idx];
        moneyController.isReal = Math.round(Math.random());
        // moneyController.isReal = 1;
        if (moneyController.isReal == 1) {
            this.TrueOfCash.spriteFrame = this.TruePic;
        } else {
            this.TrueOfCash.spriteFrame = this.FalsePic;
        }
    }

    update(deltaTime: number) {

    }

    static getMoney() : number{
        if (moneyController.isReal == 1){
            // console.log(moneyController.currentnumber);
            return moneyController.currentnumber;
        }else{
            return 0;
        }
    }
}


