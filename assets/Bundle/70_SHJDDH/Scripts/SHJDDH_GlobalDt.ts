import { _decorator, AudioClip, Component, Node, SpriteFrame } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SHJDDH_GlobalDt')
export class SHJDDH_GlobalDt extends Component {

    @property([AudioClip])
    cilps:AudioClip[] = [];

    @property([SpriteFrame])
    bgs:SpriteFrame[] = [];

    //保存当前点击对象
    clickObject:number = 3;

    private static _instance: SHJDDH_GlobalDt = null;
    public static get Instance(): SHJDDH_GlobalDt {
        return this._instance
    }

    protected onLoad(): void {
        SHJDDH_GlobalDt._instance = this;
    }
    protected start(): void {
        GamePanel.Instance.time = 3600;

    }




}


