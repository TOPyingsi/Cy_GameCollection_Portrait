import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SNDMX_StateControl')
export class SNDMX_StateControl extends Component{
    private static _instance:SNDMX_StateControl = null;
    public static getInstance():SNDMX_StateControl{
   
        return this._instance;
    }
    protected onLoad(): void {
        SNDMX_StateControl._instance = this;
    }

    public StrategyNum:number;

    public doorOpen:boolean = false;
    public win:number = 0;
    public openDorr:boolean = false;
    private wipeFace:boolean = false;
    //胜利条件doorOpen = true && win=8


    //失败条件doorOpen =true  &&  win<8
    
}


