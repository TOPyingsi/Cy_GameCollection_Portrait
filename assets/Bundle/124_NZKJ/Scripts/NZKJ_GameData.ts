import { sys } from "cc";

export class NZKJ_GameData {
    private static _key: string = "NZKJ_GameData";

    private static _instance: NZKJ_GameData = null;

    public static get Instance(): NZKJ_GameData {
        if (NZKJ_GameData._instance == null) {
            this.GetData();
        }
        return NZKJ_GameData._instance;
    }

    public static GetData() {
        let name = sys.localStorage.getItem(this._key);
        if (name != "" && name != null) {
            console.log("读取存档");
            NZKJ_GameData._instance = Object.assign(new NZKJ_GameData(), JSON.parse(name));
        } else {
            console.log("新建存档");
            NZKJ_GameData._instance = new NZKJ_GameData();
        }
    }

    public static DateSave() {
        let json = JSON.stringify(NZKJ_GameData.Instance);
        sys.localStorage.setItem(this._key, json);
    }

    public Scene: number = 0;//关卡（当前关卡）
    public CourseIsStart: boolean = false;//是否弹出过教程
}


