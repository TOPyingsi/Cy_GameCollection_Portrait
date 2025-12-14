import { _decorator, Component, EventTouch, Label, Node, resources, Sprite, SpriteFrame } from 'cc';
import { PanelBase } from '../../Framework/UI/PanelBase';
import { Panel, UIManager } from '../../Framework/Managers/UIManager';
import { SelectGamePanel } from '../SelectGamePanel';
import { DataManager, GameData } from '../../Framework/Managers/DataManager';
import Banner from '../../Banner';
import { GameManager } from '../../GameManager';
const { ccclass, property } = _decorator;

@ccclass('UnlockPanel')
export class UnlockPanel extends PanelBase {
    public IsShow: boolean = false;//是否已经显示过
    unlockData: GameData = null;
    Show(...args: any[]): void {
        if (this.IsShow) return;
        this.IsShow = true;
        // let data = DataManager.GetDataByNames(SelectGamePanel.SeletGameData[0].Data);
        // data = data.filter(e => !e.Unlock);
        // if (data.length == 0) {
        //     UIManager.HidePanel(Panel.UnlockPanel);
        //     return;
        // }
        this.unlockData = DataManager.GetDataByName("躲猫猫14");
        this.node.getChildByPath("UnlockPanel/关卡名").getComponent(Label).string = this.unlockData.gameName;
        resources.load(`Sprites/GameIcons/${this.unlockData.gameName}/spriteFrame`, SpriteFrame, (err: any, sp: SpriteFrame) => {
            if (err) {
                console.log("没有找到菜单图片" + this.unlockData.gameName);
                return;
            }
            this.node.getChildByPath("UnlockPanel/Mask/关卡图").getComponent(Sprite).spriteFrame = sp;
        });
        super.Show(this.node.getChildByName("UnlockPanel"));


    }

    start() {

    }

    OnButtomClick(btn: EventTouch) {
        switch (btn.target.name) {
            case "UnlockExit":
                UIManager.HidePanel(Panel.UnlockPanel);
                break;
            case "UnlockButtom":
                Banner.Instance.ShowVideoAd(() => {
                    this.unlockData.Unlock = true;
                    UIManager.HidePanel(Panel.UnlockPanel);
                    UIManager.HidePanel(Panel.MoreGamePagePanel);
                    GameManager.Instance.LoadGame(this.unlockData);
                })
                break;
            default:
                break;
        }

    }

}


