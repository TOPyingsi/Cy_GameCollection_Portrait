import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_Achievement')
export class GDDSCBASMR_Achievement extends Component {

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
        let fanLimit = GDDSCBASMR_DataManager.fanLevelNums[num];
        if (fanLimit == 0) this.fansLabel.string = "";
        else {
            if (fanLimit > 10000) this.fansLabel.string = `达到${fanLimit / 10000}万粉丝`;
            else this.fansLabel.string = `达到${fanLimit}粉丝`;
        }
        let name = GDDSCBASMR_DataManager.fanLevelNames[num];
        this.nameLabel.string = name;
        let fans = GDDSCBASMR_DataManager.Instance.getNumberData("Fans");
        this.achiSprite.spriteFrame = this.achiSfs[fans >= fanLimit ? 0 : 1];
        this.jbSprite.spriteFrame = this.jbSfs[fans >= fanLimit ? 0 : 1];
    }

}