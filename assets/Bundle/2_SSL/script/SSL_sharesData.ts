import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

// @ccclass('sharesData')
export class sharesData{
    company_name : string;
    lastPrice : number;
    currentPrice : number;
    sharesChangeRage : number;
    changeDeltaTime : number;
    sharesHave : number;

    constructor(_name : string, _lastPrice : number, _currentPrice : number, _sharesChangeRage : number, _change_DeltaTime : number, _currentHave : number){
        this.company_name = _name;
        this.lastPrice = _lastPrice;
        this.currentPrice = _currentPrice;
        this.sharesChangeRage = _sharesChangeRage;
        this.changeDeltaTime = _change_DeltaTime;
        this.sharesHave = _currentHave;
    }
}


