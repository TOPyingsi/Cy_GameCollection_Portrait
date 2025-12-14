import { _decorator, Component, director, Event, Label, Node, RichText } from 'cc';
import { AudioManager, Audios } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { PanelBase } from 'db://assets/Scripts/Framework/UI/PanelBase';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
const { ccclass, property } = _decorator;

@ccclass('PGZY_TipPanel')
export class PGZY_TipPanel extends PanelBase {
    Panel: Node = null;
    Button_1: Node = null;
    Button_2: Node = null;
    MessageLabel: RichText = null;
    TitleLabel: Label = null;
    Button_1_Label: Label = null;
    Button_2_Label: Label = null;
    cb_1: Function = null;
    cb_2: Function = null;

    protected onLoad(): void {
        this.Panel = NodeUtil.GetNode("Panel", this.node)
        this.Button_1 = NodeUtil.GetNode("Button_1", this.node)
        this.Button_2 = NodeUtil.GetNode("Button_2", this.node)
        this.MessageLabel = NodeUtil.GetComponent("MessageLabel", this.node, RichText)
        this.TitleLabel = NodeUtil.GetComponent("TitleLabel", this.node, Label)
        this.Button_1_Label = NodeUtil.GetComponent("Button_1_Label", this.node, Label)
        this.Button_2_Label = NodeUtil.GetComponent("Button_2_Label", this.node, Label)
    }

    Show(content: string, button1Str: string = ``, button2Str: string = ``, cb_1: Function = null, cb_2: Function = null, title: string = `提示`) {
        super.Show(this.Panel);
        this.MessageLabel.string = `${content}`;

        this.TitleLabel.string = title;
        this.Button_1_Label.string = button1Str;
        this.Button_2_Label.string = button2Str;
        this.cb_1 = cb_1;
        this.cb_2 = cb_2;

        this.Button_2.active = !Tools.IsEmptyStr(button2Str);
        ProjectEventManager.emit(ProjectEvent.弹出窗口);
    }

    OnButtonClick(event: Event) {
        // AudioManager.Instance.PlayCommonSFX(Audios.ButtonClick);
        switch (event.target.name) {
            case "Button_1":
                this.cb_1 && this.cb_1();
                break;
            case "Button_2":
                this.cb_2 && this.cb_2();
                break;
        }
    }
}