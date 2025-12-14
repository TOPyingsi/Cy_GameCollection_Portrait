import { math, sys } from "cc";
import { XCJZ_MUSIC, XCJZ_MUSIC_CONFIG, XCJZ_SHOP_ITEM } from "./XCJZ_Constant";

export class XCJZ_GameData {
    private static _key: string = "XCJZ_GameData";
    private static _awardCount: number = 3;
    private static _awardTimer: number = 600;

    private static _instance: XCJZ_GameData = null;

    public static get Instance(): XCJZ_GameData {
        if (XCJZ_GameData._instance == null) {
            this.GetData();
        }
        return XCJZ_GameData._instance;
    }

    public static GetData() {
        let name = sys.localStorage.getItem(this._key);
        if (name != "" && name != null) {
            console.log("读取存档");
            XCJZ_GameData._instance = Object.assign(new XCJZ_GameData(), JSON.parse(name));
        } else {
            console.log("新建存档");
            XCJZ_GameData._instance = new XCJZ_GameData();
        }

        //每日刷新
        const curDate: number = new Date().getDate()
        if (XCJZ_GameData._instance.Date != curDate) {
            XCJZ_GameData._instance.Date = curDate;
            XCJZ_GameData._instance.AwardCount = this._awardCount;
            XCJZ_GameData._instance.Timer = this._awardTimer;
            XCJZ_GameData._instance.TodayMusic = [];
            XCJZ_GameData._instance.TodayGetMusic = [];
            this.DateSave();
        }
        XCJZ_GameData._instance.StartTimer();
    }

    public static DateSave() {
        let json = JSON.stringify(XCJZ_GameData.Instance);
        sys.localStorage.setItem(this._key, json);
    }

    public Music: number = 1;
    public Sound: number = 1;
    public Shake: boolean = true;

    public Diamond: number = 0;//钻石
    public HaveMusic: XCJZ_MUSIC[] = [];//拥有的音乐
    public CollectMusic: XCJZ_MUSIC[] = [];//收藏的音乐
    // public StarMusic: Map<XCJZ_MUSIC, number> = new Map();//收藏的音乐
    public StarMusic: { [key: string]: number } = {};//收藏的音乐
    public CurMusic: XCJZ_MUSIC = XCJZ_MUSIC.MUSIC1;//当前播放的音乐
    public Date: number = -1;//钻石领取的剩余时间
    public AwardCount: number = 3;//钻石领取的剩余时间
    public Timer: number = 600;//钻石领取的剩余时间
    public Time_ID: number = -1;//计时器ID
    public HaveShop: XCJZ_SHOP_ITEM[] = [XCJZ_SHOP_ITEM.炫彩球球];//拥有的道具
    public CurShop: XCJZ_SHOP_ITEM = XCJZ_SHOP_ITEM.炫彩球球;//当前使用道具
    public TodayMusic: XCJZ_MUSIC[] = [];//今日奖励的歌曲
    public TodayGetMusic: XCJZ_MUSIC[] = [];//今日获取的歌曲

    public GetStarCount(music: XCJZ_MUSIC): number {
        const name: string = XCJZ_MUSIC_CONFIG.get(music).MusicName
        if (!this.StarMusic.hasOwnProperty(name)) {
            this.StarMusic[name] = 0;
            XCJZ_GameData.DateSave();
            return 0;
        }
        return this.StarMusic[name];
    }

    public AddMusic(music: XCJZ_MUSIC) {
        if (this.HaveMusic.includes(music)) return;
        this.HaveMusic.push(music);
        XCJZ_GameData.DateSave();
    }

    public Collect(music: XCJZ_MUSIC) {
        if (this.CollectMusic.includes(music)) return;
        this.CollectMusic.push(music);
        XCJZ_GameData.DateSave();
    }

    public CancelCollect(music: XCJZ_MUSIC) {
        const index: number = this.CollectMusic.indexOf(music);
        if (index == -1) return;
        this.CollectMusic.splice(index, 1);
        XCJZ_GameData.DateSave();
    }

    public ChangeDiamond(count: number) {
        this.Diamond += count;
        XCJZ_GameData.DateSave();
    }

    //开始倒计时
    public StartTimer() {
        const func: Function = () => {
            this.Timer -= 1;
            if (this.Timer <= 0) {
                this.Timer = 0;
                clearInterval(this.Time_ID);
                return;
            }
        }
        this.Time_ID = setInterval(func, 1000);

    }

    public ResetTimer() {
        clearInterval(this.Time_ID);
        this.AwardCount--;
        this.Timer = XCJZ_GameData._awardTimer;
        this.StartTimer();
        XCJZ_GameData.DateSave();
    }

    public GetTimer(): string {
        return this.Timer == 0 ? "" : Math.floor(this.Timer / 60).toString().padStart(1, "0") + ":" + (this.Timer % 60).toString().padStart(2, "0");
    }

    public AddShopItem(item: XCJZ_SHOP_ITEM) {
        if (this.HaveShop.includes(item)) return;
        this.HaveShop.push(item);
    }

    public SetMusicStar(music: XCJZ_MUSIC, count: number) {
        const name: string = XCJZ_MUSIC_CONFIG.get(music).MusicName
        if (!this.StarMusic.hasOwnProperty(name)) {
            this.StarMusic[name] = 0;
        }
        this.StarMusic[name] = Math.max(this.StarMusic[name], count);
        XCJZ_GameData.DateSave();
    }
}


