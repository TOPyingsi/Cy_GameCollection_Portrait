import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { THLCB_DataManager } from './THLCB_DataManager';
const { ccclass, property } = _decorator;

@ccclass('THLCB_Achievement')
export class THLCB_Achievement extends Component {

    @property(Label)
    fansLabel: Label;

    @property(Label)
    nameLabel: Label;

    @property(Sprite)
    achiSprite: Sprite;

    @property(Sprite)
    jbSprite: Sprite;

    @property([SpriteFrame])
    achiSfs: SpriteFrame[] = [];

    @property([SpriteFrame])
    jbSfs: SpriteFrame[] = [];

    _Init(num: number) {
        let fanLimit = THLCB_DataManager.fanLevelNums[num];
        if (fanLimit == 0) this.fansLabel.string = "";
        else {
            if (fanLimit > 10000) this.fansLabel.string = `达到${fanLimit / 10000}万粉丝`;
            else this.fansLabel.string = `达到${fanLimit}粉丝`;
        }
        let name = THLCB_DataManager.fanLevelNames[num];
        this.nameLabel.string = name;
        let fans = THLCB_DataManager.Instance.getNumberData("Fans");
        this.achiSprite.spriteFrame = this.achiSfs[fans >= fanLimit ? 0 : 1];
        this.jbSprite.spriteFrame = this.jbSfs[fans >= fanLimit ? 0 : 1];
    }

}