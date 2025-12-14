import { SpriteFrame, v3 } from "cc";
import { BundleManager } from "db://assets/Scripts/Framework/Managers/BundleManager";
import { eventCenter } from "./SHJCB_EventCenter";

export class SHJCB_DataManager {

    private static instance: SHJCB_DataManager;
    public static get Instance(): SHJCB_DataManager {
        if (!this.instance) {
            this.instance = new SHJCB_DataManager;
            this.instance.Init();
        }
        return this.instance;
    }

    static deltaCoin = 0;
    static requestViewer = 0;
    static requestMubkang = [0, 0, 0, 0];
    static curMubkang = [-1, -1, -1, -1];
    static fanLevelNums = [0, 30000, 140000, 400000, 940000, 2000000, 5000000];
    static allDecorPrices = [
        [-1, -1, -1, -1, 3000, 2500, -1, -1, 1500, -1],
        [1500, -1, -1, 2500, -1, 3000, -1, -1, 1800, -1, 2500, -1, 3000, 2200, 1500],
        [-1, 1000, -1, 1200, 1700, 2000, -1, -1, 800, 1500, -1, 1000, 2500, 2200, 2300, -1, -1, 1500, -1],
        [-1, 1000, 1000, -1, -1, -1, -1, -1, 1500, 800, -1, 1500, 1200, 900, 500, -1, -1, -1, -1, -1, -1],
        [-1, 600, 1500, -1, 1500, -1, 2000, 3000, -1]
    ];
    static jellyName = ["orange", "yellow", "blue", "milk", "green", "cyan", "black", "pink", "purple", "red", "rainbow", "galaxy"];
    static top1Name = ["blueberry", "bunny", "strawberry", "cream", "chili", "cherry", "mango", "mint", "eyeball", "fish", "kiwi", "earth", "octopus"];
    static unlockItemLevels = [
        [1, 1, 2, 3, 4, 5],
        [1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6, 7],
        [1, 2, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
        [1, 1, 2, 2, 3]
    ]
    static fanLevelNames = ["吃播新人", "新晋超级明星", "吃光所有", "可爱的吃播明星", "吃播超级明星", "吃播偶像", "直播女王"];
    static allNames = [
        ["", "", "", "", "椰子猴", "卡布奇诺", "", "", "轮胎蛙", ""],
        ["羊驼", "美西螈", "水豚", "猫", "鸡", "狗", "青蛙", "幽灵", "仓鼠", "章鱼", "熊猫", "企鹅", "兔子", "浣熊", "松鼠"]
    ];
    static coinSpawn = v3();
    static chatSfs: SpriteFrame[];
    static moldSfs: SpriteFrame[];
    static mukbangSfs: SpriteFrame[];
    static jellySfs: SpriteFrame[];
    static top1: SpriteFrame[];
    static top2: SpriteFrame[];
    static gameTop2: SpriteFrame[];
    static guestSfs: SpriteFrame[];

    private Init() {
        // localStorage.clear();
        let array = ["Tutorial", "Level", "Coin", "Exp", "ExpLimit", "Daily", "Skin", "Pet", "Bg", "Table", "Decor", "Fans", "FanLevel", "Gacha"];
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (localStorage.getItem("SHJCB_" + element) == null || localStorage.getItem("SHJCB_" + element) == "") this.setNumberData(element, element == "Level" ? 1 : element == "Coin" ? 1000 : element == "ExpLimit" ? 100 : element == "Pet" ? -1 : 0);
        }
        let array2 = ["LastDaily", "SkinStates", "PetStates", "BgStates", "TableStates", "DecorStates", "LastGacha"];
        for (let i = 0; i < array2.length; i++) {
            const element = array2[i];
            if (localStorage.getItem("SHJCB_" + element) == null || localStorage.getItem("SHJCB_" + element) == "") this.setArrayData(element, element == "SkinStates" ? [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : element == "PetStates" ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : element == "BgStates" ? [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : element == "TableStates" ? [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : element == "DecorStates" ? [1, 0, 0, 0, 0, 0, 0, 0, 0] : []);
        }
        let bundle = BundleManager.GetBundle("79_SHJCB");
        bundle.loadDir("Sprites/avatars", SpriteFrame, (err, data) => { SHJCB_DataManager.chatSfs = data; eventCenter.emit("chatSfs"); });
        bundle.loadDir("Sprites/icons/decoritem/mold", SpriteFrame, (err, data) => { SHJCB_DataManager.moldSfs = data; eventCenter.emit("moldSfs"); });
        bundle.loadDir("Sprites/items/mukbangitem", SpriteFrame, (err, data) => { SHJCB_DataManager.mukbangSfs = data; eventCenter.emit("mukbangSfs"); });
        bundle.loadDir("Sprites/items/decoritem/topping1", SpriteFrame, (err, data) => { SHJCB_DataManager.top1 = data; eventCenter.emit("top1"); });
        bundle.loadDir("Sprites/icons/decoritem/topping2", SpriteFrame, (err, data) => { SHJCB_DataManager.top2 = data; eventCenter.emit("top2"); });
        bundle.loadDir("Sprites/items/decoritem/topping2", SpriteFrame, (err, data) => { SHJCB_DataManager.gameTop2 = data; eventCenter.emit("gameTop2"); });
        bundle.loadDir("Sprites/items/decoritem/jellywater", SpriteFrame, (err, data) => { SHJCB_DataManager.jellySfs = data; eventCenter.emit("jellySfs"); });
        bundle.loadDir("Sprites/customers", SpriteFrame, (err, data) => { SHJCB_DataManager.guestSfs = data; eventCenter.emit("guestSfs"); });
    }

    public getNumberData(str: string): number {
        let data = localStorage.getItem("SHJCB_" + str);
        return parseInt(data);
    }

    public setNumberData(str: string, value: number) {
        localStorage.setItem("SHJCB_" + str, value.toString());
        eventCenter.emit("SetData:SHJCB_" + str);
    }

    public getArrayData<T>(str: string): T[] {
        let data = localStorage.getItem("SHJCB_" + str);
        return JSON.parse(data);
    }

    public setArrayData<T>(str: string, value: T[]) {
        localStorage.setItem("SHJCB_" + str, JSON.stringify(value));
        eventCenter.emit("SetData:SHJCB_" + str);
    }

    public getRecordData(str: string) {
        let data = localStorage.getItem("SHJCB_" + str);
        return JSON.parse(data);
    }

    public setRecordData(str: string, value: any) {
        localStorage.setItem("SHJCB_" + str, JSON.stringify(value));
    }
}