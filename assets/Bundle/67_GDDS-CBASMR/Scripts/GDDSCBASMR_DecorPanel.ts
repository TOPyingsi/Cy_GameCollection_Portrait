import { _decorator, Animation, AnimationClip, Event, Label, Node, Prefab, sp, Sprite, SpriteFrame } from 'cc';
import { GDDSCBASMR_UIBase } from './GDDSCBASMR_UIBase';
import { GDDSCBASMR_MainPanel } from './GDDSCBASMR_MainPanel';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { GDDSCBASMR_DecorItem } from './GDDSCBASMR_DecorItem';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_DecorPanel')
export class GDDSCBASMR_DecorPanel extends GDDSCBASMR_UIBase {

    private static instance: GDDSCBASMR_DecorPanel;
    public static get Instance(): GDDSCBASMR_DecorPanel {
        return this.instance;
    }

    @property(Prefab)
    itemPrefab: Prefab;

    @property(Node)
    decors: Node;

    @property(Node)
    content: Node;

    @property(Node)
    buyPanel: Node;

    @property(Node)
    buyKuang: Node;

    @property(Label)
    buyLabel: Label;

    @property(Label)
    buyCostLabel: Label;

    @property([Node])
    buyItems: Node[] = [];

    @property([SpriteFrame])
    iconSfs: SpriteFrame[] = [];

    arrLengths = [31, 15, 19, 21, 9];
    targetId = [-1, -1];
    buyPetData: sp.SkeletonData;
    buyIcon: SpriteFrame;

    protected onLoad(): void {
        super.onLoad();
        GDDSCBASMR_DecorPanel.instance = this;
    }

    protected _InitData(): void {
        this._CheckDecor(0);
    }

    _CheckDecor(num: number) {
        for (let i = 0; i < this.decors.children.length; i++) {
            const element = this.decors.children[i].getComponent(Sprite);
            element.spriteFrame = this.iconSfs[num == i ? 1 : 0];
        }
        for (let i = 0; i < this.arrLengths[num]; i++) {
            let element = this.content.children[i];
            if (!element) element = PoolManager.GetNodeByPrefab(this.itemPrefab, this.content);
            element.getComponent(GDDSCBASMR_DecorItem)._Init(num, i);
        }
        for (let i = this.arrLengths[num]; i < this.content.children.length; i++) {
            const element = this.content.children[i];
            element.active = false;
        }
    }

    ClickDecor(event: Event) {
        let target: Node = event.target;
        this._CheckDecor(target.getSiblingIndex());
    }

    ChooseDecor(type: number, num: number) {
        let preName = "";
        switch (type) {
            case 0:
                preName = "Skin";
                break;
            case 1:
                preName = "Pet";
                break;
            case 2:
                preName = "Bg";
                break;
            case 3:
                preName = "Table";
                break;
            case 4:
                preName = "Decor";
                break;
        }
        let chooseData = GDDSCBASMR_DataManager.Instance.getNumberData(preName);
        if (chooseData != -1) var choose = this.content.children[chooseData].getComponent(GDDSCBASMR_DecorItem);
        chooseData = num;
        GDDSCBASMR_DataManager.Instance.setNumberData(preName, chooseData);
        choose && choose._Init();
        let cur = this.content.children[num].getComponent(GDDSCBASMR_DecorItem);
        cur._Init();
    }

    VideoDecor(type: number, num: number) {
        let x = this;
        Banner.Instance.ShowVideoAd(() => {
            let preName = "";
            switch (type) {
                case 0:
                    preName = "Skin";
                    break;
                case 1:
                    preName = "Pet";
                    break;
                case 2:
                    preName = "Bg";
                    break;
                case 3:
                    preName = "Table";
                    break;
                case 4:
                    preName = "Decor";
                    break;
            }
            let data = GDDSCBASMR_DataManager.Instance.getArrayData<number>(preName + "States");
            data[num] = 1;
            GDDSCBASMR_DataManager.Instance.setArrayData(preName + "States", data);
            x.ChooseDecor(type, num);
        })
    }

    BuyDecor(type: number, num: number) {
        this.targetId = [type, num];
        this._BuyInit();
    }

    _BuyInit() {
        this.buyPanel.active = true;
        this.buyKuang.active = this.targetId[0] > 1 && this.targetId[0] < 4;
        for (let i = 0; i < this.buyItems.length; i++) {
            const element = this.buyItems[i];
            element.active = this.targetId[0] == i;
        }
        let target = this.buyItems[this.targetId[0]];
        let spine;
        switch (this.targetId[0]) {
            case 0:
                spine = target.getComponent(sp.Skeleton);
                spine.setSkin("pifu" + this.targetId[1]);
                spine.animation = "daiji";
                break;
            case 1:
                spine = target.getComponent(sp.Skeleton);
                spine.skeletonData = this.buyPetData;
                spine.animation = "daiji";
                break;
            case 2:
            case 3:
            case 4:
                let icon = target.getComponent(Sprite);
                icon.spriteFrame = this.buyIcon;
                break;
        }
        if (this.targetId[0] < 2) {
            let name = GDDSCBASMR_DataManager.allNames[this.targetId[0]][this.targetId[1]];
            this.buyLabel.string = `您要购买${name}吗？`;
        }
        else this.buyLabel.string = "您确定要购买吗？";
        let cost = GDDSCBASMR_DataManager.allDecorPrices[this.targetId[0]][this.targetId[1]];
        this.buyCostLabel.string = cost.toString();
        let ani = this.buyPanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Reverse;
        ani.play();
    }

    BuyYes() {
        let preName = "";
        switch (this.targetId[0]) {
            case 0:
                preName = "Skin";
                break;
            case 1:
                preName = "Pet";
                break;
            case 2:
                preName = "Bg";
                break;
            case 3:
                preName = "Table";
                break;
            case 4:
                preName = "Decor";
                break;
        }
        let cost = GDDSCBASMR_DataManager.allDecorPrices[this.targetId[0]][this.targetId[1]];
        let coin = GDDSCBASMR_DataManager.Instance.getNumberData("Coin");
        if (cost > coin) {
            GDDSCBASMR_MainPanel.Instance._OpenNeed();
        }
        else {
            coin -= cost;
            GDDSCBASMR_DataManager.Instance.setNumberData("Coin", coin);
            let data = GDDSCBASMR_DataManager.Instance.getArrayData<number>(preName + "States");
            data[this.targetId[1]] = 1;
            GDDSCBASMR_DataManager.Instance.setArrayData(preName + "States", data);
            this.ChooseDecor(this.targetId[0], this.targetId[1]);
            let ani = this.buyPanel.getComponent(Animation);
            ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
            ani.play();
        }
    }

    BuyNo() {
        let ani = this.buyPanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }

    ClosePanel(): void {
        GDDSCBASMR_MainPanel.Instance._OpenMain();
        let ani = this.node.getComponent(Animation);
        ani.getState("decorPanel").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
        GDDSCBASMR_MainPanel.Instance.decorMain.getState("decorMain").wrapMode = AnimationClip.WrapMode.Default;
        GDDSCBASMR_MainPanel.Instance.decorMain.play();
    }

}