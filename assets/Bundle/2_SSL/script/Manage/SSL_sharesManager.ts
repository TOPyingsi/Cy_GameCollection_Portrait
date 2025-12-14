import { _decorator, Component, debug, director, instantiate, JsonAsset, Node, Prefab, resources } from 'cc';
import { sharesData } from '../SSL_sharesData';
import { sharesController } from '../sharesPage/SSL_sharesController';
import { PrefsManager } from './SSL_PrefsManager';
import { BundleManager } from 'db://assets/Scripts/Framework/Managers/BundleManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('sharesManager')
export class sharesManager extends Component {

    static Instance: sharesManager = null;

    @property(Prefab)
    sharesPrefab : Prefab;

    @property(Node)
    sharesParent : Node;

    sharescript : Map<string, sharesController> = new Map<string, sharesController>();

    protected onLoad(): void {
        sharesManager.Instance = this;
        BundleManager.LoadJson(GameManager.GameData.DefaultBundle, "data/sharesdata").then((res: JsonAsset) => {
            const data = res.json;
            for (let i = 0; i < data.length; i++) {
                const data = res.json;
                let e = data[i];
                let sharesdata;
                // console.log(PrefsManager.GetItem(e.company_name));
                if (PrefsManager.GetShares(e.company_name) != null) {
                    // console.log("F");
                    sharesdata = JSON.parse(PrefsManager.GetShares(e.company_name)) as sharesData;
                } else {
                    // console.log("T");
                    sharesdata = (new sharesData(e.company_name, e.previous_stock_price, e.current_stock_price, e.sharesChangeRage, e.changedeltaTime, 0));
                    PrefsManager.SetShares(e.company_name, sharesdata);
                }
                // console.log(sharesdata);
                let shares = instantiate(this.sharesPrefab);
                shares.setParent(this.sharesParent);
                this.sharescript.set(sharesdata.company_name, shares.getComponent(sharesController));
                this.sharescript.get(sharesdata.company_name).setData(sharesdata);
                this.sharescript.get(sharesdata.company_name).initShares();      
            }
        });
    }

    Refresh(changeNumber: number, sharesName: string) {
        // console.log(changeNumber);
        this.sharescript.get(sharesName).addHave(changeNumber);
        this.sharescript.get(sharesName).flashState_have();
        // console.log(this.sharescript.get(sharesName).data.sharesHave);
        PrefsManager.SetShares(sharesName, this.sharescript.get(sharesName).data);
    }

    protected onEnable(): void {
        director.getScene().on("operatorShares", this.Refresh, this);
    }


    protected onDisable(): void {
        director.getScene().off("operatorShares", this.Refresh, this);
    }

    reborn(){
        for (let [key, value] of this.sharescript) {
            value.data.sharesHave = 0;
            value.data.lastPrice = 0;
            value.flashState_have();
            value.flashState_price();
        }
    }

}


