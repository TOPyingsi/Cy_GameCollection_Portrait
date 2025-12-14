import { _decorator, Component, Enum, EventTouch, find, Label, Node, tween, Tween, UIOpacity, Vec3 } from 'cc';
import { XCJZ_AWARD_CONFIG, XCJZ_SHOP_ITEM } from './XCJZ_Constant';
import { XCJZ_GameData } from './XCJZ_GameData';
import { XCJZ_EventManager, XCJZ_MyEvent } from './XCJZ_EventManager';
import Banner from 'db://assets/Scripts/Banner';
import { XCJZ_MenuManager } from './XCJZ_MenuManager';
const { ccclass, property } = _decorator;

@ccclass('XCJZ_ShopItem')
export class XCJZ_ShopItem extends Component {

    @property({ type: Enum(XCJZ_SHOP_ITEM) })
    Item: XCJZ_SHOP_ITEM = XCJZ_SHOP_ITEM.每日钻石;

    Checked: Node = null;
    Name: Label = null;
    Lights: UIOpacity[] = [];
    Stars: UIOpacity[] = [];

    Timer: Label = null;
    Diamond: Label = null;
    Over: Node = null;
    GetDiamond: Node = null;
    GetDiamondByVideo: Node = null;

    Use: Node = null;
    Used: Node = null;
    GetItemByVideo: Node = null;

    private _isChecked: boolean = false;
    private _timer: string = "";
    private _isOver: boolean = false;
    private _awardCount: number = 0;

    private _bound: Node = null;

    protected onLoad(): void {
        this.Checked = find("Checked", this.node);
        this.Name = find("Name", this.node).getComponent(Label);
        find("View/Lights", this.node).children.forEach(item => this.Lights.push(item.getChildByName("Light").getComponent(UIOpacity)));
        find("View/Stars", this.node).children.forEach(item => this.Stars.push(item.getComponent(UIOpacity)));

        if (this.Item == XCJZ_SHOP_ITEM.每日钻石) {
            this.Timer = find("Timer", this.node).getComponent(Label);
            this.Diamond = find("Diamond", this.node).getComponent(Label);
            this.Over = find("Over", this.node);
            this.GetDiamond = find("GetDiamond", this.node);
            this.GetDiamondByVideo = find("GetDiamondByVideo", this.node);
        } else {
            this.Use = find("Use", this.node);
            this.Used = find("Used", this.node);
            this.GetItemByVideo = find("GetItemByVideo", this.node);
        }
        if (this.Item == XCJZ_SHOP_ITEM.炫彩球球) {
            this._bound = find("Bound", this.node);
            tween(this._bound)
                .by(0.5, { y: 230 }, { easing: `quintOut` })
                .by(0.5, { y: -230 }, { easing: `quintIn` })
                .union()
                .repeatForever()
                .start();
        }

        this.node.on(Node.EventType.TOUCH_END, this.Click, this);
        XCJZ_EventManager.On(XCJZ_MyEvent.XCJZ_SHOP_ITEM, this.Show, this);
    }

    protected start(): void {
        this.ShowShop();
    }

    protected update(dt: number): void {
        if (this._isOver) return;
        if (this.Item == XCJZ_SHOP_ITEM.每日钻石) {
            this.ShowTimer();
        }
    }

    OnButtonClick(event: EventTouch) {
        switch (event.getCurrentTarget().name) {
            case "GetDiamond":
                // console.error("奖励：" + this._awardCount);
                XCJZ_MenuManager.Instance.ShowDiamond(this._awardCount);
                XCJZ_GameData.Instance.ResetTimer();
                break;
            case "GetDiamondByVideo":
                Banner.Instance.ShowVideoAd(() => {
                    XCJZ_MenuManager.Instance.ShowDiamond(this._awardCount);
                    // console.error("奖励：" + this._awardCount);
                    XCJZ_GameData.Instance.ResetTimer();
                })
                break;
            case "Use":
                XCJZ_GameData.Instance.CurShop = this.Item;
                XCJZ_GameData.DateSave();
                this._isChecked = false;
                this.Click();
                break;
            case "GetItemByVideo":
                Banner.Instance.ShowVideoAd(() => {
                    // console.error("奖励：" + this._awardCount);
                    XCJZ_GameData.Instance.AddShopItem(this.Item);
                    XCJZ_GameData.Instance.CurShop = this.Item;
                    XCJZ_GameData.DateSave();
                    this._isChecked = false;
                    this.Click();
                })
                break;
        }
    }

    ShowTimer() {
        this._timer = XCJZ_GameData.Instance.GetTimer();
        this.Timer.string = this._timer;
        if (XCJZ_GameData.Instance.AwardCount <= 0) {
            this._isOver = true;
            this.Over.active = true;
            this.GetDiamond.active = false;
            this.GetDiamondByVideo.active = false;
            this.Timer.string = "";
        } else if (this._timer == "") {
            this.GetDiamond.active = true;
            this.GetDiamondByVideo.active = false;
        } else {
            this.GetDiamond.active = false;
            this.GetDiamondByVideo.active = true;
            this._awardCount = XCJZ_AWARD_CONFIG[XCJZ_GameData.Instance.AwardCount - 1];
            this.Diamond.string = `+${this._awardCount}`;
        }
    }

    ShowShop() {
        this.Name.string = this.getEnumKeyByValue(XCJZ_SHOP_ITEM, this.Item);
        if (this.Item == XCJZ_SHOP_ITEM.每日钻石) return;
        const have: boolean = XCJZ_GameData.Instance.HaveShop.includes(this.Item);
        this.GetItemByVideo.active = !have;
        this.Use.active = have;
        this.Used.active = false;
        if (XCJZ_GameData.Instance.CurShop == this.Item) {
            this.Used.active = true;
            this.Use.active = false;
            return;
        }
    }

    Click() {
        if (this._isChecked) return;
        this._isChecked = true;
        this.Checked.active = true;
        this.ShowLights();
        this.ShowStars();
        XCJZ_EventManager.Emit(XCJZ_MyEvent.XCJZ_SHOP_ITEM, this.Item);
    }

    Show(item: XCJZ_SHOP_ITEM) {
        if (this._isChecked && item != this.Item) {
            this._isChecked = false;
            this.Checked.active = false;
            this.CloseLights();
            this.CloseStars();
        }
        this.ShowShop();
    }

    ShowLights() {
        this.Lights.forEach(light => {
            tween(light)
                .to(Math.random() * 0.3 + 0.1, { opacity: 255 }, { easing: `sineInOut` })
                .to(Math.random() * 0.3 + 0.1, { opacity: 100 }, { easing: `sineInOut` })
                .delay(Math.random() * 0.3 + 0.1)
                .union()
                .repeatForever()
                .start();
        });
    }

    CloseLights() {
        this.Lights.forEach(light => {
            Tween.stopAllByTarget(light);
            tween(light)
                .to(Math.random() * 0.3 + 0.1, { opacity: 100 }, { easing: `sineInOut` })
                .call(() => {
                    Tween.stopAllByTarget(light);
                })
                .start();
        });

    }

    async ShowStars() {
        for (let i = 0; i < this.Stars.length; i++) {
            if (!this._isChecked) return;
            const star = this.Stars[i];
            star.opacity = 255;
            tween(star)
                .delay(2)
                .to(2, { opacity: 0 }, { easing: `sineInOut` })
                .call(() => {
                    star.opacity = 255;
                })
                .union()
                .repeatForever()
                .start();
            star.node.scale = Vec3.ZERO;
            tween(star.node)
                .to(4, { scale: new Vec3(2, 2, 2) }, { easing: `sineInOut` })
                .call(() => {
                    star.node.scale = Vec3.ZERO;
                })
                .union()
                .repeatForever()
                .start();
            tween(star.node)
                .by(4, { angle: 100 }, { easing: `sineInOut` })
                .repeatForever()
                .start();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    CloseStars() {
        this.Stars.forEach(star => {
            Tween.stopAllByTarget(star);
            Tween.stopAllByTarget(star.node);
            star.opacity = 0;
        });

    }

    /** 根据枚举值找key*/
    private getEnumKeyByValue(enumObj: any, value: any): string | undefined {
        // 遍历枚举对象的键和值
        for (let key in enumObj) {
            if (enumObj[key] === value) {
                return key;
            }
        }
        return undefined; // 如果没有找到匹配的值，返回undefined
    }

}


