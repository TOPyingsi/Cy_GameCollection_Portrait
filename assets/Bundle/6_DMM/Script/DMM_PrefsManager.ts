import { _decorator, sys } from 'cc';
import { BADMENNAME, DMM_GENDER, DMM_ITEM } from './DMM_Constant';
const { ccclass } = _decorator;

@ccclass('DMM_PrefsManager')
export class DMM_PrefsManager {
    private static _instance: DMM_PrefsManager = null;
    public static get Instance(): DMM_PrefsManager {
        if (!DMM_PrefsManager._instance) {
            DMM_PrefsManager._instance = new DMM_PrefsManager();
        }
        return DMM_PrefsManager._instance;
    }

    public userData = {
        "Gold": 100,
        "LV": 1,
        "Gender": DMM_GENDER.男,
        "HaveItem": [DMM_ITEM.ITEM1],
        "CurItem": DMM_ITEM.ITEM1,
        "BadMen": BADMENNAME.猪,
        "Sound": [false, false],//是否静音
    }

    private constructor() {
        // sys.localStorage.setItem('userData', JSON.stringify(this.userData));
        const value = sys.localStorage.getItem('DMM_Data');
        if (value) {
            //有记录就读取  --- 没记录就存入数据
            this.userData = JSON.parse(value);
        } else {
            console.log(`userData is not exist`);
            sys.localStorage.setItem('DMM_Data', JSON.stringify(this.userData));
        }
    }

    public saveData() {
        sys.localStorage.setItem('DMM_Data', JSON.stringify(this.userData));
    }
}


