import { _decorator, Component, Node, instantiate, Prefab, resources, Sprite, tween, director } from 'cc';
import Banner from '../../../Scripts/Banner';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { PanelBase } from '../../../Scripts/Framework/UI/PanelBase';
import NodeUtil from '../../Framework/Utils/NodeUtil';
import { MyEvent } from '../../Framework/Managers/EventManager';
const { ccclass, property } = _decorator;

@ccclass('TreasureBoxPanel')
export default class TreasureBoxPanel extends PanelBase {
    @property(Sprite)
    jdt: Sprite | null = null;//进度条
    index: number = 0;
    AwardCallBack: Function = null;
    gived: boolean = false;
    sussCb: Function = null;

    Panel: Node = null;

    protected onLoad(): void {
        this.Panel = NodeUtil.GetNode("Panel", this.node);
    }

    Show(sussCb: Function = null) {
        super.Show(this.Panel);
        director.getScene().emit(MyEvent.TreasureBoxShow);
        this.IsShow2 = false;
        this.IsShow = false;
        this.sussCb = sussCb;
        this.gived = false;
        this.schedule(() => {
            if (this.index > 0) this.index -= 1;
        }, 0.1)
    }
    IsShow: boolean = false;
    IsShow2: boolean = false;
    //    //点击宝箱按钮
    OnButtonClick() {
        this.index += Tools.GetRandom(5, 10);
        if (this.index >= 60 && !this.IsShow) {
            Banner.Instance.ShowVideoAd(() => { this.GiveReward(); });
            this.IsShow = true;
            this.scheduleOnce(() => {
                this.sussCb && this.sussCb();
                director.getScene().emit(MyEvent.TreasureBoxDestroy);
                this.node.destroy();
            }, 1);
        }
    }
    protected update(dt: number): void {
        this.jdt.fillRange = this.index / 100;
    }

    protected lateUpdate(dt: number): void {
        if (this.index > 0) this.index -= 0.1;
    }

    //    //提供奖励且销毁
    GiveReward() {
        if (this.gived) return;
        this.gived = true;
        if (this.AwardCallBack) {
            this.AwardCallBack();
        }
    }
}