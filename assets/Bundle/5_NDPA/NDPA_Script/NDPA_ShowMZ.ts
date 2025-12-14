import { _decorator, Component, error, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { NDPA_EventManager, NDPA_MyEvent } from './NDPA_EventManager';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('NDPA_ShowMZ')
export class NDPA_ShowMZ extends Component {

    MZSprite: Sprite = null;
    NormalSF: SpriteFrame = null;

    protected onLoad(): void {
        this.MZSprite = this.node.getChildByName("帽子").getComponent(Sprite);
        this.NormalSF = this.MZSprite.spriteFrame;
    }

    showMZ(path: string) {
        BundleManager.LoadSpriteFrame(GameManager.GameData.DefaultBundle, path).then((sf: SpriteFrame) => {
            this.MZSprite.spriteFrame = sf;
        })
    }

    protected onEnable(): void {
        NDPA_EventManager.ON(NDPA_MyEvent.NDPA_SHOWMZ, this.showMZ, this);
    }

    protected onDisable(): void {
        NDPA_EventManager.OFF(NDPA_MyEvent.NDPA_SHOWMZ, this.showMZ, this);
    }
}


