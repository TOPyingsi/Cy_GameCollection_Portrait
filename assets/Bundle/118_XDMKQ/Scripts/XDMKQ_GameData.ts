import { sys } from "cc";

export class XDMKQ_GameData {
    private static _key: string = "XDMKQ_GameData";

    private static _instance: XDMKQ_GameData = null;

    public static get Instance(): XDMKQ_GameData {
        if (XDMKQ_GameData._instance == null) {
            this.GetData();
        }
        return XDMKQ_GameData._instance;
    }

    public static GetData() {
        let name = sys.localStorage.getItem(this._key);
        if (name != "" && name != null) {
            console.log("读取存档");
            XDMKQ_GameData._instance = Object.assign(new XDMKQ_GameData(), JSON.parse(name));
        } else {
            console.log("新建存档");
            XDMKQ_GameData._instance = new XDMKQ_GameData();
        }
    }

    public static DateSave() {
        let json = JSON.stringify(XDMKQ_GameData.Instance);
        sys.localStorage.setItem(this._key, json);
    }

    public UnlockMap: number[] = [0, 1];
    public CurMap: number = 0;
    public Music: number = 1;
    public Sound: number = 1;
    public Shake: boolean = true;
}


