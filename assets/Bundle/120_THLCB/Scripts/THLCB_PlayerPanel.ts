import { _decorator, Animation, AnimationClip, Label, Node, Prefab, sp, Sprite } from 'cc';
import { THLCB_UIBase } from './THLCB_UIBase';
import { THLCB_DataManager } from './THLCB_DataManager';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { THLCB_Achievement } from './THLCB_Achievement';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('THLCB_PlayerPanel')
export class THLCB_PlayerPanel extends THLCB_UIBase {

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
        let level = THLCB_DataManager.Instance.getNumberData("Level");
        this.expLabel.string = level.toString();
        let num = THLCB_DataManager.Instance.getNumberData("Fans");
        this.fansLabel.string = `粉丝 ${num}`;
        let fanLevel = THLCB_DataManager.Instance.getNumberData("FanLevel");
        this.fanLevelLabel.string = THLCB_DataManager.fanLevelNames[fanLevel];
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    _UpdateSkin() {
        let num = THLCB_DataManager.Instance.getNumberData("Skin");
        this.player.setSkin("pifu" + num);
    }

    _InitFanLevel() {
        for (let i = 0; i < THLCB_DataManager.fanLevelNums.length; i++) {
            let element = this.content.children[i];
            if (!element) element = PoolManager.GetNodeByPrefab(this.achiPrefab, this.content);
            element.getComponent(THLCB_Achievement)._Init(i);
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