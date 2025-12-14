import { _decorator, Camera, Component, director, Event, instantiate, Label, Node, Prefab, RichText, UITransform, v2, Vec3 } from 'cc';
import { AudioManager, Audios } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { PanelBase } from 'db://assets/Scripts/Framework/UI/PanelBase';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { GameManager } from '../../GameManager';
import { Panel, UIManager } from '../../Framework/Managers/UIManager';
import { DataManager } from '../../Framework/Managers/DataManager';
const { ccclass, property } = _decorator;

@ccclass('AnswerPanel')
export class AnswerPanel extends PanelBase {
    Panel: Node = null;
    Content: Node = null;

    answer: Node = null;

    protected onLoad(): void {
        this.Panel = NodeUtil.GetNode("Panel", this.node)
        this.Content = NodeUtil.GetNode("Content", this.node)
    }

    Show(prefab: Prefab) {
        super.Show(this.Panel);
        if (this.answer) this.answer.destroy();
        this.answer = instantiate(prefab);
        this.Content.addChild(this.answer);
        this.answer.setPosition(Vec3.ZERO);
    }

    OnButtonClick(event: Event) {
        AudioManager.Instance.PlayCommonSFX(Audios.ButtonClick);
        switch (event.target.name) {
            case "Button":
                UIManager.HidePanel(Panel.AnswerPanel);
                break;
        }
    }
}