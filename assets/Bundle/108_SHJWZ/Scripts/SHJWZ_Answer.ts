import { _decorator, Component, Node, Sprite, UITransform } from 'cc';
import { SHJWZ_GameMgr } from './SHJWZ_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('SHJWZ_Answer')
export class SHJWZ_Answer extends Component {

    private answerSprite: Sprite = null;
    protected onEnable(): void {
        if (!this.answerSprite) {
            this.answerSprite = this.getComponent(Sprite);
        }

        let index = SHJWZ_GameMgr.instance.curID;

        switch (index) {
            case 2:
                this.answerSprite.getComponent(UITransform).width = 450;
                this.answerSprite.getComponent(UITransform).height = 850;
                break;
            case 0:
            case 6:
                this.answerSprite.getComponent(UITransform).width = 750;
                this.answerSprite.getComponent(UITransform).height = 850;
                break;
            case 10:
            case 11:
                this.answerSprite.getComponent(UITransform).width = 450;
                this.answerSprite.getComponent(UITransform).height = 950;
                break;
            default:
                this.answerSprite.getComponent(UITransform).width = 750;
                this.answerSprite.getComponent(UITransform).height = 950;
                break;
        }

        let sptiteFrame = SHJWZ_GameMgr.instance.rightSprite[index];
        this.answerSprite.spriteFrame = sptiteFrame;
    }

}


