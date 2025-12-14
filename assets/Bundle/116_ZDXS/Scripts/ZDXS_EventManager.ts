import { director } from "cc";

export class ZDXS_MyEvent {
    public static ZDXS_TOUCH_MOVE: string = "ZDXS_TOUCH_MOVE";
    public static ZDXS_TOUCH_END: string = "ZDXS_TOUCH_END";
    public static ZDXS_LABEL_CHANGE: string = "ZDXS_LABEL_CHANGE";
    public static ZDXS_PLAYER_SKIN: string = "ZDXS_PLAYER_SKIN";
    public static ZDXS_PLAYER_SHOP_SHOW: string = "ZDXS_PLAYER_SHOP_SHOW";
    public static ZDXS_SHOW_SKIN: string = "ZDXS_SHOW_SKIN";
    public static ZDXS_PLAYER_WIN_SHOW: string = "ZDXS_PLAYER_WIN_SHOW";
    public static ZDXS_PLAYER_FAIL_SHOW: string = "ZDXS_PLAYER_FAIL_SHOW";
}

export class ZDXS_EventManager {

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


