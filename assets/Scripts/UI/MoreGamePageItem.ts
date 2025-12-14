import { _decorator, Component, director, Label, Node, resources, size, Sprite, SpriteFrame, Tween, tween, UITransform, v3, Vec3 } from 'cc';
import { GameData } from '../../Scripts/Framework/Managers/DataManager';
import { PoolManager } from '../Framework/Managers/PoolManager';
import { GameManager } from '../GameManager';
import { Panel, UIManager } from '../Framework/Managers/UIManager';
import { MoreGamePageItemItem } from './MoreGamePageItemItem';
const { ccclass, property } = _decorator;

@ccclass('MoreGamePageItem')
export class MoreGamePageItem extends Component {

    items: MoreGamePageItemItem[] = [];
    data: GameData[] = [];

    Init(data: GameData[]) {
        this.data = data;
        this.items = [];

        for (let i = 0; i < this.node.children.length; i++) {
            let node = this.node.children[i];
            node.active = true;
            if (i >= data.length) {
                node.active = false;
                continue;
            }

            let item = node.getComponent(MoreGamePageItemItem);
            item.Init(data[i], this.MoreGameItemCallback.bind(this));
            this.items.push(item);
        }
    }

    ResetScale() {
        this.node.active = true;
        for (let i = 0; i < this.items.length; i++) {
            let node = this.items[i].node;
            node.setScale(0.9, 0.9, 0.9);
        }
    }

    ShowItems(active: boolean) {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].node.active = active;
        }
    }

    RefreshPage() {
        this.ResetScale();
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].Refresh()
            let node = this.items[i].node;
            this.scheduleOnce(() => {
                tween(node)
                    .to(0.3, { scale: Vec3.ONE }, { easing: "backOut" }).call(() => {
                        Tween.stopAllByTarget(node);
                        node.setScale(Vec3.ONE);
                    })
                    .start();
            }, 0.05 * node.getSiblingIndex())
        }
    }

    MoreGameItemCallback(data: GameData) {
        if (GameManager.AP > 0) {
            UIManager.HidePanel(Panel.MoreGamePagePanel);
            GameManager.Instance.LoadGame(data);
        } else {
            UIManager.ShowPanel(Panel.AddApPanel);
        }
    }
}