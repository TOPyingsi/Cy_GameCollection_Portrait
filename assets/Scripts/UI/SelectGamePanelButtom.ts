import { _decorator, Component, Label, Node, resources, Skeleton, sp, Sprite, SpriteFrame } from 'cc';
import { Panel, UIManager } from '../Framework/Managers/UIManager';
import { DataManager, GameData } from '../Framework/Managers/DataManager';
import { MoreGamePagePanel } from './Panel/MoreGamePagePanel';
import { Tools } from '../Framework/Utils/Tools';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('SelectGamePanelButtom')
export class SelectGamePanelButtom extends Component {

    public GameData: GameData[] = [];

    start() {
    }

    public Init(Name: string) {
        resources.load(`Sprites/SelectButtom/${Name}/1`, sp.SkeletonData, (err: any, SkeletonData: sp.SkeletonData) => {
            if (err) {
                console.log("没有找到菜单图片" + Name);
                return;
            }
            this.node.getChildByPath("Mask/Sp").getComponent(sp.Skeleton).skeletonData = SkeletonData;
            this.node.getChildByPath("Mask/Sp").getComponent(sp.Skeleton).animation = "animation";
        });
        resources.load(`Sprites/SelectButtomFrame/${Name}/spriteFrame`, SpriteFrame, (err: any, SkeletonData: SpriteFrame) => {
            if (err) {
                console.log("没有找到菜单图片" + Name);
                return;
            }
            this.node.getChildByPath("框").getComponent(Sprite).spriteFrame = SkeletonData;
        });
        this.node.getChildByName("Name").getComponent(Label).string = Name;
    }

    //按钮点击事件
    OnClick() {
        MoreGamePagePanel.SelectGameData = this.GameData;

        for (let i = 0; i < MoreGamePagePanel.SelectGameData.length; i++) {
            if (i < 3) MoreGamePagePanel.SelectGameData[i].Unlock = true;
        }

        UIManager.ShowPanel(Panel.MoreGamePagePanel, [this.GameData]);

        this.scheduleOnce(() => {
            UIManager.HidePanel(Panel.SelectGamePanel);
        }, 0.3)
    }

}


