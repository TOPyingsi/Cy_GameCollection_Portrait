import { sys } from "cc";
import { NDPA_DW, NDPA_LV, NDPA_NUMBER } from "./NDPA_GameConstant";

export class NDPA_PrefsManager {

    private static _instance: NDPA_PrefsManager = null;
    public static get Instance(): NDPA_PrefsManager {
        if (!NDPA_PrefsManager._instance) {
            NDPA_PrefsManager._instance = new NDPA_PrefsManager();
        }
        return NDPA_PrefsManager._instance;
    }

    public userData = {
        "CurLv": NDPA_LV.LV1,
        "Gold": 120,
        "TIPS": 2,
        "NEXT": 2,
        "HaveMZ": [NDPA_NUMBER.NUMBER1],
        "UseMZ": NDPA_NUMBER.NUMBER1,
        "HaveDW": [NDPA_DW.狗熊],
        "UseDW": NDPA_DW.狗熊,
    }

    private constructor() {
        // sys.localStorage.setItem('userData', JSON.stringify(this.userData));
        const value = sys.localStorage.getItem('NDPAData');
        if (value) {
            //有记录就读取  --- 没记录就存入数据
            this.userData = JSON.parse(value);
        } else {
            console.log(`userData is not exist`);
            sys.localStorage.setItem('NDPAData', JSON.stringify(this.userData));
        }
    }

    public saveData() {
        sys.localStorage.setItem('NDPAData', JSON.stringify(this.userData));
    }
}


