import { _decorator, Camera, Component, director, Event, Label, Node, RichText, UITransform, v2 } from 'cc';
import { AudioManager, Audios } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { PanelBase } from 'db://assets/Scripts/Framework/UI/PanelBase';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { GameManager } from '../../GameManager';
import { Panel, UIManager } from '../../Framework/Managers/UIManager';
import { DataManager } from '../../Framework/Managers/DataManager';
import { Tools } from '../../Framework/Utils/Tools';
const { ccclass, property } = _decorator;

@ccclass('WinPanel')
export class WinPanel extends PanelBase {
    Panel: Node = null;
    MessageLabel: RichText = null;

    strs: string[] = ["666！这操作秀到头皮发麻，建议申遗！", "全体起立！恭迎峡谷/副本/地图の新爹！", "《关于我手残但靠欧气乱杀这件事》", "系统提示：您已获得‘肝帝认证·人类进化漏网之鱼’", "BOSS临终遗言：你清高！你拿我刷成就！", "建议严查此人DNA，怀疑混入AI成分！", "氪金大佬：在？看看实力？ 你：就这？.jpg", "恭喜解锁‘让策划连夜改代码の压迫感’成就！", "隔壁小孩馋哭了：教练我也要学这个！", "速报！该通关视频已被列入《人类操作学教材》"];

    protected onLoad(): void {
        this.Panel = NodeUtil.GetNode("Panel", this.node)
        this.MessageLabel = NodeUtil.GetComponent("MessageLabel", this.node, RichText)
    }

    Show(str: string = "") {
        super.Show(this.Panel);
        this.MessageLabel.string = `<b>${Tools.IsEmptyStr(str) ? "通关了！你真棒！" : str}</b>`;
    }

    OnButtonClick(event: Event) {
        AudioManager.Instance.PlayCommonSFX(Audios.ButtonClick);
        switch (event.target.name) {
            case "RestartButton":
                UIManager.HidePanel(Panel.WinPanel);
                GameManager.Instance.LoadGame(GameManager.GameData);
                break;
            case "NextButton":
                if (GameManager.AP > 0) {
                    UIManager.HidePanel(Panel.WinPanel);
                    GameManager.Instance.LoadGame(DataManager.GetNextLvData(GameManager.GameData));
                } else {
                    UIManager.ShowPanel(Panel.AddApPanel);
                }
                break;
            case "ReturnButton":
                UIManager.HidePanel(Panel.WinPanel);
                GameManager.Instance.ReturnAndShowMoreGame();
                break;
        }
    }
}