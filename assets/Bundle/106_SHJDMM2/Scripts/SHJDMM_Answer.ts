import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { SHJDMM_GameMgr } from './SHJDMM_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('SHJDMM_Answer')
export class SHJDMM_Answer extends Component {
    @property(SpriteFrame)
    answerSpriteFrame1: SpriteFrame = null;

    @property(SpriteFrame)
    answerSpriteFrame2: SpriteFrame = null;

    sprite: Sprite = null;
    label: Label = null;

    protected onEnable(): void {
        if (!this.sprite) {
            this.sprite = this.getComponentInChildren(Sprite);
            this.label = this.getComponentInChildren(Label);
        }

        switch (SHJDMM_GameMgr.instance.level) {
            case 0:
                this.sprite.spriteFrame = this.answerSpriteFrame1;
                this.label.string = "将人物拖到如图所示位置";
                break;
            case 1:
                this.sprite.spriteFrame = this.answerSpriteFrame2;
                this.label.string = "双击人物更换姿势,并将人物拖到如图所示位置";
                break;
        }
    }

}


