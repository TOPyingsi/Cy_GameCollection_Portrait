import { _decorator, Component, Details, JsonAsset, Label, math, Node, resources, tween, Vec2, Vec3 } from 'cc';
import { PrefsManager } from './SSL_PrefsManager';
import { SoundplayManager } from './SSL_SoundplayManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export default class PlayerManager extends Component {
    public static Instance: PlayerManager = null;

    protected onLoad(): void {
        PlayerManager.Instance = this;
    }
    Initcash: number = 0;
    Cashnum: number;
    cashLabel: Label;
    isChange: boolean = false;
    targetCash: number;

    public addMoney(num: number) {
        let posNum = this.Cashnum + num;
        this.changeMoney(posNum);
    }
    
    changeMoney(num: number) {
        SoundplayManager.instance.playOnce("金币获取", 100);
        // SoundplayManager.instance.setLoop("金币获取", true);
        this.isChange = true;
        this.targetCash = num;
    }

    getCash(): number {
        return PrefsManager.GetNumber("cash");
    }

    start() {
        this.cashLabel = this.getComponentInChildren(Label);
        if (PrefsManager.GetNumber("cash") == 0) {
            this.Cashnum = this.Initcash;
            this.fresh();
        } else {
            this.Cashnum = this.getCash();
            this.cashLabel.string = Math.round(this.Cashnum).toString();
        }

    }

    private fresh() {
        PrefsManager.SetNumber("cash", this.Cashnum);
        this.cashLabel.string = this.Cashnum.toString();
    }

    update(deltaTime: number) {
        if (this.isChange) {
            if (this.Cashnum == this.targetCash) {
                this.Cashnum = this.targetCash;
                this.isChange = false;
            } else {
                if (this.Cashnum > this.targetCash) {
                    // console.log("FUCK YOU");
                    this.Cashnum = Math.floor(math.lerp(this.Cashnum, this.targetCash, deltaTime / 5));
                    this.Cashnum = Math.round(this.Cashnum);
                } else if (this.Cashnum < this.targetCash){
                    this.Cashnum = Math.ceil(math.lerp(this.Cashnum, this.targetCash, deltaTime / 4));
                    this.Cashnum = Math.round(this.Cashnum);
                }
                this.fresh();
            }
        }
    }

    IsCashEnough(need : number) : boolean{
        // need = Math.max(0, need);
        if (need > this.Cashnum){
            return false;
        }else{
            this.addMoney(-need);
            return true;
        }
    }

    afterAd(){
        this.addMoney(1000);
    }
    reBurn(){
        this.changeMoney(500);
        
    }
}





