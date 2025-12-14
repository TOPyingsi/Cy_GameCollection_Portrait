import { _decorator, Component, director, EditBox, Event, find, Label, math, Node, PageView, ScrollView, sys, Tween, tween, Vec3 } from 'cc';
import NodeUtil from '../../Framework/Utils/NodeUtil';
import { PoolManager } from '../../Framework/Managers/PoolManager';
import { DataManager, GameData } from '../../Framework/Managers/DataManager';
import { Constant } from '../../Framework/Const/Constant';
import { Panel, UIManager } from '../../Framework/Managers/UIManager';
import { AudioManager, Audios } from '../../Framework/Managers/AudioManager';
import { GameManager } from '../../GameManager';
import { PanelBase } from '../../Framework/UI/PanelBase';
import { MoreGamePageItem } from '../MoreGamePageItem';
import { EventManager, MyEvent } from '../../Framework/Managers/EventManager';
import Banner from '../../Banner';
import { Tools } from '../../Framework/Utils/Tools';
import { SelectGamePanel } from '../SelectGamePanel';
const { ccclass, property } = _decorator;

@ccclass('MoreGamePagePanel')
export class MoreGamePagePanel extends PanelBase {
    public static SelectGameData: GameData[] = [];
    Panel: Node = null;
    PageView: PageView = null;
    Content: Node = null;
    PageLabel: Label = null;
    APLabel: Label = null;
    APTimerLabel: Label = null;
    EditBox: Node = null;
    PrivacyButton: Node = null;
    ReturnButton: Node = null;

    items: MoreGamePageItem[] = [];

    maxPageCount = 6;

    loadDone: boolean = false;

    protected onLoad(): void {
        this.Panel = NodeUtil.GetNode("Panel", this.node);
        this.PageView = NodeUtil.GetComponent("PageView", this.node, PageView);
        this.Content = NodeUtil.GetNode("Content", this.node);
        this.PageLabel = NodeUtil.GetComponent("PageLabel", this.node, Label);
        this.APLabel = NodeUtil.GetComponent("APLabel", this.node, Label);
        this.APTimerLabel = NodeUtil.GetComponent("APTimerLabel", this.node, Label);
        this.EditBox = NodeUtil.GetNode("EditBox", this.node);
        this.PrivacyButton = NodeUtil.GetNode("PrivacyButton", this.node);
        this.ReturnButton = NodeUtil.GetNode("ReturnButton", this.node);
        this.EditBox.active = sys.platform === sys.Platform.DESKTOP_BROWSER || sys.platform === sys.Platform.MOBILE_BROWSER;

        // this.SetData(DataManager.GameData);
    }

    SetData(data: GameData[]) {
        this.PageView.removeAllPages();
        this.items.forEach(e => PoolManager.PutNode(e.node));
        this.items = [];

        let pageCount = Math.ceil(data.length / this.maxPageCount);
        let loadCount = 0;
        this.PageView.setCurrentPageIndex(0);

        for (let i = 0; i < pageCount; i++) {
            const sliceData = data.slice(i * this.maxPageCount, i * this.maxPageCount + this.maxPageCount);
            PoolManager.GetNode(Constant.Path.MoreGamePageItem, this.Content).then(node => {
                let item = node.getComponent(MoreGamePageItem);
                item.Init(sliceData)
                this.items.push(item);
                this.PageView.addPage(item.node);
                loadCount++;

                if (loadCount == pageCount) {
                    this.loadDone = true;
                    this.PageViewCallback();
                }
            });
        }
    }

    Show(data: GameData[], isReLoad: boolean = true) {
        super.Show(this.Panel);
        this.RefreshAP();
        this.ShowAPTimer(GameManager.AP < GameManager.MaxAP);
        this.RefreshAPTimer();
        if (this.loadDone) this.PageViewCallback();
        this.PrivacyButton.active = Banner.IS_HUAWEI_QUICK_GAME;
        if (isReLoad) {
            this.SetData(data);
        }
        // UIManager.ShowPanel(Panel.UnlockPanel);
        this.ReturnButton.active = Banner.IsShowServerBundle;
    }

    RefreshAP() {
        this.APLabel.string = `${GameManager.AP}/${GameManager.MaxAP}`;
    }

    ShowAPTimer(show: boolean) {
        this.APTimerLabel.node.active = show;
    }

    RefreshAPTimer() {
        let str = "";
        if (Math.floor(GameManager.Instance.apTime / 60) != 0) {
            str += `${Math.floor(GameManager.Instance.apTime / 60).toString().padStart(2, '0')}分`;
        }
        str += `${Math.floor(GameManager.Instance.apTime % 60).toString().padStart(2, '0')} 秒`;
        this.APTimerLabel.string = str;
    }

    RefreshPageIndex() {
        this.PageLabel.string = `${this.PageView.getCurrentPageIndex() + 1}/${this.PageView.getPages().length}`;
    }

    PageViewCallback() {
        if (this.PageView.getCurrentPageIndex() - 1 >= 0) {
            this.items[this.PageView.getCurrentPageIndex() - 1].ResetScale();
        }

        if (this.PageView.getCurrentPageIndex() + 1 < this.PageView.getPages().length) {
            this.items[this.PageView.getCurrentPageIndex() + 1].ResetScale();
        }

        this.RefreshCurPage();
        this.RefreshPageIndex();

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].ShowItems(i == this.PageView.curPageIdx || i == this.PageView.curPageIdx + 1 || i == this.PageView.curPageIdx - 1);
        }
    }

    RefreshCurPage() {
        this.items[this.PageView.getCurrentPageIndex()].RefreshPage();
    }

    OnButtonClick(event: Event) {
        AudioManager.Instance.PlayCommonSFX(Audios.ButtonClick);

        switch (event.target.name) {
            case "LastButton":
                if (this.PageView.getCurrentPageIndex() > 0) {
                    this.PageView.scrollToPage(this.PageView.getCurrentPageIndex() - 1, 0.15);
                } else if (this.PageView.getCurrentPageIndex() == 0) {
                    this.PageView.scrollToPage(this.PageView.getPages().length - 1, 0.1);
                }
                break;
            case "NextButton":
                if (this.PageView.getCurrentPageIndex() < this.PageView.getPages().length - 1) {
                    this.PageView.scrollToPage(this.PageView.getCurrentPageIndex() + 1, 0.15);
                } else if (this.PageView.getCurrentPageIndex() == this.PageView.getPages().length - 1) {
                    this.PageView.scrollToPage(0, 0.1);
                }
                break;
            case "ApButton":
                Banner.Instance.ShowVideoAd(() => { GameManager.AP += 5 });
                break;
            case "SignInButton":
                UIManager.ShowPanel(Panel.SignInPanel);
                break;
            case "ReturnButton":
                UIManager.HidePanel(Panel.MoreGamePagePanel);
                director.loadScene("Start");
                // UIManager.ShowPanel(Panel.SelectGamePanel);
                break;
            case "PrivacyButton":
                if (Banner.IS_ANDROID) {
                    Banner.Instance.AndroidPrivacy();
                } else {
                    UIManager.ShowPanel(Panel.PrivacyPanel, false);
                }
                break;
        }
    }

    protected onEnable(): void {
        EventManager.on(MyEvent.RefreshAP, this.RefreshAP, this)
        EventManager.on(MyEvent.RefreshAPTimer, this.RefreshAPTimer, this)
        EventManager.on(MyEvent.ShowAPTimer, this.ShowAPTimer, this)
    }

    protected onDisable(): void {
        EventManager.off(MyEvent.RefreshAP, this.RefreshAP, this)
        EventManager.off(MyEvent.RefreshAPTimer, this.RefreshAPTimer, this)
        EventManager.off(MyEvent.ShowAPTimer, this.ShowAPTimer, this)
    }

    onEditDidEnded(editbox: EditBox, customEventData) {
        if (Tools.IsEmptyStr(editbox.textLabel.string)) {
            this.SetData(DataManager.GameData);
        } else {
            let data = DataManager.GameData.filter(e => e.gameName.includes(editbox.textLabel.string));
            this.SetData(data);
        }
    }
}