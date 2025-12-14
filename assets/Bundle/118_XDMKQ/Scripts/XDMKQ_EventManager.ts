import { director } from "cc";

export class XDMKQ_MyEvent {
    public static XDMKQ_TOUCH_MOVE: string = "XDMKQ_TOUCH_MOVE";
    public static XDMKQ_FIRE_START: string = "XDMKQ_FIRE_START";
    public static XDMKQ_FIRE_END: string = "XDMKQ_FIRE_END";
    public static XDMKQ_CHANGE_BULLET: string = "XDMKQ_CHANGE_BULLET";
    public static XDMKQ_FKP_ADD_JD: string = "XDMKQ_FKP_ADD_JD";
    public static XDMKQ_ROLE_SHOW: string = "XDMKQ_ROLE_SHOW";
    public static XDMKQ_CURWEAPON_BULLET_SHOW: string = "XDMKQ_CURWEAPON_BULLET_SHOW";
    public static XDMKQ_SIGHT_ENLARGEMENT: string = "XDMKQ_SIGHT_ENLARGEMENT";
    public static XDMKQ_SIGHT_REDUCE: string = "XDMKQ_SIGHT_REDUCE";
    public static XDMKQ_HIT_SHOW: string = "XDMKQ_HIT_SHOW";
    public static XDMKQ_RELOAD_SHOW: string = "XDMKQ_RELOAD_SHOW";
    public static XDMKQ_AIM_SHOW: string = "XDMKQ_AIM_SHOW";
    public static XDMKQ_FIRE_SHOW: string = "XDMKQ_FIRE_SHOW";
    public static XDMKQ_TIPS_SHOW: string = "XDMKQ_TIPS_SHOW";
    public static XDMKQ_WEAPONITEM_SHOW: string = "XDMKQ_WEAPONITEM_SHOW";
    public static XDMKQ_FIRE_EFFECT: string = "XDMKQ_FIRE_EFFECT";
    public static XDMKQ_REMOVE_ENEMY_ON_CAR: string = "XDMKQ_REMOVE_ENEMY_ON_CAR";
    public static XDMKQ_SUPPLYITEM_CLICK: string = "XDMKQ_SUPPLYITEM_CLICK";
    public static XDMKQ_ENEMY_SPEED: string = "XDMKQ_ENEMY_SPEED";
    public static XDMKQ_INJURED: string = "XDMKQ_INJURED";
}

export class XDMKQ_EventManager {

    public static On(name: string, cb: Function, target?) {
        director.getScene().on(name, cb, target);
    }

    public static Off(name: string, cb: Function, target?) {
        director.getScene().off(name, cb, target);
    }

    public static Emit(name: string, ...arg: any) {
        director.getScene().emit(name, ...arg);
    }
}


