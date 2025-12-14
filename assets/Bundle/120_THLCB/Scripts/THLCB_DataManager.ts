import { SpriteFrame, v3 } from "cc";
import { BundleManager } from "db://assets/Scripts/Framework/Managers/BundleManager";
import { eventCenter } from "./THLCB_EventCenter";

export class THLCB_DataManager {

    private static instance: THLCB_DataManager;
    public static get Instance(): THLCB_DataManager {
        if (!this.instance) {
            this.instance = new THLCB_DataManager;
            this.instance.Init();
        }
        return this.instance;
    }

    static deltaCoin = 0;
    static requestViewer = 0;
    static requestThl = [0, 0, 0, 0];
    static curThl = [-1, -1, -1, -1];
    static fanLevelNums = [0, 30000, 140000, 400000, 940000, 2000000, 5000000];
    static allDecorPrices = [
        [-1, -1, -1, -1, 3000, 2500, -1, -1, 1500, -1, 1500, -1, 3000, 3500, -1, 5000, -1, 2500, -1, 3500, -1, 5000, -1, -1, -1, 5000, -1, -1, -1, -1, -1],
        [1500, -1, -1, 2500, -1, 3000, -1, -1, 1800, -1, 2500, -1, 3000, 2200, 1500],
        [-1, 1000, -1, 1200, 1700, 2000, -1, -1, 800, 1500, -1, 1000, 2500, 2200, 2300, -1, -1, 1500, -1],
        [-1, 1000, 1000, -1, -1, -1, -1, -1, 1500, 800, -1, 1500, 1200, 900, 500, -1, -1, -1, -1, -1, -1],
        [-1, 600, 1500, -1, 1500, -1, 2000, 3000, -1]
    ];
    static jellyName = ["orange", "yellow", "blue", "milk", "green", "cyan", "black", "pink", "purple", "red", "rainbow", "galaxy"];
    static top1Name = ["blueberry", "bunny", "strawberry", "cream", "chili", "cherry", "mango", "mint", "eyeball", "fish", "kiwi", "earth", "octopus"];
    static unlockItemLevels = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5];
    static fanLevelNames = ["吃播新人", "新晋超级明星", "吃光所有", "可爱的吃播明星", "吃播超级明星", "吃播偶像", "直播女王"];
    static allNames = [
        ["", "", "", "", "青蛙吉吉", "绵羊吉吉", "", "", "樱吉吉", "", "南瓜吉吉", "熊猫吉吉", "修女吉吉", "", "圣诞吉吉", "熊吉吉", "", "新年吉吉", "", "人鱼吉吉", "", "库洛米吉吉", "", "", "", "鸡吉吉", ""],
        ["羊驼", "美西螈", "水豚", "猫", "鸡", "狗", "青蛙", "幽灵", "仓鼠", "章鱼", "熊猫", "企鹅", "兔子", "浣熊", "松鼠"]
    ];
    static coinSpawn = v3();
    static chatSfs: SpriteFrame[];
    static thlSfs: SpriteFrame[];
    static thl2Sfs: SpriteFrame[];
    static guestSfs: SpriteFrame[];

    private Init() {
        // localStorage.clear();
        let array = ["Tutorial", "Level", "Coin", "Exp", "ExpLimit", "Daily", "Skin", "Pet", "Bg", "Table", "Decor", "Fans", "FanLevel", "Gacha"];
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (localStorage.getItem("THLCB_" + element) == null || localStorage.getItem("THLCB_" + element) == "") this.setNumberData(element, element == "Level" ? 1 : element == "Coin" ? 1000 : element == "ExpLimit" ? 100 : element == "Pet" ? -1 : 0);
        }
        let array2 = ["LastDaily", "SkinStates", "PetStates", "BgStates", "TableStates", "DecorStates", "LastGacha"];
        for (let i = 0; i < array2.length; i++) {
            const element = array2[i];
            if (localStorage.getItem("THLCB_" + element) == null || localStorage.getItem("THLCB_" + element) == "") this.setArrayData(element, element == "SkinStates" ? [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : element == "PetStates" ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : element == "BgStates" ? [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : element == "TableStates" ? [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : element == "DecorStates" ? [1, 0, 0, 0, 0, 0, 0, 0, 0] : []);
        }
        let bundle = BundleManager.GetBundle("120_THLCB");
        bundle.loadDir("Sprites/avatars", SpriteFrame, (err, data) => { THLCB_DataManager.chatSfs = data; eventCenter.emit("chatSfs"); });
        bundle.loadDir("Sprites/icons/decoritem/Tanghulu", SpriteFrame, (err, data) => { THLCB_DataManager.thlSfs = data; eventCenter.emit("moldSfs"); });
        bundle.loadDir("Sprites/icons/decoritem/Tanghulu-001", SpriteFrame, (err, data) => { THLCB_DataManager.thl2Sfs = data; eventCenter.emit("mukbangSfs"); });
        bundle.loadDir("Sprites/customers", SpriteFrame, (err, data) => { THLCB_DataManager.guestSfs = data; eventCenter.emit("guestSfs"); });
    }

    public getNumberData(str: string): number {
        let data = localStorage.getItem("THLCB_" + str);
        return parseInt(data);
    }

    public setNumberData(str: string, value: number) {
        localStorage.setItem("THLCB_" + str, value.toString());
        eventCenter.emit("SetData:THLCB_" + str);
    }

    public getArrayData<T>(str: string): T[] {
        let data = localStorage.getItem("THLCB_" + str);
        return JSON.parse(data);
    }

    public setArrayData<T>(str: string, value: T[]) {
        localStorage.setItem("THLCB_" + str, JSON.stringify(value));
        eventCenter.emit("SetData:THLCB_" + str);
    }

    public getRecordData(str: string) {
        let data = localStorage.getItem("THLCB_" + str);
        return JSON.parse(data);
    }

    public setRecordData(str: string, value: any) {
        localStorage.setItem("THLCB_" + str, JSON.stringify(value));
    }
}