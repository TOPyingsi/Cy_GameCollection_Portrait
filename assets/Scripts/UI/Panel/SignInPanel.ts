import { _decorator, Node, Event, tween, v3, Tween, director, JsonAsset, math } from 'cc';
import NodeUtil from '../../Framework/Utils/NodeUtil';
import { Panel, UIManager } from '../../Framework/Managers/UIManager';
import { AudioManager, Audios } from '../../Framework/Managers/AudioManager';
import { PanelBase } from '../../Framework/UI/PanelBase';
import Banner from '../../Banner';
import { GameManager } from '../../GameManager';
import PrefsManager from '../../Framework/Managers/PrefsManager';
import { Constant } from '../../Framework/Const/Constant';
import { Tools } from '../../Framework/Utils/Tools';

const { ccclass, property } = _decorator;

@ccclass('SignInPanel')
export default class SignInPanel extends PanelBase {

    Panel: Node = null;
    Items: Node = null;
    Buttons: Node = null;

    protected onLoad(): void {
        this.Panel = NodeUtil.GetNode("Panel", this.node);
        this.Items = NodeUtil.GetNode("Items", this.node);
        this.Buttons = NodeUtil.GetNode("Buttons", this.node);
    }

    Show() {
        super.Show(this.Panel);
        this.RefreshItems();
    }

    RefreshItems() {
        let dates: any[] = [];

        if (PrefsManager.GetItem(Constant.Key.SignIn)) {
            dates = JSON.parse(PrefsManager.GetItem(Constant.Key.SignIn));
        }

        this.Items.children.forEach((e, i) => {
            if (i <= 5) {
                e.getChildByName("Get").active = i < dates.length;
            }

            if (i == 6) {
                e.getChildByName("Get").active = SignInPanel.IsAlreadySignIn() && dates.length > 6;
            }
        })
    }

    SignIn(isDoubleAp: boolean = false) {
        let today = SignInPanel.GetDateStr(new Date());

        let sign = () => {
            let aps = [2, 5, 8, 10, 12, 15, 20];
            let dates: any[] = [];

            if (PrefsManager.GetItem(Constant.Key.SignIn)) {
                dates = JSON.parse(PrefsManager.GetItem(Constant.Key.SignIn));
            }

            dates.push(today)
            PrefsManager.SetItem(Constant.Key.SignIn, JSON.stringify(dates));
            console.log(`签到成功：`, dates);

            this.RefreshItems();
            let ap = aps[math.clamp(dates.length - 1, 0, 6)];
            GameManager.AP += isDoubleAp ? ap * 2 : ap;

            UIManager.ShowTip(`签到成功，体力+${isDoubleAp ? ap * 2 : ap}`);
        }

        if (SignInPanel.IsAlreadySignIn()) {
            UIManager.ShowTip(`今天已经签到过了`);
        } else {
            sign();
        }
    }

    static IsAlreadySignIn() {
        let today = this.GetDateStr(new Date());

        if (PrefsManager.GetItem(Constant.Key.SignIn)) {
            let dates = JSON.parse(PrefsManager.GetItem(Constant.Key.SignIn));

            if (dates.find(e => e == today)) {
                return true;
            }
        }

        return false;
    }

    static GetDateStr(date: Date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    }

    OnButtonClick(event: Event) {
        AudioManager.Instance.PlayCommonSFX(Audios.ButtonClick);


        switch (event.target.name) {
            case "GetButton":
                if (SignInPanel.IsAlreadySignIn()) {
                    UIManager.ShowTip(`今天已经签到过了`);
                } else {
                    this.SignIn();
                }
                break;
            case "DoubleGetButton":
                if (SignInPanel.IsAlreadySignIn()) {
                    UIManager.ShowTip(`今天已经签到过了`);
                } else {
                    Banner.Instance.ShowVideoAd(() => {
                        this.SignIn(true);
                    });
                }
                break;
            case "Mask":
            case "CloseButton":
                UIManager.HidePanel(Panel.SignInPanel);
                break;

        }
    }


}