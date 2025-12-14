import { director } from "cc";

export class XCJZ_MyEvent {
    public static XCJZ_MUSIC_PLAY: string = "XCJZ_MUSIC_PLAY";
    public static XCJZ_MUSIC_PAUSE: string = "XCJZ_MUSIC_PAUSE";
    public static XCJZ_SELECT_ITEM: string = "XCJZ_SELECT_ITEM";
    public static XCJZ_MUSIC_ITEM_CLICK: string = "XCJZ_MUSIC_ITEM_CLICK";
    public static XCJZ_MUSIC_STAR_SHOW: string = "XCJZ_MUSIC_STAR_SHOW";
    public static XCJZ_SHOP_ITEM: string = "XCJZ_SHOP_ITEM";
    public static XCJZ_TODAY_SHOW: string = "XCJZ_TODAY_SHOW";
    public static PLAYER_MOVE: string = "PLAYER_MOVE";
    public static PLAYER_PAUSE: string = "PLAYER_PAUSE";
    public static PLAYER_RESUME: string = "PLAYER_RESUME";
    public static CHANGE_MAP_OFFSET: string = "CHANGE_MAP_OFFSET";
    public static PLAYER_SWITCH_COLOR: string = "PLAYER_SWITCH_COLOR";
    public static RESURGENCE: string = "RESURGENCE";
}

export class XCJZ_EventManager {

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


