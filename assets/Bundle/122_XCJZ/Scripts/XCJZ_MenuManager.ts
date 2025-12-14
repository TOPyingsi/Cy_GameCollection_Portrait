import { _decorator, Component, director, EventTouch, Label, Node, Sprite, tween, Tween } from 'cc';
import { XCJZ_EventManager, XCJZ_MyEvent } from './XCJZ_EventManager';
import { XCJZ_MUSIC_ITEM_TYPE, XCJZ_MUSIC, XCJZ_SELECT } from './XCJZ_Constant';
import { XCJZ_MusicItem } from './XCJZ_MusicItem';
import { XCJZ_GameData } from './XCJZ_GameData';
import Banner from 'db://assets/Scripts/Banner';
import { XCJZ_TodayItem } from './XCJZ_TodayItem';
import { Panel, UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('XCJZ_MenuManager')
export class XCJZ_MenuManager extends Component {

    public static Instance: XCJZ_MenuManager = null;

    @property(Label)
    Diamond: Label = null;

    @property(Node)
    MainPanel: Node = null;

    @property(Node)
    ShopPanel: Node = null;

    @property({ displayName: "困难模式的数量" })
    DifficultyItemsCount: number = 3;

    @property({ displayName: "热门模式的数量" })
    HotItemsCount: number = 3;

    @property({ displayName: "猜你喜欢的数量" })
    FontItemsCount: number = 3;

    @property(Node)
    TodayContent: Node = null;

    @property(Node)
    TodayAwardWindow: Node = null;

    @property(Node)
    TodayAwardButton: Node = null;

    @property(XCJZ_TodayItem)
    TodayItems: XCJZ_TodayItem[] = [];

    @property(Node)
    GetDiamondWindow: Node = null;

    @property(Node)
    SetWindow: Node = null;

    @property(Node)
    LoadingWindow: Node = null;

    @property(Sprite)
    LoadingSprite: Sprite = null;

    // @property(Node)
    // WinWindow: Node = null;

    // @property(Node)
    // FailWindow: Node = null;

    CurPanel: Node = null;
    CurWindow: Node = null;

    MapItems: Map<XCJZ_MUSIC_ITEM_TYPE, XCJZ_MusicItem[]> = new Map();
    CurTodayItems: XCJZ_MusicItem[] = [];
    CurDifficultyItems: XCJZ_MusicItem[] = [];
    CurHotItems: XCJZ_MusicItem[] = [];
    CurFontItems: XCJZ_MusicItem[] = [];

    TodayItemChecked: XCJZ_MUSIC = XCJZ_MUSIC.MUSIC1;

    protected onLoad(): void {
        XCJZ_MenuManager.Instance = this;
        ProjectEventManager.emit(ProjectEvent.游戏开始, "炫彩节奏");
    }

    start() {
        // XCJZ_EventManager.Emit(XCJZ_MyEvent.XCJZ_MUSIC_ITEM_CLICK, XCJZ_MUSIC.MUSIC1);
        this.scheduleOnce(() => {
            XCJZ_EventManager.Emit(XCJZ_MyEvent.XCJZ_SELECT_ITEM, XCJZ_SELECT.MAIN);
            this.InitItems();
            this.ShowDiamond();
        })
    }

    OnButtonClick(event: EventTouch) {
        switch (event.getCurrentTarget().name) {
            case "Set":
                this.ShowWindow(this.SetWindow);
                break;
            case "AddDiamond":
                this.ShowWindow(this.GetDiamondWindow);
                break;
            case "今日礼物":
                // this.SwitchDifficultyItems();
                this.ShowWindow(this.TodayAwardWindow);
                this.TodayItems[0].Click();
                break;
            case "换一换_困难":
                this.SwitchDifficultyItems();
                break;
            case "换一换_热门":
                this.SwitchHotItems();
                break;
            case "换一换_喜欢":
                this.SwitchFontItems();
                break;
            case "只要一首":
                if (XCJZ_GameData.Instance.TodayGetMusic.length <= 0) {
                    XCJZ_GameData.Instance.TodayGetMusic.push(this.TodayItemChecked);
                    XCJZ_GameData.Instance.AddMusic(this.TodayItemChecked);
                    this.CurTodayItems = this.MapItems.get(XCJZ_MUSIC_ITEM_TYPE.今日礼物).filter(item => item.Music == this.TodayItemChecked);
                    this.SwitchTodayItems();
                }
                this.CloseWindow();
                this.RandomPlayMusic();
                break;
            case "全都要":
                Banner.Instance.ShowVideoAd(() => {
                    XCJZ_GameData.Instance.TodayGetMusic = XCJZ_GameData.Instance.TodayMusic;
                    XCJZ_GameData.Instance.TodayGetMusic.forEach(music => XCJZ_GameData.Instance.AddMusic(music));
                    this.CurTodayItems = this.MapItems.get(XCJZ_MUSIC_ITEM_TYPE.今日礼物);
                    this.SwitchTodayItems();
                    this.CloseWindow();
                    this.TodayAwardButton.active = false;
                    this.RandomPlayMusic();
                })
                break;
            case "CloseWindow":
                this.CloseWindow();
                break;
            case "立即领取":
                Banner.Instance.ShowVideoAd(() => {
                    this.ShowDiamond(300);
                    this.CloseWindow();
                })
                break;
            case "重新挑战":
                XCJZ_MenuManager.Instance.ShowLoading(() => {
                    director.loadScene("XCJZ_Game");
                });
                break;
            case "领取":
                this.ShowDiamond(200);
                this.CloseWindow();
                break;
            case "双倍领取":
                Banner.Instance.ShowVideoAd(() => {
                    this.ShowDiamond(200);
                    this.CloseWindow();
                })
                break;
            case "返回主页":
                UIManager.ShowPanel(Panel.ReturnPanel);
                break;
        }
    }

    public ShowDiamond(change: number = 0) {
        XCJZ_GameData.Instance.ChangeDiamond(change);
        this.Diamond.string = XCJZ_GameData.Instance.Diamond.toString();
    }

    public ShowPanel(panel: Node) {
        if (this.CurPanel == panel) return;
        if (this.CurPanel) this.CurPanel.active = false;
        this.CurPanel = panel;
        this.CurPanel.active = true;
    }

    ShowWindow(window: Node) {
        if (this.CurWindow == window) return;
        if (this.CurWindow) this.CurWindow.active = false;
        this.CurWindow = window;
        this.CurWindow.active = true;
    }

    CloseWindow() {
        if (this.CurWindow) this.CurWindow.active = false;
        this.CurWindow = null;
    }

    public AddItem(itemType: XCJZ_MUSIC_ITEM_TYPE, item: XCJZ_MusicItem) {
        if (!this.MapItems.has(itemType)) {
            this.MapItems.set(itemType, []);
        }
        this.MapItems.get(itemType).push(item);
    }

    InitTodayItems() {
        const items: XCJZ_MusicItem[] = this.MapItems.get(XCJZ_MUSIC_ITEM_TYPE.今日礼物);
        for (let i = 0; i < items.length; i++) {
            this.TodayItems[i].Init(items[i]);
        }

        if (XCJZ_GameData.Instance.TodayGetMusic.length <= 0) {
            //还没有获取当天奖励
            this.ShowWindow(this.TodayAwardWindow);
            this.TodayItems[0].Click();
        } else if (XCJZ_GameData.Instance.TodayGetMusic.length >= 3) {
            this.TodayAwardButton.active = false;
        }

        this.MapItems.get(XCJZ_MUSIC_ITEM_TYPE.今日礼物).forEach(item => {
            const flag = XCJZ_GameData.Instance.TodayGetMusic.findIndex(x => x == item.Music);
            if (flag != -1) {
                this.CurTodayItems.push(item);
                item.Open();
            } else {
                item.Close();
            }
        });
    }

    InitItems() {
        if (XCJZ_GameData.Instance.TodayMusic.length <= 0) {
            const items: XCJZ_MusicItem[] = this.GetTodayMusic(3);
            items.forEach(item => item.Close());
        } else {
            this.ChangeItemToToday();
        }

        this.InitTodayItems();


        if (this.MapItems.has(XCJZ_MUSIC_ITEM_TYPE.困难关卡)) {
            const items: XCJZ_MusicItem[] = this.MapItems.get(XCJZ_MUSIC_ITEM_TYPE.困难关卡);
            items.forEach(item => item.Close());
            this.CurDifficultyItems = this.GetRandomItems(items, this.DifficultyItemsCount);
            this.CurDifficultyItems.forEach(item => item.Open());
        }

        if (this.MapItems.has(XCJZ_MUSIC_ITEM_TYPE.当前热门)) {
            const items: XCJZ_MusicItem[] = this.MapItems.get(XCJZ_MUSIC_ITEM_TYPE.当前热门);
            items.forEach(item => item.Close());
            this.CurHotItems = this.GetRandomItems(items, this.HotItemsCount);
            this.CurHotItems.forEach(item => item.Open());
        }

        if (this.MapItems.has(XCJZ_MUSIC_ITEM_TYPE.猜你喜欢)) {
            const items: XCJZ_MusicItem[] = this.MapItems.get(XCJZ_MUSIC_ITEM_TYPE.猜你喜欢);
            items.forEach(item => item.Close());
            this.CurFontItems = this.GetRandomItems(items, this.FontItemsCount);
            this.CurFontItems.forEach(item => item.Open());
        }

        this.RandomPlayMusic();
    }

    SwitchTodayItems() {
        this.CurTodayItems.forEach(item => item.Close());
        this.CurTodayItems.forEach(item => {
            if (XCJZ_GameData.Instance.TodayGetMusic.includes(item.Music)) item.Open();
        });
    }

    SwitchDifficultyItems() {
        this.CurDifficultyItems.forEach(item => item.Close());
        this.CurDifficultyItems = this.GetRandomItems(this.MapItems.get(XCJZ_MUSIC_ITEM_TYPE.困难关卡), this.DifficultyItemsCount, this.CurDifficultyItems);
        this.CurDifficultyItems.forEach(item => item.Open());
    }

    SwitchHotItems() {
        this.CurHotItems.forEach(item => item.Close());
        this.CurHotItems = this.GetRandomItems(this.MapItems.get(XCJZ_MUSIC_ITEM_TYPE.当前热门), this.HotItemsCount, this.CurHotItems);
        this.CurHotItems.forEach(item => item.Open());
    }

    SwitchFontItems() {
        this.CurFontItems.forEach(item => item.Close());
        this.CurFontItems = this.GetRandomItems(this.MapItems.get(XCJZ_MUSIC_ITEM_TYPE.猜你喜欢), this.FontItemsCount, this.CurFontItems);
        this.CurFontItems.forEach(item => item.Open());
    }

    //随机获取数组里面的count个元素
    GetRandomItems(items: XCJZ_MusicItem[], count: number, arr?: XCJZ_MusicItem[]) {
        // 如果提供了arr参数，则过滤掉这些元素
        let filteredItems = items;
        if (arr && arr.length > 0) {
            filteredItems = items.filter(item => !arr.includes(item));
        }

        // 创建一个副本以避免修改原始数组
        const shuffled = [...filteredItems];
        // 洗牌算法，只需要洗牌前count个元素即可
        for (let i = 0; i < Math.min(count, shuffled.length); i++) {
            const randomIndex = Math.floor(Math.random() * (shuffled.length - i)) + i;
            [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
        }
        // 返回前count个元素
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    //随机获取三首歌为今日奖励
    public GetTodayMusic(count: number = 3): XCJZ_MusicItem[] {
        // const shuffled = NDPA_GameUtil.shuffle(this.MusicItems);
        // return shuffled.slice(0, 3);
        if (this.MapItems.has(XCJZ_MUSIC_ITEM_TYPE.当前热门) && this.MapItems.has(XCJZ_MUSIC_ITEM_TYPE.猜你喜欢)) {
            const items1: XCJZ_MusicItem[] = this.MapItems.get(XCJZ_MUSIC_ITEM_TYPE.当前热门).filter(e => !XCJZ_GameData.Instance.HaveMusic.includes(e.Music));
            const items2: XCJZ_MusicItem[] = this.MapItems.get(XCJZ_MUSIC_ITEM_TYPE.猜你喜欢).filter(e => !XCJZ_GameData.Instance.HaveMusic.includes(e.Music));

            // 创建一个副本以避免修改原始数组
            const shuffled = [...items1, ...items2];
            // 洗牌算法，只需要洗牌前count个元素即可
            for (let i = 0; i < Math.min(count, shuffled.length); i++) {
                const randomIndex = Math.floor(Math.random() * (shuffled.length - i)) + i;
                [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
            }

            const items: XCJZ_MusicItem[] = shuffled.slice(0, Math.min(count, shuffled.length));

            let index: number = 0;
            if (!XCJZ_GameData.Instance.HaveMusic.includes(XCJZ_MUSIC.MUSIC1) && items.findIndex(e => e.Music == XCJZ_MUSIC.MUSIC1) == -1) {
                const item: XCJZ_MusicItem = shuffled.find(e => e.Music == XCJZ_MUSIC.MUSIC1);
                if (item) items[index++] = item;
            }
            if (!XCJZ_GameData.Instance.HaveMusic.includes(XCJZ_MUSIC.MUSIC2) && items.findIndex(e => e.Music == XCJZ_MUSIC.MUSIC2) == -1) {
                const item: XCJZ_MusicItem = shuffled.find(e => e.Music == XCJZ_MUSIC.MUSIC2);
                if (item) items[index++] = item;
            }
            items.forEach(item => {
                item.ChangeParent(this.TodayContent);
                if (this.MapItems.get(item.Item).includes(item)) this.MapItems.get(item.Item).splice(this.MapItems.get(item.Item).indexOf(item), 1);
                item.Item = XCJZ_MUSIC_ITEM_TYPE.今日礼物;
                this.AddItem(item.Item, item);
                XCJZ_GameData.Instance.TodayMusic.push(item.Music);
                XCJZ_GameData.DateSave();
            });
            return items;
        }
        return [];
    }

    //将音乐添加到今日
    ChangeItemToToday() {
        if (this.MapItems.has(XCJZ_MUSIC_ITEM_TYPE.当前热门) && this.MapItems.has(XCJZ_MUSIC_ITEM_TYPE.猜你喜欢)) {
            const items1: XCJZ_MusicItem[] = this.MapItems.get(XCJZ_MUSIC_ITEM_TYPE.当前热门);
            const items2: XCJZ_MusicItem[] = this.MapItems.get(XCJZ_MUSIC_ITEM_TYPE.猜你喜欢);
            // 创建一个副本以避免修改原始数组
            const shuffled = [...items1, ...items2];

            shuffled.forEach(item => {
                if (XCJZ_GameData.Instance.TodayMusic.includes(item.Music)) {
                    item.ChangeParent(this.TodayContent);
                    if (this.MapItems.get(item.Item).includes(item)) this.MapItems.get(item.Item).splice(this.MapItems.get(item.Item).indexOf(item), 1);
                    item.Item = XCJZ_MUSIC_ITEM_TYPE.今日礼物;
                    this.AddItem(item.Item, item);
                }
            });
        }
    }

    //随机播放歌曲
    RandomPlayMusic() {
        const shuffled = [...this.CurTodayItems, ...this.CurDifficultyItems, ...this.CurHotItems, ...this.CurFontItems];
        const musicItem: XCJZ_MusicItem = shuffled[Math.floor(Math.random() * shuffled.length)];
        if (musicItem) XCJZ_EventManager.Emit(XCJZ_MyEvent.XCJZ_MUSIC_ITEM_CLICK, musicItem.Music);
    }

    //展示加载界面
    ShowLoading(cb: Function = null) {
        this.ShowWindow(this.LoadingWindow);
        Tween.stopAllByTarget(this.LoadingSprite);
        this.LoadingSprite.fillRange = 0;
        tween(this.LoadingSprite)
            .to(5, { fillRange: 1 }, { easing: `quintInOut` })
            .call(() => {
                cb && cb();
                // this.CloseWindow();
            })
            .start();
    }
}


