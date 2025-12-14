import { _decorator, Component, Node, sp, Sprite, SpriteFrame, tween, UITransform, v3 } from 'cc';
import { ZHSHJ_GameManager } from './ZHSHJ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('ZHSHJ_Change')
export class ZHSHJ_Change extends Component {

    private _targetID: number = 0;

    public get targetID(): number {
        return this._targetID;
    }
    public set targetID(id: number) {
        this._targetID = id;
    }
    //private _skeleton: sp.Skeleton = null;

    start() {
        //this._skeleton = this.node.getComponent(sp.Skeleton);
        this.idle(1);
    }

    update(deltaTime: number) {

    }

    idle(sign: number) {
        tween(this.node).by(1, { scale: v3(0, 0.05 * sign, 0) })
            .call(() => {
                sign = -sign;
                this.idle(sign);
            })
            .start();
    }

    isWin: boolean = false;
    public changeSk() {
        ZHSHJ_GameManager.Instance.winUI(this.targetID, true);

        let spriteFrame: SpriteFrame = ZHSHJ_GameManager.Instance.winSprites[this._targetID];
        let sprite = this.node.getComponent(Sprite);
        let x = spriteFrame.width;
        let y = spriteFrame.height;
        let spriteUITransform = sprite.getComponent(UITransform);
        spriteUITransform.width = x;
        spriteUITransform.height = y;

        sprite.spriteFrame = spriteFrame;
        //播放通关音效
        ZHSHJ_GameManager.Instance.playWinAudio(this._targetID);
        this.scheduleOnce(() => {
            ZHSHJ_GameManager.Instance.win(this._targetID);

            //ZHSHJ_GameManager.Instance.rightNode.active = false;
        }, 2.8);

        // this.PlayAinimation("motion", () => {
        //     this.PlayAinimation("thin", () => {
        //         if (this.isWin) {
        //             return;
        //         }
        //         ZHSHJ_GameManager.Instance.win(this._targetID);
        //         this.isWin = true;

        //     }, true);

        // });
    }

    // PlayAinimation(animationName: string, callBack: Function, isloop: boolean = false) {
    //     this._skeleton.setCompleteListener(null);
    //     this._skeleton.setAnimation(0, animationName, isloop);
    //     this._skeleton.setCompleteListener(() => {
    //         if (callBack) {
    //             callBack();
    //         }
    //     });
    // }
}