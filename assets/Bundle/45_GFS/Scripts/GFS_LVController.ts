import { _decorator, Component, find, Label, Node, Prefab, Rect, Sprite, SpriteFrame, tween, UIOpacity, UITransform } from 'cc';
import { GFS_NZ } from './GFS_NZ';
import { GFS_TouchController } from './GFS_TouchController';
import { GFS_Item } from './GFS_Item';
import { GamePanel } from '../../../Scripts/UI/Panel/GamePanel';
import { GFS_GAME } from './GFS_Constant';
const { ccclass, property } = _decorator;

@ccclass('GFS_LVController')
export class GFS_LVController extends Component {

    public static Instance: GFS_LVController = null;

    @property(SpriteFrame)
    SFs: SpriteFrame[] = [];

    @property(Prefab)
    Answer: Prefab = null;

    Items: GFS_Item[] = [];
    XD: Node = null;

    BG: Sprite = null;
    MaskUIOpacity: UIOpacity
    TipsNode: Node = null;
    TipsLabel: Label = null;

    BlackDogItem: GFS_Item = null;
    private _index: number = 0;

    protected onLoad(): void {
        GFS_LVController.Instance = this;

        GamePanel.Instance.answerPrefab = this.Answer;

        this.XD = find("小刀", this.node);
        this.BG = find("背景", this.node).getComponent(Sprite);
        this.MaskUIOpacity = find("Mask", this.node).getComponent(UIOpacity);
        this.TipsNode = find("Tips", this.node);
        this.TipsLabel = find("Tips/Tips", this.node).getComponent(Label);
    }

    switchBG() {
        tween(this.MaskUIOpacity)
            .to(1, { opacity: 255 }, { easing: `sineIn` })
            .call(() => {
                GFS_NZ.Instance.initPos();
                this.BG.spriteFrame = this.SFs[1];
                this.XD.active = true;
            })
            .to(1, { opacity: 0 }, { easing: `sineIn` })
            .call(() => {
                this.nextWave();
            })
            .start();
    }

    gameOver() {
        let game: GFS_GAME = GFS_GAME.胜利
        if (GFS_NZ.Instance.NGNumber > 0) {
            game = GFS_GAME.失败;
        }

        tween(this.MaskUIOpacity)
            .to(1, { opacity: 255 }, { easing: `sineIn` })
            .call(() => {
                GFS_NZ.Instance.initPos();
                if (game == GFS_GAME.失败) {
                    this.BG.spriteFrame = this.SFs[0];
                } else if (game == GFS_GAME.胜利) {
                    this.BG.spriteFrame = this.SFs[2];
                }
                GFS_TouchController.Instance.IsTouch = false;
                this.XD.active = false;
            })
            .to(1, { opacity: 0 }, { easing: `sineIn` })
            .call(() => {
                if (game == GFS_GAME.失败) {
                    GFS_NZ.Instance.gameFail();
                } else if (game == GFS_GAME.胜利) {
                    GFS_NZ.Instance.gameWin();
                }
            })
            .start();
    }

    showTips(tips: string, time: number = 4) {
        this.TipsNode.active = true;
        this.TipsLabel.string = tips;
        this.scheduleOnce(() => {
            this.TipsNode.active = false;
            this.nextWave();
        }, time);
    }

    showWinTips() {
        this.TipsNode.active = true;
        this.TipsLabel.string = `还好平时鬼片看的多！`;
        this.scheduleOnce(() => {
            this.TipsNode.active = false;
            this.scheduleOnce(() => {
                GamePanel.Instance.winStr = `太棒了！你就是最强梗王！`
                GamePanel.Instance.Win();
            }, 1);
        }, 2);
    }

    nextWave() {
        if (this._index >= this.Items.length) {
            this.gameOver();
            return;
        }
        GFS_TouchController.Instance.IsTouch = true;
        GFS_NZ.Instance.showSF();
        this.Items[this._index++].init();
    }

    getBlackDogBoundingBoxToWorld(): Rect | null {
        if (this.BlackDogItem.BlackDog && this.BlackDogItem.BlackDog.active) return this.BlackDogItem.BlackDog.getComponent(UITransform).getBoundingBoxToWorld();
        return null;
    }

}


