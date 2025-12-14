import { _decorator, Component, director, Node, Tween, tween, v3, Vec3 } from 'cc';
import { DMM_AudioManager, DMM_Audios } from './DMM_AudioManager';
import { DMM_SettlePanel } from './DMM_SettlePanel';
import Banner from '../../../Scripts/Banner';
const { ccclass, property } = _decorator;

const minX: number = -275;
const maxX: number = 275;

@ccclass('DMM_Multiple')
export class DMM_Multiple extends Component {
    @property(Node)
    Arrows: Node = null;

    @property({ type: Number })
    Dis: number[] = [];

    private _arrowsPos: Vec3 = Vec3.ZERO;

    protected onLoad(): void {
        this._arrowsPos = this.Arrows.getPosition().clone();
    }

    protected start(): void {
        this.move();
    }

    move() {
        tween(this.Arrows)
            .to(2, { position: v3(maxX, this._arrowsPos.y, this._arrowsPos.z) }, { easing: `quadInOut` })
            .to(2, { position: v3(minX, this._arrowsPos.y, this._arrowsPos.z) }, { easing: `quadInOut` })
            .union()
            .repeatForever()
            .start();
    }

    click() {
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        Banner.Instance.ShowVideoAd(() => {
            DMM_AudioManager.PlaySound(DMM_Audios.BankNote);
            Tween.stopAllByTarget(this.Arrows);
            const curDis: number = Math.abs(this.Arrows.getPosition().clone().x);
            if (curDis <= this.Dis[0]) {
                DMM_SettlePanel.Instance.Multiple = 5;
            } else if (curDis <= this.Dis[1]) {
                DMM_SettlePanel.Instance.Multiple = 4;
            } else if (curDis <= this.Dis[2]) {
                DMM_SettlePanel.Instance.Multiple = 3;
            } else {
                DMM_SettlePanel.Instance.Multiple = 2;
            }
            DMM_SettlePanel.Instance.getAward();
        })

    }

    click2() {
        DMM_AudioManager.PlaySound(DMM_Audios.BankNote);
        DMM_SettlePanel.Instance.Multiple = 1;
        DMM_SettlePanel.Instance.getAward();
    }

}
