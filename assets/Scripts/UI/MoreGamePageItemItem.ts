import { _decorator, Component, director, Label, Node, resources, Sprite, SpriteFrame, Vec3 } from 'cc';
import { GameData } from '../../Scripts/Framework/Managers/DataManager';
import NodeUtil from '../Framework/Utils/NodeUtil';
import { ResourceUtil } from '../Framework/Utils/ResourceUtil';
import { AudioManager, Audios } from '../Framework/Managers/AudioManager';
import Banner from '../Banner';
const { ccclass, property } = _decorator;

@ccclass('MoreGamePageItemItem')
export class MoreGamePageItemItem extends Component {

    Icon: Sprite = null;
    Label: Label = null;
    Lock: Node = null;
    Pass: Node = null;

    data: GameData = null;

    cb: Function = null;

    protected onLoad(): void {
        this.Icon = NodeUtil.GetComponent("Icon", this.node, Sprite);
        this.Label = NodeUtil.GetComponent("Label", this.node, Label);
        this.Lock = NodeUtil.GetNode("Lock", this.node);
        this.Pass = NodeUtil.GetNode("Pass", this.node);
    }

    Init(data: GameData, cb: Function) {
        this.data = data;
        this.cb = cb;
        this.Label.string = `${data.gameName}`;

        this.Refresh();
        ResourceUtil.Load(`Sprites/GameIcons/${data.gameName}/spriteFrame`, SpriteFrame, (err: any, spriteFrame: SpriteFrame) => {
            if (spriteFrame) this.Icon.spriteFrame = spriteFrame;
            else this.Label.node.active = true;
        });
    }

    Refresh() {
        this.Lock.active = !this.data.Unlock;
        this.Pass.active = this.data.Pass;
    }

    OnButtonClick(event) {
        AudioManager.Instance.PlayCommonSFX(Audios.ButtonClick);

        if (this.data.Unlock) {
            this.cb && this.cb(this.data);
        } else {
            Banner.Instance.ShowVideoAd(() => {
                this.data.Unlock = true;
                this.cb && this.cb(this.data);
            });
        }
    }
}