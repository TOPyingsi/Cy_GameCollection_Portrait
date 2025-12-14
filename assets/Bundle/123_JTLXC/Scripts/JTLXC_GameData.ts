import { sys } from "cc";

export class JTLXC_GameData {
    private static _key: string = "JTLXC_GameData";

    private static _instance: JTLXC_GameData = null;

    public static get Instance(): JTLXC_GameData {
        if (JTLXC_GameData._instance == null) {
            this.GetData();
        }
        return JTLXC_GameData._instance;
    }

    public static GetData() {
        let name = sys.localStorage.getItem(this._key);
        if (name != "" && name != null) {
            console.log("读取存档");
            JTLXC_GameData._instance = Object.assign(new JTLXC_GameData(), JSON.parse(name));
        } else {
            console.log("新建存档");
            JTLXC_GameData._instance = new JTLXC_GameData();
        }
    }

    public static DateSave() {
        let json = JSON.stringify(JTLXC_GameData.Instance);
        sys.localStorage.setItem(this._key, json);
    }

    public Scene: number = 1;//关卡
    public Cource: number = 0;//（0啥也没教1教了点击2教了缩放）
}


