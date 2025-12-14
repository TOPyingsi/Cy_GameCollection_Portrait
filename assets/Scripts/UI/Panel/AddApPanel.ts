import { _decorator, Camera, Component, director, Event, Label, Node, RichText, UITransform, v2 } from 'cc';
import { AudioManager, Audios } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { PanelBase } from 'db://assets/Scripts/Framework/UI/PanelBase';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { GameManager } from '../../GameManager';
import { Panel, UIManager } from '../../Framework/Managers/UIManager';
import Banner from '../../Banner';
const { ccclass, property } = _decorator;

@ccclass('AddApPanel')
export class AddApPanel extends PanelBase {
    Panel: Node = null;
    MessageLabel: RichText = null;

    protected onLoad(): void {
        this.Panel = NodeUtil.GetNode("Panel", this.node)
        this.MessageLabel = NodeUtil.GetComponent("MessageLabel", this.node, RichText)
    }

    Show() {
        super.Show(this.Panel);
    }

    OnButtonClick(event: Event) {
        AudioManager.Instance.PlayCommonSFX(Audios.ButtonClick);
        switch (event.target.name) {
            case "OKButton":
                UIManager.HidePanel(Panel.AddApPanel);
                break;
            case "GetAPButton":
                Banner.Instance.ShowVideoAd(() => {
                    GameManager.AP += 5;
                    UIManager.HidePanel(Panel.AddApPanel);
                });
                break;
        }
    }
}