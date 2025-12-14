import { _decorator, Animation, AnimationClip, Label, Node, Prefab, sp, Sprite } from 'cc';
import { GDDSCBASMR_UIBase } from './GDDSCBASMR_UIBase';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { GDDSCBASMR_Achievement } from './GDDSCBASMR_Achievement';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_PlayerPanel')
export class GDDSCBASMR_PlayerPanel extends GDDSCBASMR_UIBase {

    @property(sp.Skeleton)
    player: sp.Skeleton;

    @property(Sprite)
    expSprite: Sprite;

    @property(Label)
    expLabel: Label;

    @property(Label)
    fansLabel: Label;

    @property(Label)
    fanLevelLabel: Label;

    @property(Prefab)
    achiPrefab: Prefab;

    @property(Node)
    content: Node;

    @property(Node)
    FansPanel: Node;

    protected _InitData(): void {
        this._UpdateSkin();
        this._UpdateProgress(this.expSprite, "Exp", "ExpLimit");
        let level = GDDSCBASMR_DataManager.Instance.getNumberData("Level");
        this.expLabel.string = level.toString();
        let num = GDDSCBASMR_DataManager.Instance.getNumberData("Fans");
        this.fansLabel.string = `粉丝 ${num}`;
        let fanLevel = GDDSCBASMR_DataManager.Instance.getNumberData("FanLevel");
        this.fanLevelLabel.string = GDDSCBASMR_DataManager.fanLevelNames[fanLevel];
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    _UpdateSkin() {
        let num = GDDSCBASMR_DataManager.Instance.getNumberData("Skin");
        this.player.setSkin("pifu" + num);
    }

    _InitFanLevel() {
        for (let i = 0; i < GDDSCBASMR_DataManager.fanLevelNums.length; i++) {
            let element = this.content.children[i];
            if (!element) element = PoolManager.GetNodeByPrefab(this.achiPrefab, this.content);
            element.getComponent(GDDSCBASMR_Achievement)._Init(i);
        }
    }

    OpenFans() {
        this._InitFanLevel();
        this.FansPanel.active = true;
        let ani = this.FansPanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Reverse;
        ani.play();
    }

    CloseFan() {
        let ani = this.FansPanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }

    ClosePanel(): void {
        let ani = this.node.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }

}