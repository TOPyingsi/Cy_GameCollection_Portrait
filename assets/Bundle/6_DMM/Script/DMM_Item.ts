import { _decorator, Component, Enum, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { DMM_ITEM } from './DMM_Constant';
import { DMM_GameManager } from './DMM_GameManager';
import { DMM_PrefsManager } from './DMM_PrefsManager';
import { DMM_PlayerController } from './DMM_PlayerController';
import { DMM_AudioManager, DMM_Audios } from './DMM_AudioManager';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { DMM_HintController } from './DMM_HintController';
import { DMM_EventManager, DMM_MyEvent } from './DMM_EventManager';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('DMM_Item')
export class DMM_Item extends Component {

    @property({ type: Enum(DMM_ITEM) })
    ItemType: DMM_ITEM = DMM_ITEM.ITEM1;

    @property(Node)
    Checked: Node = null;

    @property(Node)
    Unluck: Node = null;

    @property(Sprite)
    IconSprite: Sprite = null;

    @property(SpriteFrame)
    IconSF: SpriteFrame[] = [];

    @property
    Price: number = 0;

    @property(Label)
    PriceLabel: Label = null;

    private _isUnluck: boolean = true;
    private _isChecked: boolean = false;


    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_END, this.click, this);
    }

    protected start(): void {
        this.PriceLabel.string = this.Price.toString();
        this.show();
    }

    show() {
        this._isUnluck = DMM_PrefsManager.Instance.userData.HaveItem.indexOf(this.ItemType) == -1;
        this.Unluck.active = this._isUnluck;
        this._isChecked = DMM_PrefsManager.Instance.userData.CurItem == this.ItemType;
        this.Checked.active = this._isChecked;
        this.IconSprite.spriteFrame = this.IconSF[DMM_PrefsManager.Instance.userData.Gender];
        DMM_PlayerController.Instance.showPlayer();
    }

    click() {
        if (this._isUnluck) {
            if (DMM_PrefsManager.Instance.userData.Gold >= this.Price) {
                //购买
                DMM_AudioManager.PlaySound(DMM_Audios.Click);
                DMM_PrefsManager.Instance.userData.Gold -= this.Price;
                DMM_PrefsManager.Instance.userData.HaveItem.push(this.ItemType);
                DMM_PrefsManager.Instance.userData.CurItem = this.ItemType;
                DMM_PrefsManager.Instance.saveData();
                DMM_GameManager.Instance.showGold();
                DMM_EventManager.Scene.emit(DMM_MyEvent.DMM_SHOWITEM);
            } else {
                DMM_AudioManager.PlaySound(DMM_Audios.Forbid);
                BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], "Bundle/DMM_Prefabs/Hint").then((prefab: Prefab) => {
                    const node: Node = instantiate(prefab);
                    node.parent = DMM_GameManager.Instance.Canvas;
                    node.getComponent(DMM_HintController).showHint(`金币不足！`);
                })
            }
        } else {
            //选中
            DMM_AudioManager.PlaySound(DMM_Audios.Click);
            DMM_PrefsManager.Instance.userData.CurItem = this.ItemType;
            DMM_PrefsManager.Instance.saveData();
            DMM_EventManager.Scene.emit(DMM_MyEvent.DMM_SHOWITEM);
        }
    }

    protected onEnable(): void {
        DMM_EventManager.ON(DMM_MyEvent.DMM_SHOWITEM, this.show, this);
    }

    protected onDisable(): void {
        DMM_EventManager.OFF(DMM_MyEvent.DMM_SHOWITEM, this.show, this);
    }

}


