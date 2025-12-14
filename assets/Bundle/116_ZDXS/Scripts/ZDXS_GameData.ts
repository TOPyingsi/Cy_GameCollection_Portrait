import { sys } from "cc";

export class ZDXS_GameData {

    private static _key: string = "ZDXS_GameData";

    private static _instance: ZDXS_GameData = null;

    public static get Instance(): ZDXS_GameData {
        if (ZDXS_GameData._instance == null) {
            this.GetData();
        }
        return ZDXS_GameData._instance;
    }

    public static GetData() {
        let name = sys.localStorage.getItem(this._key);
        if (name != "" && name != null) {
            console.log("读取存档");
            ZDXS_GameData._instance = Object.assign(new ZDXS_GameData(), JSON.parse(name));
        } else {
            console.log("新建存档");
            ZDXS_GameData._instance = new ZDXS_GameData();
        }
    }

    public static DateSave() {
        let json = JSON.stringify(ZDXS_GameData.Instance);
        sys.localStorage.setItem(this._key, json);
    }

    public Mute: boolean = false;
    public Gold: number = 0;
    public Stars: number = 0;
    public LevelStar: number[][] = [[], [], [], []];
    public HaveSkin: number[] = [0];
    public CurSkin: number = 0;
    public Mode: number = 0;
    public CurLevel: number = 0;
}


