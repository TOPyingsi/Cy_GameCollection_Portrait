import { _decorator, Camera, Component, director, Event, Label, Node, RichText, UITransform, v2 } from 'cc';
import { AudioManager, Audios } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { PanelBase } from 'db://assets/Scripts/Framework/UI/PanelBase';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { GameManager } from '../../GameManager';
import { Tools } from '../../Framework/Utils/Tools';
import { Panel, UIManager } from '../../Framework/Managers/UIManager';
import Banner from '../../Banner';
import { GamePanel } from './GamePanel';
const { ccclass, property } = _decorator;

@ccclass('LostPanel')
export class LostPanel extends PanelBase {
    Panel: Node = null;
    AnswerButton: Node = null;
    MessageLabel: RichText = null;

    strs: string[] = ["《重生之我在新手村反复去世》更新中...", "这波在大气层，下次直接突破臭氧层！", "电子功德+1，失败是赛博飞升的前戏", "对面开挂实锤了！建议呼叫祖安队友！", "系统检测到您使用了‘放海战术’，瑞思拜！", "蚌埠住了？速速点击‘无能狂怒.jpg’按钮", "NPC：这人明明菜到抠脚却坚持氪命的样子真美", "您已触发隐藏成就：《破防の艺术》", "注意！您已被BOSS列入‘白给名单’", "重生点已刷新，速速再战！(战术后仰.gif)"];

    protected onLoad(): void {
        this.Panel = NodeUtil.GetNode("Panel", this.node)
        this.AnswerButton = NodeUtil.GetNode("AnswerButton", this.node);
        this.MessageLabel = NodeUtil.GetComponent("MessageLabel", this.node, RichText)
    }

    Show(str: string = "") {
        super.Show(this.Panel);
        this.MessageLabel.string = `<b>${Tools.IsEmptyStr(str) ? "通关失败。不要放弃，再试一次吧！" : str}</b>`;

        // this.AnswerButton.active = GamePanel.Instance.answerPrefab != null || GamePanel.Instance.answerCallback != null;
    }

    OnButtonClick(event: Event) {
        AudioManager.Instance.PlayCommonSFX(Audios.ButtonClick);
        switch (event.target.name) {

            case "RestartButton":
                UIManager.HidePanel(Panel.LostPanel);
                GameManager.Instance.LoadGame(GameManager.GameData);
                break;
            case "AnswerButton":
                Banner.Instance.ShowVideoAd(() => {
                    if (GamePanel.Instance.answerCallback) {
                        GamePanel.Instance.answerCallback();
                    }
                    if (GamePanel.Instance.answerPrefab) {
                        UIManager.ShowPanel(Panel.AnswerPanel, [GamePanel.Instance.answerPrefab]);

                    }
                });
                break;
            case "ReturnButton":
                UIManager.HidePanel(Panel.LostPanel);
                GameManager.Instance.ReturnAndShowMoreGame();
                break;
        }

    }
}