import { _decorator, Component, Enum, Label, Node, Sprite, SpriteFrame } from 'cc';
import { NDPA_PROPTYPE } from './NDPA_GameConstant';
import { NDPA_EventManager, NDPA_MyEvent } from './NDPA_EventManager';
import { NDPA_PrefsManager } from './NDPA_PrefsManager';
import { NDPA_GameUtil } from './NDPA_GameUtil';
const { ccclass, property } = _decorator;

@ccclass('NDPA_Prop')
export class NDPA_Prop extends Component {

    @property({ type: Enum(NDPA_PROPTYPE) })
    PropType: NDPA_PROPTYPE = NDPA_PROPTYPE.TIPS;

    @property({ type: SpriteFrame })
    HaveSF: SpriteFrame = null;

    @property({ type: SpriteFrame })
    NoSF: SpriteFrame = null;

    @property({ type: SpriteFrame })
    HaveIconSF: SpriteFrame = null;

    @property({ type: SpriteFrame })
    NoIconSF: SpriteFrame = null;

    @property({ type: Node })
    PropNum: Node = null;

    @property({ type: Label })
    Num: Label = null;

    @property({ type: Sprite })
    BtnSprite: Sprite = null;

    @property({ type: Sprite })
    IconSprite: Sprite = null;

    isClick: boolean = false;

    protected start(): void {
        this.show();
    }

    show() {
        if (NDPA_PrefsManager.Instance.userData[NDPA_GameUtil.GetEnumKeyByValue(NDPA_PROPTYPE, this.PropType)] <= 0) {
            this.BtnSprite.spriteFrame = this.NoSF;
            this.IconSprite.spriteFrame = this.NoIconSF;
            this.PropNum.active = false;
            this.isClick = false;
        } else {
            this.BtnSprite.spriteFrame = this.HaveSF;
            this.IconSprite.spriteFrame = this.HaveIconSF;
            this.PropNum.active = true;
            this.Num.string = String(NDPA_PrefsManager.Instance.userData[NDPA_GameUtil.GetEnumKeyByValue(NDPA_PROPTYPE, this.PropType)]);
            this.isClick = true;
        }
    }

    use() {
        NDPA_PrefsManager.Instance.userData[NDPA_GameUtil.GetEnumKeyByValue(NDPA_PROPTYPE, this.PropType)]--;
        NDPA_PrefsManager.Instance.saveData();
        this.show();
    }

    protected onEnable(): void {
        NDPA_EventManager.ON(NDPA_MyEvent.NDPA_SHOWPROP, this.show, this);
    }

}


