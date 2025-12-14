import { _decorator, Component, director, EventTouch, Label, Node, tween, Tween, v3 } from 'cc';
import { XCJZ_GameData } from './XCJZ_GameData';
import Banner from 'db://assets/Scripts/Banner';
import { XCJZ_MenuManager } from './XCJZ_MenuManager';
const { ccclass, property } = _decorator;

@ccclass('XCJZ_GameWinWindow')
export class XCJZ_GameWinWindow extends Component {

    @property(Node)
    Pointer: Node = null;

    @property(Label)
    Award_Pointer: Label = null;
    @property(Label)
    Award_Normal: Label = null;
    @property(Label)
    Award_Video: Label = null;

    @property(Node)
    Stars: Node[] = [];

    @property(Node)
    Buttons: Node[] = [];

    private _awardCount: number = 0;
    private _awardMultiple: number = 1;
    private _angle_z: number = 0;

    Show(count: number) {
        this.node.active = true;
        for (let i = 0; i < this.Stars.length; i++) {
            this.Stars[i].active = i < count;
        }

        this._awardCount = 50 * count;
        this.ShowPointer();
    }

    protected update(dt: number): void {
        this._angle_z = this.Pointer.eulerAngles.z
        this.ShowAward();
    }

    OnButtonClick(event: EventTouch) {
        switch (event.getCurrentTarget().name) {
            case "WinWindow":
                Tween.stopAllByTarget(this.Pointer);
                this.Buttons.forEach(button => {
                    button.active = true;
                });
                break;
            case "领取":
                XCJZ_GameData.Instance.ChangeDiamond(this._awardCount);
                director.loadScene("XCJZ_Menu", () => {
                    XCJZ_MenuManager.Instance.ShowLoading(() => {
                        XCJZ_MenuManager.Instance.CloseWindow();
                    });
                });
                break;
            case "双倍领取":
                Banner.Instance.ShowVideoAd(() => {
                    XCJZ_GameData.Instance.ChangeDiamond(this._awardCount * this._awardMultiple);
                    director.loadScene("XCJZ_Menu", () => {
                        XCJZ_MenuManager.Instance.ShowLoading(() => {
                            XCJZ_MenuManager.Instance.CloseWindow();
                        });
                    });
                })
                break;
        }
    }

    ShowPointer() {
        this.Pointer.active = true;
        Tween.stopAllByTarget(this.Pointer);
        tween(this.Pointer)
            .to(1, { eulerAngles: v3(0, 0, -88) }, { easing: "sineInOut" })
            .to(1, { eulerAngles: v3(0, 0, 88) }, { easing: "sineInOut" })
            .union()
            .repeatForever()
            .start();
    }

    ShowAward() {
        if (this._angle_z < -65) {
            this._awardMultiple = 5;
        } else if (this._angle_z < -30) {
            this._awardMultiple = 4;
        } else if (this._angle_z < 30) {
            this._awardMultiple = 3;
        } else {
            this._awardMultiple = 2;
        }
        this.Award_Normal.string = this._awardCount.toString();
        this.Award_Pointer.string = (this._awardCount * this._awardMultiple).toString();
        this.Award_Video.string = (this._awardCount * this._awardMultiple).toString();
    }
}


