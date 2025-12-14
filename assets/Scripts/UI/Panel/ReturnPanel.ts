import { _decorator, Component, director, Node } from 'cc';
import { PanelBase } from '../../Framework/UI/PanelBase';
import { ProjectEvent, ProjectEventManager } from '../../Framework/Managers/ProjectEventManager';
import { Panel, UIManager } from '../../Framework/Managers/UIManager';
import { GameManager } from '../../GameManager';
const { ccclass, property } = _decorator;

@ccclass('ReturnPanel')
export class ReturnPanel extends PanelBase {
    Show(...args: any[]): void {
        super.Show(this.node.getChildByName("弹板"));
    }
    OnYesClick() {
        ProjectEventManager.emit(ProjectEvent.返回主页, "");
        UIManager.HidePanel(Panel.ReturnPanel);
        UIManager.ShowLoadingPanel(GameManager.StartScene);
    }
    OnNoClick() {
        UIManager.HidePanel(Panel.ReturnPanel);
    }
}


